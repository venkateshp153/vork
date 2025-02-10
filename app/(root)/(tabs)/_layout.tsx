import { StyleSheet, View, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "../../../constants/icons";

const TabIcon = ({ focused, icon }: { focused: boolean; icon: any }) => (
  <View style={styles.iconContainer}>
    <Image source={icon} style={[styles.icon, { opacity: focused ? 1 : 0.5 }]} />
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={icons.home} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={icons.laundry} focused={focused} />,
        }}
      />
         <Tabs.Screen
        name="main"
        options={{
          title: "Main",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={icons.area} focused={focused} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    position: "absolute",
    borderTopColor: "#0061FF1A",
    borderTopWidth: 1,
    minHeight: 70,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
