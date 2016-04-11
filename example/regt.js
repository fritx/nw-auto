/* eslint-disable no-constant-condition */
import 'babel-polyfill'
import 'should'
import co from 'co'
import _ from 'lodash'
import Chance from 'chance'
import Nixe from '../src/Nixe'

const chance = new Chance()

;['imtest0400'].forEach(thread)
// ['imtest0400', 'imtest0401', 'imtest0402'].forEach(thread)


function thread(username) {
  co(async() => {
    console.log('start:', username)
    const nixe = new Nixe('../../regt')
    nixe.on('web', (type, ...data) => { //fixme
      console.log('web', type, data)
    })
    await nixe.ready()
    console.log('nw ready')

    const isAutoLogin = await nixe.wait(4000)
      .evaluate(() => {
        const doc = global._wins.login.window.document
        const cancel = doc.querySelector('.uk-button-small')
        return !!cancel
      })
    console.log('isAutoLogin', isAutoLogin)

    if (isAutoLogin) {
      await nixe
        .evaluate(() => {
          const doc = global._wins.login.window.document
          const cancel = doc.querySelector('.uk-button-small')
          cancel.parentNode.click()
        })
        .wait(6000)
    }

    const isHomeOpen = await nixe
      .evaluate((username) => {
        const doc = global._wins.login.window.document
        // doc.querySelector('[name=username]').focus() // fixme: redux-form
        // doc.querySelector('[name=username]').value = 'imtest0008'
        // doc.querySelector('[name=username]').blur()
        // doc.querySelector('[name=password]').focus()
        // doc.querySelector('[name=password]').value = '5b3A%3zz'
        // doc.querySelector('[name=password]').blur()
        global.formChange('login', 'username', username) // fixme
        global.formChange('login', 'password', '5b3A%3zz') // fixme
        const checked = doc.querySelector('[name=rememberMe][value=true]')
        if (checked) checked.parentNode.click() // 取消记住密码
      }, username)
      .wait(1000)
      .evaluate(() => {
        const doc = global._wins.login.window.document
        doc.querySelector('[type=submit]').click()
      })
      .wait(8000)
      .evaluate(() => !!global._wins.home)
    isHomeOpen.should.be.eql(true)
    console.log('login success:', username)

    while (true) { // infinite loop
      // const keyword = 'imtest00'
      const keyword = _.sample([
        'near.yu', 'irina.su', 'o-kui.xiao', 'fritz.lin', 'o-kai.xiang',
      ])
      await nixe
        .evaluate((keyword) => {
          const doc = global._wins.home.window.document
          const input = doc.querySelector('#searchUserInput')
          input.focus()
          input.value = keyword
          let ev = document.createEvent('Event')
          ev.initEvent('keyup', true, true)
          input.dispatchEvent(ev)
          setTimeout(() => {
            ev = document.createEvent('Event')
            ev.initEvent('keyup', true, true)
            ev.keyCode = 13
            input.dispatchEvent(ev)
          }, 2000)
        }, keyword)
      console.log('search & set conver', keyword)

      const msg = `Hello Bitch! ${chance.sentence()}`
      await nixe.wait(5000)
        .evaluate((msg) => {
          const doc = global._wins.home.window.document
          const input = doc.querySelector('#editor')
          input.innerHTML = msg
          input.blur()
          doc.querySelector('.send_btn').click()
        }, msg)
      console.log('input &  send msg', msg)
    }
  }).catch((err) => {
    // throw err // will not work
    console.error(err.stack)
  })
}
