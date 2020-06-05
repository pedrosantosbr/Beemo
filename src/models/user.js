export default class User {
  constructor(user) {
    this.id = user.jid
    this.uid = user.uid
    this.name = user.name
    this.created_at = user.created_at
    this.updated_at = user.updated_at
  }

  static getAvatarUrl(avatarUID) {
    return getImageLinkFromUID(avatarUID)
  }

  static schema = {
    name: 'Message',
    primaryKey: 'id',
    properties: {
      id: { type: 'string', indexed: true },
      dialog_id: 'int',
      sender_id: 'int',
      body: 'string',
      date_sent: 'int',
    }
  }
}
