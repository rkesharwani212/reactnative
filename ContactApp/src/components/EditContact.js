/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable curly */
/* eslint-disable no-alert */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eol-last */
import React, {useState, useEffect } from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { Avatar, Button, Text, TextInput } from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'ContactDatabase.db' });

const EditContact = () => {
    const route = useRoute();
    const navigation =  useNavigation();
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [imagePath, setImagePath] = useState(route.params.data.imagePath);
    const [landlineNumber, setLandlineNumber] = useState('');

    useEffect(()=>{

        setName(route.params.data.name);
        setNumber(route.params.data.number.toString());
        setImagePath(route.params.data.imagePath);
        setLandlineNumber(route.params.data.landlineNumber.toString());
    },[]);
    const handleImageChange = () => {
        // Implement image selection logic here, and update the 'image' state accordingly
        let options = {
          mediaType: 'photo',
          maxWidth: 300,
          maxHeight: 550,
          quality: 1,
        };
    
        launchImageLibrary(options, (response) => {
          //console.log('Response = ', response);
    
          if (response.didCancel) {
            alert('User cancelled camera picker');
            return;
          } else if (response.errorCode === 'camera_unavailable') {
            alert('Camera not available on device');
            return;
          } else if (response.errorCode === 'permission') {
            alert('Permission not satisfied');
            return;
          } else if (response.errorCode === 'others') {
            alert(response.errorMessage);
            return;
          }
          setImagePath(response.assets[0].uri);
        });
      };
      const handleSubmit = () => {
        db.transaction(txn => {
            txn.executeSql(
              'UPDATE table_contact set contact_name=?, contact_number=?, landline_number=?, contact_image_path=? where contact_id=?',
              [name, number, landlineNumber, imagePath, route.params.data.contactId],
              (tx, results) => {
                console.log('Results', results);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'User updated successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => navigation.navigate('Contacts'),
                      },
                    ],
                    {cancelable: false},
                  );
                } else alert('Updation Failed');
              },
              error=>{
                console.log(error);
              },
            );
        });
      };
  return (
    <View style={styles.container}>
      {/* <Avatar.Icon size={80} icon="account" /> */}
      <TouchableOpacity onPress={handleImageChange}>
        <Avatar.Image
          source={{ uri: imagePath }}
          size={100}
          style={styles.avatar}
        />
        <Text style={styles.text} variant="titleSmall">Add picture</Text>
      </TouchableOpacity>
      {/* <Button
            mode="contained"
            onPress={handleImageChange}
            style={styles.button}
        >
            Select Image
        </Button> */}
      <TextInput
        label="Name"
        value={name}
        onChangeText={name=>setName(name)}
        style={styles.input}
      />

      <TextInput
        label="Phone Number"
        value={number}
        onChangeText={number=>setNumber(number)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Landline Number"
        value={landlineNumber}
        onChangeText={landlineNumber=>setLandlineNumber(landlineNumber)}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
      >
        Submit
      </Button>
    </View>
  );
};

export default EditContact;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      width: '100%',
      marginBottom: 16,
    },
    avatar: {
      marginTop: 16,
      marginBottom: 32,
    },
    button: {
      width: '100%',
      marginBottom: 16,
    },
    text: {
      margin: 10,
    },
  });