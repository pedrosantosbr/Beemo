import Database from '~/Database'
import Dialog from '~/models/dialog'

exports.createOrUpdate = (payload) => {
  const dialog = new Dialog(payload)

  try {
    Database.shared.realm.write(() => {
      Database.shared.realm.create('Dialog', {
        id: dialog.id,
        user_id: parseInt(dialog.user_id),
        last_message: dialog.last_message,
        last_message_id: dialog.last_message_id,
        last_message_date_sent: parseInt(dialog.last_message_date_sent) || null,
        unread_messages_count: dialog.unread_messages_count,
        unread_messages_ids: dialog.unread_messages_ids,
        updated_at: new Date(dialog.updated_date)
      }, 'modified')
    })
    return dialog
  } catch (e) {
    console.warn('erro em dialog repository', e);
    return null
  }
}

exports.update = (dialog) => {
  try {
    Database.shared.realm.write(() => {
      Database.shared.realm.create('Dialog', dialog, 'modified')
    })
    return dialog
  } catch (e) {
    console.warn(e)
  }
}


exports.getDialogBySenderId = (id) => {
  let results = Database.shared.realm
    .objects('Dialog')
    .filtered('user_id == $0', id)

  if (results.length == 0) {
    return null
  }

  return results[0]
}
