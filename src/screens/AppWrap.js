import React, { Component, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ChatService from '~/services/chat-service';
import AuthService from '~/services/auth-service';
import Database from '~/Database';

export default class AppWrap extends Component {

  constructor(props) {
    super(props)
    this.initUser()
  }

  initUser = async () => {
    const { navigation } = this.props
    const rootStackScreen = await AuthService.init()
    if (rootStackScreen === 'Dialogs') {
      ChatService.setUpListeners()
      await Database.shared.init()
    }
    navigation.navigate(rootStackScreen)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Beemo App</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSize: {
    width: 200,
    height: 150
  },
})
