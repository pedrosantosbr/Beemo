import React from 'react';
import store from '~/store';
import ChatService from '~/services/chat-service';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const ContactsList = ({ contacts, navigation, setModalVisible }) => {
  const goToChat = async (contact) => {
    const dialogs = store.getState().dialogs;
    const userId = contact.phoneNumbers[0].number;
    let dialog = undefined;

    dialogs.map((elem) => {
      if (elem.user_id == userId) {
        dialog = elem;
      }
    });

    setModalVisible(false)

    if (!dialog || dialog == undefined) {
      const newDialog = await ChatService.createDialog(userId)
      navigation.navigate('Chat', { dialog: newDialog })
      return
    }
    navigation.navigate('Chat', { dialog });
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

