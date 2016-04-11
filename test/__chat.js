
import 'should'
import Nixe from '../src/Nixe'

describe('nw-auto', function () {

  this.timeout(15000)

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
        .wait(5000)
    }
  })

  // it('login failed', async () => {
  //   await nixe
  //     .evaluate(() => {
  //       const doc = global._wins.login.window.document
  //       const cancel = doc.querySelector('.uk-button-small')
  //       if (cancel) cancel.parentNode.click()
  //       doc.querySelector('[name=username]').focus()
  //       doc.querySelector('[name=username]').value = 'imtest0008'
  //       doc.querySelector('[name=username]').blur()
  //       doc.querySelector('[name=password]').focus()
  //       doc.querySelector('[name=password]').value = 'WrongPass'
  //       doc.querySelector('[name=password]').blur()
  //       const checked = doc.querySelector('[name=rememberMe][value=true]')
  //       if (checked) checked.parentNode.click() // 取消记住密码
  //     })
  //     .wait(500)
  //     .evaluate(() => {
  //       const doc = global._wins.login.window.document
  //       doc.querySelector('[type=submit]').click()
  //     })
  // })

  // it('close alert', async () => {
  //   await nixe
  //     .wait(8000)
  //     .evaluate(() => {
  //       const md5 = window.require('md5')
  //       const hash = md5('登录失败__账号和密码不匹配')
  //       const doc = global._wins[`alert/${hash}`].window.document
  //       doc.querySelector('#closeBtn').click()
  //     })
  // })

  it('login success', async () => {
    await nixe
      .evaluate(() => {
        const doc = global._wins.login.window.document
        doc.querySelector('[name=username]').focus()
        doc.querySelector('[name=username]').value = 'imtest0008'
        doc.querySelector('[name=username]').blur()
        doc.querySelector('[name=password]').focus()
        doc.querySelector('[name=password]').value = '5b3A%3zz'
        doc.querySelector('[name=password]').blur()
        const checked = doc.querySelector('[name=rememberMe][value=true]')
        if (checked) checked.parentNode.click() // 取消记住密码
      })
      .wait(500)
      .evaluate(() => {
        const doc = global._wins.login.window.document
        doc.querySelector('[type=submit]').click()
      })
      .wait(8000)
  })

  // it('open config & check update', async () => {
  //   await nixe
  //     .evaluate(() => {
  //       const doc = global._wins.home.window.document
  //       doc.querySelector('.setUp_person').click()
  //     })
  //     .wait(3000)
  //     .evaluate(() => {
  //       const doc = global._wins.systemconfig.window.document
  //       doc.querySelector('.singlePostion').click()
  //     })
  //     .wait(3000)
  //     .evaluate(() => {
  //       const md5 = window.require('md5')
  //       const hash = md5('检查更新__已经是最新的版本')
  //       let doc = global._wins[`alert/${hash}`].window.document
  //       doc.querySelector('#closeBtn').click()
  //       doc = global._wins.systemconfig.window.document
  //       doc.querySelector('.dot, .close-r').click()
  //     })
  // })

  // it('search & open conver', async () => {
  //   await nixe
  //     .evaluate(() => {
  //       const doc = global._wins.home.window.document
  //       const input = doc.querySelector('#searchUserInput')
  //       input.focus()
  //       input.value = 's'
  //       let ev = document.createEvent('Event')
  //       ev.initEvent('keyup', true, true)
  //       input.dispatchEvent(ev)
  //       setTimeout(() => {
  //         ev = document.createEvent('Event')
  //         ev.initEvent('keyup', true, true)
  //         ev.keyCode = 40
  //         input.dispatchEvent(ev)
  //         setTimeout(() => {
  //           ev = document.createEvent('Event')
  //           ev.initEvent('keyup', true, true)
  //           ev.keyCode = 13
  //           input.dispatchEvent(ev)
  //         }, 2000)
  //       }, 2000)
  //     })
  //     .wait(6000)
  // })

  // it('input & send msg', async () => {
  //   await nixe
  //     .evaluate(() => {
  //       const doc = global._wins.home.window.document
  //       const input = doc.querySelector('#editor')
  //       input.innerHTML = 'Hello World!'
  //       input.blur()
  //       // const ev = document.createEvent('Event')
  //       // ev.initEvent('keydown', true, true)
  //       // ev.keyCode = 13
  //       // input.dispatchEvent(ev)
  //       doc.querySelector('.send_btn').click()
  //     })
  // })

  // it('input pwd & open history', async () => {
  //   await nixe
  //     .evaluate(() => {
  //       const doc = global._wins.home.window.document
  //       doc.querySelector('.add_icon').click()
  //     })
  //     .wait(3000)
  //     .evaluate(() => {
  //       const md5 = window.require('md5')
  //       const hash = md5('身份验证__为了您的信息安全，请输入登录密码，有效期30分钟')
  //       const doc = global._wins[`prompt/${hash}`].window.document
  //       const input = doc.querySelector('#pwdverify')
  //       input.focus()
  //       input.value = '5b3A%3zz'
  //       input.blur()
  //       doc.querySelector('.blue_btn').click()
  //     })
  //     .wait(4000)
  //     .evaluate(() => {
  //       const doc = global._wins.history.window.document
  //       doc.querySelector('.show_history').click()
  //     })
  //     .wait(2000)
  //     .evaluate(() => {
  //       const doc = global._wins.history.window.document
  //       doc.querySelector('.dot, .close-r').click()
  //     })
  // })

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

  // it('hang', (done) => {})

  // it('end', async () => {
  //   await nixe.end()
  // })
})
