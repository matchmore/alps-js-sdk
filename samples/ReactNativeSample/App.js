import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Manager } from "matchmore";

export default class App extends React.Component {
  _manager = new Manager(
    "***REMOVED***"
  );


  async componentDidMount(){
    let manager = this._manager;
    manager
      .createMobileDevice("me", "browser", "")
      .then(device => {
        manager.startMonitoringMatches();
        manager.onMatch = match => {
          this.setState(previousState => {
            return { matches: previousState.matches.concat(match) };
          });
        };
        return device;
      })
      .then(device => {
        //lets wait for the current location
        let location = new Promise(resolve => {
          manager.onLocationUpdate = resolve;
          manager.startUpdatingLocation();
        });

        location
          .then(location => {
            let publication = manager
              .createPinDevice("Our test pin", location)
              .then(pin => {
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
            let subscription = manager.createSubscription(
              "my-topic",
              100 /* m */,
              20 /* s */,
              "age >= 18"
            );
            return subscription;
          });
      });
  }
  constructor(props) {
    super(props);
    this.state = { matches: [] };
  }

  render() {

    return (
      <View style={styles.container}>

        <Text>DUPA</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});