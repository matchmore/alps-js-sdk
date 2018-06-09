import { IPersistenceManager } from "../persistence";
import { Device, Publication, Subscription } from "../model/models";
export default class LocalStoragePersistenceManager implements IPersistenceManager {
    private _defaultDevice?;
    private _devices;
    private _publications;
    private _subscriptions;
    private _onLoad?;
    devices(): Device[];
    publications(): Publication[];
    subscriptions(): Subscription[];
    add(entity: Device | Publication | Subscription): void;
    remove(entity: Device | Publication | Subscription): void;
    defaultDevice(): Device | undefined;
    addDevice(device: Device, isDefault?: boolean): void;
    onLoad(onLoad: (state: IPersistenceManager) => void): void;
    load(): Promise<Boolean>;
    save(): Promise<Boolean>;
}
