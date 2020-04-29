export default class Dialog {
  constructor(dialog = defaultDialog) {
    this.id = dialog._id || dialog.id
    this.user_id = dialog.user_id
    this.updated_date = Date.parse(dialog.updated_at) || Date.now()
    this.last_message_date_sent = dialog.last_message_date_sent || Date.parse(dialog.updated_at) / 1000 || Date.parse(dialog.created_at) / 1000
    this.last_message = dialog.last_message || ''
    this.last_message_id = dialog.last_message_id
    this.last_message_user_id = dialog.last_message_user_id
    this.unread_messages_count = dialog.unread_messages_count
    this.unread_messages_ids = dialog.unread_messages_ids
  }
}
