import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../../app/(auth)/signIn';
import SignUpScreen from '../../app/(auth)/signUp';
import ForgotPasswordScreen from '../../app/(auth)/forgotPassword';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}