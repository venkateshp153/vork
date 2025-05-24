//app/auth/signUp.tsx
import React from "react";
import { Alert, View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { useForm } from "../../assets/hooks/FormStateManagement";
import { authService } from "../../assets/services/authService";
import icons from "../../constants/icons";
import { obj } from "../../assets/obj";
import AuthForm from "../../components/AuthForm";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import BackButton from "../../components/BackButton";
import { authStyles } from "../../assets/styles/authStyles";

const SignUp = () => {
  const {
    formFields,
    isFocused,
    handleFocus,
    handleChange,
    handleBlur,
    resetForm,
  } = useForm({
    initialValues: {
      username: {
        value: "",
        errorActive: false,
        errorMessage: "",
        verify: false,
      },
      id: {
        value: "",
        errorActive: false,
        errorMessage: "",
        verify: false,
      },
      company: {
        value: "",
        errorActive: false,
        errorMessage: "",
        verify: false,
      },
      password: {
        value: "",
        errorActive: false,
        errorMessage: "",
        verify: false,
        show: false,
      },
    },
    validationRules: {
      username: {
        required: true,
        pattern: obj.regex.email,
        errorMessage: "Invalid username/email",
      },
      id: {
        required: true,
        pattern: obj.regex.id,
        errorMessage: "Invalid ID format",
      },
      company: {
        required: true,
        errorMessage: "Company name is required",
      },
      password: {
        required: true,
        pattern: obj.regex.password,
        errorMessage: "Password doesn't meet requirements",
      },
    },
  });

  const handleIdValidation = async () => {
    handleBlur("id");
    if (formFields.id.verify) {
      try {
        await authService.checkClientId(formFields.id.value);
      } catch (error) {
        console.error("Client ID validation error:", error);
      }
    }
  };

  const handleSignUp = async () => {
    // Check if any field has errors
    const hasErrors = Object.values(formFields).some(
      (field) => !field.verify || field.errorActive
    );

    if (hasErrors) {
      Alert.alert("Error", "Please correct the errors in the form");
      return;
    }

    try {
      const idCheck = await authService.checkClientId(formFields.id.value);
      if (idCheck.length > 0) {
        Alert.alert("Error", "This ID is already registered");
        return;
      }

      const accessToken = Math.random().toString(36).substr(2, 10).toUpperCase();
      const userData = {
        Username: formFields.username.value,
        Id: formFields.id.value,
        Company: formFields.company.value,
        Password: formFields.password.value,
        AccessCode: accessToken,
      };

      await authService.register(userData);
      Alert.alert("Success", "Account created successfully");
      resetForm();
      router.replace("/signIn");
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", "Failed to create account");
    }
  };

  return (
    <View style={authStyles.container}>
      <BackButton backTo="/" />
      <AuthForm appIcon={require("../../assets/images/no-result.png")}>
        <AppText
          text="Create an Account"
          style={authStyles.authTitle}
        />
        <AppText
          text="Enter your details below"
          style={authStyles.authSubtitle}
        />

        <AppInput
          label="Username"
          showLabel={false}
          activeBorder={!formFields.username.errorMessage}
          showBorder={true}
          value={formFields.username.value}
          inputIcon={icons.person}
          errorLabel={formFields.username.errorMessage}
          onChangeText={(text) => handleChange("username", text)}
          onBlur={() => handleBlur("username")}
          onFocus={handleFocus}
        />

        <AppInput
          label="ID"
          showLabel
          activeBorder={!formFields.id.errorMessage}
          value={formFields.id.value}
          onFocus={handleFocus}
          onBlur={handleIdValidation}
          inputIcon={icons.wallet}
          errorLabel={formFields.id.errorMessage}
          onChangeText={(text) => handleChange("id", text)}
        />

        <AppInput
          label="Company"
          showLabel
          activeBorder={!formFields.company.errorMessage}
          value={formFields.company.value}
          onFocus={handleFocus}
          onChangeText={(text) => handleChange("company", text)}
          onBlur={() => handleBlur("company")}
          inputIcon={icons.area}
          errorLabel={formFields.company.errorMessage}
        />

        <AppInput
          label="Password"
          showLabel
          activeBorder={!formFields.password.errorMessage}
          value={formFields.password.value}
          onFocus={handleFocus}
          onChangeText={(text) => handleChange("password", text)}
          onBlur={() => handleBlur("password")}
          inputIcon={icons.shield}
          errorLabel={formFields.password.errorMessage}
          secureTextEntry
        />

        <AppButton
          text="SIGN UP"
          onPress={handleSignUp}
          buttonStyle={{ marginVertical: 20, marginHorizontal: 22 }}
          disabled={false}
        />

        <View style={authStyles.signInPrompt}>
          <Text style={authStyles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signIn")}>
            <Text style={authStyles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </AuthForm>
    </View>
  );
};

export default SignUp;