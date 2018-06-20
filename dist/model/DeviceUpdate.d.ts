/**
 * Describes update of device, it allows to change name of device and device token (only in case of mobile devices)
 */
export interface DeviceUpdate {
    /**
     * New device name (optional)
     */
    name?: string;
    /**
     * Token used for pushing matches. The token needs to be prefixed with `apns://` or `fcm://` dependent on the device or channel the match should be pushed with
     */
    deviceToken?: string;
}
