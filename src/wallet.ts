/** @module */
import BaseCoin from './base_coin'
import CryptUtil from '@pefish/js-util-crypto'
import {PrivateKey, PublicKey, key, TransactionBuilder, TransactionHelper, Aes, ops, hash} from 'gxbjs'
import GxbWsHelper from './ws'
import ErrorHelper from '@pefish/js-error'

export default class GxbWalletHelper extends BaseCoin {

  remoteClient: GxbWsHelper

  constructor() {
    super()
  }

  async initRemoteClient(url) {
    this.remoteClient = new GxbWsHelper(url)
    await this.remoteClient.connect()
  }

  close () {
    this.remoteClient && this.remoteClient.close()
  }

  isPublicKeyString (str) {
    const result = PublicKey.fromPublicKeyString(str)
    return result !== null
  }

  getAllBySeedAndIndex(seed, index) {
    const sha256 = CryptUtil.sha256ToHex(seed + index)
    let privateKeyObj = PrivateKey.fromSeed(key.normalize_brainKey(sha256))
    return {
      seed,
      index,
      sha256,
      privateKey: privateKeyObj.toHex(),
      publicKey: privateKeyObj.toPublicKey().toString(),
      wif: privateKeyObj.toWif(),
      address: privateKeyObj.toPublicKey().toAddressString()
    }
  }

  getPubkeyFromWif(wif) {
    const privKey = PrivateKey.fromWif(wif)
    return privKey.toPublicKey().toString()
  }

  decryptMemo (toWif, fromPKey, nonce, encryptedMemo) {
    const privKey = PrivateKey.fromWif(toWif)
    return Aes.decrypt_with_checksum(
      privKey,
      fromPKey,
      nonce,
      encryptedMemo
    ).toString()
  }

  encryptMemo (fromWif, toPKey, nonce, memo) {
    const privKey = PrivateKey.fromWif(fromWif)
    return Aes.encrypt_with_checksum(
      privKey,
      toPKey,
      nonce,
      memo
    ).toString()
  }

  async getTxIdfromTxObj (txObj) {
    const txHex = await this.remoteClient.getTxHexFromTxObj(txObj)
    return hash.sha256(ops.transaction.toBuffer(ops.transaction.fromHex(txHex))).toString('hex').substring(0, 40)
  }

  /**
   * 构建转账交易
   * @param wif {string} 私钥
   * @param fromAccountName {string} 源账户名
   * @param toAccountName {string} 目标账户名
   * @param amount {string} 金额，单位wei
   * @param memo {string} memo
   * @param assetId {string} 资产类型
   * @param expiration {number} 过期时间。最大不能超过maximum_time_until_expiration(通过get_global_properties接口可以看到)
   * @returns {Promise<{txId: string, txObj, txHex: string}>}
   */
  async buildTransferTransaction(wif, fromAccountName, toAccountName, amount, memo = null, assetId = '1.3.1', expiration = 30) {
    if (!this.remoteClient) {
      throw new ErrorHelper(`没有连接ws`)
    }

    const privKey = PrivateKey.fromWif(wif)
    const pubkey = privKey.toPublicKey().toString()

    let tr = new TransactionBuilder()

    const operation = {
      fee: {
        amount: '0',
        asset_id: assetId
      },
      from: await this.remoteClient.getAccountIdByName(fromAccountName),
      to: await this.remoteClient.getAccountIdByName(toAccountName),
      amount: {
        amount,
        asset_id: assetId
      }
    }
    if (memo) {
      const memoToPkey = await this.remoteClient.getMemoPKey(toAccountName)
      let nonce = TransactionHelper.unique_nonce_uint64()
      operation['memo'] = {
        from: pubkey,
        to: memoToPkey,
        nonce,
        message: Aes.encrypt_with_checksum(
          privKey,
          memoToPkey,
          nonce,
          memo
        )
      }
    }

    tr.add_type_operation('transfer', operation)

    tr.add_signer(privKey, pubkey)

    const blockchainInfo = await this.remoteClient.getObject('2.1.0')
    tr.expiration = Math.ceil(new Date(blockchainInfo['time'] + 'Z').getTime() / 1000) + expiration
    tr.ref_block_num = blockchainInfo['head_block_number'] & 0xFFFF
    tr.ref_block_prefix = new Buffer(blockchainInfo['head_block_id'], 'hex').readUInt32LE(4)
    // for (let op of tr.operations) {
    //   op[1]['fee'] = await this.remoteClient.getRequiredFee(ops.operation.toObject(op), assetId)
    // }
    tr.operations[0][1]['fee'] = await this.remoteClient.getRequiredFee(ops.operation.toObject(tr.operations[0]), assetId)

    // 对以下字段转为buffer
    // ref_block_num: uint16,
    // ref_block_prefix: uint32,
    // expiration: time_point_sec,
    // operations: array(operation),
    // extensions: set(future_extensions)
    tr.tr_buffer = ops.transaction.toBuffer(tr)
    tr.sign()  // 对 tr_buffer + chain_id 签名

    const txObj = ops.signed_transaction.toObject(tr)
    return {
      txId: tr.id(),
      txObj,
      txHex: JSON.stringify(txObj)
    }
  }

