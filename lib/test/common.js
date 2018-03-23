"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.samplePublication = {
    topic: "sampletopic",
    range: 300,
    duration: 5,
    properties: { data1: "value1", data2: 1, data3: false }
};
exports.sampleSubscription = {
    topic: "sampletopic",
    selector: "data1='value1'",
    range: 300,
    duration: 5
};
exports.sampleLocation = {
    latitude: 54.350115,
    longitude: 18.558819,
    altitude: 0,
    horizontalAccuracy: 1.0,
    verticalAccuracy: 1.0
};
exports.sampleDevice = {
    name: "test",
    platform: "iOS",
    deviceToken: "f4eea68c-a349-4dbe-a395-c935abc7f6f2",
    location: exports.sampleLocation
};
//# sourceMappingURL=common.js.map