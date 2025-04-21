interface CrublibraryOptions {
    apiKey: string;
    apiUrl: string;
}
declare class Crublibrary {
    private apiKey;
    private apiUrl;
    constructor(options: CrublibraryOptions);
    recharge(): Promise<unknown>;
    create(data: any): Promise<unknown>;
    get(): Promise<unknown>;
    update(txHash: string, value: any): Promise<unknown>;
    delete(txHash: string): Promise<{
        txHash: string;
    } | undefined>;
    private handleError;
}
export declare function sayHelloFromLibrary(): void;
export default Crublibrary;
