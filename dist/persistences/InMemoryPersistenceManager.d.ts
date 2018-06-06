import { IPersistenceManager } from "../persistence";
import * as models from "../model/models";
export default class InMemoryPersistenceManager implements IPersistenceManager {
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
    remove(entity: models.Device | models.Publication | models.Subscription): void;
    defaultDevice(): models.Device | undefined;
    addDevice(device: models.Device, isDefault?: boolean): void;
    load(): Promise<Boolean>;
    save(): Promise<Boolean>;
}
