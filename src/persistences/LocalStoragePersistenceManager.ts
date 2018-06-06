import {IPersistenceManager, MatchmoreEntityDiscriminator} from "../persistence";
import {
  Device,
  Publication,
  Subscription,
} from "../model/models";
import PlatformConfig from '../platform';
const storageKey = '@matchmoreSdk:data';

export default class LocalStoragePersistenceManager implements IPersistenceManager {
  private _defaultDevice?: Device;
  private _devices: Device[] = [];
  private _publications: Publication[] = [];
  private _subscriptions: Subscription[] = [];
  private _onLoad?: (state: IPersistenceManager) => void;
  
  devices() {
    return this._devices;
  }
  
  publications() {
    return this._publications;
  }
  
  subscriptions() {
    return this._subscriptions;
  }
  
  add(entity: Device | Publication | Subscription) {
    if (MatchmoreEntityDiscriminator.isDevice(entity)) {
      let device: Device = entity;
      this._devices.push(device);
      this.save();
      return;
    }
    
    if (MatchmoreEntityDiscriminator.isPublication(entity)) {
      let pub: Publication = entity;
      this._publications.push(pub);
      this.save();
      return;
    }
    
    if (MatchmoreEntityDiscriminator.isSubscription(entity)) {
      let sub: Subscription = entity;
      this._subscriptions.push(sub);
      this.save();
      return;
    }
  }

  remove(entity: Device | Publication | Subscription) {
    if (MatchmoreEntityDiscriminator.isDevice(entity)) {
      let device: Device = entity;
      if (device.id == this._defaultDevice.id) throw new Error("Cannot delete default device");
      this._devices = this._devices.filter(d=> device.id != d.id);
      this.save();
      return;
    }

    if (MatchmoreEntityDiscriminator.isPublication(entity)) {
      let pub: Publication = entity;
      this._publications = this._publications.filter(d=> pub.id != d.id);
      this.save();
      return;
    }

    if (MatchmoreEntityDiscriminator.isSubscription(entity)) {
      let sub: Subscription = entity;
      this._subscriptions = this._subscriptions.filter(d=> sub.id != d.id);
      this.save();
      return;
    }
  }
  
  defaultDevice(): Device | undefined {
    return this._defaultDevice;
  }
  
  addDevice(device: Device, isDefault?: boolean) {
    this.add(device);
    if (isDefault) this._defaultDevice = device;
    this.save();
  }
  
  onLoad(onLoad: (state: IPersistenceManager) => void) {
    this._onLoad = onLoad;
  }
  
  async load(): Promise<Boolean> {
    const dataString = await PlatformConfig.storage.load(storageKey);
    const data = JSON.parse(dataString);
    if (data) {
      this._devices = data.devices.map((deviceObject) => <Device>deviceObject);
      this._subscriptions = data.subscriptions.map((subscriptionObject) => <Subscription>subscriptionObject);
      this._publications = data.publications.map((publicationObject) => <Publication>publicationObject);
      this._defaultDevice = <Device>data.defaultDevice;
    }
    return true;
  }
  
  async save(): Promise<Boolean> {
    const saveData = {
      devices: this._devices,
      subscriptions: this._subscriptions,
      publications: this._publications,
      defaultDevice: this._defaultDevice,
    }
    return await PlatformConfig.storage.save(storageKey, JSON.stringify(saveData));
  }
}
