import 'node-assist'
import assert from "assert"
import GxbWsHelper from './ws'


describe('gxbWsHelper', () => {

  let wsHelper

  before(async () => {
    wsHelper = new GxbWsHelper('wss://node5.gxb.io:443')
    await wsHelper.connect()
  })

  it('getBalance', async () => {
    try {
      const result = await wsHelper.getBalance('bisale-1')
      global.logger.error(result)
      // assert.strictEqual(result, 'Aatqqnhk5T3APLPDYzCuAXuTyGEufu8LEL')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('reconnect', async () => {
    try {
      await wsHelper.reconnect()
      const result = await wsHelper.getAccount('bisale-1')
      global.logger.error(result)
      // assert.strictEqual(result, 'Aatqqnhk5T3APLPDYzCuAXuTyGEufu8LEL')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getRelativeAccountHistory', async () => {
    try {
      const result = await wsHelper.getRelativeAccountHistory('1.2.18', 11, 1, 15)
      // logger.error(JSON.stringify(result))
      // assert.strictEqual(result, 'Aatqqnhk5T3APLPDYzCuAXuTyGEufu8LEL')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAccountTransferHistory', async () => {
    try {
      const result = await wsHelper.getAccountTransferHistory('1.2.18', 11, 1)
      // logger.error(JSON.stringify(result))
      // assert.strictEqual(result, 'Aatqqnhk5T3APLPDYzCuAXuTyGEufu8LEL')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAccount', async () => {
    try {
      const result = await wsHelper.getAccount('albert')
      // logger.error(result)
      // assert.strictEqual(result, 'Aatqqnhk5T3APLPDYzCuAXuTyGEufu8LEL')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getObject', async () => {
    try {
      const result = await wsHelper.getObject('2.1.0')
      // logger.error(result)
      // assert.strictEqual(result, 'Aatqqnhk5T3APLPDYzCuAXuTyGEufu8LEL')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getRequiredFees', async () => {
    try {
      const result = await wsHelper.getRequiredFees([0, {
        'fee': {'amount': '1000', 'asset_id': '1.3.1'},
        'from': '1.2.22222',
        'to': '1.2.11111',
        'amount': {'amount': '2000', 'asset_id': '1.3.1'},
        'memo': {
          'from': 'GXC8CSgXHhyM4robvhQqDbk55s2iVfu39HFgyyhypet46ZTbM5aSF',
          'to': 'GXC6a1wKBWbjG33HhAteHG2uKwZjRtkq3RrSoJuvN77azRQxH8bmX',
          'nonce': '391414507547849',
          'message': '4a01006f86d891076fed3cc47f5b462f'
        },
        'extensions': []
      }], '1.3.1')
      // logger.error(result)
      // assert.strictEqual(result, 'Aatqqnhk5T3APLPDYzCuAXuTyGEufu8LEL')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })
})

