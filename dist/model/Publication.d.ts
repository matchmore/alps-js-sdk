/**
 * A publication can be seen as a JavaMessagingService (JMS) publication extended with the notion of a geographical zone. The zone is defined as circle with a center at the given location and a range around that location.
 */
export interface Publication {
    /**
     * The id (UUID) of the publication.
     */
    id?: string;
    /**
     * The timestamp of the publication creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /**
     * The id (UUID) of the world that contains device to attach a publication to.
     */
    worldId: string;
    /**
     * The id (UUID) of the device to attach a publication to.
     */
    deviceId: string;
    /**
     * The topic of the publication. This will act as a first match filter. For a subscription to be able to match a publication they must have the exact same topic.
     */
    topic: string;
    /**
     * The range of the publication in meters. This is the range around the device holding the publication in which matches with subscriptions can be triggered.
     */
    range: number;
    /**
     * The duration of the publication in seconds. If set to '0' it will be instant at the time of publication. Negative values are not allowed.
     */
    duration: number;
    /**
     * The dictionary of key, value pairs. Allowed values are number, boolean, string and array of afformentioned types
     */
    properties: any;
}
