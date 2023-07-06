/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
//import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Avatar, Text } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'ContactDatabase.db' });

//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const AddContact = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [landlineNumber, setLandlineNumber] = useState('');

  const defaultImage = require('../images/default1.jpg');
  const navigation = useNavigation();

  useEffect(() => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name = 'table_contact'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_contact', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_contact(contact_id INTEGER PRIMARY KEY AUTOINCREMENT, contact_name VARCHAR(20), contact_number INT(10), landline_number INT(10), contact_image_path VARCHAR(255), isFav BIT)',
              [],
            );
          } else {
            console.log('Already Created');
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  }, []);

  const handleImageChange = () => {
    // Implement image selection logic here, and update the 'image' state accordingly
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setImagePath(response.assets[0].uri);
    });
  };

  const handleSubmit = () => {
    function isInteger(str) {
      return /^\d+$/.test(str);
    }

    if (name === '') {
      alert('Name can not be empty');
      return;
    }
    if (number != '' && !isInteger(number)) {
      alert('phone number can only have numbers');
      return;
    }
    if (landlineNumber != '' && !isInteger(landlineNumber)) {
      alert('Landline number cannot only have numbers');
      return;
    }
    if (landlineNumber.length > 10) {
      alert('Number cannot be greater then 10 digits');
      return;
    }
    if (number.length !== 10) {
      alert('Phone number should have 10 digits');
      return;
    }
    saveData();
  };
  const saveData = () => {
    //console.log(name + "" + plannedAmount + "==" + actualAmount);
    db.transaction((txn) => {
      txn.executeSql(
        'INSERT INTO table_contact (contact_name, contact_number, landline_number, contact_image_path, isFav) VALUES (?,?,?,?,?)',
        [name, number, landlineNumber, imagePath, false],
        (tx, res) => {
          if (res.rowsAffected === 1) {
            navigation.goBack();
          }
          console.log(res);
        },
        error => {
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
          source={imagePath == '' ? defaultImage : { uri: imagePath }}
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
        onChangeText={name => setName(name)}
        style={styles.input}
      />

      <TextInput
        label="Phone Number"
        value={number}
        onChangeText={number => setNumber(number)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Landline Number"
        value={landlineNumber}
        onChangeText={landlineNumber => setLandlineNumber(landlineNumber)}
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

export default AddContact;

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
