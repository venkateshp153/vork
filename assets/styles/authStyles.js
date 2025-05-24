// assets/styles/authStyles.ts
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  authTitle: {
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "bold",
    margin: 5,
    marginTop: 15,
  },
  authSubtitle: {
    color: colors.inActive,
    fontWeight: "bold",
    alignSelf: "center",
    margin: 5,
    marginBottom: 15,
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
  },
  footerLink: {
    alignSelf: "center",
    margin: 5,
    marginBottom: 15,
    color: colors.primary,
  },
  dividerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  dividerLine: {
    borderBottomWidth: 1,
    width: "30%",
    borderColor: colors.inActive,
  },
  dividerText: {
    color: colors.inActive,
    marginHorizontal: 10,
  },
  signUpPrompt: {
    flexDirection: "row",
    marginTop: 20,
  },
  signUpText: {
    color: colors.inActive,
  },
  signUpLink: {
    fontWeight: "bold",
    color: colors.primary,
    textDecorationLine: "underline",
  },
  signInPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    color: colors.inActive,
  },
  signInLink: {
    fontWeight: "bold",
    color: colors.primary,
    textDecorationLine: "underline",
  },
});