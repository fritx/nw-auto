// import gui from 'nw.gui'
import ipc from './ipc'

const parent = ipc()
// const win = gui.Window.get()


// fixme: 只用绑定全局唯一
process.on('uncaughtException', (e) => {
  parent.emit('uncaughtException', e.stack || e.toString())
})


parent.on('evaluate', (fnstr, ...args) => {
  // note: deal with istanbul
  // https://github.com/gotwarlost/istanbul/issues/310
  fnstr = fnstr.replace(/__cov_(.+?)\+\+;?/g, '')
  try {
    const code = `(${fnstr})(${JSON.stringify(args).slice(1, -1)})`
    const result = window.eval(code)
    // const result = win.eval(null, code)
    parent.emit('evaluate:done', null, result)
  } catch (e) {
    // fixme: err需要全方位容错
    // https://github.com/fritx/nw-chat/commit/2098bd6e7bc73401deae0b31f63c745a75c0576c#diff-4116d579ff9b93353468e43032ca77feR44
    parent.emit('evaluate:done', e && e.stack || String(e))
  }
})

parent.emit('app:ready')
console.log('parent.emit app:ready')

