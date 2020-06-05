import { v5 as uuidv5 } from 'uuid';

const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
export default class Dialog {
  constructor(dialog) {
    this.id = dialog.id
    this.user_id = dialog.user_id
    this.updated_date = Date.parse(dialog.updated_at) || Date.now()
    this.last_message = dialog.last_message || null
    this.last_message_id = dialog.last_message_id || null
    this.last_message_date_sent = dialog.last_message_date_sent || Math.floor(dialog.updated_at / 1000) || null
    this.unread_messages_ids = dialog.unread_messages_ids || []
    this.unread_messages_count = dialog.unread_messages_count || 0
  }

  static schema = {
    name: 'Dialog',
    primaryKey: 'id',
    properties: {
      id: { type: 'string', indexed: true },
      user_id: 'int',
      updated_at: 'date',
      last_message: 'string?',
      last_message_id: 'string?',
      last_message_date_sent: 'int?',
      unread_messages_count: 'int?',
      unread_messages_ids: 'string?[]'
    }
  }
}
