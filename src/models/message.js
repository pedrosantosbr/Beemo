import DialogRepository from '~/repositories/dialog-repository';

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
}

export default class Message {
  constructor(msg = defaultMessage, currentUser) {
    this.id = msg.id || msg._id
    this.body = msg.body || msg.message
    this.sender_id = msg.sender_id
    this.dialog_id = msg.dialog_id || (msg.extension && msg.extension.dialog_id)
    this.send_state = msg.send_state || 0
    this.date_sent = msg.date_sent || (msg.extension && msg.extension.date_sent) || Math.floor(Date.now() / 1000)
  }

  static schema = {
    name: 'Message',
    primaryKey: 'id',
    properties: {
      id: { type: 'string', indexed: true },
      dialog_id: 'string',
      sender_id: 'int',
      body: 'string',
      date_sent: 'int',
      send_state: { type: 'int?', default: 0 }
    }
  }
}
export class FakeMessage {
  constructor(msg) {
    this.id = msg.id
    this.body = msg.body
    this.date_sent = msg.extension.date_sent
    this.dialog_id = msg.extension.dialog_id
    this.send_state = 0
    this.sender = undefined
    this.sender_id = msg.extension.sender_id
  }
}
