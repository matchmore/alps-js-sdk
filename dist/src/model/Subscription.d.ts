/**
 * A subscription can be seen as a JMS subscription extended with the notion of geographical zone. The zone again being defined as circle with a center at the given location and a range around that location.
 */
export interface Subscription {
    /**
     * The id (UUID) of the subscription.
     */
    id?: string;
    /**
     * The timestamp of the subscription creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /**
     * The id (UUID) of the world that contains device to attach a subscription to.
     */
    worldId: string;
    /**
     * The id (UUID) of the device to attach a subscription to.
     */
    deviceId: string;
    /**
     * The topic of the subscription. This will act as a first match filter. For a subscription to be able to match a publication they must have the exact same topic.
     */
    topic: string;
    /**
     * This is an expression to filter the publications. For instance 'job='developer'' will allow matching only with publications containing a 'job' key with a value of 'developer'.
     */
    selector: string;
    /**
     * The range of the subscription in meters. This is the range around the device holding the subscription in which matches with publications can be triggered.
     */
    range: number;
    /**
     * The duration of the subscription in seconds. If set to '0' it will be instant at the time of subscription. Negative values are not allowed.
     */
    duration: number;
    /**
     * When match will occurs, they will be notified on these provided URI(s) address(es) in the pushers array.
     */
    pushers?: Array<string>;
}
