
// import React from 'react';
// import { TouchableOpacity, StyleSheet } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { colors } from '../assets/styles/colors';

// // Define the allowed route paths as a type
// type AllowedRoutes = 
//   | '/'
//   | '/signIn'
//   | '/signUp'
//   | `/details/${string}` // Dynamic route example
//   // Add all other valid routes in your app here
//   ;

// interface BackButtonProps {
//   backTo?: AllowedRoutes; // Restrict `backTo` to allowed routes
// }

// const BackButton: React.FC<BackButtonProps> = ({ backTo }) => {
//   const router = useRouter();

//   const handlePress = () => {
//     if (backTo) {
//       router.push(backTo as any); // Cast to `any` to bypass TypeScript's type checking
//     } else {
//       router.back();
//     }
//   };

//   return (
//     <TouchableOpacity onPress={handlePress} style={styles.button}>
//       <FontAwesome name="angle-left" size={25} color={colors.appThemeColor} />
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     width: '10%',
//     alignItems: 'center',
//     height: 30,
//     marginRight: 10,
//   },
// });

// export default BackButton;

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { colors } from '../assets/styles/colors';

// Define the allowed route paths as a type
type AllowedRoutes = 
  | '/'
  | '/home' // Add '/home' as a valid route
  | '/signIn'
  | '/signUp'
  | `/details/${string}` // Dynamic route example
  // Add all other valid routes in your app here
  ;

interface BackButtonProps {
  backTo?: AllowedRoutes; // Restrict `backTo` to allowed routes
}

const BackButton: React.FC<BackButtonProps> = ({ backTo }) => {
  const router = useRouter();
  const navigation = useNavigation();

  const handlePress = () => {
    if (backTo) {
      router.push("/"); // Navigate to the specified route if `backTo` is provided
    } else {
      // Check if the current screen is part of a gesture-enabled stack
      if (navigation.canGoBack()) {
        router.back(); // Navigate back if there's a previous screen
      } else {
        router.push('/'); // Navigate to home if no previous screen exists
      }
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <FontAwesome name="angle-left" size={25} color={colors.appThemeColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '10%',
    alignItems: 'center',
    height: 30,
    marginRight: 10,
  },
});

export default BackButton;