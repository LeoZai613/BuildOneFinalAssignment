import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import {LoginButton} from 'react-native-fbsdk-next';

const backgroundImage =
  'https://wallpapers.com/images/hd/illuminated-poke-ball-pokemon-iphone-aidw21v1d13ujypw.jpg';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Clear any existing authentication state
    auth().signOut();
  }, []);

  const loginUser = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Navigate to the dashboard or profile screen after successful login
      navigation.navigate('UserProfile');
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={{uri: backgroundImage}}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Enter Email"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Enter Password"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* Facebook Login Button */}
        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('Login failed:', error);
            } else if (result.isCancelled) {
              console.log('Login was cancelled');
            } else {
              console.log('Login was successful:', result);
              navigation.navigate('UserProfile');
            }
          }}
          onLogoutFinished={() => console.log('User logged out')}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    color: 'white', // text color
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default LoginScreen;
