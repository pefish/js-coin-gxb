export default class GxbWsHelper {
    private url;
    private apisInstance;
    connected: boolean;
    constructor(url: any);
    connect(): Promise<void>;
    reconnect(): Promise<void>;
    close(): void;
    getBlock(height: any): Promise<any>;
    getTransactionByBlocknumAndIndex(blockNum: any, index: any): Promise<any>;
    /**
     * 获取交易（如果此交易过了有效期，则返回null）
     * @param txId
     * @returns {Promise<void>}
     */
    getTransaction(txId: any): Promise<any>;
    getAccount(accountNameOrId: any): Promise<any>;
    getBalance(accountNameOrId: any, assetId?: string): Promise<any>;
    getBalances(accountNameOrId: any): Promise<any>;
    getObject(objectId: any): Promise<any>;
    getTxHexFromTxObj(txObj: any): Promise<any>;
    getNameByAccountId(accountId: any): Promise<any>;
    getAccountIdByName(accountName: any): Promise<any>;
    getMemoPKey(accountNameOrId: any): Promise<any>;
    getBlockChainInfo(): Promise<any>;
    /**
     * 获取最新高度
     * @param isIrreversible {boolean} 是不是不可回滚的
     * @returns {Promise<*>}
     */
    getLatestHeight(isIrreversible?: boolean): Promise<any>;
    getRequiredFee(operation: any, assertId: any): Promise<any>;
    /**
     * 广播交易（交易入块才返回）,返回交易信息
     * @param txObj
     */
    sendTransactionToInclude(txObj: any): Promise<unknown>;
    /**
     * 不会等待确认在返回，发送成功立即返回null
     * @param txObj
     * @returns {Promise<*>}
     */
    sendTransaction(txObj: any): Promise<any>;
    sendRawTransaction(txObj: any, include?: boolean): Promise<any>;
    getRelativeAccountHistory(accountId: any, start: any, limit: any, end: any): Promise<any>;
    getAccountTransferHistory(accountId: any, start: any, limit: any): Promise<any>;
}
