import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getTime } from '../../../helpers/getTime';

const LeftMessage = ({ message }) => {
  return (
    <>
      <Text style={styles.messageText}>
        {message.body || ' '}
      </Text>
      {/* <Text style={styles.dateSent}>
        {getTime(message.date_sent)}
      </Text> */}
    </>
  )
}

const styles = StyleSheet.create({
  messageText: {
    color: '#292929',
    fontSize: 16
  },
  dateSent: {
    fontSize: 12,
    color: '#292929'
  }
})

export default LeftMessage
