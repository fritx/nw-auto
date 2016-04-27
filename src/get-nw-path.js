import which from 'which'

// todo: more clues and more effort
// including in-project nw stuff
export function getNwPath() {
  try {

    // for nw (local, recommended)
    // https://github.com/nwjs/npm-installer
    return require('nw').findpath()
  } catch (err) {
    try {

      // for nwjs (global)
      // https://github.com/egoist/nwjs
      return which.sync('nw')
    } catch (err) {
      try {

        // for nwjs < 1.0.0
        return which.sync('nwjs')
      } catch (err) {

        return null
      }
    }
  }
}
