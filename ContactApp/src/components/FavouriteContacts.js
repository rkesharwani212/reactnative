/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eol-last */
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Avatar, List, Searchbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'ContactDatabase.db' });

const FavouriteContacts = () => {
    const [favouriteContacts, setFavouriteContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const renderItem = ({ item }) => (
        <List.Item
            title={item.contact_name}
            description={item.contact_number}
            left={() => (
                <Avatar.Image style={{ margin: 5 }}
                    source={{ uri: item.contact_image_path }}
                    size={40}
                />
            )}
        />
    );
    const getData = () => {
        db.transaction(txn => {
            txn.executeSql('SELECT * FROM table_contact WHERE isFav=?', [1], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    //console.log(results.rows.item(i))
                    temp.push(results.rows.item(i));
                }
                setFavouriteContacts(temp);
            });
        });
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredData = favouriteContacts.filter((contact) =>
            contact.contact_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredContacts(filteredData.sort((a, b) => a.contact_name.localeCompare(b.contact_name)));
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Searchbar
                placeholder="Search"
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={searchQuery.trim() === '' ? favouriteContacts.sort((a, b) => a.contact_name.localeCompare(b.contact_name)) : filteredContacts}
                renderItem={renderItem}
                keyExtractor={(item) => item.contact_id}
            />
        </View>
    );
};

export default FavouriteContacts;