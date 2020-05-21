import React from 'react';
import store from '~/store';
import ChatService from '~/services/chat-service';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const ContactsList = ({ contacts, navigation, setModalVisible }) => {
  const goToChat = (contact) => {
    const dialogs = store.getState().dialogs;
    const userId = contact.phoneNumbers[0].number;
    let dialog = undefined;

    dialogs.map((elem) => {
      if (elem.user_id == userId) {
        dialog = elem;
      }
    });

    if (!dialog || dialog == undefined) {
      ChatService
        .createDialog(userId)
        .then(newDialog => {
          console.log('novo dialogo criado', newDialog)
          navigation.navigate('Chat', { dialog: newDialog });
        });
    } else {
      navigation.navigate('Chat', { dialog });
    }

    setModalVisible(false);
  }
  return (
    <View>
      {contacts.map((contact, index) => (
        <TouchableOpacity key={index} onPress={() => goToChat(contact)}>
          <View style={styles.contact}>
            <Text>{contact.givenName} - <Text> {contact.phoneNumbers[0].number} </Text></Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  contact: {
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: 'lightgrey'
  }
})

export default ContactsList

