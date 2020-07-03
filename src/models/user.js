export default class User {
  constructor(user) {
    this.id = user.jid
    this.uid = user.uid
    this.name = user.name
    this.photo_url = user.photo_url
    this.created_at = user.created_at
    this.updated_at = user.updated_at
  }

  static getAvatarUrl(avatarUID) {
    return getImageLinkFromUID(avatarUID)
  }

  static schema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: { type: 'string', indexed: true },
      uuid: 'string',
      name: 'string',
      photo_url: 'string',
      created_at: 'date',
      updated_at: 'date'
    }
  }
}
