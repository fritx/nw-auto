/* eslint-disable no-constant-condition */
import 'babel-polyfill'
import 'should'
import co from 'co'
import _ from 'lodash'
import Chance from 'chance'
import Nixe from '../src/Nixe'

const chance = new Chance()
process.env.GT_SERVER_URL = 'http://10.60.217.94:25041' // 指定连接环境

;['imtest0400'].forEach(thread)
// ;['imtest0400', 'imtest0401', 'imtest0402'].forEach(thread)


function thread(username) {
  co(async() => {
    console.log('start:', username)
    const nixe = new Nixe('../../regt')
    // nixe.on('web', (type, ...data) => { //fixme
    //   console.log('web', type, data)
    // })
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
      .wait(10000)
      .evaluate(() => !!global._wins.home)
    isHomeOpen.should.be.eql(true)
    console.log('login success:', username)

    while (true) { // infinite loop
      // const keyword = 'imtest00'
      // const keyword = _.sample([
      //   'near.yu', 'irina.su', 'o-kui.xiao', 'fritz.lin', 'o-kai.xiang',
      // ])
      const keyword = `imtest0${400 + _.random(0, 99)}`
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
      console.log('set conver', keyword)

      let msg = `Hello Bitch! ${chance.word()}`
      await nixe.wait(5000)
        .evaluate((msg) => {
          const doc = global._wins.home.window.document
          doc.querySelector('.favorite').click() // 确保添加联系人
          const input = doc.querySelector('#editor')
          input.innerHTML = msg
          input.blur()
          doc.querySelector('.send_btn').click()
        }, msg)
      console.log('send chat msg', msg)

      // 测试环境开群 暂时不行 @肖逵
      await nixe
        .evaluate(() => {
          const doc = global._wins.home.window.document
          doc.querySelector('.add_group').click()
        })
        .wait(2000)
        .evaluate(() => {
          const doc = global._wins.mucform.window.document
          // const items = doc.querySelectorAll('.creat_right li[data-custom-id*=imtest]')
          const items = doc.querySelectorAll('.creat_right li')
          ;[].forEach.call(items, function (item) { item.click() })
        })
        .wait(500)
        .evaluate(() => {
          const doc = global._wins.mucform.window.document
          doc.querySelector('.blue_btn').click()
        })
      console.log('create group')

      msg = `Hey All! ${chance.word()}`
      await nixe.wait(5000)
        .evaluate((msg) => {
          const doc = global._wins.home.window.document
          const input = doc.querySelector('#editor')
          input.innerHTML = msg
          input.blur()
          doc.querySelector('.send_btn').click()
        }, msg)
      console.log('send group msg', msg)

      await nixe.wait(10000)
        .evaluate(() => {
          const currConverId = global._store.getState().currConverId
          const currUserId = global._store.getState().currUserId
          const memIds = global._store.getState().allMems[currConverId]
          memIds.forEach((userId) => {
            if (userId === currUserId) return
            global.sendKickPresence(currConverId, userId)
          })
        })
      console.log('kick members')

      await nixe.wait(2000)
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
      console.log('quit group')
    }
  }).catch((err) => {
    // throw err // will not work
    console.error(err.stack)
  })
}
