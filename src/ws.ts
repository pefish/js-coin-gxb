import { Apis } from 'gxbjs-ws'
import ErrorHelper from '@pefish/js-error'

export default class GxbWsHelper {
  private url: string
  private apisInstance: any
  public connected: boolean

  constructor (url) {
    if (typeof url !== 'string') {
      url = `${url['protocol']}://${url['host']}:${url['port']}`
    }
    this.url = url
    this.apisInstance = null
    this.connected = false
  }

  async connect () {
    this.apisInstance = Apis.instance(this.url, true)
    await this.apisInstance.init_promise
    this.connected = true
  }

  async reconnect () {
    await this.close()
    await this.connect()
    this.connected = true
  }

  close () {
    this.apisInstance && this.apisInstance.close()
    this.apisInstance = null
    this.connected = false
  }

  async getBlock (height) {
    const result = await this.apisInstance.db_api().exec('get_block', [height])
    if (result === null) {
      throw new ErrorHelper(`对象没有找到. method: 'getBlock', params: ${height}, result: ${JSON.stringify(result)}`)
    }
    return result
  }

  async getTransactionByBlocknumAndIndex (blockNum, index) {
    return await this.apisInstance.db_api().exec('get_transaction', [blockNum, index])
  }

  /**
   * 获取交易（如果此交易过了有效期，则返回null）
   * @param txId
   * @returns {Promise<void>}
   */
  async getTransaction (txId) {
    const result = await this.apisInstance.db_api().exec('get_recent_transaction_by_id', [txId])
    if (result === null) {
      throw new ErrorHelper(`对象没有找到. method: 'getTransaction', params: ${txId}, result: ${JSON.stringify(result)}`)
    }
    return result
  }

  async getAccount (accountNameOrId) {
    const results = await this.apisInstance.db_api().exec('get_full_accounts', [[accountNameOrId], false])
    if (!results[0]) {
      throw new ErrorHelper(`对象没有找到. method: 'getAccount', params: ${accountNameOrId}, result:  ${JSON.stringify(results)}`)
    }
    if (!results[0][1]) {
      throw new ErrorHelper(`返回数据异常. ${JSON.stringify(results)}`)
    }
    return results[0][1]
  }

  async getBalance (accountNameOrId, assetId = '1.3.1') {
    const account = await this.getAccount(accountNameOrId)
    for (let { asset_type, balance } of account['balances']) {
      if (asset_type === assetId) {
        return balance.toString()
      }
    }
    return '0'
  }

  async getBalances (accountNameOrId) {
    const account = await this.getAccount(accountNameOrId)
    return account['balances']
  }

  async getObject (objectId) {
    const results = await this.apisInstance.db_api().exec('get_objects', [[objectId]])
    if (!results[0]) {
      throw new ErrorHelper(`对象没有找到. method: 'getObject', params: ${objectId}, result:  ${JSON.stringify(results)}`)
    }
    return results[0]
  }

  async getTxHexFromTxObj (txObj) {
    return await this.apisInstance.db_api().exec('get_transaction_hex', [txObj])
  }

  async getNameByAccountId (accountId) {
    const account = await this.getAccount(accountId)
    return account['account']['name']
  }

  async getAccountIdByName (accountName) {
    const account = await this.getAccount(accountName)
    return account['account']['id']
  }

  async getMemoPKey (accountNameOrId) {
    const account = await this.getAccount(accountNameOrId)
    if (!account['account']['options']) {
      throw new ErrorHelper(`对象没有找到. method: 'getMemoPKey', params: ${accountNameOrId}, result: ${JSON.stringify(account)}`)
    }
    return account['account']['options']['memo_key']
  }

  async getBlockChainInfo () {
    return await this.getObject('2.1.0')
  }

  /**
   * 获取最新高度
   * @param isIrreversible {boolean} 是不是不可回滚的
   * @returns {Promise<*>}
   */
  async getLatestHeight (isIrreversible = true) {
    const result = await this.getBlockChainInfo()
    return isIrreversible === true ? result['last_irreversible_block_num'].toString() : result['head_block_number'].toString()
  }

  async getRequiredFee (operation, assertId) {
    const results = await this.apisInstance.db_api().exec('get_required_fees', [[operation], assertId])
    if (!results[0]) {
      throw new ErrorHelper(`对象没有找到. method: 'getRequiredFee', params: null, result: ${JSON.stringify(results)}`)
    }
    return results[0]
  }

  /**
   * 广播交易（交易入块才返回）,返回交易信息
   * @param txObj
   */
  sendTransactionToInclude (txObj) {
    return new Promise((resolve, reject) => {
      this.apisInstance.network_api().exec('broadcast_transaction_with_callback', [(res) => {
        resolve(res)
      }, txObj]).catch((err) => {
        reject(err)
      })
    })
  }

  /**
   * 不会等待确认在返回，发送成功立即返回null
   * @param txObj
   * @returns {Promise<*>}
   */
  async sendTransaction (txObj) {
    return await this.apisInstance.network_api().exec('broadcast_transaction', [txObj])
  }

  async sendRawTransaction (txObj, include = true) {
    let result
    if (include === true) {
      result = await this.sendTransactionToInclude(txObj)
    } else {
      result = await this.sendTransaction(txObj)
    }
    return result
  }

  async getRelativeAccountHistory (accountId, start, limit, end) {
    return await this.apisInstance.history_api().exec('get_relative_account_history', [accountId, start, limit, end])
  }

  async getAccountTransferHistory (accountId, start, limit) {
    return await this.apisInstance.history_api().exec('get_account_history_by_operations', [accountId, [0], start, limit])
  }
}

