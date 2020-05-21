import BeemoApp from '~/Beemo/lib/beemoMain'
import Message, { FakeMessage } from '~/models/message'
import store from '~/store'
import Database from '~/Database'
import DialogRepository from '~/repositories/dialog-repository'
import MessageRepository from '~/repositories/message-repository'
import { sortDialogs, addNewDialog, fetchDialogs } from '../actions/dialogs'
import { fetchMessages } from '../actions/messages'
import { selectDialog, unselectDialog } from '~/actions/selectedDialog'
import { pushMessage } from '../actions/messages'
import Dialog from '~/models/dialog'
import { v5 as uuidv5 } from 'uuid';

const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

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

  async onMessageListener(senderId, msg) {
    const message = new Message(msg)
    console.log('ChatService line 43', message)
    const user = this.currentUser
    const dialog = this.getSelectedDialog()

    if (senderId !== user.id) {
      if (dialog === message.dialog_id) {
        store.dispatch(sortDialogs(message))
      } else {
        store.dispatch(sortDialogs(message, true))
      }
      MessageRepository.create(message)
      store.dispatch(pushMessage(message, message.dialog_id))
    }
  }

  async sendMessage(dialog, messageText) {
    const user = this.currentUser
    const text = messageText.trim()
    const date = Math.floor(Date.now() / 1000)

    let msg = {
      id: uuidv5(text, MY_NAMESPACE),
      type: 'chat',
      body: text,
      extension: {
        save_to_history: 1,
        dialog_id: dialog.id || null,
        sender_id: user.id,
        date_sent: date,
      },
      markable: 1
    }

    const message = new FakeMessage(msg)
    store.dispatch(pushMessage(message, dialog.id))
    await BeemoApp.chat.send(dialog.user_id, msg)
    store.dispatch(sortDialogs(message))
  }

  createDialog(userId) {
    console.log('chegou aqui', userId)
    let newDialog = new Dialog({ user_id: userId })
    store.dispatch(addNewDialog(newDialog))
    DialogRepository.createOrUpdate(newDialog)
    return newDialog
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
