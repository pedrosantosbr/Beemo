import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getTime } from '../../../helpers/getTime';

const RightMessage = ({ message }) => {
  return (
    <>
      <Text style={styles.messageText}>
        {message.body || ''}
      </Text>
      <View>
        {/* <Text style={styles.dateSent}>
          {getTime(message.date_sent)}
        </Text> */}
        <MessageSendState send_state={message.send_state} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  messageText: {
    color: '#fff',
    fontSize: 16
  },
  dateSent: {
    fontSize: 12,
    color: '#fff'
  }
})

export default RightMessage
