import React from 'react'
import { View, FlatList, StatusBar, Text, StyleSheet } from 'react-native'
import Dialog from './Dialog'

const Dialogs = ({ navigation }) => {

  const dialogs = [{
    title: 'Pedro Henrique',
    message: 'Precisamos conversar...',
    last_message: new Date(),
    last_date: new Date(),
    updated_date: new Date(),
    unread_messages_count: 2
  },
  {
    title: 'Carlos Henrique',
    message: 'fala aê.',
    last_message: new Date(),
    last_date: new Date(),
    updated_date: new Date(),
    unread_messages_count: 1
  }]

  keyExtractor = (item, index) => index.toString();

  _renderDialog = ({ item }) => {
    return (
      <Dialog dialog={item} navigation={navigation} />
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <FlatList
        data={dialogs}
        keyExtractor={this.keyExtractor}
        renderItem={(item) => this._renderDialog(item)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Dialogs.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Text style={[
        { fontSize: 22, color: 'black', fontWeight: 'bold' },
        Platform.OS === 'android' ?
          { paddingLeft: 13 } :
          { paddingLeft: 0 }]}>
        Mensagens
      </Text>
    ),
  }
}

export default Dialogs
