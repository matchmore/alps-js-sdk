export interface Location {
    /**
     * The timestamp of the location creation in seconds since Jan 01 1970 (UTC).
     */
    createdAt?: number;
    /**
     * The latitude of the device in degrees, for instance '46.5333' (Lausanne, Switzerland).
     */
    latitude: number;
    /**
     * The longitude of the device in degrees, for instance '6.6667' (Lausanne, Switzerland).
     */
    longitude: number;
    /**
     * The altitude of the device in meters, for instance '495.0' (Lausanne, Switzerland).
     */
    altitude: number;
    /**
     * The horizontal accuracy of the location, measured on a scale from '0.0' to '1.0', '1.0' being the most accurate. If this value is not specified then the default value of '1.0' is used.
     */
    horizontalAccuracy?: number;
    /**
     * The vertical accuracy of the location, measured on a scale from '0.0' to '1.0', '1.0' being the most accurate. If this value is not specified then the default value of '1.0' is used.
     */
    verticalAccuracy?: number;
}
