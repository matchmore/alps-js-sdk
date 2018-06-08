import {Client, Subscription, Device, Publication, MobileDevice, IBeaconDevice, PinDevice, Location, Match} from "./client";
import Base64 = require("Base64");
import {MatchMonitor, MatchMonitorMode} from "./matchmonitor";
import {LocationManager, GPSConfig} from "./locationmanager";
import {
  IPersistenceManager,
  InMemoryPersistenceManager,
} from "./index";

export interface Token {
  sub: string;
}

type Provider<T> = (deviceId: string) => T;

export class Manager {
  private defaultClient: Client;
  
  private _matchMonitor: MatchMonitor;
  private _locationManager: LocationManager;
  private _persistenceManager: IPersistenceManager;
  public token: Token;
  
  constructor(
    public apiKey: string,
    public apiUrlOverride?: string,
    persistenceManager?: IPersistenceManager,
    gpsConfig?: GPSConfig
  ) {
    if (!apiKey) throw new Error("Api key required");
    this._persistenceManager =
      persistenceManager || new InMemoryPersistenceManager();
    
    this.token = JSON.parse(Base64.atob(this.apiKey.split(".")[1])); // as Token;
    
    // this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
    // Hack the api location (to use an overidden value if needed)
    var basePath = "https://api.matchmore.io/v5";
    if (this.apiUrlOverride) basePath = this.apiUrlOverride;
    else this.apiUrlOverride = basePath;
    this.defaultClient = new Client(basePath, options => {
      options.headers["Authorization"] = this.apiKey;
      return Promise.resolve(options);
    }, {
      fetch
    });

    this._matchMonitor = new MatchMonitor(this);
    this._locationManager = new LocationManager(this, gpsConfig);
  }
  
  async load(): Promise<Boolean> {
    return await this._persistenceManager.load();
  }
  
  get apiUrl() {
    return this.apiUrlOverride;
  }
  
  get defaultDevice(): Device | undefined {
    return this._persistenceManager.defaultDevice();
  }
  
  get devices(): Device[] {
    return this._persistenceManager.devices();
  }
  
  get publications(): Publication[] {
    return this._persistenceManager.publications();
  }
  
  get subscriptions(): Subscription[] {
    return this._persistenceManager.subscriptions();
  }
  
  /**
   * Creates a mobile device
   * @param name
   * @param platform
   * @param deviceToken platform token for push notifications for example apns://apns-token or fcm://fcm-token
   * @param completion optional callback
   */
  public createMobileDevice(
    name: string,
    platform: string,
    deviceToken: string,
    completion?: (device: MobileDevice) => void
  ): Promise<MobileDevice> {
    return this.createAnyDevice(
      <MobileDevice>{
        name: name,
        platform: platform,
        deviceToken: deviceToken
      },
      completion
    );
  }
  
  /**
   * Create a pin device
   * @param name
   * @param location
   * @param completion optional callback
   */
  public createPinDevice(
    name: string,
    location: Location,
    completion?: (device: PinDevice) => void
  ): Promise<PinDevice> {
    return this.createAnyDevice(
      new PinDevice({
        name: name,
        location: location
      }),
      completion
    );
  }
  
  /**
   * Creates an ibeacon device
   * @param name
   * @param proximityUUID
   * @param major
   * @param minor
   * @param location
   * @param completion optional callback
   */
  public createIBeaconDevice(
    name: string,
    proximityUUID: string,
    major: number,
    minor: number,
    location: Location,
    completion?: (device: IBeaconDevice) => void
  ): Promise<IBeaconDevice> {
    return this.createAnyDevice(
      new IBeaconDevice({
        name: name,
        proximityUUID: proximityUUID,
        major: major,
        minor: minor
      }),
      completion
    );
  }
  
  /**
   * Create a device
   * @param device whole device object
   * @param completion optional callback
   */
  public createAnyDevice<T extends Device>(
    device: Device,
    completion?: (device: T) => void
  ): Promise<T> {
    let p = new Promise<T>((resolve, reject) => {
      let api = this.defaultClient;
      let callback = function (error, data, response) {
        if (error) {
          reject(
            "An error has occured while creating device '" +
            device.name +
            "' :" +
            error
          );
        } else {
          // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
          resolve(JSON.parse(response.text));
        }
      };
      
      api.createDevice(device);
    });
    return p.then((device: T) => {
      let ddevice = this._persistenceManager.defaultDevice();
      let isDefault = !ddevice;
      this._persistenceManager.addDevice(device, isDefault);
      
      if (completion) completion(device);
      return device;
    });
  }

