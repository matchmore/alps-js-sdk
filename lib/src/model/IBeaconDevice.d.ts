import * as models from './models';
export interface IBeaconDevice extends models.Device {
    proximityUUID: string;
    major: number;
    minor: number;
}
