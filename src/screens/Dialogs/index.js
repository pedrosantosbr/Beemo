import React, { useState, useEffect } from 'react'
import { View, FlatList, StatusBar, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import store from '~/store'
import ChatService from '~/services/chat-service'
import Dialog from './Dialog'


const Dialogs = ({ navigation, dialogs }) => {
  const [dialogsList, setDialogsList] = useState(dialogs)
  useEffect(() => {
    setDialogsList(dialogs)
  }, [dialogs])

  keyExtractor = (item, index) => index.toString();

  _renderDialog = ({ item }) => {
    return (
      <Dialog dialog={item} navigation={navigation} />
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      {dialogsList.length > 0 &&
        <FlatList
          data={dialogsList}
          keyExtractor={this.keyExtractor}
          renderItem={(item) => this._renderDialog(item)}
        />}
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

const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(Dialogs)
