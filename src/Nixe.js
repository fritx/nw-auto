import { spawn } from 'child_process'
import which from 'which'
import { EventEmitter } from 'events'
import proxy from './proxy'
import guid from './guid'
import ipc from './ipc'
import IPC from 'tiny-ipc'
import co from 'co'
import _tkill from 'tree-kill'
import { promisify } from 'bluebird'

const tkill = promisify(_tkill)


export default class Nixe {

  // todo: static/instance config
  constructor(entry, options = {}) {
    // process.env.NW_AUTO = '1' // fixme
    // const uuid = `${Math.random()}`.substr(2) // fixme
    const uuid = guid() // fixme
    IPC.makeHub(`/tmp/nwauto_${uuid}`) // fixme

    const { nwPath, noFocus, noShow } = options
    this.proc = spawn(
      nwPath || which.sync('nw'),
      // [entry, `--${uuid}`],
      [entry],
      {
        stdio: [null, null, null, 'ipc'],
        env: {
          ...process.env,
          NW_AUTO: '1',
          NW_AUTO_UUID: uuid,
          NW_AUTO_NOFOCUS: noFocus ? '1' : '0',
          NW_AUTO_NOSHOW: noShow ? '1' : '0',
        },
      }
    )
    this.child = ipc(this.proc, uuid)
    this.ended = false

    // https://github.com/segmentio/nightmare/commit/593b9750f299cc4eed5bcb07bd8c1c9eecab182f
    // process.setMaxListeners(Infinity)
    // const num = Math.max(process.listenerCount(), process.getMaxListeners())
    // process.setMaxListeners(num + 1) // 更全面的做法 确保该绑定不报错
    process.setMaxListeners(Infinity)
    process.on('uncaughtException', (err) => {
      console.error(err.stack)
      // this.end() // 此处并不一定需要kill
    })

    let exited = false
    // https://github.com/tj/co#var-fn--cowrapfn
    const exit = co.wrap(async () => {
      if (exited) return
      exited = true
      await this.end()
      process.exit()
    })
    // todo: process.onexit没有充足时间
    // 可否通过spawn一个其他进程来kill nw?
    process.on('exit', exit)
    process.on('SIGINT', exit)
    process.on('SIGTERM', exit)
    process.on('SIGQUIT', exit)
    process.on('SIGHUP', exit)
    process.on('SIGBREAK', exit)

    // 代理this.child的emitter用法
    const proto = EventEmitter.prototype
    proxy(this, this.child, Object.keys(proto))

    // 额外的高级用法 once可以await
    const once = this.once.bind(this)
    this.once = (ekey, handler) => new Promise((res, rej) => {
      once(ekey, (...args) => {
        try {
          handler(...args)
          res()
        } catch (err) { rej(err) }
      })
    })

    this.child.on('uncaughtException', (info = '') => {
      console.error('runner uncaughtException:', info.replace(/\n/g, '\n  '))
    })

    this.child.on('runner:log', (...args) => {
      console.log('runner:log', ...args)
    })

    this.child.once('app:ready', () => {
      this.appReady = true
    })

    this.tasks = []
  }

  async end() {
    if (this.ended) return
    this.ended = true
    if (this.proc.connected) this.proc.disconnect()
    // this.proc.kill()
    await tkill(this.proc.pid, 'SIGINT') // nw需要treekill
  }

  queue(task) {
    this.tasks.push(task) // async fn
    return this
  }

  async run() {
    let result // last result
    let left = this.tasks.length // tasks to run
    while (left--) {
      const task = this.tasks.shift()
      result = await task(result) // should be a promise
      // or would have
      // Unhandled rejection TypeError:
      // A value undefined was yielded that could not be treated as a promise
    }
    return result
  }

  // work as a "promise" ifself
  // make `run` optional
  // async then(res, rej) {
  then(res, rej) {
    return new Promise((_res, _rej) => {
      this.run().then(_res, _rej)
    })
    .then(res, rej)
  }

  ready() {
    return this.queue(() => new Promise((res) => {
      if (this.appReady) return res()
      this.child.once('app:ready', res)
    }))
  }

  wait(delay) {
    return this.queue(() => new Promise((res) => {
      setTimeout(res, delay)
    }))
  }

  evaluate(fn, ...args) {
    return this.queue(() => new Promise((res, rej) => {
      const done = (errm, result) => {
        // if (errm) rej(errm)
        if (errm) rej(new Error(errm))
        // note: NaN becomes 0 via ipc
        // null/undefined becomes null
        else res(result)
      }
      // note: ipc cannot pass functions directly
      this.child.emit('evaluate', String(fn), ...args)
      this.child.once('evaluate:done', done)
    }))
  }
}
