import * as models from "../src/model/models";
export declare let samplePublication: {
    topic: string;
    range: number;
    duration: number;
    properties: {
        data1: string;
        data2: number;
        data3: boolean;
    };
};
export declare let sampleSubscription: {
    topic: string;
    selector: string;
    range: number;
    duration: number;
};
export declare let sampleLocation: models.Location;
export declare let sampleDevice: {
    name: string;
    platform: string;
    deviceToken: string;
    location: models.Location;
};
