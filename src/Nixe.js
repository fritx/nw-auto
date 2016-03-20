import { spawn } from 'child_process'
import which from 'which'
import { EventEmitter } from 'events'
import proxy from './proxy'
import ipc from './ipc'
import IPC from 'tiny-ipc'
import _tkill from 'tree-kill'
import { promisify } from 'bluebird'

const tkill = promisify(_tkill)
IPC.makeHub('/tmp/nwsock')


export default class Nixe {

  // todo: static/instance config
  constructor(entry, options = {}) {
    const { nwPath } = options
    this.proc = spawn(
      nwPath || which.sync('nw'),
      [entry],
      { stdio: [null, null, null, 'ipc'] }
    )
    this.child = ipc(this.proc)

    // https://github.com/segmentio/nightmare/commit/593b9750f299cc4eed5bcb07bd8c1c9eecab182f
    // process.setMaxListeners(Infinity)
    const num = Math.max(process.listenerCount(), process.getMaxListeners())
    process.setMaxListeners(num + 1) // 更全面的做法 确保该绑定不报错
    const end = () => this.end()
    process.on('uncaughtException', (e) => {
      console.error(e)
      end()
    })
    process.on('exit', end)
    process.on('SIGINT', end)
    process.on('SIGTERM', end)
    process.on('SIGQUIT', end)
    process.on('SIGHUP', end)
    process.on('SIGBREAK', end)

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
    .then(res)
    .catch(rej)
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
