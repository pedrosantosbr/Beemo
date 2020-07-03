import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  Modal,
  FlatList,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';
import ChatService from '~/services/chat-service'
import Dialog from './Dialog'
import Contacts from 'react-native-contacts'
import ContactList from '~/screens/Contacts'

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const Dialogs = ({ navigation, dialogs }) => {
  console.log('LIST OF DIALOGS', dialogs)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    function loadDialogs() {
      ChatService.fetchDialogsFromDatabase()
    }

    loadDialogs()
  }, [])

  const keyExtractor = (item, index) => index.toString();

  const _renderDialog = ({ item }) => {
    return (
      <Dialog dialog={item} navigation={navigation} />
    )
  }

  const openContactList = () => {
    Contacts.getAll((err, contacts) => {
      if (err) {
        throw err;
      }
      this.contacts = contacts
      setModalVisible(true)
    })
  }

  return (
    <View style={styles.container}>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>Nova conversa</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: 'rgb(0, 164, 219)' }}>cancelar</Text>
              </TouchableOpacity>
            </View>
            <ContactList setModalVisible={setModalVisible} navigation={navigation} contacts={this.contacts} />
          </View>
        </View>
      </Modal>

      <View style={styles.options}>
        <TouchableOpacity onPress={openContactList}>
          <Text style={styles.btnOptions}>
            Nova Conversa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.btnOptions}>Criar Grupo</Text>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle={'dark-content'} />
      <FlatList
        data={dialogs}
        keyExtractor={keyExtractor}
        renderItem={(item) => _renderDialog(item)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  modalView: {
    backgroundColor: 'white',
    width: fullWidth,
    height: fullHeight,
    paddingVertical: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
  },
  modalDivider: {
    backgroundColor: '#e3e3e3',
    paddingVertical: 10
  },
  modalTextDivider: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 14,
    padding: 5
  },
  options: {
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnOptions: {
    color: 'rgb(0, 164, 219)'
  }
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
