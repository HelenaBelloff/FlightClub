import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlightPreviewScreen from './screens/FlightPreviewScreen';
import HomeScreen from './screens/HomeScreen';
import LogFlightScreen from './screens/LogFlightScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="FlightClub"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="FlightClub" 
            component={HomeScreen}
            options={{
              title: 'Flight Club',
            }}
          />
          <Stack.Screen 
            name="Log Flight" 
            component={LogFlightScreen}
            options={{
              title: 'Log New Flight',
            }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              title: 'My Profile',
            }}
          />
          <Stack.Screen 
            name="FlightPreview" 
            component={FlightPreviewScreen}
            options={{
              title: 'Flight Preview',
              headerLeft: () => null, // Disable back button
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
