import * as models from "./model/models";
export declare type MatchmoreEntity = models.Device | models.Publication | models.Subscription;
export interface IPersistenceManager {
    defaultDevice(): models.Device | undefined;
    devices(): models.Device[];
    publications(): models.Publication[];
    subscriptions(): models.Subscription[];
    onLoad(onLoad: (state: IPersistenceManager) => void): any;
    addDevice(device: models.Device, isDefault?: boolean): any;
    add(entity: MatchmoreEntity): any;
}
export declare class MatchmoreEntityDiscriminator {
    static isDevice(x: any): x is models.Device;
    static isSubscription(x: any): x is models.Subscription;
    static isPublication(x: any): x is models.Publication;
}
export declare class InMemoryPersistenceManager implements IPersistenceManager {
    private _defaultDevice?;
    private _devices;
    private _publications;
    private _subscriptions;
    private _onLoad?;
    devices(): models.Device[];
    publications(): models.Publication[];
    onLoad(onLoad: (state: IPersistenceManager) => void): void;
    subscriptions(): models.Subscription[];
    add(entity: models.Device | models.Publication | models.Subscription): void;
    defaultDevice(): models.Device | undefined;
    addDevice(device: models.Device, isDefault?: boolean): void;
}
