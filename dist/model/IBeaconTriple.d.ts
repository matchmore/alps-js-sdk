export interface IBeaconTriple {
    /**
     * The deviceId of the beacon.
     */
    deviceId?: string;
    /**
     * The UUID of the beacon, the purpose is to distinguish iBeacons in your network, from all other beacons in networks outside your control.
     */
    proximityUUID?: string;
    /**
     * Major values are intended to identify and distinguish a group.
     */
    major?: number;
    /**
     * Minor values are intended to identify and distinguish an individual.
     */
    minor?: number;
}
