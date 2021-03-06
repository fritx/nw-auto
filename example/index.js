/* eslint-disable no-constant-condition */
import 'should'
import co from 'co'
// import Nixe from '../lib'
import Nixe from '../src/Nixe'

['test01', 'test02', 'test03'].forEach(thread)
// ['test01'].forEach(thread)


function thread(username) {
  co(async() => {
    console.log('start:', username)
    const nixe = new Nixe('../nw-chat', {
      noFocus: true,
      noShow: true,
    })
    nixe.on('web', (type, ...data) => { //fixme
      console.log('web', type, data)
    })
    await nixe.ready()
    console.log('nw ready')

    const isHomeOpen = await nixe.wait(1000)
      .evaluate((username) => {
        const doc = global.wins.login.window.document
        doc.querySelector('[name=username]').focus()
        doc.querySelector('[name=username]').value = username
        doc.querySelector('[name=username]').blur()
        doc.querySelector('[name=password]').focus()
        doc.querySelector('[name=password]').value = '123'
        doc.querySelector('[name=password]').blur()
        doc.querySelector('[type=submit]').click()
      }, username)
      .wait(5000)
      .evaluate(() => !!global.wins.home)
    isHomeOpen.should.be.eql(true)
    console.log('login success:', username)

    while (true) { // infinite loop
      await nixe.evaluate(() => {
        const doc = global.wins.home.window.document
        const lis = doc.querySelectorAll('.conver-li')
        const randomIndex = Math.floor(Math.random() * lis.length)
        lis[randomIndex].click()
        console.log('set conver:', doc.querySelector('h2').textContent)
      })
      .wait(2000)
    }
  }).catch((err) => {
    // throw err // will not work
    console.error(err.stack)
  })
}

