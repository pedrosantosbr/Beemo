import Database from '~/Database'
import Message from '~/models/message'

exports.create = (message) => {
  console.log('mensagem a ser criada', new Date(message.date_sent * 1000))
  Database.shared.realm.write(() => {
    Database.shared.realm.create('Message', {
      id: message.id,
      body: message.body,
      sender_id: message.sender_id,
      date_sent: new Date(message.date_sent * 1000),
      dialog_id: message.dialog_id
    })
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