  public deleteDevice(deviceId: string, completion?: () => void){
  
    let p = new Promise((resolve, reject) => {
      let api = this.defaultClient;
      let callback = function (error, data, response) {
        if (error) {
          reject(
            "An error has occured while deleting device '" +
            deviceId +
            "' :" +
            error
          );
        } else {
          resolve();
        }
      };
      
      api.deleteDevice(deviceId);
    });

    return p.then(() => {
      let d = this._persistenceManager.devices().find(d=> d.id == deviceId);
      if(d)
        this._persistenceManager.remove(d);
      
      if (completion) completion();
    });
  }
  
  // private setDeviceType(device: Device): Device {
  //   if (this.isMobileDevice(device)) {
  //     device.deviceType = DeviceType.MobileDevice;
  //     return device;
  //   }
    
  //   if (this.isBeaconDevice(device)) {
  //     device.deviceType = DeviceType.IBeaconDevice;
  //     return device;
  //   }
    
  //   if (this.isPinDevice(device)) {
  //     device.deviceType = DeviceType.PinDevice;
  //     return device;
  //   }
    
  //   throw new Error("Cannot determine device type");
  // }
  
  private isMobileDevice(device: Device): device is MobileDevice {
    return (<MobileDevice>device).platform !== undefined;
  }
  
  private isPinDevice(device: Device): device is PinDevice {
    return (<PinDevice>device).location !== undefined;
  }
  
  private isBeaconDevice(
    device: Device
  ): device is IBeaconDevice {
    return (<IBeaconDevice>device).major !== undefined;
  }
  
