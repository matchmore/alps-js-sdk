export interface StorageInterface {
    save: (key: string, value: string) => boolean;
    load: (key: string) => any;
    remove: (key: string) => boolean;
}
export declare class PlatformConfig {
    private static instance;
    storage: StorageInterface;
    webSocket: object;
    constructor();
    static getInstance(): PlatformConfig;
}
declare const instance: PlatformConfig;
export default instance;
