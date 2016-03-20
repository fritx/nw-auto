
import 'should'
import Nixe from '../src/Nixe'

describe('nw-auto', function () {

  this.timeout(60 * 1000)

  let nixe

  after(async () => {
    await nixe.end()
  })

  it('should construct', () => {
    nixe = new Nixe('../nw-chat')
    nixe.on('web', (type, ...data) => { //fixme
      console.log('web', type, data)
    })
  })

  it('should get ready', async () => {
    await nixe.ready()
  })

  // it('should evaluate', async () => {
  //   const prom = nixe.once('web', (type, ...data) => { //fixme
  //     type.should.be.eql('console:log')
  //     data.should.be.eql(['log test'])
  //   })
  //   const result = await nixe.evaluate(() => {
  //     console.log('log test')
  //     return 666
  //   })
  //   result.should.be.eql(666)
  //   await prom
  // })

  // fixme removeListener
  it('should login failed', async () => {
    const prom = new Promise((res) => {
      nixe.on('web', (type, ...data) => {
        if (type === 'page:alert' &&
          data[0] === 'INVALID_LOGIN_INFO') res()
      })
    })
    nixe.once('web', (type, ...data) => {
      type.should.be.eql('page:alert')
      data.should.be.eql(['INVALID_LOGIN_INFO'])
    })
    await nixe.wait(1000)
      .evaluate(() => {
        const win = global.wins.login
        const doc = win.window.document
        doc.querySelector('[name=username]').focus()
        doc.querySelector('[name=username]').value = 'test.user'
        doc.querySelector('[name=username]').blur()
        doc.querySelector('[name=password]').focus()
        doc.querySelector('[name=password]').value = '998'
        doc.querySelector('[name=password]').blur()
        doc.activeElement.blur()
        // const ev = doc.createEvent('MouseEvent')
        // ev.initEvent('click', true, true)
        // doc.querySelector('[type=submit]').dispatchEvent(ev)
        doc.querySelector('[type=submit]').click()
      })
    await prom
  })

  it('should login success', async () => {
    const isHomeOpen = await nixe.wait(1000)
      .evaluate(() => {
        const win = global.wins.login
        const doc = win.window.document
        doc.querySelector('[name=username]').focus()
        doc.querySelector('[name=username]').value = 'test.user'
        doc.querySelector('[name=username]').blur()
        doc.querySelector('[name=password]').focus()
        doc.querySelector('[name=password]').value = '123'
        doc.querySelector('[name=password]').blur()
        doc.querySelector('[type=submit]').click()
      })
      .wait(10000)
      .evaluate(() => !!global.wins.home)
    isHomeOpen.should.be.eql(true)
  })

  it('should end', (done) => {
    // await nixe.end()

  })
})
