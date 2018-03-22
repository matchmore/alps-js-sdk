import * as models from "./model/models";

type MatchmoreEntity = models.Device | models.Publication | models.Subscription;
export interface IPersistenceManager {
  defaultDevice(): models.Device;
  devices(): models.Device[];
  publications(): models.Publication[];
  subscriptions(): models.Subscription[];

  addDevice(device: models.Device, isDefault?: boolean);
  add(entity: MatchmoreEntity);
}

export class MatchmoreEntityDiscriminator {
  public static isDevice(x: any): x is models.Device {
    return (
      (<models.MobileDevice>x).deviceToken !== undefined ||
      (<models.PinDevice>x).location !== undefined ||
      (<models.IBeaconDevice>x).proximityUUID !== undefined
    );
  }

  public static isSubscription(x: any): x is models.Subscription {
    return (<models.Subscription>x).selector !== undefined;
  }

  public static isPublication(x: any): x is models.Publication {
    return (<models.Publication>x).properties !== undefined;
  }
}

export class InMemoryPersistenceManager implements IPersistenceManager {
  private _defaultDevice: models.Device;
  private _devices: models.Device[] = [];
  private _publications: models.Publication[] = [];
  private _subscriptions: models.Subscription[] = [];
  devices() {
    return this._devices;
  }

  publications() {
    return this._publications;
  }

  subscriptions() {
    return this._subscriptions;
  }
  add(entity: models.Device | models.Publication | models.Subscription) {
    if (MatchmoreEntityDiscriminator.isDevice(entity)) {
      let device: models.Device = entity;
      this._devices.push(device);
      return;
    }

    if (MatchmoreEntityDiscriminator.isPublication(entity)) {
      let pub: models.Publication = entity;
      this._publications.push(pub);
      return;
    }

    if (MatchmoreEntityDiscriminator.isSubscription(entity)) {
      let sub: models.Subscription = entity;
      this._subscriptions.push(sub);
      return;
    }
  }

  defaultDevice(): models.Device {
    return this._defaultDevice;
  }
  addDevice(device: models.Device, isDefault?: boolean) {
    this.add(device);
    if(isDefault) this._defaultDevice = device;
  }
}
