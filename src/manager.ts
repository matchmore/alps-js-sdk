import ScalpsCoreRestApi = require("matchmore_alps_core_rest_api");
import Base64 = require("Base64");
import { MatchMonitor } from "./matchmonitor";
import { LocationManager } from "./locationmanager";
import * as models from "./model/models";
import { IPersistenceManager, InMemoryPersistenceManager } from "./persistence";

interface Token {
  sub: string;
}

export class Manager {
  defaultClient: ScalpsCoreRestApi.ApiClient;

  private _matchMonitor: MatchMonitor;
  private _locationManager: LocationManager;
  private _persistenceManager: IPersistenceManager;
  private token: Token;

  constructor(
    public apiKey: string,
    apiUrlOverride?: string,
    persistenceManager?: IPersistenceManager
  ) {
    this._persistenceManager =
      persistenceManager || new InMemoryPersistenceManager();
    this.init(apiUrlOverride);
  }

  init(apiUrlOverride?: string) {
    this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;

    this.token = JSON.parse(Base64.atob(this.apiKey.split(".")[1])) as Token;

    this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
    // Hack the api location (to use an overidden value if needed)
    if (apiUrlOverride) this.defaultClient.basePath = apiUrlOverride;
    this._matchMonitor = new MatchMonitor(this);
    this._locationManager = new LocationManager(this);
  }
  get defaultDevice(): models.Device {
    return this._persistenceManager.defaultDevice();
  }
  get devices(): models.Device[] {
    return this._persistenceManager.devices();
  }
  get publications(): models.Publication[] {
    return this._persistenceManager.publications();
  }
  get subscriptions(): models.Subscription[] {
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
    completion?: (device: models.MobileDevice) => void
  ): Promise<models.MobileDevice> {
    return this.createAnyDevice(
      <models.MobileDevice>{
        deviceType: models.DeviceType.MobileDevice,
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
    location: models.Location,
    completion?: (device: models.PinDevice) => void
  ): Promise<models.PinDevice> {
    return this.createAnyDevice(
      <models.PinDevice>{
        deviceType: models.DeviceType.PinDevice,
        name: name,
        location: location
      },
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
    location: models.Location,
    completion?: (device: models.IBeaconDevice) => void
  ): Promise<models.IBeaconDevice> {
    return this.createAnyDevice(
      <models.IBeaconDevice>{
        deviceType: models.DeviceType.IBeaconDevice,
        name: name,
        proximityUUID: proximityUUID,
        major: major,
        minor: minor,
        location: location
      },
      completion
    );
  }
/**
 * Create a device
 * @param device whole device object
 * @param completion optional callback
 */
  public createAnyDevice<T extends models.Device>(
    device: models.Device,
    completion?: (device: T) => void
  ): Promise<T> {
    device = this.setDeviceType(device);
    let p = new Promise((resolve, reject) => {
      let api = new ScalpsCoreRestApi.DeviceApi();
      let callback = function(error, data, response) {
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

      api.createDevice(device, callback);
    });
    return p.then((device: T) => {
      let ddevice = this._persistenceManager.defaultDevice();
      let isDefault = !ddevice;
      this._persistenceManager.addDevice(
        device,
        isDefault
      );

      if (completion) completion(device);
      return device;
    });
  }

  private setDeviceType(device: models.Device): models.Device {
    if (this.isMobileDevice(device)) {
      device.deviceType = models.DeviceType.MobileDevice;
      return device;
    }

    if (this.isBeaconDevice(device)) {
      device.deviceType = models.DeviceType.IBeaconDevice;
      return device;
    }

    if (this.isPinDevice(device)) {
      device.deviceType = models.DeviceType.PinDevice;
      return device;
    }

    throw new Error("Cannot determine device type");
  }

  private isMobileDevice(device: models.Device): device is models.MobileDevice {
    return (<models.MobileDevice>device).platform !== undefined;
  }

  private isPinDevice(device: models.Device): device is models.PinDevice {
    return (<models.PinDevice>device).location !== undefined;
  }

  private isBeaconDevice(
    device: models.Device
  ): device is models.IBeaconDevice {
    return (<models.IBeaconDevice>device).major !== undefined;
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
    completion?: (publication: models.Publication) => void
  ): Promise<models.Publication> {
    if (!this.defaultDevice) {
      throw new Error(
        "There is no default device available, please call createDevice before createPublication"
      );
    }
    let p = new Promise((resolve, reject) => {
      let api = new ScalpsCoreRestApi.PublicationApi();
      let callback = function(error, data, response) {
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

      let _deviceId = deviceId ? deviceId : this.defaultDevice.id;

      let publication: models.Publication = {
        worldId: this.token.sub,
        topic: topic,
        deviceId: _deviceId,
        range: range,
        duration: duration,
        properties: properties
      };

      api.createPublication(_deviceId, publication, callback);
    });
    return p.then((publication: models.Publication) => {
      this._persistenceManager.add(publication);
      if (completion) completion(publication);
      return publication;
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
    completion?: (subscription: models.Subscription) => void
  ): Promise<models.Subscription> {
    if (!this.defaultDevice) {
      throw new Error(
        "There is no default device available, please call createDevice before createPublication"
      );
    }
    let p = new Promise((resolve, reject) => {
      let api = new ScalpsCoreRestApi.SubscriptionApi();
      let callback = function(error, data, response) {
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

      let _deviceId = deviceId ? deviceId : this.defaultDevice.id;

      let subscription: models.Subscription = {
        worldId: this.token.sub,
        topic: topic,
        deviceId: _deviceId,
        range: range,
        duration: duration,
        selector: selector
      };

      api.createSubscription(_deviceId, subscription, callback);
    });
    return p.then((subscription: models.Subscription) => {
      this._persistenceManager.add(subscription);
      if (completion) completion(subscription);
      return subscription;
    });
  }

  /**
   * Updates the device location
   * @param location 
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public updateLocation(
    location: models.Location,
    deviceId?: string,
    completion?: (location: void) => void
  ): Promise<void> {
    if (!this.defaultDevice) {
      throw new Error(
        "There is no default device available, please call createDevice before createPublication"
      );
    }
    let p = new Promise((resolve, reject) => {
      let api = new ScalpsCoreRestApi.LocationApi();
      let callback = function(error, data, response) {
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

      let _deviceId = deviceId ? deviceId : this.defaultDevice.id;
      api.createLocation(_deviceId, location, callback);
    });
    return p.then((location: models.Location) => {
      if (completion) completion;
    });
  }

  /**
   * Returns all current matches
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public getAllMatches(
    deviceId?: string,
    completion?: (matches: models.Match[]) => void
  ): Promise<models.Match[]> {
    if (!this.defaultDevice) {
      throw new Error(
        "There is no default device available, please call createDevice before createPublication"
      );
    }
    let p = new Promise((resolve, reject) => {
      let api = new ScalpsCoreRestApi.DeviceApi();
      let callback = function(error, data, response) {
        if (error) {
          reject("An error has occured while fetching matches: " + error);
        } else {
          // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
          resolve(JSON.parse(response.text));
        }
      };
      let _deviceId = deviceId ? deviceId : this.defaultDevice.id;
      api.getMatches(_deviceId, callback);
    });
    return p.then((matches: models.Match[]) => {
      if (completion) completion(matches);
      return matches;
    });
  }

  /**
   * Gets publications
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public getAllPublications(
    deviceId?: string,
    completion?: (publications: models.Publication[]) => void
  ) {
    let p = new Promise((resolve, reject) => {
      let api = new ScalpsCoreRestApi.DeviceApi();
      let callback = function(error, data, response) {
        if (error) {
          reject("An error has occured while fetching publications: " + error);
        } else {
          // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
          resolve(JSON.parse(response.text));
        }
      };
      let _deviceId = deviceId ? deviceId : this.defaultDevice.id;
      api.getPublications(_deviceId, callback);
    });
    return p;
  }

  /**
   * Gets subscriptions
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public getAllSubscriptions(
    deviceId?: string,
    completion?: (subscriptions: models.Subscription[]) => void
  ) {
    let p = new Promise((resolve, reject) => {
      let api = new ScalpsCoreRestApi.DeviceApi();
      let callback = function(error, data, response) {
        if (error) {
          reject("An error has occured while fetching subscriptions: " + error);
        } else {
          // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
          resolve(JSON.parse(response.text));
        }
      };
      let _deviceId = deviceId ? deviceId : this.defaultDevice.id;
      api.getSubscriptions(_deviceId, callback);
    });
    return p;
  }

  /**
   * Registers a callback for matches
   * @param completion 
   */
  public onMatch(completion: (match: models.Match) => void) {
    this._matchMonitor.onMatch = completion;
  }

  /**
   * Register a callback for location updates
   * @param completion 
   */
  public onLocationUpdate(completion: (location: models.Location) => void) {
    this._locationManager.onLocationUpdate = completion;
  }

  public startMonitoringMatches() {
    this._matchMonitor.startMonitoringMatches();
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
