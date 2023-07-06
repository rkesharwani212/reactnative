/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { Avatar, FAB, IconButton, List, Searchbar } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'ContactDatabase.db' });

const Home = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [contactList, setContactList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const ref = useRef();
  useEffect(() => {
    getData();
  }, [isFocused]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = contactList.filter((contact) =>
      contact.contact_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredContacts(filteredData.sort((a, b) => a.contact_name.localeCompare(b.contact_name)));
  };

  const getData = () => {
    db.transaction(txn => {
      txn.executeSql('SELECT * FROM table_contact', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          //console.log(results.rows.item(i))
          temp.push(results.rows.item(i));
        }
        setContactList(temp);
      });
    });
  };
  const handleDeleteContact = (id) => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM  table_contact where contact_id=?',
        [id],
        (tx, results) => {
          //console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    getData();
                  },
                },
              ],
              { cancelable: false },
            );
          } else {
            alert('Please insert a valid User Id');
          }
        },
      );
    });
  };

  const handleToggleFavorite = (contactId, isFav) => {
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE table_contact set isFav=? where contact_id=?',
        [!isFav, contactId],
        (tx, results) => {
          console.log('Results', results);
          getData();
        },
        error => {
          console.log(error);
        },
      );
    });

  }

  const LeftSwipe = (item) => {
    return (
      <View style={{ flexDirection:'row'}}>
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}>
          <IconButton
            icon="delete"
            onPress={() => {
              handleDeleteContact(item.contact_id)
            }}
          />
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#03a9fc'}}>
          <IconButton
            icon="pencil"
          onPress={() => {
            navigation.navigate('Edit contact', {
              data: {
                name: item.contact_name,
                number: item.contact_number,
                landlineNumber: item.landline_number,
                imagePath: item.contact_image_path,
                contactId: item.contact_id,
              },
            });
            }}
          />
        </View>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Swipeable renderLeftActions={()=>LeftSwipe(item)} >
      <List.Item
        title={item.contact_name}
        description={item.contact_number}
        left={() => (
          <Avatar.Image style={{ margin: 5 }}
            source={{ uri: item.contact_image_path }}
            size={40}
          />
        )}
        right={() => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon={item.isFav ? 'star' : 'star-outline'}
              onPress={() => handleToggleFavorite(item.contact_id, item.isFav)}
            />
          </View>
        )}
      />
    </Swipeable>

  );
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={searchQuery.trim() === '' ? contactList.sort((a, b) => a.contact_name.localeCompare(b.contact_name)) : filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.contact_id}
      />
      <FAB
        size="medium"
        icon="plus"
        onPress={() => { navigation.navigate('Create contact') }}
        style={styles.fab}
      />
    </View>
  )
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
