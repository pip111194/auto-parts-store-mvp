import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import HomeScreen from '../screens/customer/HomeScreen';
import BrowseScreen from '../screens/customer/BrowseScreen';
import PartDetailScreen from '../screens/customer/PartDetailScreen';
import SearchScreen from '../screens/customer/SearchScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PartDetail" 
      component={PartDetailScreen}
      options={{ title: 'Part Details' }}
    />
  </Stack.Navigator>
);

const BrowseStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Browse" 
      component={BrowseScreen}
      options={{ title: 'Browse Parts' }}
    />
    <Stack.Screen 
      name="PartDetail" 
      component={PartDetailScreen}
      options={{ title: 'Part Details' }}
    />
  </Stack.Navigator>
);

const CustomerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2D5BFF',
        tabBarInactiveTintColor: '#6C757D',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="BrowseTab"
        component={BrowseStack}
        options={{
          tabBarLabel: 'Browse',
          tabBarIcon: ({ color, size }) => (
            <Icon name="magnify" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Icon name="text-search" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;
