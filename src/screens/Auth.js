import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef} from 'react';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { obj } from '../utils/Obj';

const Auth = ({navigation}) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState({
    value: '',
    errorActive: false,
    errorMessage: '',
  });
  const [id, setId] = useState({
    value: '',
    errorActive: false,
    errorMessage: '',
  });
  const [company, setCompany] = useState({
    value: '',
    errorActive: false,
    errorMessage: '',
  });
  const [password, setPassword] = useState({
    value: '',
    errorActive: false,
    errorMessage: '',
  });
  const [signInUsername, setSignInUsername] = useState({
    value: '',
    errorActive: false,
    errorMessage: '',
  });
  const [signInPassword, setSignInPassword] = useState({
    value: '',
    errorActive: false,
    errorMessage: '',
  });
  const [loading, setLoading] = useState(false); // Loading state

  const animation = useRef(new Animated.Value(0)).current;
  
  function validateSignInUsername() {
    if (!obj.regex.username.test(signInUsername.value)) {
      setSignInUsername({...signInUsername, errorActive: true});
      console.log("Username/Id not valid");
    } else {
      setSignInUsername({...signInUsername, errorActive: false});
      console.log("valid email");
    }
  }
  function validateSignInPassword() {
    if (!obj.regex.password.test(signInPassword.value)) {
      setSignInPassword({...signInPassword, errorActive: true});
      console.log("password not valid");
    } else {
      setSignInPassword({...signInPassword, errorActive: false});
      console.log("valid password");
    }   
  }
  const handleSignIn = async()=>{
     if (!signInUsername.value || !signInPassword.value) {
      Alert.alert('Error', 'Please fill in all fields');
      setLoading(true)
      try {
        // Check if the username or id already exists (for signup validation)
        const response = await fetch(
          `https://sheetdb.io/api/v1/mm8jpgiaq7bqt/search?sheet=UserData&Id=${signInUsername.value}&Password=${signInPassword.value}`,
        );
        const data = await response.json();
        console.log(JSON.stringify(data));
  
        if (data.length > 0) {
          Alert.alert('Error', 'Incorrect Username/Id/Password');
          setSignInUsername({...signInUsername,errorActive:true})
          setLoading(false); // Stop loading
          return;
        } else {
          setSignInUsername({...signInUsername, value: ''});
        }
    }catch(e){
      console.log(e,"error")
    }
  }
  }
  const handleSignUp = async () => {
    if (!username.value || !id.value || !company.value || !password.value) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Generate access token (dummy example, replace with your logic)
    const generateAccessToken = () => {
      return Math.random().toString(36).substr(2, 10).toUpperCase();
    };

    const accessToken = generateAccessToken();

    const bodyObj = {
      Username: username.value,
      Id: id.value,
      Company: company.value,
      Password: password.value,
      AccessCode: accessToken,
    };

    setLoading(true); // Start loading

    try {
      // Check if the username or id already exists (for signup validation)
      const response = await fetch(
        `https://sheetdb.io/api/v1/mm8jpgiaq7bqt/search?sheet=UserData&Id=${id.value}`,
      );
      const data = await response.json();
      console.log(JSON.stringify(data));

      if (data.length > 0) {
        Alert.alert('Error', 'Username or ID already exists');
        setId({...id, errorMessage: 'Username or ID already exists'});
        setLoading(false); // Stop loading
        return;
      } else {
        setId({...id, value: ''});
      }

      // Signup logic to create a new user with AccessCode
      const signupResponse = await fetch(
        'https://sheetdb.io/api/v1/mm8jpgiaq7bqt?sheet=UserData',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [
            bodyObj,
            ],
          }),
        },
      );

      const signupData = await signupResponse.json();
      console.log(signupData);
      if (!id.errorMessage) {
        toggleForm(true);
        setUsername({...username, value: ''});
        setId({...id, value: ''});
        setCompany({...company, value: ''});
        setPassword({...password, value: ''});
      } else {
        Alert.alert('Error', signupData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      if (error.message === 'Network request failed') {
        Alert.alert(
          'Error',
          'Network request failed. Please check your internet connection and try again.',
        );
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    } finally {
      setLoading(false); // Stop loading after request is done
    }
  };

  const toggleForm = signIn => {
    setIsSignIn(signIn);
    Animated.timing(animation, {
      toValue: signIn ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const signInFormOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const signUpFormOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => toggleForm(false)} style={styles.tab}>
          <Text style={[styles.tabText, !isSignIn && styles.activeTab]}>
            SIGNUP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleForm(true)} style={styles.tab}>
          <Text style={[styles.tabText, isSignIn && styles.activeTab]}>
            SIGNIN
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Animated.View style={[styles.form, {opacity: signInFormOpacity}]}>
          <AppInput
            label="Username/Id"
            showLabel={true}
            value={signInUsername.value}
            onChangeText={text => setSignInUsername({...signInUsername,value: text})}
            onEndEditing={validateSignInUsername}
            style={styles.input}
          />
          <AppInput
            label="Password"
            showLabel={true}
            value={signInPassword.value}
            onChangeText={text => setSignInPassword({...signInPassword,value: text})}
            onEndEditing={validateSignInPassword}
            style={styles.input}
          />
          <AppButton
            text="SIGNIN"
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
            onPress={handleSignIn}
          />
        </Animated.View>

        <Animated.ScrollView
          style={[styles.form, {opacity: signUpFormOpacity}]}>
          <AppInput
            label="Username"
            showLabel={true}
            value={username.value}
            onChangeText={text => {
              setUsername({...username, value: text});
            }}
            style={styles.input}
            showBorder={signInUsername.errorActive}
          />
          <AppInput
            label="Work-Id"
            showLabel={true}
            value={id.value}
            onChangeText={text => {
              setId({...id, value: text});
            }}
            style={styles.input}
            onEndEditing={async () => {
              try {
                const response = await fetch(
                  `https://sheetdb.io/api/v1/mm8jpgiaq7bqt/search?sheet=UserData&Id=${id.value}`,
                );
                const data = await response.json();
                console.log(JSON.stringify(data));
                if (data.length > 0) {
                  Alert.alert('Error', 'Username or ID already exists');
                  setId({...id, errorMessage: 'Username or ID already exists'});
                } else {
                  setId({...id, errorMessage: ''});
                }
              } catch (error) {
                console.error('Error checking ID:', error);
              }
            }}
            errorLabel={id.errorMessage}
          />
          <AppInput
            label="Company"
            showLabel={true}
            value={company.value}
            onChangeText={text => {
              setCompany({...company, value: text});
            }}
            style={styles.input}
          />
          <AppInput
            label="Password"
            showLabel={true}
            value={password.value}
            onChangeText={text => {
              setPassword({...password, value: text});
            }}
            style={styles.input}
          />
          {loading ? ( // Show loading spinner if request is in progress
            <ActivityIndicator size="large" color="black" />
          ) : (
            <AppButton
              text="SIGNUP"
              buttonStyle={styles.button}
              textStyle={styles.buttonText}
              onPress={handleSignUp}
            />
          )}
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: 'gray',
  },
  tabText: {
    fontSize: 18,
    color: 'gray',
    fontWeight: '600',
  },
  activeTab: {
    color: 'black',
    borderBottomColor: 'black',
  },
  formContainer: {
    flex: 1,
  },
  form: {
    position: 'absolute',
    width: '100%',
  },
  input: {
    width: '100%',
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'black',
    width: '100%',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
