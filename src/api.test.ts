import 'node-assist'
import assert from "assert"
import GxbApiHelper from './api'

describe('GxbApiHelper', () => {

  let helper

  before(async () => {
    helper = new GxbApiHelper('http://block.gxb.io/api')
  })

  it('getTransactionByHash', async () => {
    try {
      const result = await helper.getTransactionByHash('deabee7d256d24e9e9452b2bdd0a3d8d115915c1')
      global.logger.error('1', JSON.stringify(result))
      // assert.notStrictEqual(result, undefined)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

