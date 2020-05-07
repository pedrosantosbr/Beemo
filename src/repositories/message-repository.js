import Database from '~/Database'
import Message from '~/models/message'

exports.createOrUpdate = (message) => {
  Database.shared.realm.write(() => {
    Database.shared.realm.create('Message', message, 'modified')
  })
}

exports.loadMessages = (dialogId, limit) => {
  let messages = Database
    .shared.realm
    .objects('Message')
    .filtered(`dialog_id = $0 SORT(date_sent ASC) LIMIT(${limit})`, dialogId)

  console.log(messages)
  return messages
}
