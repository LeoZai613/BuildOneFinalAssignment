import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const UserProfileScreen = () => {
  const navigation = useNavigation();

  const navigateToChat = () => {
    navigation.navigate('ChatScreen');
  };

  return (
    <View style={styles.container}>
      <Text>User Profile</Text>
      <TouchableOpacity onPress={navigateToChat} style={styles.chatButton}>
        <Text style={styles.buttonText}>Go to Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default UserProfileScreen;
