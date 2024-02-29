import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth

const backgroundImage =
  'https://wallpapers.com/images/hd/illuminated-poke-ball-pokemon-iphone-aidw21v1d13ujypw.jpg';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Password Reset Email Sent',
        'An email with instructions to reset your password has been sent to your email address.',
        [{text: 'OK', onPress: () => navigation.navigate('Login')}],
      );
    } catch (error) {
      console.error('Password reset email failed:', error.message);
      Alert.alert('Password Reset Failed', error.message);
    }
  };

  return (
    <ImageBackground
      source={{uri: backgroundImage}}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Enter Email"
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  resetButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
