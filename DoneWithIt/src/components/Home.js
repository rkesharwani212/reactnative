import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View } from 'react-native';
import { PaperProvider, Appbar, Card, Text, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

const Home = () => {
  const budgets = useSelector(state=>state);
  const navigation = useNavigation();
  const handleAdd = ()=>{
    navigation.navigate("Budget Entry")
  }
  return (
    <View style = {{flex:1, backgroundColor:"#ffff",justifyContent:'center'}}>
      <Button style = {{ width:200, margin:20}}
                        buttonColor='black'
                        mode='contained'
                        contentStyle = {{height: 50}} 
                        onPress={handleAdd}>Add New Budget</Button>
        {
          budgets.map((budget,id)=>(
            <Card style = {{borderRadius:10, margin: 10, marginTop:2, backgroundColor:'#ccffe6'}}>
              <Card.Title titleVariant='titleLarge' title = {budget.name}/>
              <Card.Content>
                <Text>Planned Amount: {budget.plannedAmount}</Text>
                <Text>Actual Amount: {budget.actualAmount}</Text>
              </Card.Content>
            </Card>
              
          ))
          
        }
    </View>
  )
}

export default Home