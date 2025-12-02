import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import DashboardScreen from '../screens/admin/DashboardScreen';
import PartsListScreen from '../screens/admin/PartsListScreen';
import AddPartScreen from '../screens/admin/AddPartScreen';
import EditPartScreen from '../screens/admin/EditPartScreen';
import CategoriesScreen from '../screens/admin/CategoriesScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const PartsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="PartsList" 
      component={PartsListScreen}
      options={{ title: 'Parts Inventory' }}
    />
    <Stack.Screen 
      name="AddPart" 
      component={AddPartScreen}
      options={{ title: 'Add New Part' }}
    />
    <Stack.Screen 
      name="EditPart" 
      component={EditPartScreen}
      options={{ title: 'Edit Part' }}
    />
  </Stack.Navigator>
);

const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#2D5BFF',
        drawerInactiveTintColor: '#6C757D',
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Parts"
        component={PartsStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="car-cog" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="shape" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;