  /**
   * Create a publication for a device
   * @param topic topic of the publication
   * @param range range in meters
   * @param duration time in seconds
   * @param properties properties on which the sub selector can filter on
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public createPublication(
    topic: string,
    range: number,
    duration: number,
    properties: Object,
    deviceId?: string,
    completion?: (publication: Publication) => void
  ): Promise<Publication> {
    return this.withDevice<Promise<Publication>>(deviceId)(deviceId => {
      let p = new Promise<Publication>((resolve, reject) => {
        let api = this.defaultClient;
        let callback = function (error, data, response) {
          if (error) {
            reject(
              "An error has occured while creating publication '" +
              topic +
              "' :" +
              error
            );
          } else {
            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
            resolve(JSON.parse(response.text));
          }
        };
        
        let publication = new Publication({
          worldId: this.token.sub,
          topic: topic,
          deviceId: deviceId,
          range: range,
          duration: duration,
          properties: properties
        });
        
        api.createPublication(deviceId, publication);
      });
      return p.then((publication: Publication) => {
        this._persistenceManager.add(publication);
        if (completion) completion(publication);
        return publication;
      });
    });
  }

  public deletePublication(deviceId: string, pubId: string, completion?: () => void){
  
    let p = new Promise((resolve, reject) => {
      let api = this.defaultClient;
      let callback = function (error, data, response) {
        if (error) {
          reject(
            "An error has occured while deleting publication '" +
            pubId +
            "' :" +
            error
          );
        } else {
          resolve();
        }
      };
      
      api.deletePublication(deviceId, pubId);
    });

    return p.then(() => {
      let d = this._persistenceManager.publications().find(d=> d.id == pubId);
      if(d)
        this._persistenceManager.remove(d);
      
      if (completion) completion();
    });
  }
  
  /**
   * Create a subscription for a device
   * @param topic topic of the subscription
   * @param range range in meters
   * @param duration time in seconds
   * @param selector selector which is used for filtering publications
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public createSubscription(
    topic: string,
    range: number,
    duration: number,
    selector?: string,
    deviceId?: string,
    completion?: (subscription: Subscription) => void
  ): Promise<Subscription> {
    return this.withDevice<Promise<Subscription>>(deviceId)(deviceId => {
      let p = new Promise<Subscription>((resolve, reject) => {
        let api = this.defaultClient;
        let callback = function (error, data, response) {
          if (error) {
            reject(
              "An error has occured while creating subscription '" +
              topic +
              "' :" +
              error
            );
          } else {
            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
            resolve(JSON.parse(response.text));
          }
        };
        
        let subscription = new Subscription({
          worldId: this.token.sub,
          topic: topic,
          deviceId: deviceId,
          range: range,
          duration: duration,
          selector: selector || ""
        });
        
        api.createSubscription(deviceId, subscription);
      });
      return p.then((subscription: Subscription) => {
        this._persistenceManager.add(subscription);
        if (completion) completion(subscription);
        return subscription;
      });
    });
  }

  public deleteSubscription(deviceId: string, subId: string, completion?: () => void){
  
    let p = new Promise((resolve, reject) => {
      let api = this.defaultClient;
      let callback = function (error, data, response) {
        if (error) {
          reject(
            "An error has occured while deleting Ssbscription '" +
            subId +
            "' :" +
            error
          );
        } else {
          resolve();
        }
      };
      
      api.deleteSubscription(deviceId, subId);
    });

    return p.then(() => {
      let d = this._persistenceManager.publications().find(d=> d.id == subId);
      if(d)
        this._persistenceManager.remove(d);
      
      if (completion) completion();
    });
  }
  
  /**
   * Updates the device location
   * @param location
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public updateLocation(
    location: Location,
    deviceId?: string,
  ): Promise<void> {
    return this.withDevice<Promise<void>>(deviceId)(deviceId => {
      let p = new Promise((resolve, reject) => {
        let api = this.defaultClient;
        let callback = function (error, data, response) {
          if (error) {
            reject(
              "An error has occured while creating location ['" +
              location.latitude +
              "','" +
              location.longitude +
              "']  :" +
              error
            );
          } else {
            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
            resolve();
          }
        };
        
        api.createLocation(deviceId, location);
      });
      return p.then(_ => {
      });
    });
  }
  
  /**
   * Returns all current matches
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public getAllMatches(
    deviceId?: string,
    completion?: (matches: Match[]) => void
  ): Promise<Match[]> {
    return this.withDevice<Promise<Match[]>>(deviceId)(deviceId => {
      let p = new Promise<Match[]>((resolve, reject) => {
        let api = this.defaultClient;
        let callback = function (error, data, response) {
          if (error) {
            reject("An error has occured while fetching matches: " + error);
          } else {
            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
            resolve(JSON.parse(response.text));
          }
        };
        
        api.getMatches(deviceId);
      });
      return p.then((matches: Match[]) => {
        if (completion) completion(matches);
        return matches;
      });
    });
  }
  
  /**
   * Returns a specific match for device
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public getMatch(
    matchId,
    string,
    deviceId?: string,
    completion?: (matches: Match) => void
  ): Promise<Match> {
    return this.withDevice<Promise<Match>>(deviceId)(deviceId => {
      let p = new Promise<Match>((resolve, reject) => {
        let api = this.defaultClient;
        let callback = function (error, data, response) {
          if (error) {
            reject("An error has occured while fetching matches: " + error);
          } else {
            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
            resolve(JSON.parse(response.text));
          }
        };
        
        api.getMatch(deviceId, matchId);
      });
      return p.then((matches: Match) => {
        if (completion) completion(matches);
        return matches;
      });
    });
  }
  
  /**
   * Gets publications
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public getAllPublications(
    deviceId?: string,
    completion?: (publications: Publication[]) => void
  ) {
    return this.withDevice<Promise<Publication[]>>(deviceId)(
      deviceId => {
        let p = new Promise<Publication[]>((resolve, reject) => {
          let api = this.defaultClient;
          let callback = function (error, data, response) {
            if (error) {
              reject(
                "An error has occured while fetching publications: " + error
              );
            } else {
              // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
              resolve(JSON.parse(response.text));
            }
          };
          
          api.getPublications(deviceId);
        });
        return p;
      }
    );
  }
  
  private withDevice<T>(deviceId?: string): (p: Provider<T>) => T {
    if (!!deviceId) {
      return (p: Provider<T>) => p(deviceId)
    }
    ;
    if (!!this.defaultDevice && !!this.defaultDevice.id) {
      return (p: Provider<T>) => p(this.defaultDevice.id)
    }
    ;
    
    throw new Error(
      "There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id"
    );
  }
  
  /**
   * Gets subscriptions
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public getAllSubscriptions(
    deviceId?: string,
    completion?: (subscriptions: Subscription[]) => void
  ) {
    return this.withDevice<Promise<Subscription[]>>(deviceId)(
      deviceId => {
        let p = new Promise<Subscription[]>((resolve, reject) => {
          let api = this.defaultClient;
          let callback = function (error, data, response) {
            if (error) {
              reject(
                "An error has occured while fetching subscriptions: " + error
              );
            } else {
              // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
              resolve(JSON.parse(response.text));
            }
          };
          
          api.getSubscriptions(deviceId);
        });
        return p;
      }
    );
  }
  
  /**
   * Registers a callback for matches
   * @param completion
   */
  set onMatch(completion: (match: Match) => void) {
    this._matchMonitor.onMatch = completion;
  }
  
  /**
   * Register a callback for location updates
   * @param completion
   */
  set onLocationUpdate(completion: (location: Location) => void) {
    this._locationManager.onLocationUpdate = completion;
  }
  
  public startMonitoringMatches(mode: MatchMonitorMode) {
    this._matchMonitor.startMonitoringMatches(mode);
  }
  
  public stopMonitoringMatches() {
    this._matchMonitor.stopMonitoringMatches();
  }
  
  public startUpdatingLocation() {
    this._locationManager.startUpdatingLocation();
  }
  
  public stopUpdatingLocation() {
    this._locationManager.stopUpdatingLocation();
  }
}