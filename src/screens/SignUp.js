import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Minimum 6 characters, at least one letter and one number

  const handleInputChange = () => {
    if (
      emailRegex.test(email) &&
      passwordRegex.test(password) &&
      password === confirmPassword
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{flex:1,width:"100%"}} showsVerticalScrollIndicator={false} 
  showsHorizontalScrollIndicator={false}>
      <Image
        source={{uri: 'https://your-logo-url.com/logo.png'}}
        style={styles.logo}
      />
      <AppInput
        label="Username"
        showLabel={true}
        activeBorder={false}
        showBorder={false}
        value="String"
        style={styles.input}
      />

      <AppInput
        label="Id"
        showLabel={true}
        activeBorder={false}
        showBorder={false}
        value="String"
        style={styles.input}
      />
      <AppInput
        label="Phone"
        showLabel={true}
        activeBorder={false}
        showBorder={false}
        value="String"
        style={styles.input}
      />
      <AppInput
        label="Email"
        showLabel={true}
        activeBorder={false}
        showBorder={false}
        value="String"
        style={styles.input}
      />
      <AppInput
        label="Company"
        showLabel={true}
        activeBorder={false}
        showBorder={false}
        value="String"
        style={styles.input}
      />
      <AppInput
        label="Password"
        showLabel={true}
        activeBorder={false}
        showBorder={false}
        value="String"
        style={styles.input}
      />
      <AppButton
        text="SIGNUP"
        // onPress={handleSignUp}
        buttonStyle={{
          marginTop: 20,
          alignSelf: 'center',
          backgroundColor: 'lightgray',
          width: 250,
        }}
        textStyle={{color: 'black', fontSize: 13}}
      />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SignUp;
