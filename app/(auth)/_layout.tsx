import { Stack } from 'expo-router';
import { useAppSelector } from '../../redux/hooks';

export default function AuthLayout() {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="forgotPassword" />
    </Stack>
  );
}