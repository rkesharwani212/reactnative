import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { View } from 'react-native'
import { Appbar, Button, HelperText, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';

const CreateBudget = () => {
    const [name, setName] = useState("");
    const [plannedAmount, setPlannedAmount] = useState("");
    const [actualAmount, setActualAmount] = useState("");

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleCancel = ()=>{
        navigation.navigate("Budget Entry Listing");
    }
    const handleSubmit = ()=>{
//plannedAmount!="" && actualAmount!="" && !isNaN(parseFloat(plannedAmount)) && !isNaN(parseFloat(actualAmount))
        if(plannedAmount!="" && isNaN(parseFloat(plannedAmount))){
            alert("Planned Amount should be a number");
            return
        }
        if(actualAmount!="" && isNaN(parseFloat(actualAmount))){
            alert("Actual Amount should be a number");
            return
        }
        if(name.trim() == "" || plannedAmount.trim() == "" || actualAmount.trim() ==""){
            alert("Please Fill All The Fields");
            return;
        }
        const data = {
            name,
            plannedAmount,
            actualAmount
        }
         dispatch({type:"Add",payload:data})
         navigation.navigate("Budget Entry Listing");

    }
  return (
    <View style = {{flex:1, backgroundColor:"#ffff",justifyContent:'center'}}>
        {/* <Appbar.Header>
            <Appbar.Content style={{ alignItems: 'center' }} title = "Budget Entry" />
        </Appbar.Header> */}
            <View style = {{width:'85%' ,alignSelf:'center'}}>
                <TextInput style = {{margin:10}}
                    label="Name"
                    value={name}
                    onChangeText={name => setName(name)}
                />
                <TextInput style = {{margin:10}}
                    label="Planned Amount"
                    value={plannedAmount}
                    onChangeText={plannedAmount => setPlannedAmount(plannedAmount)}
                />
                <TextInput style = {{margin:10}}
                    label="Actual Amount"
                    value={actualAmount}
                    onChangeText={actualAmount => setActualAmount(actualAmount)}
                />
                <Button style = {{marginTop:10}} 
                        contentStyle = {{height: 50}} 
                        mode='contained'
                        onPress={handleCancel}>Cancel</Button>
                <Button style = {{marginTop:10}}
                        buttonColor='#4CAF50' 
                        contentStyle = {{height: 50}} 
                        mode='contained'
                        onPress={handleSubmit}>Submit</Button>
            </View>
    </View>
    
  )
}

export default CreateBudget