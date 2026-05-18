import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Bell, Car, Gauge, Settings, Wrench } from "lucide-react-native";
import type { ComponentType } from "react";
import { useColorScheme } from "react-native";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { VehiclesScreen } from "./src/screens/VehiclesScreen";
import { MaintenanceScreen } from "./src/screens/MaintenanceScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { colors } from "./src/theme/colors";

export type RootTabs = {
  Dashboard: undefined;
  Vehicles: undefined;
  Maintenance: undefined;
  Notifications: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabs>();

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? colors.ink : colors.surface },
          headerTintColor: isDark ? colors.surface : colors.ink,
          tabBarActiveTintColor: colors.blue,
          tabBarStyle: { minHeight: 64, paddingBottom: 8, paddingTop: 8 }
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: icon(Gauge) }} />
        <Tab.Screen name="Vehicles" component={VehiclesScreen} options={{ tabBarIcon: icon(Car), title: "Vehicules" }} />
        <Tab.Screen name="Maintenance" component={MaintenanceScreen} options={{ tabBarIcon: icon(Wrench), title: "Entretien" }} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarIcon: icon(Bell), title: "Alertes" }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: icon(Settings), title: "Profil" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function icon(Icon: ComponentType<{ color: string; size: number }>) {
  return ({ color, size }: { color: string; size: number }) => <Icon color={color} size={size} />;
}
