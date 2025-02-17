import { Text, View, Alert } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import AppInput from "../components/AppInput";
import icons from "../constants/icons";
import { styles } from "../assets/styles/styles";
import AppButton from "../components/AppButton";
import AuthForm from "../components/AuthForm";
import AppText from "../components/AppText";
import { colors } from "../assets/styles/colors";
import { obj } from "../assets/obj";

interface InputState {
  value: string;
  errorActive: boolean;
  errorMessage: string;
  verify: boolean;
  show?: boolean;
}

const SignIn: React.FC = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [email, setEmail] = useState<InputState>({
    value: "Leah@outlook.com",
    errorActive: false,
    errorMessage: "",
    verify: false,
  });

  const [password, setPassword] = useState<InputState>({
    value: "User@101",
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
    });
  };

  const handlePasswordInputChange = (text: string) => {
    const isValid = obj.regex.password.test(text);
    setPassword({
      ...password,
      value: text,
      verify: isValid,
      errorMessage: isValid ? "" : "Incorrect Password",
    });
  };

  const handleEmailInputOnBlur = () => {
    setIsFocused(false);
    if (!email.value) {
      setEmail({ ...email, errorActive: true, errorMessage: "Enter your email" });
    } else if (!email.value.match(obj.regex.email)) {
      setEmail({ ...email, errorActive: true, errorMessage: "Incorrect email" });
    } else {
      setEmail({ ...email, errorActive: false, errorMessage: "" });
    }
  };

  const handlePasswordInputOnBlur = () => {
    setIsFocused(false);
    if (!password.value) {
      setPassword({ ...password, errorActive: true, errorMessage: "Enter your password" });
    } else if (!password.value.match(obj.regex.password)) {
      setPassword({ ...password, errorActive: true, errorMessage: "Incorrect Password" });
    } else {
      setPassword({ ...password, errorActive: false, errorMessage: "" });
    }
  };

  const handleSignIn = async () => {
    if (!email.value || !password.value) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `https://sheetdb.io/api/v1/mm8jpgiaq7bqt/search?sheet=UserData&Email=${email.value}&Password=${password.value}`
      );
      const data = await response.json();

      if (data.length > 0) {
        Alert.alert("Error", "Incorrect Username/Id/Password");
        setEmail({ ...email, errorActive: true });
        return;
      } else {
        setEmail({ ...email, value: "" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <AuthForm appIcon={require("../assets/images/no-result.png")}>
        <AppText text="Welcome Back" style={{ alignSelf: "center", fontSize: 30, fontWeight: "bold", margin: 5, marginTop: 15 }} />
        <AppText text="Enter your details below" style={{ color: colors.inActive, fontWeight: "bold", alignSelf: "center", margin: 5, marginBottom: 15 }} />

        <AppInput
          label="Username"
          showLabel={false}
          activeBorder={!!email.errorMessage}
          showBorder={true}
          value={email.value}
          inputIcon={icons.person}
          errorLabel={email.errorMessage}
          onChangeText={handleEmailInputChange}
          onBlur={handleEmailInputOnBlur}
          onFocus={handleFocus}
        />

        <AppInput
          label="Password"
          showLabel={false}
          activeBorder={!!password.errorMessage}
          value={password.value}
          inputIcon={icons.shield}
          errorLabel={password.errorMessage}
          onChangeText={handlePasswordInputChange}
          onBlur={handlePasswordInputOnBlur}
          onFocus={handleFocus}
          secureTextEntry
        />

        <AppButton text="SIGNIN" onPress={handleSignIn} buttonStyle={{ marginVertical: 20, marginHorizontal: 22 }} />

        <AppText text="Forgot your password?" style={{ alignSelf: "center", margin: 5, marginBottom: 15 }} />

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
          <View style={{ borderBottomWidth: 1, width: "30%", borderColor: colors.inActive }} />
          <AppText text="Or sign in with" style={{ color: colors.inActive, alignSelf: "center", margin: 5 }} />
          <View style={{ borderBottomWidth: 1, width: "30%", borderColor: colors.inActive }} />
        </View>

        <View style={{ flex: 0.1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          {/* <AppButton text="Google" onPress={}/>
          <AppButton text="Facebook" onPress={} /> */}
        </View>
      </AuthForm>
    </View>
  );
};

export default SignIn;
