// CustomerScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CustomerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Customer Screen!</Text>
      {/* Add more components and functionality specific to the customer screen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomerScreen;
