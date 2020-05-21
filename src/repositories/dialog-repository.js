import Database from '~/Database'

exports.createOrUpdate = (d) => {
  try {
    Database.shared.realm.write(() => {
      Database.shared.realm.create('Dialog', {
        id: d.id,
        user_id: d.user_id,
        updated_at: new Date(d.updated_date * 1000),
        last_message: d.last_message,
        last_message_id: d.last_message_id,
        last_message_date_sent: new Date(d.last_message_date_sent * 1000),
        unread_messages_count: d.unread_messages_count,
        unread_messages_ids: d.unread_messages_ids
      }, 'modified')
    });
  } catch (e) {
    console.warn('erro em dialog repository', e);
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
