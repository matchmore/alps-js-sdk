import { MatchMonitorMode } from "./matchmonitor";
import { GPSConfig } from "./locationmanager";
import * as models from "./model/models";
import { IPersistenceManager } from "./index";
export interface Token {
    sub: string;
}
export declare class Manager {
    apiKey: string;
    apiUrlOverride?: string;
    private defaultClient;
    private _matchMonitor;
    private _locationManager;
    private _persistenceManager;
    token: Token;
    constructor(apiKey: string, apiUrlOverride?: string, persistenceManager?: IPersistenceManager, gpsConfig?: GPSConfig);
    load(): Promise<Boolean>;
    readonly apiUrl: any;
    readonly defaultDevice: models.Device | undefined;
    readonly devices: models.Device[];
    readonly publications: models.Publication[];
    readonly subscriptions: models.Subscription[];
    /**
     * Creates a mobile device
     * @param name
     * @param platform
     * @param deviceToken platform token for push notifications for example apns://apns-token or fcm://fcm-token
     * @param completion optional callback
     */
    createMobileDevice(name: string, platform: string, deviceToken: string, completion?: (device: models.MobileDevice) => void): Promise<models.MobileDevice>;
    /**
     * Create a pin device
     * @param name
     * @param location
     * @param completion optional callback
     */
    createPinDevice(name: string, location: models.Location, completion?: (device: models.PinDevice) => void): Promise<models.PinDevice>;
    /**
     * Creates an ibeacon device
     * @param name
     * @param proximityUUID
     * @param major
     * @param minor
     * @param location
     * @param completion optional callback
     */
    createIBeaconDevice(name: string, proximityUUID: string, major: number, minor: number, location: models.Location, completion?: (device: models.IBeaconDevice) => void): Promise<models.IBeaconDevice>;
    /**
     * Create a device
     * @param device whole device object
     * @param completion optional callback
     */
    createAnyDevice<T extends models.Device>(device: models.Device, completion?: (device: T) => void): Promise<T>;
    deleteDevice(deviceId: string, completion?: () => void): Promise<void>;
    private setDeviceType;
    private isMobileDevice;
    private isPinDevice;
    private isBeaconDevice;
    /**
     * Create a publication for a device
     * @param topic topic of the publication
     * @param range range in meters
     * @param duration time in seconds
     * @param properties properties on which the sub selector can filter on
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    createPublication(topic: string, range: number, duration: number, properties: Object, deviceId?: string, completion?: (publication: models.Publication) => void): Promise<models.Publication>;
    deletePublication(deviceId: string, pubId: string, completion?: () => void): Promise<any>;
    /**
     * Create a subscription for a device
     * @param topic topic of the subscription
     * @param range range in meters
     * @param duration time in seconds
     * @param selector selector which is used for filtering publications
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    createSubscription(topic: string, range: number, duration: number, selector?: string, deviceId?: string, completion?: (subscription: models.Subscription) => void): Promise<models.Subscription>;
    deleteSubscription(deviceId: string, subId: string, completion?: () => void): Promise<any>;
    /**
     * Updates the device location
     * @param location
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    updateLocation(location: models.Location, deviceId?: string): Promise<void>;
    /**
     * Returns all current matches
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllMatches(deviceId?: string, completion?: (matches: models.Match[]) => void): Promise<models.Match[]>;
    /**
     * Returns a specific match for device
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getMatch(matchId: any, string: any, deviceId?: string, completion?: (matches: models.Match) => void): Promise<models.Match>;
    /**
     * Gets publications
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllPublications(deviceId?: string, completion?: (publications: models.Publication[]) => void): Promise<any>;
    private deviceWithId;
    private withDevice;
    /**
     * Gets subscriptions
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllSubscriptions(deviceId?: string, completion?: (subscriptions: models.Subscription[]) => void): Promise<any>;
    /**
     * Registers a callback for matches
     * @param completion
     */
    onMatch: (match: models.Match) => void;
    /**
     * Register a callback for location updates
     * @param completion
     */
    onLocationUpdate: (location: models.Location) => void;
    startMonitoringMatches(mode: MatchMonitorMode): void;
    stopMonitoringMatches(): void;
    startUpdatingLocation(): void;
    stopUpdatingLocation(): void;
}
