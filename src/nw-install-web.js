
// 容错 babel-polyfill要求单例
try {
  require('babel-polyfill')
} catch (err) {
  // ignore
}

// require('./runner')
require('./preload')
