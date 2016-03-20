
if (!global.__nwauto) {
  global.__nwauto = true
  install()
}

function install() {

  // 容错 babel-polyfill要求单例
  try {
    require('babel-polyfill')
  } catch (err) {
    // ignore
  }

  require('./runner')
  require('./preload')
}
