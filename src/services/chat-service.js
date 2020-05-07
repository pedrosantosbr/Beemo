import BeemoApp from '~/Beemo/lib/beemoMain'
import Message from '~/models/message'
import store from '~/store'
import Database from '~/Database'
import DialogRepository from '~/repositories/dialog-repository'
import MessageRepository from '~/repositories/message-repository'
import { sortDialogs, addNewDialog, fetchDialogs } from '../actions/dialogs'
import { fetchMessages } from '../actions/messages'
import { selectDialog, unselectDialog } from '~/actions/selectedDialog'
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

  getMessages(dialog) {
    this.setSelectedDialog(dialog.id)
    if (dialog.unread_messages_count > 0) {
      let messages = MessageRepository.loadMessages(dialog.id, 30)
      store.dispatch(fetchMessages(dialog.id, messages))
    }
    return
  }

  async onMessageListener(msg) {
    const message = new Message(msg)
    const user = this.currentUser
    const dialog = this.getSelectedDialog()

    if (message.sender_id !== user.id) {
      if (!message.dialog_id || message.dialog_id === null) {
        const newDialog = await DialogRepository.create(message)
        console.log('DIALOG ID', newDialog.id)
        MessageRepository.createOrUpdate({ ...message, dialog_id: newDialog.id })
        store.dispatch(addNewDialog(newDialog))
        store.dispatch(pushMessage(message, newDialog.id))
        return;
      }

      if (dialog === message.dialog_id) {
        return
      } else {
        MessageRepository.createOrUpdate(message)
        store.dispatch(sortDialogs(message, true))
        store.dispatch(pushMessage(message, message.dialog_id))
      }
    }
  }

  async sendMessage(dialog, message) {
    const user = this.currentUser
    const text = message.trim()
    const date = Date.now()

    let msg = {
      type: 'chat',
      body: text,
      extension: {
        save_to_history: 1,
        dialog_id: dialog.id,
        sender_id: user.id,
        date_sent: date,
      },
      markable: 1
    }

  }

  getSelectedDialog = () => {
    return store.getState().selectedDialog
  }

  setSelectedDialog = (dialogId) => {
    store.dispatch(selectDialog(dialogId))
  }

  resetSelectedDialog() {
    store.dispatch(unselectDialog())
  }

  get currentUser() {
    return store.getState().currentUser
  }
}

const chatService = new ChatService()
Object.freeze(chatService)
export default chatService
