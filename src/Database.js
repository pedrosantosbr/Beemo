const Realm = require('realm')
import Dialog from '~/models/dialog'

class Database {
  constructor() {
    this.realm = null
  }

  init = async () => {
    try {
      Realm.open({
        schema: [Dialog.schema2],
        schemaVersion: 4,
        migration: (oldRealm, newRealm) => {
          // only apply this change if upgrading to schemaVersion 1

        }
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
