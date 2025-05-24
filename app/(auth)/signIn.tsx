import {
  Alert,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { login, setUser } from "../../redux/slices/authSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AppInput from "../../components/AppInput";
import icons from "../../constants/icons";
import { styles } from "../../assets/styles/styles";
import AppButton from "../../components/AppButton";
import AuthForm from "../../components/AuthForm";
import AppText from "../../components/AppText";
import { colors } from "../../assets/styles/colors";
import { obj } from "../../assets/obj";
import BackButton from "../../components/BackButton";
import { AppError } from "@/assets/utils/errorMessages";
import { authService } from "@/redux/services/authService";

interface UserData {
  id: string;
  Email: string;
  Username?: string;
  "   "?: string; // Special field from your API
  Company?: string;
  AccessCode?: string;
  [key: string]: any; // For any additional fields
}

interface InputState {
  value: string;
  errorActive: boolean;
  errorMessage: string;
  verify: boolean;
  show?: boolean;
}

const SignIn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Initialize with empty strings for production
  const [email, setEmail] = useState<InputState>({
    value: __DEV__ ? "Ram@outlook.com" : "",
    errorActive: false,
    errorMessage: "",
    verify: false,
  });

  const [password, setPassword] = useState<InputState>({
    value: __DEV__ ? "User@104" : "",
    errorActive: false,
    errorMessage: "",
    verify: false,
    show: false,
  });

  const handleFocus = () => setIsFocused(true);

  const handleEmailInputChange = (text: string) => {
    const isValid = obj.regex.email.test(text);
    setEmail({
      ...email,
      value: text,
      verify: isValid,
      errorMessage: isValid ? "" : "Incorrect Email",
      errorActive: !isValid && text.length > 0,
    });
  };

  const handlePasswordInputChange = (text: string) => {
    const isValid = obj.regex.password.test(text);
    setPassword({
      ...password,
      value: text,
      verify: isValid,
      errorMessage: isValid ? "" : "Incorrect Password",
      errorActive: !isValid && text.length > 0,
    });
  };

  const handleEmailInputOnBlur = () => {
    setIsFocused(false);
    if (!email.value) {
      setEmail({
        ...email,
        errorActive: true,
        errorMessage: "Enter your email",
        verify: false,
      });
    }
  };

  const handlePasswordInputOnBlur = () => {
    setIsFocused(false);
    if (!password.value) {
      setPassword({
        ...password,
        errorActive: true,
        errorMessage: "Enter your password",
        verify: false,
      });
    }
  };


  const handleSignIn = async () => {
    // Validate inputs
    if (!email.value || !password.value) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    try {
      // Dispatch the login thunk action
      const resultAction = await dispatch(login({
        email: email.value,
        password: password.value
      }));
  
      if (login.fulfilled.match(resultAction)) {
        // The thunk already handles storing the user in Redux state
        const userData = resultAction.payload;
        
        // Handle the special field case (if needed)
        const userWithSpecialField = userData as UserData & { "   "?: string };
        const normalizedUser = {
          ...userWithSpecialField,
          Username: userWithSpecialField["   "] || userWithSpecialField.Username,
          id: userWithSpecialField.Id || userWithSpecialField.id
        };
        // console.log(userData,"<=======>",userWithSpecialField)
        // Update the user in Redux state with normalized data
        dispatch(setUser(normalizedUser));
        
        // Navigate to the main app
        router.replace("/(tabs)");
      } else if (login.rejected.match(resultAction)) {
        // Handle error from the thunk
        const errorMessage = resultAction.payload?.message || "Login failed";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };


  // const handleSignIn = async () => {
  //   if (!email.value || !password.value) {
  //     Alert.alert("Error", "Please fill in all fields");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://sheetdb.io/api/v1/mm8jpgiaq7bqt/search?sheet=UserData&Email=${email.value}&Password=${password.value}`
  //     );
  //     const userDataRes = await response.json();
   
  //     if (!userDataRes || userDataRes.length === 0) {
  //       Alert.alert("Error", "Invalid credentials");
  //       return;
  //     }

  //     // Type assertion for the special field
  //     const userWithSpecialField = userDataRes[0] as UserData & { "   "?: string };
      
  //     const userData = {
  //       ...userWithSpecialField,
  //       Username: userWithSpecialField["   "] || userWithSpecialField.Username,
  //       id: userWithSpecialField.Id || userWithSpecialField.id
  //     };

  //     const resultAction = await dispatch(login({
  //       email: email.value,
  //       password: password.value
  //     }));

  //     if (login.fulfilled.match(resultAction)) {
  //       // Manually set user if needed (thunk should handle this)
  //       dispatch(setUser(userData));
  //       router.replace("/(tabs)");
  //     } else if (login.rejected.match(resultAction)) {
  //       const errorMessage = resultAction.payload?.message || "Login failed";
  //       Alert.alert("Error", errorMessage);
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     Alert.alert("Error", "An unexpected error occurred");
  //   }
  // };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null;
  }
  return (
    <View style={styles.container}>
    {/* <StatusBar style="light" backgroundColor="#3498db" /> */}
      {/* <BackButton backTo="/" /> */}
      <AuthForm appIcon={require("../../assets/images/no-result.png")}>
        <AppText
          text="Welcome Back"
          style={{
            alignSelf: "center",
            fontSize: 30,
            fontWeight: "bold",
            margin: 5,
            marginTop: 15,
          }}
        />
        <AppText
          text="Enter your details below"
          style={{
            color: colors.inActive,
            fontWeight: "bold",
            alignSelf: "center",
            margin: 5,
            marginBottom: 15,
          }}
        />

        <AppInput
          label="Email"
          showLabel={false}
          activeBorder={!email.errorMessage}
          showBorder={true}
          value={email.value}
          inputIcon={icons.person}
          errorLabel={email.errorMessage}
          onChangeText={handleEmailInputChange}
          onBlur={handleEmailInputOnBlur}
          onFocus={handleFocus}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppInput
          label="Password"
          showLabel={false}
          activeBorder={!password.errorMessage}
          value={password.value}
          inputIcon={icons.shield}
          errorLabel={password.errorMessage}
          onChangeText={handlePasswordInputChange}
          onBlur={handlePasswordInputOnBlur}
          onFocus={handleFocus}
          secureTextEntry
        />
{loading ? (
  <ActivityIndicator size="large" />
) : (
        <AppButton
          text={loading ? <ActivityIndicator color="white" /> : "SIGN IN"}
          onPress={handleSignIn}
          disabled={loading}
          buttonStyle={{
            marginVertical: 20,
            marginHorizontal: 22,
            opacity: loading ? 0.7 : 1,
          }}
        />)}

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgotPassword")}
          style={{ alignSelf: "center" }}
        >
          <AppText
            text="Forgot your password?"
            style={{ margin: 5, marginBottom: 15 }}
          />
        </TouchableOpacity>

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <AppText
            text="Or"
            style={{ color: colors.inActive, marginHorizontal: 10 }}
          />
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.signUpPrompt}>
          <AppText text="Don't have an account? " style={{ color: "#aaa" }} />
          <TouchableOpacity onPress={() => router.push("/(auth)/signUp")}>
            <AppText
              text="Sign up"
              style={{
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            />
          </TouchableOpacity>
        </View>
      </AuthForm>
    </View>
  );
};

export default SignIn;
