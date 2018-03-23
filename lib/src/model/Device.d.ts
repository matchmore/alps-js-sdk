import * as models from './models';
export interface Device {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    group?: Array<string>;
    name?: string;
    deviceType?: models.DeviceType;
}
