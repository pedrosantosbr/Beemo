import React, { useState, useEffect } from 'react';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Message from './Message';
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import Avatar from '../../components/avatar';
const fullWidth = Dimensions.get('window').width;

const Chat = ({ props }) => {

  const [formData, setFormData] = useState({
    activIndicator: false,
    messageText: '',
    user: {
      id: 1
    },
    history: [
      {
        id: 'afj3129*34',
        sender_id: 2,
        body: 'Fico no aguardo.',
        date_sent: new Date(),
        send_state: 2
      },
      {
        id: 'afuu129*34',
        sender_id: 2,
        body: 'Quero sim, por favor',
        date_sent: new Date(),
        send_state: 2
      },
      {
        id: 'afjg129*34',
        sender_id: 1,
        body: 'Quer que envie a localização?',
        date_sent: new Date(),
        send_state: 2
      },
      {
        id: 'af2d129*34',
        sender_id: 1,
        body: 'Além do hamburguer, uma cocacola 2L',
        date_sent: new Date(),
        send_state: 2
      },
      {
        id: 'afjd129*14',
        sender_id: 1,
        body: 'Gostaria de pedir um X egg bacon, por favor.',
        date_sent: new Date(),
        send_state: 2
      },
      {
        id: 'adk129*14',
        sender_id: 2,
        body: 'Boa noite, o que gostaria de pedir?',
        date_sent: new Date(),
        send_state: 1,
      },
      {
        id: 'adk109*14',
        sender_id: 1,
        body: 'Boa noite, gostaria de fazer um pedido.',
        date_sent: new Date(),
        send_state: 3
      },
    ]
  });

  const needToGetMoreMessage = null;

  const getMoreMessages = () => { }

  const onTypeMessage = messageText => setFormData({ ...formData, messageText })

  const sendMessage = async () => {
    let { history, messageText } = formData
    history.push({
      id: 'adk102*14',
      sender_id: 1,
      body: messageText,
      date_sent: new Date(),
      send_state: 3
    }, )
    setFormData({ ...formData, history, messageText: '' })
  }

  const sendAttachment = () => { }

  const _renderMessageItem = (message) => {
    const { user } = formData
    const isOtherSender = message.sender_id !== user.id ? true : false
    return (
      <Message otherSender={isOtherSender} message={message} key={message.id} />
    )
  }

  const _keyExtractor = (item, index) => index.toString()

  const { messageText, activIndicator, history } = formData

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}>
      <StatusBar barStyle="dark-content" />
      {activIndicator &&
        (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )
      }
      <FlatList
        data={history}
        inverted
        keyExtractor={_keyExtractor}
        renderItem={({ item }) => _renderMessageItem(item)}
        onEndReachedThreshold={5}
        onEndReached={getMoreMessages}
      />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <AutoGrowingTextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="grey"
            value={messageText}
            onChangeText={onTypeMessage}
            maxHeight={170}
            minHeight={30}
            enableScrollToCaret
          />
          <TouchableOpacity style={styles.button}>
            <Icon name="send" size={22} color="#fff" onPress={sendMessage} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

Chat.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Text numberOfLines={3} style={{ fontSize: 22, color: 'black' }}>
        Pedro
      </Text>
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => goToDetailsScreen(navigation)}>
        <Avatar
          photo={{ uri: 'https://s.gravatar.com/avatar/e6d8a87880d0588818e1586943c6eee1?s=80' }}
          name='pedro'
          iconSize="small"
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: 25,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: 'black',
    paddingRight: 20,

  },
  button: {
    width: 35,
    height: 35,
    borderRadius: 30,
    backgroundColor: '#53D769',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachment: {
    width: 40,
    height: 50,
    position: 'absolute',
    right: 5,
    bottom: 0,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 7,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 3,
      width: 0,
    },
    elevation: 2,
    backgroundColor: 'whitesmoke',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 7 : 10,
  }
});

export default Chat
