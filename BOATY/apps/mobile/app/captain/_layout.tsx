import { Tabs } from 'expo-router';
import { LayoutDashboard, Ship, Bell, Navigation, DollarSign } from 'lucide-react-native';
import { C } from '../../constants/colors';

export default function CaptainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.orange,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: C.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="fleet"
        options={{
          title: 'Flota',
          tabBarIcon: ({ color, size }) => <Ship size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Viajes',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="active"
        options={{
          title: 'Activo',
          tabBarIcon: ({ color, size }) => <Navigation size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Dinero',
          tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
