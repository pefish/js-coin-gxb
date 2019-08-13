export default class GxbApiHelper {
    private baseUrl;
    constructor(url: any);
    getTransactionByHash(txId: any): Promise<any>;
    getAccountBalance(idOrName: any): Promise<any>;
    getAccount(idOrName: any): Promise<any>;
    getBlock(blockHeight: any): Promise<any>;
}
