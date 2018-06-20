/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from "react";
import "./src/PlatformConfig";
import {Manager, LocalStoragePersistenceManager} from "@matchmore/matchmore";
import {StyleSheet, View, Dimensions} from "react-native";
import MapView, {Marker} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

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
      this.createPin(location);
      this.setState({coords: location.coords});
    }

    this.manager.onMatch = match => {
      this.setState(previousState => {
        return {matches: [...previousState.matches, match]};
      });
    };
  }

  async createDevice() {
    const device = await this.manager.createMobileDevice("me", "browser", "");
    this.manager.startUpdatingLocation();
    this.manager.startMonitoringMatches();
    this.subscribe();
  }

  async subscribe() {
    return await this.manager.createSubscription(
      "my-topic",
      99999 /* m */,
      20 /* s */,
      "age >= 18"
    );
  }

  async createPin(location) {
    const pin = await this.manager.createPinDevice("Our test pin", location.coords)
    await this.manager.createPublication(
      "my-topic",
      99999 /* m */,
      20 /* s */,
      {age: 20, name: "Clara"},
      pin.id
    );
    await this.manager.createPublication(
      "my-topic",
      99999 /* m */,
      20 /* s */,
      {age: 18, name: "Justine"},
      pin.id
    );
    await this.manager.createPublication(
      "my-topic",
      99999 /* m */,
      20 /* s */,
      {age: 17, name: "Alex"},
      pin.id
    );
  }

  mapRegion() {
    if (this.state.coords) {
      return {
        ...this.state.coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    }
    return undefined;
  }

  render() {
    return (
      <MapView ref={(ref) => this.map = ref} style={{height, width}} region={this.mapRegion()}>
        {this.state.coords && (
          <Marker coordinate={this.state.coords}/>
        )}
        {this.state.matches.map(match => (
          <Marker key={match.id} coordinate={match.publication.location} pinColor="blue"/>
        ))}
      </MapView>
    );
  }
}