class ChatHelpers {
  constructor() {
    this._userCurrentJid = null;
  }

  getUserIdFromJID(jid) {
    if (jid.indexOf('@') < 0) return null;
    return jid.split('@')[0];
  }

  getDialogIdFromJID(jid) {
    if (jid.indexOf('@') < 0) return null;
    return jid.split('@')[0];
  }
}

module.exports = ChatHelpers;
