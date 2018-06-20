export declare class Client {
    private http;
    private baseUrl;
    private transformOptions;
    protected jsonParseReviver: (key: string, value: any) => any;
    constructor(baseUrl?: string, transformOptions?: (RequestInit) => Promise<RequestInit>, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    });
    /**
     * Create a device
     * @device The device to be created.
     * @return Representation of the newly created device.
     */
    createDevice(device: Device): Promise<Device>;
    protected processCreateDevice(response: Response): Promise<Device>;
    /**
     * Get IBeacons triples for all registered devices
     * @return Expected response to a valid request.
     */
    getIBeaconTriples(): Promise<IBeaconTriple[]>;
    protected processGetIBeaconTriples(response: Response): Promise<IBeaconTriple[]>;
    /**
     * Info about a device
     * @deviceId The id (UUID) of the device.
     * @return Expected response to a valid request.
     */
    getDevice(deviceId: string): Promise<Device>;
    protected processGetDevice(response: Response): Promise<Device>;
    /**
     * Delete an existing device
     * @deviceId The id (UUID) of the device.
     * @return Expected response to a valid request.
     */
    deleteDevice(deviceId: string): Promise<void>;
    protected processDeleteDevice(response: Response): Promise<void>;
    /**
     * Updates name or/and device token for existing device
     * @deviceId The id (UUID) of the device.
     * @device The device update description.
     * @return Expected response to a valid request.
     */
    updateDevice(deviceId: string, device: DeviceUpdate): Promise<Device>;
    protected processUpdateDevice(response: Response): Promise<Device>;
    /**
     * Get matches for the device
     * @deviceId The id (UUID) of the device.
     * @return Expected response to a valid request.
     */
    getMatches(deviceId: string): Promise<Match[]>;
    protected processGetMatches(response: Response): Promise<Match[]>;
    /**
     * Get match for the device by its id
     * @deviceId The id (UUID) of the user device.
     * @matchId The id (UUID) of the match.
     * @return Expected response to a valid request.
     */
    getMatch(deviceId: string, matchId: string): Promise<Match>;
    protected processGetMatch(response: Response): Promise<Match>;
    /**
     * Create a publication for a device
     * @deviceId The id (UUID) of the device.
     * @publication Publication to create on a device.
     * @return The representation of the newly created publication.
     */
    createPublication(deviceId: string, publication: Publication): Promise<Publication>;
    protected processCreatePublication(response: Response): Promise<Publication>;
    /**
     * Get all publications for a device
     * @deviceId The id (UUID) of the device.
     * @return Expected response to a valid request.
     */
    getPublications(deviceId: string): Promise<Publication[]>;
    protected processGetPublications(response: Response): Promise<Publication[]>;
    /**
     * Info about a publication on a device
     * @deviceId The id (UUID) of the device.
     * @publicationId The id (UUID) of the publication.
     * @return Expected response to a valid request.
     */
    getPublication(deviceId: string, publicationId: string): Promise<Publication>;
    protected processGetPublication(response: Response): Promise<Publication>;
    /**
     * Delete a Publication
     * @deviceId The id (UUID) of the device.
     * @publicationId The id (UUID) of the subscription.
     * @return Expected response to a valid request.
     */
    deletePublication(deviceId: string, publicationId: string): Promise<void>;
    protected processDeletePublication(response: Response): Promise<void>;
    /**
     * Create a subscription for a device
     * @deviceId The id (UUID) of the device.
     * @subscription Subscription to create on a device.
     * @return Expected response to a valid request.
     */
    createSubscription(deviceId: string, subscription: Subscription): Promise<Subscription>;
    protected processCreateSubscription(response: Response): Promise<Subscription>;
    /**
     * Get all subscriptions for a device
     * @deviceId The id (UUID) of the device.
     * @return Expected response to a valid request.
     */
    getSubscriptions(deviceId: string): Promise<Subscription[]>;
    protected processGetSubscriptions(response: Response): Promise<Subscription[]>;
    /**
     * Info about a subscription on a device
     * @deviceId The id (UUID) of the device.
     * @subscriptionId The id (UUID) of the subscription.
     * @return Expected response to a valid request.
     */
    getSubscription(deviceId: string, subscriptionId: string): Promise<Subscription>;
    protected processGetSubscription(response: Response): Promise<Subscription>;
    /**
     * Delete a Subscription
     * @deviceId The id (UUID) of the device.
     * @subscriptionId The id (UUID) of the subscription.
     * @return Expected response to a valid request.
     */
    deleteSubscription(deviceId: string, subscriptionId: string): Promise<void>;
    protected processDeleteSubscription(response: Response): Promise<void>;
    /**
     * Create a new location for a device
     * @deviceId The id (UUID) of the device.
     * @location Location to create for a device.
     * @return Expected response to a valid request.
     */
    createLocation(deviceId: string, location: Location): Promise<Location>;
    protected processCreateLocation(response: Response): Promise<Location>;
    /**
     * Trigger the proximity event between a device and a ranged BLE iBeacon
     * @deviceId The id (UUID) of the device.
     * @proximityEvent The proximity event to be created for the device.
     * @return Representation of the newly created proximity event for the device.
     */
    triggerProximityEvents(deviceId: string, proximityEvent: ProximityEvent): Promise<ProximityEvent>;
    protected processTriggerProximityEvents(response: Response): Promise<ProximityEvent>;
}
/** A device might be either virtual like a pin device or physical like a mobile phone or iBeacon device. */
export declare enum DeviceType {
    MobileDevice,
    PinDevice,
    IBeaconDevice,
}
/** A device might be either virtual like a pin device or physical like a mobile phone or iBeacon device. */
export declare class Device implements IDevice {
    /** The id (UUID) of the device. */
    id?: string;
    /** The timestamp of the device's creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The timestamp of the device's creation in seconds since Jan 01 1970 (UTC).
     */
    updatedAt?: number;
    /** Optional device groups, one device can belong to multiple groups, grops are string that can be max 25 characters long and contains letters numbers or underscores */
    group?: string[];
    /** The name of the device. */
    name?: string;
    protected _discriminator: string;
    constructor(data?: IDevice);
    init(data?: any): void;
    static fromJS(data: any): Device;
    toJSON(data?: any): any;
}
/** A device might be either virtual like a pin device or physical like a mobile phone or iBeacon device. */
export interface IDevice {
    /** The id (UUID) of the device. */
    id?: string;
    /** The timestamp of the device's creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The timestamp of the device's creation in seconds since Jan 01 1970 (UTC).
     */
    updatedAt?: number;
    /** Optional device groups, one device can belong to multiple groups, grops are string that can be max 25 characters long and contains letters numbers or underscores */
    group?: string[];
    /** The name of the device. */
    name?: string;
}
/** Describes update of device, it allows to change name of device and device token (only in case of mobile devices) */
export declare class DeviceUpdate implements IDeviceUpdate {
    /** New device name (optional) */
    name?: string;
    /** Token used for pushing matches. The token needs to be prefixed with `apns://` or `fcm://` dependent on the device or channel the match should be pushed with */
    deviceToken?: string;
    constructor(data?: IDeviceUpdate);
    init(data?: any): void;
    static fromJS(data: any): DeviceUpdate;
    toJSON(data?: any): any;
}
/** Describes update of device, it allows to change name of device and device token (only in case of mobile devices) */
export interface IDeviceUpdate {
    /** New device name (optional) */
    name?: string;
    /** Token used for pushing matches. The token needs to be prefixed with `apns://` or `fcm://` dependent on the device or channel the match should be pushed with */
    deviceToken?: string;
}
export declare class IBeaconTriple implements IIBeaconTriple {
    /** The deviceId of the beacon.
     */
    deviceId?: string;
    /** The UUID of the beacon, the purpose is to distinguish iBeacons
  in your network, from all other beacons in
  networks outside your control.
   */
    proximityUUID?: string;
    /** Major values are intended to identify and
  distinguish a group.
   */
    major?: number;
    /** Minor values are intended to identify and
  distinguish an individual.
   */
    minor?: number;
    constructor(data?: IIBeaconTriple);
    init(data?: any): void;
    static fromJS(data: any): IBeaconTriple;
    toJSON(data?: any): any;
}
export interface IIBeaconTriple {
    /** The deviceId of the beacon.
     */
    deviceId?: string;
    /** The UUID of the beacon, the purpose is to distinguish iBeacons
  in your network, from all other beacons in
  networks outside your control.
   */
    proximityUUID?: string;
    /** Major values are intended to identify and
  distinguish a group.
   */
    major?: number;
    /** Minor values are intended to identify and
  distinguish an individual.
   */
    minor?: number;
}
export declare class Location implements ILocation {
    /** The timestamp of the location creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The latitude of the device in degrees, for instance
  '46.5333' (Lausanne, Switzerland).
   */
    latitude: number;
    /** The longitude of the device in degrees, for instance
  '6.6667' (Lausanne, Switzerland).
   */
    longitude: number;
    /** The altitude of the device in meters, for instance '495.0' (Lausanne,
  Switzerland).
   */
    altitude: number;
    /** The horizontal accuracy of the location, measured on a
  scale from '0.0' to '1.0', '1.0' being the most
  accurate. If this value is not specified then the default
  value of '1.0' is used.
   */
    horizontalAccuracy?: number;
    /** The vertical accuracy of the location, measured on a scale from '0.0'
  to '1.0', '1.0' being the most accurate. If this value is not
  specified then the default value of '1.0' is used.
   */
    verticalAccuracy?: number;
    constructor(data?: ILocation);
    init(data?: any): void;
    static fromJS(data: any): Location;
    toJSON(data?: any): any;
}
export interface ILocation {
    /** The timestamp of the location creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The latitude of the device in degrees, for instance
  '46.5333' (Lausanne, Switzerland).
   */
    latitude: number;
    /** The longitude of the device in degrees, for instance
  '6.6667' (Lausanne, Switzerland).
   */
    longitude: number;
    /** The altitude of the device in meters, for instance '495.0' (Lausanne,
  Switzerland).
   */
    altitude: number;
    /** The horizontal accuracy of the location, measured on a
  scale from '0.0' to '1.0', '1.0' being the most
  accurate. If this value is not specified then the default
  value of '1.0' is used.
   */
    horizontalAccuracy?: number;
    /** The vertical accuracy of the location, measured on a scale from '0.0'
  to '1.0', '1.0' being the most accurate. If this value is not
  specified then the default value of '1.0' is used.
   */
    verticalAccuracy?: number;
}
/** A publication can be seen as a JavaMessagingService (JMS) publication extended with the notion of a geographical zone. The zone is defined as circle with a center at the given location and a range around that location. */
export declare class Publication implements IPublication {
    /** The id (UUID) of the publication. */
    id?: string;
    /** The timestamp of the publication creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The id (UUID) of the world that contains device to attach a publication to. */
    worldId: string;
    /** The id (UUID) of the device to attach a publication to. */
    deviceId: string;
    /** The topic of the publication. This will act as a first match filter.
  For a subscription to be able to match a publication they must have
  the exact same topic.
   */
    topic: string;
    /** In some cases a develop might want to show the location.
     */
    location?: Location;
    /** The range of the publication in meters. This is the range around the
  device holding the publication in which matches with subscriptions can
  be triggered.
   */
    range: number;
    /** The duration of the publication in seconds. If set to '0' it will be instant at
  the time of publication. Negative values are not allowed.
   */
    duration: number;
    /** The dictionary of key, value pairs. Allowed values are number, boolean, string and array of afformentioned types */
    properties: {
        [key: string]: Anonymous;
    };
    constructor(data?: IPublication);
    init(data?: any): void;
    static fromJS(data: any): Publication;
    toJSON(data?: any): any;
}
/** A publication can be seen as a JavaMessagingService (JMS) publication extended with the notion of a geographical zone. The zone is defined as circle with a center at the given location and a range around that location. */
export interface IPublication {
    /** The id (UUID) of the publication. */
    id?: string;
    /** The timestamp of the publication creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The id (UUID) of the world that contains device to attach a publication to. */
    worldId: string;
    /** The id (UUID) of the device to attach a publication to. */
    deviceId: string;
    /** The topic of the publication. This will act as a first match filter.
  For a subscription to be able to match a publication they must have
  the exact same topic.
   */
    topic: string;
    /** In some cases a develop might want to show the location.
     */
    location?: Location;
    /** The range of the publication in meters. This is the range around the
  device holding the publication in which matches with subscriptions can
  be triggered.
   */
    range: number;
    /** The duration of the publication in seconds. If set to '0' it will be instant at
  the time of publication. Negative values are not allowed.
   */
    duration: number;
    /** The dictionary of key, value pairs. Allowed values are number, boolean, string and array of afformentioned types */
    properties: {
        [key: string]: any;
    };
}
/** A subscription can be seen as a JMS subscription extended with the notion of geographical zone. The zone again being defined as circle with a center at the given location and a range around that location. */
export declare class Subscription implements ISubscription {
    /** The id (UUID) of the subscription. */
    id?: string;
    /** The timestamp of the subscription creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The id (UUID) of the world that contains device to attach a subscription to. */
    worldId: string;
    /** The id (UUID) of the device to attach a subscription to. */
    deviceId: string;
    /** The topic of the subscription. This will act as a first match filter.
  For a subscription to be able to match a publication they must have
  the exact same topic.
   */
    topic: string;
    /** In some cases a develop might want to show the location.
     */
    location?: Location;
    /** This is an expression to filter the publications. For instance
  'job='developer'' will allow matching only with publications
  containing a 'job' key with a value of 'developer'.
   */
    selector: string;
    /** The range of the subscription in meters. This is the range around the
  device holding the subscription in which matches with publications can
  be triggered.
   */
    range: number;
    /** The duration of the subscription in seconds. If set to '0' it will be instant at
  the time of subscription. Negative values are not allowed.
   */
    duration: number;
    /** The duration of the match in seconds, this describes how often you will get matches when publication and subscription are moving in each other range.
  If set to '0' you will get matches every time publication or subscription in range will move.
  Negative values are not allowed.
   */
    matchTTL?: number;
    /** When match will occurs,
  they will be notified on these provided URI(s) address(es) in the pushers array.
   */
    pushers?: string[];
    constructor(data?: ISubscription);
    init(data?: any): void;
    static fromJS(data: any): Subscription;
    toJSON(data?: any): any;
}
/** A subscription can be seen as a JMS subscription extended with the notion of geographical zone. The zone again being defined as circle with a center at the given location and a range around that location. */
export interface ISubscription {
    /** The id (UUID) of the subscription. */
    id?: string;
    /** The timestamp of the subscription creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The id (UUID) of the world that contains device to attach a subscription to. */
    worldId: string;
    /** The id (UUID) of the device to attach a subscription to. */
    deviceId: string;
    /** The topic of the subscription. This will act as a first match filter.
  For a subscription to be able to match a publication they must have
  the exact same topic.
   */
    topic: string;
    /** In some cases a develop might want to show the location.
     */
    location?: Location;
    /** This is an expression to filter the publications. For instance
  'job='developer'' will allow matching only with publications
  containing a 'job' key with a value of 'developer'.
   */
    selector: string;
    /** The range of the subscription in meters. This is the range around the
  device holding the subscription in which matches with publications can
  be triggered.
   */
    range: number;
    /** The duration of the subscription in seconds. If set to '0' it will be instant at
  the time of subscription. Negative values are not allowed.
   */
    duration: number;
    /** The duration of the match in seconds, this describes how often you will get matches when publication and subscription are moving in each other range.
  If set to '0' you will get matches every time publication or subscription in range will move.
  Negative values are not allowed.
   */
    matchTTL?: number;
    /** When match will occurs,
  they will be notified on these provided URI(s) address(es) in the pushers array.
   */
    pushers?: string[];
}
/** An object representing a match between a subscription and a publication. */
export declare class Match implements IMatch {
    /** The id (UUID) of the match. */
    id?: string;
    /** The timestamp of the match in seconds since Jan 01 1970 (UTC). */
    createdAt?: number;
    publication: Publication;
    subscription: Subscription;
    constructor(data?: IMatch);
    init(data?: any): void;
    static fromJS(data: any): Match;
    toJSON(data?: any): any;
}
/** An object representing a match between a subscription and a publication. */
export interface IMatch {
    /** The id (UUID) of the match. */
    id?: string;
    /** The timestamp of the match in seconds since Jan 01 1970 (UTC). */
    createdAt?: number;
    publication: Publication;
    subscription: Subscription;
}
export declare class APIError implements IAPIError {
    code: number;
    message: string;
    constructor(data?: IAPIError);
    init(data?: any): void;
    static fromJS(data: any): APIError;
    toJSON(data?: any): any;
}
export interface IAPIError {
    code: number;
    message: string;
}
/** A mobile device is one that potentially moves together with its user and therefore has a geographical location associated with it. */
export declare class MobileDevice extends Device implements IMobileDevice {
    /** The platform of the device, this can be any string
  representing the platform type, for instance 'iOS'.
   */
    platform: string;
    /** The deviceToken is the device push notification token
  given to this device by the OS, either iOS or Android for
  identifying the device with push notification
  services.
   */
    deviceToken: string;
    location: Location;
    constructor(data?: IMobileDevice);
    init(data?: any): void;
    static fromJS(data: any): MobileDevice;
    toJSON(data?: any): any;
}
/** A mobile device is one that potentially moves together with its user and therefore has a geographical location associated with it. */
export interface IMobileDevice extends IDevice {
    /** The platform of the device, this can be any string
  representing the platform type, for instance 'iOS'.
   */
    platform: string;
    /** The deviceToken is the device push notification token
  given to this device by the OS, either iOS or Android for
  identifying the device with push notification
  services.
   */
    deviceToken: string;
    location: Location;
}
/** A pin device is one that has geographical location associated with it but is not represented by any object in the physical world. */
export declare class PinDevice extends Device implements IPinDevice {
    location: Location;
    constructor(data?: IPinDevice);
    init(data?: any): void;
    static fromJS(data: any): PinDevice;
    toJSON(data?: any): any;
}
/** A pin device is one that has geographical location associated with it but is not represented by any object in the physical world. */
export interface IPinDevice extends IDevice {
    location: Location;
}
/** An iBeacon device represents an Apple conform iBeacon announcing its presence via Bluetooth advertising packets. */
export declare class IBeaconDevice extends Device implements IIBeaconDevice {
    /** The UUID of the beacon, the purpose is to distinguish iBeacons
  in your network, from all other beacons in
  networks outside your control.
   */
    proximityUUID: string;
    /** Major values are intended to identify and
  distinguish a group.
   */
    major: number;
    /** Minor values are intended to identify and
  distinguish an individual.
   */
    minor: number;
    constructor(data?: IIBeaconDevice);
    init(data?: any): void;
    static fromJS(data: any): IBeaconDevice;
    toJSON(data?: any): any;
}
/** An iBeacon device represents an Apple conform iBeacon announcing its presence via Bluetooth advertising packets. */
export interface IIBeaconDevice extends IDevice {
    /** The UUID of the beacon, the purpose is to distinguish iBeacons
  in your network, from all other beacons in
  networks outside your control.
   */
    proximityUUID: string;
    /** Major values are intended to identify and
  distinguish a group.
   */
    major: number;
    /** Minor values are intended to identify and
  distinguish an individual.
   */
    minor: number;
}
/** A proximity event is triggered to the core when a mobile device detects an iBeacon device in his Bluetooth Low Energy(BLE) range. */
export declare class ProximityEvent implements IProximityEvent {
    /** The id (UUID) of the proximity event. */
    id?: string;
    /** The timestamp of the proximity event in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The id (UUID) of the iBeacon to trigger a proximity event to. */
    deviceId: string;
    /** Distance between the mobile device that trigger the proximity event
  and the ranged iBeacon. This distance is automatically generated by the SDK
  based upon the CLProximity.
   */
    distance: number;
    constructor(data?: IProximityEvent);
    init(data?: any): void;
    static fromJS(data: any): ProximityEvent;
    toJSON(data?: any): any;
}
/** A proximity event is triggered to the core when a mobile device detects an iBeacon device in his Bluetooth Low Energy(BLE) range. */
export interface IProximityEvent {
    /** The id (UUID) of the proximity event. */
    id?: string;
    /** The timestamp of the proximity event in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /** The id (UUID) of the iBeacon to trigger a proximity event to. */
    deviceId: string;
    /** Distance between the mobile device that trigger the proximity event
  and the ranged iBeacon. This distance is automatically generated by the SDK
  based upon the CLProximity.
   */
    distance: number;
}
export declare class Anonymous implements IAnonymous {
    constructor(data?: IAnonymous);
    init(data?: any): void;
    static fromJS(data: any): Anonymous;
    toJSON(data?: any): any;
}
export interface IAnonymous {
}
export declare class SwaggerException extends Error {
    message: string;
    status: number;
    response: string;
    headers: {
        [key: string]: any;
    };
    result: any;
    constructor(message: string, status: number, response: string, headers: {
        [key: string]: any;
    }, result: any);
    protected isSwaggerException: boolean;
    static isSwaggerException(obj: any): obj is SwaggerException;
}
