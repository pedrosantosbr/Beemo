import { v5 as uuidv5 } from 'uuid';

const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
export default class Dialog {
  constructor(dialog = defaultDialog) {
    this.id = uuidv5(dialog.user_id, MY_NAMESPACE)
    this.user_id = dialog.user_id
    this.updated_date = dialog.updated_at || Date.now()
    this.last_message_date_sent = dialog.last_message_date_sent || dialog.updated_at
    this.last_message = dialog.last_message || ''
    this.last_message_id = dialog.last_message_id
    this.unread_messages_count = dialog.unread_messages_count || 1
    this.unread_messages_ids = dialog.unread_messages_ids
  }

  static schema = {
    name: 'Dialog',
    primaryKey: 'id',
    properties: {
      id: { type: 'string', indexed: true },
      user_id: 'string',
      updated_date: 'int',
      last_message: 'string?',
      last_message_id: 'string?',
      last_message_date_sent: 'int?',
      unread_messages_count: 'int?',
      unread_messages_ids: 'string?[]'
    }
  }
}
