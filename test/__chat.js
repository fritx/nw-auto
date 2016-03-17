
import 'should'
import Nixe from '../src/Nixe'

describe('nw-auto', function () {

  this.timeout(30 * 1000)

  let nixe

  it('should construct', () => {
    nixe = new Nixe('../../regt')
  })

  // it('should end', () => {
  //   nixe.end()
  // })
  // return

  it('should get ready', async () => {
    await nixe.ready()
  })

  // it('should evaluate', async () => {
  //   const result = await nixe.evaluate(() => {
  //     console.log(123)
  //     return 666
  //   })
  //   result.should.be.eql(666)
  // })

  it('should login', async () => {
    await nixe
      .wait(3000)
      .evaluate(() => {
        const doc = global._wins.login.window.document
        doc.querySelector('[name=username]').value = 'imtest0008'
        doc.querySelector('[name=password]').value = '5b3A%3zz'
        const checked = doc.querySelector('[name=rememberMe][value=true]')
        if (checked) checked.parentNode.click() // 取消记住密码
      })
      .wait(500)
      .evaluate(() => {
        const doc = global._wins.login.window.document
        doc.querySelector('[type=submit]').click()
      })
  })

  it('should check update', async () => {
    await nixe
      .wait(6000)
      .evaluate(() => {
        const doc = global._wins.home.window.document
        doc.querySelector('.setUp_person').click()
      })
      .wait(3000)
      .evaluate(() => {
        const doc = global._wins.systemconfig.window.document
        doc.querySelector('.singlePostion').click()
      })
  })

  it('should close alert', async () => {
    await nixe
      .wait(3000)
      .evaluate(() => {
        const md5 = window.require('md5')
        const hash = md5('检查更新__已经是最新的版本')
        let doc = global._wins[`alert/${hash}`].window.document
        doc.querySelector('#closeBtn').click()
        doc = global._wins.systemconfig.window.document
        doc.querySelector('.dot, .close-r').click()
      })
  })

  it('should search', async () => {
    await nixe
      .wait(500)
      .evaluate(() => {
        const doc = global._wins.home.window.document
        const input = doc.querySelector('#searchUserInput')
        input.focus()
        input.value = 's'
        // 触发keyup事件
        let ev =  document.createEvent('KeyboardEvent')
        ev.initKeyboardEvent('keyup', true, true, window)
        input.dispatchEvent(ev)
        setTimeout(() => {
          ev =  document.createEvent('KeyboardEvent')
          ev.initKeyboardEvent('keyup', true, true, window)
          ev.keyCode = 13
          input.dispatchEvent(ev)
          // setTimeout(() => {
          //   ev =  document.createEvent('KeyboardEvent')
          //   ev.initKeyboardEvent('keyup', true, true, window, 0, 0, 0, 0, 0, 38)
          //   input.dispatchEvent(ev)
          // }, 1000)
        }, 1000)
      })
  })

  it('should hang', (done) => {
    //
  })

  // it('should end', () => {
  //   nixe.end()
  // })
})
