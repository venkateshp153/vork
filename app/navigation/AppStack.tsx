import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../(tabs)/profile';
import ScheduleScreen from '../(tabs)/schedule';
import TabsLayout from '../../app/(tabs)/_layout';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsLayout} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}