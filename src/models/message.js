export const STATUS_PENDING = 0
export const STATUS_SENT = 1
export const STATUS_DELIVERED = 2
export const STATUS_READ = 3

const defaultMessage = {
  id: '',
  body: '',
  dialog_id: '',
  date_sent: Math.floor(Date.now() / 1000),
  sender_id: null,
  sender: null
}

export default class Message {
  constructor(msg = defaultMessage) {
    this.id = msg.id || msg._id
    this.body = msg.body || msg.message
    this.dialog_id = msg.dialog_id
    this.date_sent = msg.date_sent || (msg.extension && msg.extension.date_sent) || Math.floor(Date.now() / 1000)
    // this.send_state = Message.getSendState(msg, currentUser)
    this.sender_id = msg.sender_id || (msg.extension && msg.extension.sender_id)
    this.sender = msg.sender_id
  }

  static getSendState(msg, currentUser) {
    // if (msg ?.read_ids ?.find(_id => _id !== currentUser)) {
    //   return STATUS_READ
    // }
    // if (msg ?.delivered_ids ?.find(msg => msg.delivered_ids !== currentUser)) {
    //   return STATUS_DELIVERED
    // }
    return STATUS_PENDING
  }

}

export class FakeMessage {
  constructor(msg) {
    this.attachment = msg.extension.attachments
    this.body = msg.body
    this.date_sent = msg.extension.date_sent
    this.dialog_id = msg.extension.dialog_id
    this.id = msg.id
    this.send_state = 0
    this.sender = undefined
    this.sender_id = msg.extension.sender_id
  }
}
