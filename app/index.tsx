// app/index.tsx - Welcome/landing screen
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { colors } from "@/assets/styles/colors";
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <StatusBar style="light" backgroundColor={colors.error} />
      <Text>Welcome to My App</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push("/(auth)/signIn")}
      >
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push("/(auth)/signUp")}
      >
        <Text>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  button: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 5
  }
});