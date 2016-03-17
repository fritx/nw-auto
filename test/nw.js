
import 'should'
import Nixe from '../src/Nixe'

describe('nw-auto', function () {

  this.timeout(20 * 1000)

  let nixe

  after(() => {
    nixe.end()
  })

  it('should construct', () => {
    nixe = new Nixe('../nw-chat')
  })

  // it('should end', () => {
  //   nixe.end()
  // })
  // return

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

  it('should end', () => {
    nixe.end()
  })
})
