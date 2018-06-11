/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import "./src/PlatformConfig";
import { Manager, LocalStoragePersistenceManager } from "@matchmore/matchmore";
import { StyleSheet, View, Dimensions, Text } from "react-native";

const { width, height } = Dimensions.get('window');

const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiZmUwNjk5ZDgtNTFkYS00ZGQ5LWIwNTUtMjM1ODJlNGVjYzM2IiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1Mjc1MTU0MDIsImlhdCI6MTUyNzUxNTQwMiwianRpIjoiMSJ9.aEXifqwUatHmUKoVsB0SFao5mfQioXAX8r4ehgBzhJ5zoa_WKSOYREEipSDYQFoYTuL-du13KkWvoQaZS6Fgsg";

type Props = {};
export default class App extends Component<Props> {
  manager = null;

  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      coords: false,
    };
  }

  async componentDidMount() {
    await this.initManager();
    this.createDevice();
  }

  async initManager() {
    const localPersistenceManager = new LocalStoragePersistenceManager();
    await localPersistenceManager.load();
    this.manager = new Manager(
      apiKey,
      undefined,
      localPersistenceManager,
      // undefined,
      {
        enableHighAccuracy: false,
        timeout: 60000,
        maximumAge: 60000
      }
    )

    this.manager.onLocationUpdate = (location) => {
      console.log("BINHNX: Got location ", location);
      this.createPin(location);
      this.setState({ coords: location.coords });
    }

    this.manager.onMatch = match => {
      console.log("BINHNX: Got new match", match);
      this.setState(previousState => {
        return { matches: [ ...previousState.matches, match ] };
      });
    };
  }

  createDevice() {
    console.log("Device creating");
    this.manager.createMobileDevice("me", "browser", "")
      .then((device) => {
        console.log("Device added", device);
        this.manager.startUpdatingLocation();
        this.manager.startMonitoringMatches();
        this.subscribe();
      });
  }

  subscribe() {
    let subscription = this.manager.createSubscription(
      "my-topic",
      99999 /* m */,
      20 /* s */,
      "age >= 18"
    );
    return subscription;
  }

  createPin(location) {
    this.manager.createPinDevice("Our test pin", location.coords)
      .then((pin) => {
        console.log("Created pin", pin)
        let p1 = this.manager.createPublication(
          "my-topic",
          99999 /* m */,
          20 /* s */,
          { age: 20, name: "Clara" },
          pin.id
        );
        let p2 = this.manager.createPublication(
          "my-topic",
          99999 /* m */,
          20 /* s */,
          { age: 18, name: "Justine" },
          pin.id
        );
        let p3 = this.manager.createPublication(
          "my-topic",
          99999 /* m */,
          20 /* s */,
          { age: 17, name: "Alex" },
          pin.id
        );
        return Promise.all([p1, p2, p3]);
      });
  }

  render() {
    return (
      this.state.matches.map(match => (
        <Text key={match.id}>Matched with {match.publication.properties.name}!</Text>
      ))
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
