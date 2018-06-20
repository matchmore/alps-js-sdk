import { Subscription, Device, Publication, MobileDevice, IBeaconDevice, PinDevice, Location, Match } from "./client";
import { MatchMonitorMode } from "./matchmonitor";
import { GPSConfig } from "./locationmanager";
import { IPersistenceManager } from "./index";
export interface Token {
    sub: string;
}
export declare class Manager {
    apiKey: string;
    apiUrlOverride: string;
    private api;
    private _matchMonitor;
    private _locationManager;
    private _persistenceManager;
    token: Token;
    constructor(apiKey: string, apiUrlOverride?: string, persistenceManager?: IPersistenceManager, gpsConfig?: GPSConfig);
    load(): Promise<Boolean>;
    readonly apiUrl: string;
    readonly defaultDevice: Device | undefined;
    readonly devices: Device[];
    readonly publications: Publication[];
    readonly subscriptions: Subscription[];
    /**
     * Creates a mobile device
     * @param name
     * @param platform
     * @param deviceToken platform token for push notifications for example apns://apns-token or fcm://fcm-token
     * @param completion optional callback
     */
    createMobileDevice(name: string, platform: string, deviceToken: string): Promise<MobileDevice>;
    /**
     * Create a pin device
     * @param name
     * @param location
     * @param completion optional callback
     */
    createPinDevice(name: string, location: Location): Promise<PinDevice>;
    /**
     * Creates an ibeacon device
     * @param name
     * @param proximityUUID
     * @param major
     * @param minor
     * @param location
     * @param completion optional callback
     */
    createIBeaconDevice(name: string, proximityUUID: string, major: number, minor: number, location: Location): Promise<IBeaconDevice>;
    /**
     * Create a device
     * @param device whole device object
     * @param completion optional callback
     */
    createAnyDevice<T extends Device>(device: Device): Promise<T>;
    private handleError(error, operation);
    deleteDevice(deviceId: string): Promise<void>;
    /**
     * Create a publication for a device
     * @param topic topic of the publication
     * @param range range in meters
     * @param duration time in seconds
     * @param properties properties on which the sub selector can filter on
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    createPublication(topic: string, range: number, duration: number, properties: Object, deviceId?: string): Promise<Publication>;
    deletePublication(deviceId: string, pubId: string): Promise<void>;
    /**
     * Create a subscription for a device
     * @param topic topic of the subscription
     * @param range range in meters
     * @param duration time in seconds
     * @param selector selector which is used for filtering publications
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    createSubscription(topic: string, range: number, duration: number, selector?: string, deviceId?: string): Promise<Subscription>;
    deleteSubscription(deviceId: string, subId: string): Promise<void>;
    /**
     * Updates the device location
     * @param location
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    updateLocation(location: Location, deviceId?: string): Promise<void>;
    /**
     * Returns all current matches
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllMatches(deviceId?: string): Promise<Match[]>;
    /**
     * Returns a specific match for device
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getMatch(matchId: string, deviceId?: string): Promise<Match>;
    /**
     * Gets publications
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllPublications(deviceId?: string): Promise<Publication[]>;
    private deviceWithId(deviceId?);
    /**
     * Gets subscriptions
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllSubscriptions(deviceId?: string): Promise<Subscription[]>;
    /**
     * Registers a callback for matches
     * @param completion
     */
    onMatch: (match: Match) => void;
    /**
     * Register a callback for location updates
     * @param completion
     */
    onLocationUpdate: (location: Location) => void;
    startMonitoringMatches(mode?: MatchMonitorMode): void;
    stopMonitoringMatches(): void;
    startUpdatingLocation(): void;
    stopUpdatingLocation(): void;
}
