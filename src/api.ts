import HttpRequestUtil from '@pefish/js-util-httprequest'
import ErrorHelper from '@pefish/js-error'

export default class GxbApiHelper {
  private baseUrl: string

  constructor(url) {
    // this._baseUrl = (network === 'testnet' ? '' : 'https://block.gxb.io/api')
    this.baseUrl = `${url}`
  }

  async getTransactionByHash(txId) {
    const result = await HttpRequestUtil.getJson(this.baseUrl + `/transaction/${txId}`, null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }

  async getAccountBalance(idOrName) {
    const result = await HttpRequestUtil.getJson(this.baseUrl + `/account_balance/${idOrName}`, null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }

  async getAccount(idOrName) {
    const result = await HttpRequestUtil.getJson(this.baseUrl + `/account/${idOrName}`, null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }
  async getBlock(blockHeight) {
    const result = await HttpRequestUtil.getJson(this.baseUrl + `/block/${blockHeight}`, null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }
}
