export interface StorageInterface {
    save: (key: string, value: string) => boolean;
    load: (key: string) => any;
    remove: (key: string) => boolean;
}
declare class PlatformConfig {
    storage: StorageInterface;
    webSocket: object;
    constructor();
}
declare const instance: PlatformConfig;
export default instance;
