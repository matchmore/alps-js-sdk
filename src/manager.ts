import * as ScalpsCoreRestApi from "./api";
import Base64 = require("Base64");
import {MatchMonitor, MatchMonitorMode} from "./matchmonitor";
import {LocationManager, GPSConfig} from "./locationmanager";
import * as models from "./model/models";
import {
  IPersistenceManager,
  InMemoryPersistenceManager,
} from "./index";

export interface Token {
  sub: string;
}

type Provider<T> = (deviceId: string) => T;

export class Manager {
  private defaultClient: ScalpsCoreRestApi.ApiClient;
  
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
    this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
    
    this.token = JSON.parse(Base64.atob(this.apiKey.split(".")[1])); // as Token;
    
    this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
    // Hack the api location (to use an overidden value if needed)
    if (this.apiUrlOverride) this.defaultClient.basePath = this.apiUrlOverride;
    else this.apiUrlOverride = this.defaultClient.basePath;
    this._matchMonitor = new MatchMonitor(this);
    this._locationManager = new LocationManager(this, gpsConfig);
  }
  
  async load(): Promise<Boolean> {
    return await this._persistenceManager.load();
  }
  
  get apiUrl() {
    return this.defaultClient.basePath;
  }
  
  get defaultDevice(): models.Device | undefined {
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
  public async createAnyDevice<T extends models.Device>(
    device: models.Device,
    completion?: (device: T) => void
  ): Promise<T> {
    try {
      const _device = this.setDeviceType(device);
      let api = new ScalpsCoreRestApi.DeviceApi();
      
      const { response } = await api.createDevice(_device);
      const result = JSON.parse(response.text);
      
      let ddevice = this._persistenceManager.defaultDevice();
      let isDefault = !ddevice;
      this._persistenceManager.addDevice(result, isDefault);
      
      if (completion) completion(result);
      return result;
    }
    catch (error) {
      throw new Error(`An error has occured while creating device '${device.name}': ${error}`);
    }
  }

  public async deleteDevice(deviceId: string, completion?: () => void) {
    try {
      let api = new ScalpsCoreRestApi.DeviceApi();
      await api.deleteDevice(deviceId);
      
      let d = this._persistenceManager.devices().find(d=> d.id == deviceId);
      if(d) this._persistenceManager.remove(d);
  
      if (completion) completion();
      return;
    }
    catch (error) {
      throw new Error(`An error has occured while deleting device '${deviceId}': ${error}`);
    }
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
  
  private isBeaconDevice(device: models.Device): device is models.IBeaconDevice {
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
  public async createPublication(
    topic: string,
    range: number,
    duration: number,
    properties: Object,
    deviceId?: string,
    completion?: (publication: models.Publication) => void
  ): Promise<models.Publication> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      let publication: models.Publication = {
        worldId: this.token.sub,
        topic: topic,
        deviceId: deviceWithId,
        range: range,
        duration: duration,
        properties: properties
      };
      
      let api = new ScalpsCoreRestApi.DeviceApi();
    
      const { response } = await api.createPublication(deviceWithId, publication);
      const result = JSON.parse(response.text);
  
      this._persistenceManager.add(result);
      if (completion) completion(result);
      
      return result;
    }
    catch (error) {
      throw new Error(`An error has occured while creating publication '${topic}': ${error}`);
    }
  }

  public async deletePublication(deviceId: string, pubId: string, completion?: () => void){
    try {
      let api = new ScalpsCoreRestApi.DeviceApi();
    
      const { response } = await api.deletePublication(deviceId, pubId);
      const result = JSON.parse(response.text);
      
      let d = this._persistenceManager.publications().find(d=> d.id == pubId);
      if (d) this._persistenceManager.remove(d);
      
      if (completion) completion();
      return result;
    }
    catch (error) {
      throw new Error(`An error has occured while deleting publication '${pubId}' : ${error}`);
    }
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
  public async createSubscription(
    topic: string,
    range: number,
    duration: number,
    selector?: string,
    deviceId?: string,
    completion?: (subscription: models.Subscription) => void
  ): Promise<models.Subscription> {
  
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      let subscription: models.Subscription = {
        worldId: this.token.sub,
        topic: topic,
        deviceId: deviceWithId,
        range: range,
        duration: duration,
        selector: selector || ""
      };
      
      let api = new ScalpsCoreRestApi.DeviceApi();
    
      const { response } = await api.createSubscription(deviceWithId, subscription);
      const result = JSON.parse(response.text);
  
      this._persistenceManager.add(result);
      if (completion) completion(result);
      
      return result;
    }
    catch (error) {
      throw new Error(`An error has occurred while creating subscription '${topic}': ${error}`);
    }
  }

  public async deleteSubscription(deviceId: string, subId: string, completion?: () => void) {
    try {
      let api = new ScalpsCoreRestApi.DeviceApi();
    
      const { response } = await api.deleteSubscription(deviceId, subId);
      const result = JSON.parse(response.text);
  
      let d = this._persistenceManager.publications().find(d=> d.id == subId);
      if(d) this._persistenceManager.remove(d);
      if (completion) completion();
      return result;
    }
    catch (error) {
      throw new Error(
        `An error has occurred while deleting Subscription '${subId}': ${error}`
      );
    }
  }
  
  /**
   * Updates the device location
   * @param location
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async updateLocation(
    location: models.Location,
    deviceId?: string,
  ): Promise<void> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      let api = new ScalpsCoreRestApi.DeviceApi();
    
      const { response } = await api.createLocation(deviceWithId, location);
      const result = JSON.parse(response.text);
      return result;
    }
    catch (error) {
      throw new Error(`An error has occurred while creating location ['${location.latitude}', '${location.longitude}'] ${error}`);
    }
  }
  
  /**
   * Returns all current matches
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async getAllMatches(
    deviceId?: string,
    completion?: (matches: models.Match[]) => void
  ): Promise<models.Match[]> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      let api = new ScalpsCoreRestApi.DeviceApi();
    
      const { response } = await api.getMatches(deviceWithId);
      const result = JSON.parse(response.text);
      
      if (completion) completion(result);
      return result;
    }
    catch (error) {
      throw new Error(`An error has occurred while fetching matches: ${error}`);
    }
  }
  
  /**
   * Returns a specific match for device
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async getMatch(
    matchId,
    string,
    deviceId?: string,
    completion?: (matches: models.Match) => void
  ): Promise<models.Match> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      let api = new ScalpsCoreRestApi.DeviceApi();
    
      const { response } = await api.getMatch(deviceWithId, matchId);
      const result = JSON.parse(response.text);
    
      if (completion) completion(result);
      return result;
    }
    catch (error) {
      throw new Error(`An error has occurred while fetching matches: ${error}`);
    }
  }
  
  /**
   * Gets publications
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async getAllPublications(
    deviceId?: string,
    completion?: (publications: models.Publication[]) => void
  ): Promise<models.Publication[]> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      let api = new ScalpsCoreRestApi.DeviceApi();
      
      const { response } = await api.getPublications(deviceWithId);
      const result = JSON.parse(response.text);
      
      if (completion) completion(result);
      return result;
    }
    catch (error) {
      throw new Error("An error has occurred while fetching publications: " + error);
    }
  }
  
  private deviceWithId(deviceId?: string): string {
    if (!!deviceId) {
      return deviceId;
    }
    if (!!this.defaultDevice && !!this.defaultDevice.id) {
      return this.defaultDevice.id;
    }
  
    throw new Error(
      "There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id"
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
  public async getAllSubscriptions(
    deviceId?: string,
    completion?: (subscriptions: models.Subscription[]) => void
  ): Promise<models.Subscription[]> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      let api = new ScalpsCoreRestApi.DeviceApi();
    
      const { response } = await api.getSubscriptions(deviceWithId);
      const result = JSON.parse(response.text);
    
      if (completion) completion(result);
      return result;
    }
    catch (error) {
      throw new Error("An error has occurred while fetching subscriptions: " + error);
    }
  }
  
  /**
   * Registers a callback for matches
   * @param completion
   */
  set onMatch(completion: (match: models.Match) => void) {
    this._matchMonitor.onMatch = completion;
  }
  
  /**
   * Register a callback for location updates
   * @param completion
   */
  set onLocationUpdate(completion: (location: models.Location) => void) {
    this._locationManager.onLocationUpdate = completion;
  }
  
  public startMonitoringMatches(mode?: MatchMonitorMode) {
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