  async buildUpgradeAccountTransaction(wif, accountId, expiration = 15) {
    if (!this.remoteClient) {
      throw new ErrorHelper(`没有连接ws`)
    }

    const privKey = PrivateKey.fromWif(wif)
    const pubkey = privKey.toPublicKey().toString()


    let tr = new TransactionBuilder()

    tr.add_type_operation('account_upgrade', {
      fee: {
        amount: '200000000',
        asset_id: '1.3.0'
      },
      account_to_upgrade: accountId,
      upgrade_to_lifetime_member: true,
      extensions: []
    })

    tr.add_signer(privKey, pubkey)

    const blockchainInfo = await this.remoteClient.getObject('2.1.0')
    tr.expiration = Math.ceil(new Date(blockchainInfo['time'] + 'Z').getTime() / 1000) + expiration
    tr.ref_block_num = blockchainInfo['head_block_number'] & 0xFFFF
    tr.ref_block_prefix = new Buffer(blockchainInfo['head_block_id'], 'hex').readUInt32LE(4)
    tr.tr_buffer = ops.transaction.toBuffer(tr)
    tr.sign()

    const txObj = ops.signed_transaction.toObject(tr)
    return {
      txId: tr.id(),
      txObj: ops.signed_transaction.toObject(tr),
      txHex: JSON.stringify(txObj)
    }
  }

  async buildCreateAccountTransaction(wif, registrarId, accountName, ownerPkey, expiration = 15) {
    if (!this.remoteClient) {
      throw new ErrorHelper(`没有连接ws`)
    }

    const privKey = PrivateKey.fromWif(wif)
    const pubkey = privKey.toPublicKey().toString()

    let tr = new TransactionBuilder()

    tr.add_type_operation('account_create', {
      fee: {
        amount: '0',
        asset_id: '1.3.0'
      },
      registrar: registrarId,
      referrer: registrarId,
      referrer_percent: 1000,
      name: accountName,
      owner: {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[
          ownerPkey,
          1
        ]
        ],
        address_auths: []
      },
      active: {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [
          [
            ownerPkey,
            1
          ]
        ],
        address_auths: []
      },
      options: {
        memo_key: ownerPkey,
        voting_account: '1.2.5',
        num_witness: 0,
        num_committee: 0,
        votes: [],
        extensions: []
      },
      extensions: {}
    })

    tr.add_signer(privKey, pubkey)

    const blockchainInfo = await this.remoteClient.getObject('2.1.0')
    tr.expiration = Math.ceil(new Date(blockchainInfo['time'] + 'Z').getTime() / 1000) + expiration
    tr.ref_block_num = blockchainInfo['head_block_number'] & 0xFFFF
    tr.ref_block_prefix = new Buffer(blockchainInfo['head_block_id'], 'hex').readUInt32LE(4)
    tr.operations[0][1]['fee'] = await this.remoteClient.getRequiredFee(ops.operation.toObject(tr.operations[0]), '1.3.0')
    tr.tr_buffer = ops.transaction.toBuffer(tr)
    tr.sign()

    const txObj = ops.signed_transaction.toObject(tr)
    return {
      txId: tr.id(),
      txObj: ops.signed_transaction.toObject(tr),
      txHex: JSON.stringify(txObj)
    }
  }
}

