import ScalpsCoreRestApi = require("matchmore_alps_core_rest_api");
import { MatchMonitor } from "./matchmonitor";
import { LocationManager } from "./locationmanager";
import * as models from "./model/models";

export class Manager {
  defaultClient: ScalpsCoreRestApi.ApiClient;

  // Store all the objects created by the manager:
  public devices: models.Device[] = [];
  public publications: models.Publication[] = [];
  public subscriptions: models.Subscription[] = [];
  public locations: models.Location[] = [];
  public defaultDevice: models.Device;

  private matchMonitor: MatchMonitor;
  private locationManager: LocationManager;

  constructor(public apiKey: string, apiUrlOverride?: string) {
    this.init(apiUrlOverride);
  }

  init(apiUrlOverride?: string) {
    this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
    this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
    // Hack the api location (to use an overidden value if needed)
    if (apiUrlOverride) this.defaultClient.basePath = apiUrlOverride;
    this.matchMonitor = new MatchMonitor(this);
    this.locationManager = new LocationManager(this);
  }

  public createMobileDevice(
    name: string,
    platform: string,
    deviceToken: string,
    location: models.Location,
    completion?: (device: models.MobileDevice) => void
  ): Promise<models.MobileDevice> {
    return this.createAnyDevice(
      <models.MobileDevice>{
        deviceType: models.DeviceType.MobileDevice,
        name: name,
        platform: platform,
        deviceToken: deviceToken,
        location: location
      },
      completion
    );
  }

  public createPinDevice(
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

  public createIBeaconDevice(
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
    return p.then((device :T) => {
      this.devices.push(device);
      this.defaultDevice = this.devices[0];
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

  public createPublication(
    topic: String,
    range: number,
    duration: number,
    properties: Object,
    completion?: (publication: ScalpsCoreRestApi.Publication) => void
  ): Promise<ScalpsCoreRestApi.Publication> {
    if (this.defaultDevice) {
      return this.createAnyPublication(
        this.defaultDevice.id,
        topic,
        range,
        duration,
        properties,
        completion
      );
    } else {
      throw new Error(
        "There is no default device available, please call createDevice before createPublication"
      );
    }
  }

  public createAnyPublication(
    deviceId: String,
    topic: String,
    range: number,
    duration: number,
    properties: Object,
    completion?: (publication: models.Publication) => void
  ): Promise<models.Publication> {
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
      api.createPublication(
        deviceId,
        topic,
        range,
        duration,
        properties,
        callback
      );
    });
    return p.then((publication: models.Publication) => {
      this.publications.push(publication);
      if (completion) completion(publication);
      return publication;
    });
  }

  public createSubscription(
    topic: string,
    selector: String,
    range: number,
    duration: number,
    completion?: (subscription: models.Subscription) => void
  ): Promise<models.Subscription> {
    if (this.defaultDevice) {
      return this.createAnySubscription(
        this.defaultDevice.id,
        topic,
        selector,
        range,
        duration,
        completion
      );
    } else {
      throw new Error(
        "There is no default device available, please call createDevice before createSubscription"
      );
    }
  }

  public createAnySubscription(
    deviceId: String,
    topic: String,
    selector: String,
    range: number,
    duration: number,
    completion?: (subscription: models.Subscription) => void
  ): Promise<models.Subscription> {
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
      api.createSubscription(
        deviceId,
        topic,
        selector,
        range,
        duration,
        callback
      );
    });
    return p.then((subscription: models.Subscription) => {
      this.subscriptions.push(subscription);
      if (completion) completion(subscription);
      return subscription;
    });
  }

  public updateLocation(
    latitude: number,
    longitude: number,
    altitude: number,
    horizontalAccuracy: number,
    verticalAccuracy: number,
    completion?: (location: models.Location) => void
  ): Promise<models.Location> {
    if (this.defaultDevice) {
      return this.updateAnyLocation(
        this.defaultDevice.id,
        latitude,
        longitude,
        altitude,
        horizontalAccuracy,
        verticalAccuracy,
        completion
      );
    } else {
      throw new Error(
        "There is no default device available, please call createDevice before updateLocation"
      );
    }
  }

  public updateAnyLocation(
    deviceId: String,
    latitude: number,
    longitude: number,
    altitude: number,
    horizontalAccuracy: number,
    verticalAccuracy: number,
    completion?: (location: models.Location) => void
  ): Promise<models.Location> {
    let p = new Promise((resolve, reject) => {
      let api = new ScalpsCoreRestApi.LocationApi();
      let callback = function(error, data, response) {
        if (error) {
          reject(
            "An error has occured while creating location ['" +
              latitude +
              "','" +
              longitude +
              "']  :" +
              error
          );
        } else {
          // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
          resolve(JSON.parse(response.text));
        }
      };
      var opts = {
        horizontalAccuracy: horizontalAccuracy,
        verticalAccuracy: verticalAccuracy
      };
      api.createLocation(
        deviceId,
        latitude,
        longitude,
        altitude,
        opts,
        callback
      );
    });
    return p.then((location: models.Location) => {
      this.locations.push(location);
      if (completion) completion(location);
      return location;
    });
  }

  public getAllMatches(
    completion?: (matches: ScalpsCoreRestApi.Match[]) => void
  ) {
    if (this.defaultDevice) {
      return this.getAllMatchesForAny(this.defaultDevice.id);
    } else {
      throw new Error(
        "There is no default device available, please call createDevice before getAllMatches"
      );
    }
  }

  public getAllMatchesForAny(
    deviceId: String,
    completion?: (matches: models.Match[]) => void
  ) {
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
      api.getMatches(deviceId, callback);
    });
    p.then((matches: models.Match[]) => {
      if (completion) completion(matches);
    });
    return p;
  }

  public getAllPublicationsForDevice(
    deviceId: String,
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
      api.getPublications(deviceId, callback);
    });
    return p;
  }

  public getAllSubscriptionsForDevice(
    deviceId: String,
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
      api.getSubscriptions(deviceId, callback);
    });
    return p;
  }

  public onMatch(completion: (match: models.Match) => void) {
    this.matchMonitor.onMatch = completion;
  }

  public onLocationUpdate(
    completion: (location: models.Location) => void
  ) {
    this.locationManager.onLocationUpdate = completion;
  }

  public startMonitoringMatches() {
    this.matchMonitor.startMonitoringMatches();
  }

  public stopMonitoringMatches() {
    this.matchMonitor.stopMonitoringMatches();
  }

  public startUpdatingLocation() {
    this.locationManager.startUpdatingLocation();
  }

  public stopUpdatingLocation() {
    this.locationManager.stopUpdatingLocation();
  }
}
