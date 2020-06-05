const Config = require('../beemoConfig');
const Utils = require('./beemoChatInternalUtils')

class ChatHelpers {
  constructor() {
    this._userCurrentJid = null;
  }

  jidOrUserId(jidOrUserId) {
    let jid;
    if (typeof jidOrUserId === 'string' && jidOrUserId.includes('@')) { // jid
      jid = jidOrUserId;
    } else { // user id
      jid = jidOrUserId + '@' + Config.endpoints.chat;
    }
    return jid;
  }

  userCurrentJid(client) {
    return client.jid._local + '@' + client.jid._domain + '/' + client.jid._resource;
  }

  getUserIdFromJID(jid) {
    if (jid.indexOf('@') < 0) return null;
    return jid.split('@')[0];
  }

  getDialogIdFromJID(jid) {
    if (jid.indexOf('@') < 0) return null;
    return jid.split('@')[0];
  }

  setUserCurrentJid(jid) {
    this._userCurrentJid = jid;
  }

  getUserCurrentJid() {
    return this._userCurrentJid;
  }

  getBsonObjectId() {
    return Utils.getBsonObjectId();
  }
}

module.exports = ChatHelpers;
