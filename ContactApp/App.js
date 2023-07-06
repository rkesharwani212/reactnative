/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Home from './src/components/Home';
import AddContact from './src/components/AddContact';
import EditContact from './src/components/EditContact';
import FavouriteContacts from './src/components/FavouriteContacts';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerTitleAlign:'center'}}>
          <Stack.Screen name="Drawer" component={DrawerNavigation} options={{ headerShown: false }} />
          <Stack.Screen name="Contacts" component={Home} />
          <Stack.Screen name="Create contact" component={AddContact} />
          <Stack.Screen name="Edit contact" component={EditContact} />
          <Stack.Screen name="Favourite contacts" component={FavouriteContacts} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator screenOptions={{headerTitleAlign:'center'}}>
      <Drawer.Screen name="Contacts" component={Home} />
      <Drawer.Screen name="Favourite contacts" component={FavouriteContacts} />
    </Drawer.Navigator>
  );
};

export default App;
