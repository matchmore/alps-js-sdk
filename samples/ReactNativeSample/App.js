/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Manager } from "matchmore";
import { Platform, StyleSheet, Text, View, FlatList } from "react-native";

type Props = {};
export default class App extends Component<Props> {
  _manager = new Manager(
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiZmUwNjk5ZDgtNTFkYS00ZGQ5LWIwNTUtMjM1ODJlNGVjYzM2IiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1Mjc1MTU0MDIsImlhdCI6MTUyNzUxNTQwMiwianRpIjoiMSJ9.aEXifqwUatHmUKoVsB0SFao5mfQioXAX8r4ehgBzhJ5zoa_WKSOYREEipSDYQFoYTuL-du13KkWvoQaZS6Fgsg",
    undefined,
    undefined,
    {
      enableHighAccuracy: false,
      timeout: 60000,
      maximumAge: 60000
    }
  );

  constructor(props) {
    super(props);
    this.state = { matches: [] };
  }

  async componentDidMount() {
    console.log("Setting up")
    let manager = this._manager;
    manager
      .createMobileDevice("me", "browser", "")
      .then(device => {
        manager.onMatch = match => {
          this.setState(previousState => {
            return { matches: previousState.matches.concat(match) };
          });
        };
        manager.startMonitoringMatches();
        return device;
      })
      .then(device => {
        //lets wait for the current location
        let location = new Promise(resolve => {
          manager.onLocationUpdate = location => {
            console.log("Got location " + location)
            resolve(location);
          }
        });

        manager.startUpdatingLocation();
        console.log("Started Location updates")

        location
          .then(location => {
            let publication = manager
              .createPinDevice("Our test pin", location)
              .then(pin => {
                console.log("Created pin")
                let p1 = manager.createPublication(
                  "my-topic",
                  100 /* m */,
                  20 /* s */,
                  { age: 20, name: "Clara" },
                  pin.id
                );
                let p2 = manager.createPublication(
                  "my-topic",
                  100 /* m */,
                  20 /* s */,
                  { age: 18, name: "Justine" },
                  pin.id
                );
                let p3 = manager.createPublication(
                  "my-topic",
                  100 /* m */,
                  20 /* s */,
                  { age: 17, name: "Alex" },
                  pin.id
                );
                return Promise.all([p1, p2, p3]);
              });
          })
          .then(_ => {
            console.log("Created publications")
            let subscription = manager.createSubscription(
              "my-topic",
              100 /* m */,
              20 /* s */,
              "age >= 18"
            );
            return subscription;
          });
      }).catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>You got matches:</Text>
        <FlatList
          data={this.state.matches}
          renderItem={({ item }) => <Text>{item.publication.name}</Text>}
        />
      </View>
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
