
// 容错 babel-polyfill要求单例
// import 'babel-polyfill'
try {
  require('babel-polyfill')
  require('./runner')
  require('./preload')
} catch (err) {
  // ignore
}

// import './runner'
// import './preload'
