import React from 'react';
import { View, Switch, Text } from 'react-native';

const FollowMeView = ({ on,  onChange }) => (
  <View style={styles.container}>
    <Text>Follow me</Text>
    <Switch value={true}/>
  </View>
)

const styles = {
  container: {
    height: 64,
    alignSelf: 'stretch',
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  }
}

export default FollowMeView;