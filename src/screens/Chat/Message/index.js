import React, { useEffect, useState } from 'react';
import MessageSendState from '~/components/messageSendState';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import { getTime } from '~/helpers/getTime';

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const Message = ({ navigation, otherSender, message }) => {
  let containerPosition = otherSender ? 'flex-start' : 'flex-end'

  return (
    <View>
      {otherSender ?
        (
          <View style={[styles.container, { justifyContent: 'flex-start' }]}>
            <View style={[styles.message, styles.leftMessage]}>
              <Text style={[styles.messageText, styles.leftMessageText]}>
                {message.body || ''}
              </Text>
              <Text style={styles.dateSent}>
                {getTime(message.date_sent)}
              </Text>
            </View>
          </View>
        ) :
        (
          <View style={[styles.container, { justifyContent: 'flex-end' }]}>
            <View style={[styles.message, styles.rightMessage]}>
              <Text style={[styles.rightMessageText, styles.messageText]}>
                {message.body || ''}
              </Text>
              <View style={styles.rightDateSent}>
                <Text style={[styles.dateSent, { color: '#389046' }]}>
                  {getTime(message.date_sent)}
                </Text>
                <MessageSendState send_state={message.send_state} />
              </View>
            </View>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 3,
    flexDirection: 'row',
    marginBottom: 2,
  },
  message: {
    padding: 10,
    borderRadius: 18,
    alignItems: 'flex-end',
    maxWidth: fullWidth * .7,
  },
  leftMessage: {
    backgroundColor: '#E4E4E2',
  },
  rightMessage: {
    backgroundColor: '#53D769',
  },
  messageText: {
    fontSize: 16
  },
  leftMessageText: {
    color: '#292929',
  },
  rightMessageText: {
    color: '#fff',
    alignSelf: 'flex-start',
  },
  dateSent: {
    color: 'grey',
    marginLeft: 3,
    alignSelf: 'flex-end',
    fontSize: 12,
  },
  rightDateSent: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
})

export default Message
