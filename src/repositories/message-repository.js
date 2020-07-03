import Database from '~/Database'

exports.create = (message) => {
  Database.shared.realm.write(() => {
    Database.shared.realm.create('Message', {
      id: message.id,
      body: message.body,
      dialog_id: message.dialog_id,
      sender_id: parseInt(message.sender_id),
      date_sent: parseInt(message.date_sent),
      send_state: parseInt(message.send_state)
    })
  })
}

exports.update = (message) => {
  Database.shared.realm.write(() => {
    Database.shared.realm.create('Message', { ...message }, 'modified')
  })
}

exports.loadMessages = (dialogId, limit) => {
  let messages = Database
    .shared.realm
    .objects('Message')
    .filtered(`dialog_id = $0 SORT(date_sent DESC) LIMIT(${limit})`, dialogId)

  return messages
}
