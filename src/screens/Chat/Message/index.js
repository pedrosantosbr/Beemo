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
import LeftMessage from '~/screens/Chat/Message/LeftMessage';
import RightMessage from '~/screens/Chat/Message/RightMessage';

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const Message = ({ navigation, otherSender, message }) => {
  let mv = otherSender ? 10 : 2

  return (
    <View style={[{ marginVertical: mv }, styles.container, (otherSender ? styles.positionToLeft : styles.positionToRight)]}>
      <View style={[styles.bubble, (otherSender ? styles.leftBubble : styles.rightBubble)]}>
        {otherSender ?
          (
            <LeftMessage message={message} />
          ) :
          (
            <RightMessage message={message} />
          )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: fullWidth,
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  bubble: {
    padding: 10,
    borderRadius: 18,
    maxWidth: fullWidth * .6,
  },
  positionToRight: {
    justifyContent: 'flex-end'
  },
  positionToLeft: {
    justifyContent: 'flex-start'
  },
  leftBubble: {
    backgroundColor: '#E4E4E2',
  },
  rightBubble: {
    backgroundColor: '#53D769',
  }
})

export default Message
