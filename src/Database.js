const Realm = require('realm')
import Dialog from '~/models/dialog'
import Message from '~/models/message'
import User from '~/models/user'

class Database {
  constructor() {
    this.realm = null
  }

  init = async () => {
    try {
      Realm.open({
        schema: [Dialog.schema, Message.schema],
        schemaVersion: 21,
        migration: (oldRealm, newRealm) => { }
      }).then(realm => {
        console.log(realm.path)
        this.realm = realm
      });
    } catch (e) {
      console.log('Cannot start database', e)
    }
  }
}

Database.shared = new Database()
export default Database
