import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { colors } from "../assets/styles/colors";

interface AuthFormProps {
  appIcon?: any;
  children?: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ appIcon, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {appIcon && <Image source={appIcon} style={styles.icon} />}
      </View>
      <View style={{height:15,width:'90%',zIndex:-1,borderWidth:1,borderBottomWidth:0, borderTopLeftRadius: 80,
    borderTopRightRadius: 80,backgroundColor: 'rgba(255, 255, 255, 0.8)'}}></View>
      <View style={styles.formContainer}>{children}</View>
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor:colors.appThemeColor
  },
  iconContainer: {
    flex: 0.3,
    justifyContent:"center",
    alignItems:"center",
    alignSelf: "center",
    paddingRight: 5,
  },
  icon: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  formContainer: {
    flex: 0.7,
    backgroundColor:colors.titleColor,
    borderWidth: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    padding: 20,
  },
});
