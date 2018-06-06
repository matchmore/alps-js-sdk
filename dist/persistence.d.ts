import * as models from "./model/models";
export declare type MatchmoreEntity = models.Device | models.Publication | models.Subscription;
export interface IPersistenceManager {
    defaultDevice(): models.Device | undefined;
    devices(): models.Device[];
    publications(): models.Publication[];
    subscriptions(): models.Subscription[];
    onLoad(onLoad: (state: IPersistenceManager) => void): any;
    load(): Promise<Boolean>;
    save(): Promise<Boolean>;
    addDevice(device: models.Device, isDefault?: boolean): any;
    add(entity: MatchmoreEntity): any;
    remove(entity: MatchmoreEntity): any;
}
export declare class MatchmoreEntityDiscriminator {
    static isDevice(x: any): x is models.Device;
    static isSubscription(x: any): x is models.Subscription;
    static isPublication(x: any): x is models.Publication;
}
