import {
  Client,
  Subscription,
  Device,
  Publication,
  MobileDevice,
  IBeaconDevice,
  PinDevice,
  Location,
  Match,
  IPublication,
  SwaggerException,
  IMobileDevice
} from "./client";
import Base64 = require("Base64");
import { MatchMonitor, MatchMonitorMode } from "./matchmonitor";
import { LocationManager, GPSConfig } from "./locationmanager";
import { IPersistenceManager, InMemoryPersistenceManager } from "./index";

export interface Token {
  sub: string;
}

type Provider<T> = (deviceId: string) => T;

export class Manager {
  private api: Client;

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
    this.api = new Client(
      basePath,
      options => {
        options.headers["api-key"] = this.apiKey;
        return Promise.resolve(options);
      },
      {
        fetch
      }
    );

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
    deviceToken: string
  ): Promise<MobileDevice> {
    return this.createAnyDevice(
      new MobileDevice({
        name: name,
        platform: platform,
        deviceToken: deviceToken,
        location: new Location({ latitude: 0, longitude: 0, altitude: 0 })
      })
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
    location: Location
  ): Promise<PinDevice> {
    return this.createAnyDevice(
      new PinDevice({
        name: name,
        location: location
      })
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
    location: Location
  ): Promise<IBeaconDevice> {
    return this.createAnyDevice(
      new IBeaconDevice({
        name: name,
        proximityUUID: proximityUUID,
        major: major,
        minor: minor
      })
    );
  }

  /**
   * Create a device
   * @param device whole device object
   * @param completion optional callback
   */
  public async createAnyDevice<T extends Device>(
    device: Device
  ): Promise<T> {
    try {
      const result = await this.api.createDevice(device);
      const ddevice = this._persistenceManager.defaultDevice();
      const isDefault = !ddevice;
      this._persistenceManager.addDevice(result, isDefault);

      return result as T;
    } catch (error) {
      this.handleError(error, `create device '${device.name}'`);
    }
  }

  private handleError(error: any, operation: string){
    if (error instanceof SwaggerException) {
      throw new Error(
        `An error has occurred during '${operation}': ${error} ${error.status}, ${error.response}`
      );
    }

    throw error;
  }

  public async deleteDevice(deviceId: string) {
    try {
      await this.api.deleteDevice(deviceId);

      const d = this._persistenceManager.devices().find(d => d.id == deviceId);
      if (d) this._persistenceManager.remove(d);

      return;
    } catch (error) {
      this.handleError(error, `delete device '${deviceId}'`);
    }
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
  ): Promise<Publication> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      const publication = new Publication({
        worldId: this.token.sub,
        topic: topic,
        deviceId: deviceWithId,
        range: range,
        duration: duration,
        properties: properties
      });

      const result = await this.api.createPublication(
        deviceWithId,
        publication
      );

      this._persistenceManager.add(result);

      return result;
    } catch (error) {
      this.handleError(error, `create publication for topic ${topic}`)
    }
  }

  public async deletePublication(
    deviceId: string,
    pubId: string
  ): Promise<void> {
    try {
      await this.api.deletePublication(deviceId, pubId);

      const d = this._persistenceManager.publications().find(d => d.id == pubId);
      if (d) this._persistenceManager.remove(d);

    } catch (error) {
      this.handleError(error, `delete publication for device ${deviceId}, publication ${pubId}`);
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
    deviceId?: string
  ): Promise<Subscription> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      const subscription = new Subscription({
        worldId: this.token.sub,
        topic: topic,
        deviceId: deviceWithId,
        range: range,
        duration: duration,
        selector: selector || ""
      });

      const result = await this.api.createSubscription(
        deviceWithId,
        subscription
      );

      this._persistenceManager.add(result);

      return result;
    } catch (error) {
      this.handleError(error, `create subscription for topic ${topic}`)
    }
  }

  public async deleteSubscription(
    deviceId: string,
    subId: string,
  ) {
    try {
      const result = await this.api.deleteSubscription(deviceId, subId);

      const d = this._persistenceManager.publications().find(d => d.id == subId);
      if (d) this._persistenceManager.remove(d);
      return result;
    } catch (error) {
      this.handleError(error, `delete subscription for device ${deviceId}, subscription ${subId}`);
    }
  }

  /**
   * Updates the device location
   * @param location
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async updateLocation(
    location: Location,
    deviceId?: string
  ): Promise<void> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      await this.api.createLocation(deviceWithId, location);
    } catch (error) {
      this.handleError(error, `creating location ['${
        location.latitude
      }'`);
    }
  }

  /**
   * Returns all current matches
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async getAllMatches(
    deviceId?: string
  ): Promise<Match[]> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);
      const result = await this.api.getMatches(deviceWithId);

      return result;
    } catch (error) {
      this.handleError(error, `fetch matches`);
    }
  }

  /**
   * Returns a specific match for device
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async getMatch(
    matchId: string,
    deviceId?: string
  ): Promise<Match> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);

      const result = await this.api.getMatch(deviceWithId, matchId);

      return result;
    } catch (error) {
      this.handleError(error, `fetch match ${matchId}`);
    }
  }

  /**
   * Gets publications
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async getAllPublications(
    deviceId?: string
  ): Promise<Publication[]> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);

      const result = await this.api.getPublications(deviceWithId);

      return result;
    } catch (error) {
      this.handleError(error, `fetch publications`);
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

  /**
   * Gets subscriptions
   * @param deviceId optional, if not provided the default device will be used
   * @param completion optional callback
   */
  public async getAllSubscriptions(
    deviceId?: string
  ): Promise<Subscription[]> {
    try {
      const deviceWithId = this.deviceWithId(deviceId);

      const result = await this.api.getSubscriptions(deviceWithId);

      return result;
    } catch (error) {
      this.handleError(error, `fetch subscriptions`);
    }
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
