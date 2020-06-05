import BeemoApp from '~/Beemo/lib/beemoMain'
import { AppState } from 'react-native'
import Message, { FakeMessage } from '~/models/message'
import store from '~/store'
import Database from '~/Database'
import DialogRepository from '~/repositories/dialog-repository'
import MessageRepository from '~/repositories/message-repository'
import { sortDialogs, addNewDialog, fetchDialogs, updateDialog } from '../actions/dialogs'
import { fetchMessages } from '../actions/messages'
import { selectDialog, unselectDialog } from '~/actions/selectedDialog'
import { pushMessage } from '../actions/messages'
import Dialog from '~/models/dialog'
import { v5 as uuidv5 } from 'uuid';

const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

class ChatService {
  setUpListeners() {
    BeemoApp.chat.onMessageListener = this.onMessageListener.bind(this)
    BeemoApp.chat.onSentMessageCallback = this.onSentMessageListener.bind(this)
    BeemoApp.chat.onDeliveredStatusListener = this.onDeliveredStatus.bind(this)
    BeemoApp.chat.onReadStatusListener = this.onReadStatus.bind(this)
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  fetchDialogsFromDatabase() {
    const dialogs = []

    Database.shared.realm.objects('Dialog').forEach((elem) => {
      console.log(elem)
      let dialog = new Dialog(elem)
      dialogs.push(dialog)
    })

    store.dispatch(fetchDialogs(dialogs))
  }

  updateDialogsUnreadMessagesCount = (dialog) => {
    const updateObj = Object.assign(dialog, { unread_messages_count: 0 })
    store.dispatch(updateDialog(updateObj))
    return true
  }

  async getMessages(dialog) {
    this.setSelectedDialog(dialog.id)
    const user = this.currentUser
    const isAlredyUpdate = this.getMessagesByDialogId(dialog.id)
    let amountMessages = null

    if (
      !dialog.isAlreadyMessageFetch ||
      dialog.unread_messages_count > 0 && !dialog.isAlreadyMessageFetch
    ) {
      console.log('first entry')
      const historyFromDatabase = await MessageRepository.loadMessages(dialog.id, 15)
      const messages = historyFromDatabase.map(elem => (new Message(elem, user.id)))
      const newObj = Object.assign(dialog, { isAlreadyMessageFetch: true })

      this.updateDialogsUnreadMessagesCount(newObj)
      store.dispatch(fetchMessages(dialog.id, messages))
      amountMessages = messages.length

    } else {
      console.log('second entry')
      // If the second entry into the chat
      if (dialog.unread_messages_count > 0) {
        const firstUnreadMsg = messages[dialog.unread_messages_count - 1]
        console.log()
        store.dispatch(fetchMessages(dialog.id, isAlredyUpdate))
        this.updateDialogsUnreadMessagesCount(dialog)
      }
      amountMessages = isAlredyUpdate.length
    }

    return amountMessages
  }

  onMessageListener(senderId, msg) {
    const message = new Message(msg, senderId)
    const selectedDialog = this.getSelectedDialog() === senderId

    if (selectedDialog) {
      this.readMessage(message.id, message.dialog_id)
      this.sendReadStatus(msg.extension.message_id, msg.extension.sender_id, msg.dialog_id)
    }

    MessageRepository.create(message)
    store.dispatch(sortDialogs(message, !selectedDialog))
    store.dispatch(pushMessage(message, message.dialog_id))
  }

  async sendMessage(dialog, messageText) {
    const user = this.currentUser
    const text = messageText.trim()
    const date = Math.floor(Date.now() / 1000)

    let msg = {
      type: 'chat',
      body: text,
      extension: {
        save_to_history: 1,
        sender_id: user.id,
        dialog_id: dialog.id,
        date_sent: date,
      },
      markable: 1
    }

    msg.id = this.messageUniqueId

    const message = new FakeMessage(msg)
    store.dispatch(pushMessage(message, dialog.id))
    store.dispatch(sortDialogs(message))
    await BeemoApp.chat.send(dialog.user_id, msg)
    MessageRepository.create(message)
  }

  async createDialog(recipientId, message = null) {
    console.log('NEW ID', this.generateDialogId(recipientId))
    payload = {
      id: this.generateDialogId(recipientId),
      user_id: recipientId,
    }

    if (message && message != null) {
      payload.unread_messages_count = 1
      payload.last_message = message.body
      payload.last_messag_id = message.id
      payload.last_message_date_sent = message.date_sent
    }

    let newDialog = await DialogRepository.createOrUpdate(payload)
    store.dispatch(addNewDialog(newDialog))
    return newDialog
  }

  async readMessage(messageId, dialogId) {
    this.onReadStatus(messageId, dialogId)
    // return MessageRepository.update(null, {
    //   id: messageId,
    //   read: 1
    // })
  }

  handleAppStateChange = (AppState) => {
    if (AppState === 'active') {
      ConnectyCube.chat.markActive()
    } else {
      ConnectyCube.chat.markInactive()
    }
  }

  // ConnectyCube listeners
  onSentMessageListener(failedMessage, msg) {
    if (failedMessage) {
      return
    }
    store.dispatch(updateMessages(msg.extension.dialog_id, msg.id, { send_state: STATUS_SENT }))
  }

  onDeliveredStatus(messageId, dialogId, userId) {
    store.dispatch(updateMessages(dialogId, messageId, { send_state: STATUS_DELIVERED }))
  }

  // Beemo listeners
  onReadStatus(messageId, dialogId, userId) {
    store.dispatch(updateMessages(dialogId, messageId, { send_state: STATUS_READ }))
  }

  sendReadStatus(messageId, userId, dialogId) {
    BeemoApp.chat.sendReadStatus({ messageId, userId, dialogId })
  }

  sendDeliveredStatus(messageId, userId, dialogId) {
    BeemoApp.chat.sendDeliveredStatus({ messageId, userId, dialogId })
  }

  pushMessageToStore(userId, messages) {
    store.dispatch(pushMessage(userId, messages.map(message => new Message(message))))
  }

  getDialog(userId) {
    return store.getState().dialogs.find(elem => elem.id === userId)
  }

  getMessagesByDialogId(dialogId) {
    const result = store.getState().messages
    return result[dialogId]
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

  get messageUniqueId() {
    return BeemoApp.chat.helpers.getBsonObjectId()
  }

  generateDialogId(id) {
    let x = Math.floor(parseInt(id) / 9)
    let y = Math.floor(parseInt(this.currentUser.id) / 9)
    let result = Math.floor(x * y / 1000)
    let dialogId = `${result.toString(16)}${result}`

    return dialogId
  }
}

const chatService = new ChatService()
Object.freeze(chatService)
export default chatService
