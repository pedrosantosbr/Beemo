import BeemoApp from '~/Beemo/lib/beemoMain'
import Message from '~/models/message'
import Dialog from '~/models/dialog'
import store from '~/store'
import { sortDialogs, addNewDialog } from '../actions/dialogs'
import { pushMessage } from '../actions/messages'
import { v4 as uuidv4 } from 'uuid';

import AsyncStorage from '@react-native-community/async-storage';

class ChatService {
  setUpListeners() {
    BeemoApp.chat.onMessageListener = this.onMessageListener.bind(this)
  }

  onMessageListener(msg) {
    const message = new Message(msg)
    const user = this.currentUser
    const dialog = this.getSelectedDialog()

    if (message.sender_id !== user.id) {
      if (!message.dialog_id) {
        const newObj = {
          id: uuidv4(),
          last_message: message.body,
          last_message_date_sent: message.date_sent,
          updated_date: message.date_sent,
          unread_messages_count: 1,
          user_id: message.sender_id,
        }

        const newDialog = new Dialog(newObj)
        store.dispatch(addNewDialog(newDialog))
        store.dispatch(pushMessage(message, newDialog.id))
        return;
      }

      if (dialog === message.dialog_id) {
        return
      } else {
        store.dispatch(sortDialogs(message, true))
      }

      store.dispatch(pushMessage(message, message.dialog_id))
    }
  }

  getSelectedDialog() {
    return null;
  }

  get currentUser() {
    return store.getState().currentUser
  }
}

const chatService = new ChatService()
Object.freeze(chatService)
export default chatService
