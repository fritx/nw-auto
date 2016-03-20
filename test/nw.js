
import 'should'
import Nixe from '../src/Nixe'

describe('nw-auto', function () {

  this.timeout(40 * 1000)

  let nixe

  after(async () => {
    await nixe.end()
  })

  it('should construct', () => {
    nixe = new Nixe('../nw-chat')
    nixe.child.on('web', (type, ...data) => { //fixme
      console.log(type, data)
    })
  })

  it('should get ready', async () => {
    await nixe.ready()
  })

  it('should evaluate', async () => {
    const result = await nixe.evaluate(() => {
      console.log(123)
      return 666
    })
    result.should.be.eql(666)
  })

  it('should end', async() => {
    await nixe.end()
  })
})
