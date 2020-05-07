import BeemoApp from '~/Beemo/lib/beemoMain'
import Message from '~/models/message'
import store from '~/store'
import Database from '~/Database'
import DialogRepository from '~/repositories/dialog-repository'
import { sortDialogs, addNewDialog, fetchDialogs } from '../actions/dialogs'
import { pushMessage } from '../actions/messages'
import Dialog from '~/models/dialog';
class ChatService {
  setUpListeners() {
    BeemoApp.chat.onMessageListener = this.onMessageListener.bind(this)
  }

  fetchDialogsFromDatabase() {
    const dialogs = []

    Database.shared.realm.objects('Dialog').forEach((elem) => {
      let dialog = new Dialog(elem)
      dialogs.push(dialog)
    })

    store.dispatch(fetchDialogs(dialogs))
  }

  onMessageListener(msg) {
    const message = new Message(msg)
    const user = this.currentUser
    const dialog = this.getSelectedDialog()

    if (message.sender_id !== user.id) {
      if (!message.dialog_id || message.dialog_id === null) {
        const newDialog = DialogRepository.create(message)
        store.dispatch(addNewDialog(newDialog))
        store.dispatch(pushMessage(message, newDialog.id))
        return;
      }

      if (dialog === message.dialog_id) {
        return
      } else {
        store.dispatch(sortDialogs(message, true))
        store.dispatch(pushMessage(message, message.dialog_id))
      }
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
