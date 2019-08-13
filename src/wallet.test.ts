import 'node-assist'
import assert from "assert"
import GxbWalletHelper from './wallet'


describe('gxbWalletHelper', () => {

  let walletHelper

  before(async () => {
    walletHelper = new GxbWalletHelper()
    await walletHelper.initRpcClient({
      protocol: 'ws',
      host: '10.1.0.175',
      port: 11011
    })
  })

  after(async () => {
    walletHelper.remoteClient.close()
  })

  it('getPubkeyFromWif', async () => {
    try {
      const result = walletHelper.getPubkeyFromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
      // logger.error(result)
      assert.strictEqual(result, 'GXC6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildUpgradeAccountTransaction', async () => {
    try {
      const result = await walletHelper.buildUpgradeAccountTransaction(
        '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
        '1.2.17'
      )
      // logger.error(result)
      // logger.error('test', await walletHelper.remoteClient.sendTransaction(result['tb']))
      // assert.strictEqual(result, '6PYNYuL3ALr32vfE1P5XMJXTmWJEm6wVD1SGdyTPurpDTz5QV7B7Kgd5o2')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildCreateAccountTransaction', async () => {
    try {
      const result = await walletHelper.buildCreateAccountTransaction(
        '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
        '1.2.17',
        'test',
        'GXC6a1wKBWbjG33HhAteHG2uKwZjRtkq3RrSoJuvN77azRQxH8bmX',
      )
      // logger.error(result['txObj'])
      // logger.error('test', await walletHelper.remoteClient.sendTransaction(result['txObj']))
      // assert.strictEqual(result, 'L5E2CtQXRUqmSn2Tuvp6mjPpTAAZtr6DN36p6ThzRVmcfe4HvaC8')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getBalance', async () => {
    try {
      const result = await walletHelper.remoteClient.getBalance('nathan', '1.3.0')
      // logger.error(result)
      // assert.strictEqual(result, '005f6fd6299c8ed650d0b712ed858a3b6bcbbbd1')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('isPublicKeyString', async () => {
    try {
      const result = walletHelper.isPublicKeyString('GXC8CSgXHhyM4robvhQqDbk55s2iVfu39HFgyyhypet46ZTbM5aSF')
      // logger.error(result)
      assert.strictEqual(result, true)

      const result1 = walletHelper.isPublicKeyString('GXC8CSgXHhyM4robvhQqDbk55s2iVfu39HFgyyhypet46ZTbM5aS')
      // logger.error(result)
      assert.strictEqual(result1, false)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getBlock', async () => {
    try {
      const result = await walletHelper.remoteClient.getBlock('3176')
      // logger.error(result)
      // assert.strictEqual(result, 'eedbe854b8525525f74af6eda59c5904e13713117b163f810df35ed4a11f53d8')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getTransaction', async () => {
    try {
      // const result = await walletHelper.remoteClient.getTransaction('91cf7411e80f69830559e98fe5258746c8c6bb85')
      // logger.error(result)
      // assert.strictEqual(result, 'Aatqqnhk5T3APLPDYzCuAXuTyGEufu8LEL')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getLatestHeight', async () => {
    try {
      const result1 = await walletHelper.remoteClient.getLatestHeight()
      // logger.error(result1)
      const result2 = await walletHelper.remoteClient.getLatestHeight(false)
      // logger.error(result2)
      assert.strictEqual(result1.lt(result2), true)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('decriptMemo', async () => {
    try {
      const result1 = await walletHelper.decryptMemo(
        '5JCmmE4cCwmoDZFucT95C8uE4LzPy94izfkiGEox3JCHyaoVTqJ',
        'GXC6a1wKBWbjG33HhAteHG2uKwZjRtkq3RrSoJuvN77azRQxH8bmX',
        '391566085155110',
        '02b004c038c7c48ececc52dc7691002c'
      )
      // logger.error(result1)
      assert.strictEqual(result1, '321')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getTxHexFromTxObj', async () => {
    try {
      const result1 = await walletHelper.remoteClient.getTxHexFromTxObj({
        "ref_block_num": 34961,
        "ref_block_prefix": 309934730,
        "expiration": "2018-06-21T04:23:55",
        "operations": [
          [
            0,
            {
              "fee": {
                "amount": 9493,
                "asset_id": "1.3.1"
              },
              "from": "1.2.20",
              "to": "1.2.19",
              "amount": {
                "amount": 1000000,
                "asset_id": "1.3.1"
              },
              "memo": {
                "from": "GXC6a1wKBWbjG33HhAteHG2uKwZjRtkq3RrSoJuvN77azRQxH8bmX",
                "to": "GXC7LWVDyHofczqFJiznk7dHoDDDfnyofEp1HJ9X2caX8GBGxHaWN",
                "nonce": "391566085155110",
                "message": "02b004c038c7c48ececc52dc7691002c"
              },
              "extensions": []
            }
          ]
        ],
        "extensions": [],
        "signatures": [
          "1f1192c092e8355c94e3c4f4a6a88696e1117dcb5aa82ab75fd07e8648c04b6af44d18a87f92cc4d4b5d65e9ce55caa68dfff44724097e21f2bd43792d2cf6191a"
        ],
        "operation_results": [
          [
            0,
            {}
          ]
        ]
      })
      // logger.error(result1)
      assert.strictEqual(result1, '91888a3a79125b282b5b0100152500000000000001141340420f0000000000010102dd729ac1e01ffdf23ffbc9b955277789f71f491b43051ba3afdc3a5d399b7b2903427906a5e27801d140225ca70cd2d448fd839b9deaede6251ca683b19509bc5c26696995206401001002b004c038c7c48ececc52dc7691002c0000011f1192c092e8355c94e3c4f4a6a88696e1117dcb5aa82ab75fd07e8648c04b6af44d18a87f92cc4d4b5d65e9ce55caa68dfff44724097e21f2bd43792d2cf6191a')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getTxIdfromTxObj', async () => {
    try {
      const result1 = await walletHelper.getTxIdfromTxObj({
        "ref_block_num": 34961,
        "ref_block_prefix": 309934730,
        "expiration": "2018-06-21T04:23:55",
        "operations": [
          [
            0,
            {
              "fee": {
                "amount": 9493,
                "asset_id": "1.3.1"
              },
              "from": "1.2.20",
              "to": "1.2.19",
              "amount": {
                "amount": 1000000,
                "asset_id": "1.3.1"
              },
              "memo": {
                "from": "GXC6a1wKBWbjG33HhAteHG2uKwZjRtkq3RrSoJuvN77azRQxH8bmX",
                "to": "GXC7LWVDyHofczqFJiznk7dHoDDDfnyofEp1HJ9X2caX8GBGxHaWN",
                "nonce": "391566085155110",
                "message": "02b004c038c7c48ececc52dc7691002c"
              },
              "extensions": []
            }
          ]
        ],
        "extensions": [],
        "signatures": [
          "1f1192c092e8355c94e3c4f4a6a88696e1117dcb5aa82ab75fd07e8648c04b6af44d18a87f92cc4d4b5d65e9ce55caa68dfff44724097e21f2bd43792d2cf6191a"
        ],
        "operation_results": [
          [
            0,
            {}
          ]
        ]
      })
      // logger.error(result1)
      assert.strictEqual(result1, '176aa9a1560b347db86c9a9a3bc3128bae226913')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAllBySeedAndIndex', async () => {
    try {
      const result = walletHelper.getAllBySeedAndIndex('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173', 1)
      // logger.error(result)
      assert.strictEqual(result['publicKey'], 'GXC6a1wKBWbjG33HhAteHG2uKwZjRtkq3RrSoJuvN77azRQxH8bmX')
      const result1 = walletHelper.getAllBySeedAndIndex('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173', 2)
      // logger.error(result1)
      assert.strictEqual(result1['publicKey'], 'GXC7mfd2USq7yELo9zZiH5pyYi1jphh2yLAZtD7kf9Dhi3T7Xqnjk')
      const result2 = walletHelper.getAllBySeedAndIndex('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173', 3)
      // logger.error(result2)
      assert.strictEqual(result2['publicKey'], 'GXC7LWVDyHofczqFJiznk7dHoDDDfnyofEp1HJ9X2caX8GBGxHaWN')
      const result3 = walletHelper.getAllBySeedAndIndex('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173', 4)
      // logger.error(result3)
      assert.strictEqual(result3['publicKey'], 'GXC8CSgXHhyM4robvhQqDbk55s2iVfu39HFgyyhypet46ZTbM5aSF')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildTransferTransaction', async () => {
    try {
      const result = await walletHelper.buildTransferTransaction(
        '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
        'nathan',
        'test',
        '1000000000',
        '12452'
      )
      // logger.error(await walletHelper.getTxIdfromTxObj(result['txObj']))
      global.logger.error('result', JSON.stringify(result))
      // logger.error('test', await walletHelper.remoteClient.sendTransactionToInclude(result['txObj']))
      // logger.error('test1', await walletHelper.remoteClient.sendTransaction(result['txObj']))
      // assert.strictEqual(result['txId'], 'd43ed1069ce1f9aedc22477190c8458e486a1dcd7bd8ca2fb700a1d1f301ad57')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getNameByAccountId', async () => {
    try {
      const result = await walletHelper.remoteClient.getNameByAccountId('1.2.19')
      assert.strictEqual(result, 'deposit')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

