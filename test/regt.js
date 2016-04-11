
import 'should'
import Nixe from '../src/Nixe'

describe('nw-auto', function () {

  this.timeout(0) // disable timeout

  let nixe

  after(async () => {
    await nixe.end()
  })

  it('construct', () => {
    nixe = new Nixe('../../regt')
  })

  it('get ready', async () => {
    await nixe.ready().wait(4000)
  })

  it('cancel autologin', async () => {
    const isAutoLogin = await nixe
      .evaluate(() => {
        const doc = global._wins.login.window.document
        const cancel = doc.querySelector('.uk-button-small')
        return !!cancel
      })
    if (isAutoLogin) {
      await nixe
        .evaluate(() => {
          const doc = global._wins.login.window.document
          const cancel = doc.querySelector('.uk-button-small')
          cancel.parentNode.click()
        })
        .wait(6000)
    }
  })

  it('login success', async () => {
    await nixe
      .evaluate(() => {
        const doc = global._wins.login.window.document
        // doc.querySelector('[name=username]').focus()
        // doc.querySelector('[name=username]').value = 'imtest0008'
        // doc.querySelector('[name=username]').blur()
        // doc.querySelector('[name=password]').focus()
        // doc.querySelector('[name=password]').value = '5b3A%3zz'
        // doc.querySelector('[name=password]').blur()
        global.formChange('login', 'username', process.env.USERNAME || 'imtest0008') // fixme
        global.formChange('login', 'password', process.env.PASSWORD || '5b3A%3zz') // fixme
        const checked = doc.querySelector('[name=rememberMe][value=true]')
        if (checked) checked.parentNode.click() // 取消记住密码
      })
      .wait(1000)
      .evaluate(() => {
        const doc = global._wins.login.window.document
        doc.querySelector('[type=submit]').click()
      })
      .wait(8000)
  })

  it('search & open conver', async () => {
    await nixe
      .evaluate(() => {
        const doc = global._wins.home.window.document
        const input = doc.querySelector('#searchUserInput')
        input.focus()
        // input.value = 's'
        input.value = 'imtest00'
        let ev = document.createEvent('Event')
        ev.initEvent('keyup', true, true)
        input.dispatchEvent(ev)
        setTimeout(() => {
          ev = document.createEvent('Event')
          ev.initEvent('keyup', true, true)
          ev.keyCode = 40
          input.dispatchEvent(ev)
          setTimeout(() => {
            ev = document.createEvent('Event')
            ev.initEvent('keyup', true, true)
            ev.keyCode = 13
            input.dispatchEvent(ev)
          }, 2000)
        }, 2000)
      })
      .wait(6000)
  })

  it('input & send msg', async () => {
    await nixe
      .evaluate(() => {
        const doc = global._wins.home.window.document
        const input = doc.querySelector('#editor')
        input.innerHTML = 'Hello World!'
        input.blur()
        // const ev = document.createEvent('Event')
        // ev.initEvent('keydown', true, true)
        // ev.keyCode = 13
        // input.dispatchEvent(ev)
        doc.querySelector('.send_btn').click()
      })
  })

  it('invite a group', async () => {
    await nixe
      .evaluate(() => {
        const doc = global._wins.home.window.document
        doc.querySelector('.add_group').click()
      })
      .wait(2000)
      .evaluate(() => {
        const doc = global._wins.mucform.window.document
        // const items = doc.querySelectorAll('.creat_right li[data-custom-id*=imtest]')
        // const items = doc.querySelectorAll('.creat_right li')
        const items = doc.querySelectorAll('.creat_right li:not([data-custom-id^=imtest])')
        ;[].forEach.call(items, function (item) { item.click() })
      })
      .wait(500)
      .evaluate(() => {
        const doc = global._wins.mucform.window.document
        doc.querySelector('.blue_btn').click()
      })
      .wait(20000)
      .evaluate(() => {
        const currConverId = global._store.getState().currConverId
        const currUserId = global._store.getState().currUserId
        const memIds = global._store.getState().allMems[currConverId]
        memIds.forEach((userId) => {
          if (userId === currUserId) return
          global.sendKickPresence(currConverId, userId)
        })
      })
      .wait(2000)
      .evaluate(() => {
        const doc = global._wins.home.window.document
        doc.querySelector('.op-btn-group .logout').click()
      })
      .wait(2000)
      .evaluate(() => {
        const md5 = window.require('md5')
        const hash = md5('退出讨论组__退出讨论组后将无法再收发讨论组的消息，确定要退出吗？')
        const doc = global._wins[`confirm/${hash}`].window.document
        doc.querySelector('#closeBtn').click()
      })
  })

  it('hang', (done) => {
    done // hang
  })

  // it('end', async () => {
  //   await nixe.end()
  // })
})
