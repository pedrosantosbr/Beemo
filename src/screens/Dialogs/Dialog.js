import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import Avatar from '../../components/avatar';
import DialogTitle from './DialogTitle';
import DialogLastDate from './DialogLastDate';
import DialogUnreadCounter from './DialogUnreadCount';

const Dialog = ({ dialog, navigation }) => {
  const getOccupants = async () => {
    navigation.navigate('Chat', { dialog })
  }

  return (
    <TouchableOpacity onPress={() => getOccupants()}>
      <View style={styles.container}>
        <Avatar
          photo={dialog.avatar}
          name='pedro'
          iconSize='large'
        />
        <View style={styles.dialog}>
          <DialogTitle name={dialog.user_id} message={dialog.last_message} />
          <View style={styles.infoContainer}>
            <DialogLastDate
              lastDate={dialog.last_message_date_sent}
              lastMessage={dialog.last_message}
              updatedDate={dialog.updated_date}
            />
            <DialogUnreadCounter
              unreadMessagesCount={dialog.unread_messages_count}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  dialog: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    borderBottomColor: 'lightgrey'
  },
  infoContainer: {
    maxWidth: 75,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: 5,
    marginLeft: 5
  }
});

export default Dialog;
