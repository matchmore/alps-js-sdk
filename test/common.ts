import * as models from "../src/model/models";

// STUB OBJECTS

export let samplePublication = {
  topic: "sampletopic",
  range: 300,
  duration: 5,
  properties: { data1: "value1", data2: 1, data3: false }
};

export let sampleSubscription = {
  topic: "sampletopic",
  selector: "data1='value1'",
  range: 300,
  duration: 5
};

export let sampleLocation: models.Location = {
  latitude: 54.350115,
  longitude: 18.558819,
  altitude: 0,
  horizontalAccuracy: 1.0,
  verticalAccuracy: 1.0
};

export let sampleDevice = {
  name: "test",
  platform: "iOS",
  deviceToken: "f4eea68c-a349-4dbe-a395-c935abc7f6f2",
  location: sampleLocation
};
