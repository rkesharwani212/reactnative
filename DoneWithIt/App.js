import React from 'react';
import { PaperProvider, Appbar, Card, Text, Button } from 'react-native-paper';
import Home from './src/components/Home';
import CreateBudget from './src/components/CreateBudget';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import budgetReducer from './src/redux/reducers/budgetReducer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const store = createStore(budgetReducer);
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Budget Entry" component={CreateBudget} />
            <Stack.Screen name="Budget Entry Listing" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
    
  );
}

