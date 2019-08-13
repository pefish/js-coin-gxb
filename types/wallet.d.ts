/** @module */
import BaseCoin from './base_coin';
import GxbWsHelper from './ws';
export default class GxbWalletHelper extends BaseCoin {
    remoteClient: GxbWsHelper;
    constructor();
    initRemoteClient(url: any): Promise<void>;
    close(): void;
    isPublicKeyString(str: any): boolean;
    getAllBySeedAndIndex(seed: any, index: any): {
        seed: any;
        index: any;
        sha256: string;
        privateKey: any;
        publicKey: any;
        wif: any;
        address: any;
    };
    getPubkeyFromWif(wif: any): any;
    decryptMemo(toWif: any, fromPKey: any, nonce: any, encryptedMemo: any): any;
    encryptMemo(fromWif: any, toPKey: any, nonce: any, memo: any): any;
    getTxIdfromTxObj(txObj: any): Promise<any>;
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
    buildTransferTransaction(wif: any, fromAccountName: any, toAccountName: any, amount: any, memo?: any, assetId?: string, expiration?: number): Promise<{
        txId: any;
        txObj: any;
        txHex: string;
    }>;
    buildUpgradeAccountTransaction(wif: any, accountId: any, expiration?: number): Promise<{
        txId: any;
        txObj: any;
        txHex: string;
    }>;
    buildCreateAccountTransaction(wif: any, registrarId: any, accountName: any, ownerPkey: any, expiration?: number): Promise<{
        txId: any;
        txObj: any;
        txHex: string;
    }>;
}
