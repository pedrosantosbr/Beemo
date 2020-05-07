import Database from '~/Database'
import Dialog from '~/models/dialog'

exports.create = (message) => {
  if (!message) return

  const dialog = new Dialog({
    last_message: message.body,
    last_message_id: message.id,
    last_message_date_sent: message.date_sent,
    updated_date: message.date_sent,
    user_id: message.sender_id,
  })

  try {
    Database.shared.realm.write(() => {
      Database.shared.realm.create('Dialog', dialog)
    })
    return dialog
  } catch (e) {
    console.warn(e)
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
