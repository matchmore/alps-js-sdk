import * as models from './models';
export interface PinDevice extends models.Device {
    location: models.Location;
}
