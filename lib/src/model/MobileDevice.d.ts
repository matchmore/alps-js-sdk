import * as models from './models';
export interface MobileDevice extends models.Device {
    platform: string;
    deviceToken: string;
    location: models.Location;
}
