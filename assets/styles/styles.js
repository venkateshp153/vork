import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { size } from "./sizes";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, // Use your background color
  },
  boxColor: {
    borderWidth: 1,
    borderColor: "red",
  },
  pageStyle: {
    width: "90%",
    alignSelf: "center",
  },
  appName: {
    fontFamily: "sans-serif-condensed",
    fontSize: 30,
    fontWeight: "bold",
    color: colors.titleColor,
  },
  appNameView: {
    height: 80,
    justifyContent: "center",
    alignSelf: "center",
  },
  titleText: {
    fontSize: 25,
    padding: 10,
    alignSelf: "center",
    color: colors.titleColor,
  },
  headerView: {
    backgroundColor: colors.headerColor,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    margin: 5,
  },
  headerTitleView: {
    fontFamily: "sans-serif-light",
    width: "auto",
    height: 80,
    justifyContent: "flex-end",
    alignSelf: "center",
  },

  appLogoView: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  appLogoSize: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
  LoginButton: {
    height: 40,
    alignItems: "center",
    backgroundColor: colors.headerColor,
    padding: 10,
    width: "70%",
    borderRadius: 45,
    margin: 5,
  },
  signInButton: {
    height: 40,
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    borderColor: colors.appThemeColor,
    padding: 10,
    width: "70%",
    borderRadius: 45,
    margin: 10,
  },
  footerTitleView: {
    fontFamily: "sans-serif-light",
    width: "auto",
    height: "auto",
    justifyContent: "center",
  },
  footerTitle: {
    color: colors.textColor,
    fontSize: 25,
    paddingBottom: 10,
    width: "80%",
    alignSelf: "center",
  },
  appTheme: {
    alignSelf: "center",
    width: "80%",
    marginBottom: 20,
  },
  initial_login_signIn: {
    alignItems: "center",
  },
  appInputView: {
    alignItems: "center",
  },
  AppInput: {
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 8,
    width: "80%",
  },
  pageTitle: {
    fontSize: size.fontSize.large,
    color: colors.textColor,
    fontWeight: "bold",
  },
  linkStyle: {
    fontSize: 13,
    color: colors.appThemeColor,
  },
  btnPageTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "flex-end",
    marginVertical: 10,
  },
  rankCard: {
    flexDirection: "row",
    height: 90,
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
  },
  homeIcon: {
    height: 60,
    width: 70,
    borderRadius: 40,
    borderWidth: 1,
    marginBottom: 30,
    marginHorizontal: 10,
    borderColor: colors.inActive,
    backgroundColor: colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  homeIconLabel: {
    width: "auto",
    fontSize: size.fontSize.xsmall,
    textAlign: "center",
  },
  homeDate: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.buttonColor,
    backgroundColor: colors.baseGray08,
    marginVertical: 15,
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inActive, // Use your inactive color
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
});
