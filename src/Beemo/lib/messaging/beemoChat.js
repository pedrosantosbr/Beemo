import { jid, xml } from '@xmpp/client';
import XMPPClient from '@xmpp/client/react-native';
import Config from '../beemoConfig';
import ChatUtils from './beemoChatInternalUtils';
import ChatHelpers from './beemoChatHelpers';

const debug = require('@xmpp/debug')

class ChatService {
  constructor() {
    this.xmppClient = XMPPClient.client({
      service: Config.chatProtocol.websocket,
      credentials: (auth, mechanism) => {
        const crds = {
          username: this.xmppClient.options.username,
          password: this.xmppClient.options.password
        };
        return auth(crds);
      }
    });

    this.stanzasCallbacks = {};

    this.helpers = new ChatHelpers();

    this.isConnected = false;
    this._isConnecting = false;
    this._isLogout = false;

    this._checkConnectionTimer = undefined;

    this.xmppClientListeners = [];
  }

  // Public Methods
  connect(params) {
    return new Promise((resolve, reject) => {
      const isInitialConnect = typeof callback === 'function';

      if (this._isConnecting) {
        if (isInitialConnect) {
          const err = { code: 422, info: 'Already in CONNECTING state' };
          reject(err);
        }
        return;
      }

      if (this.isConnected) {
        console.log('[Chat]', 'CONNECTED - You are already connected');
        if (isInitialConnect) {
          resolve();
        }

        resolve();
        return;
      }

      this._isConnecting = true;
      this._isLogout = false;

      // remove all old listeners
      this.xmppClientListeners.forEach((listener) => {
        this.xmppClient.removeListener(listener.name, listener.callback);
      });

      const callbackConnect = () => {
        console.log('[Chat]', 'CONNECTING');
      };
      this.xmppClient.on('connect', callbackConnect);
      this.xmppClientListeners.push({ name: 'connect', callback: callbackConnect });

      const callbackDisconnect = () => {
        console.log('[Chat]', 'DISCONNECTED');

        this.isConnected = false;
        this._isConnecting = false;

        // reconnect to chat and enable check connection
        this._establishConnection(params);
      };
      this.xmppClient.on('disconnect', callbackDisconnect);
      this.xmppClientListeners.push({ name: 'disconnect', callback: callbackDisconnect });

      const callbackOnline = (jid) => {
        console.log('[Chat]', 'ONLINE');
        this._postConnectActions();
        resolve();
      };
      this.xmppClient.on('online', callbackOnline);
      this.xmppClientListeners.push({ name: 'online', callback: callbackOnline });

      const callbackOffline = () => {
        console.log('[Chat]', 'OFFLINE');
      };
      this.xmppClient.on('offline', callbackOffline);
      this.xmppClientListeners.push({ name: 'offline', callback: callbackOffline });

      const callbackStatus = (status, value) => {
        console.log('[Chat]', 'status', status, value ? value.toString() : '');
      };
      this.xmppClient.on('status', callbackStatus);
      this.xmppClientListeners.push({ name: 'status', callback: callbackStatus });

      const callbackStanza = stanza => {
        // after 'input' and 'element' (only if stanza, not nonza)
        if (stanza.is('presence')) {
          this._onPresence(stanza);
        } else if (stanza.is('iq')) {
          this._onIQ(stanza);
        } else if (stanza.is('message')) {
          console.log(stanza)
          if (stanza.attrs.type === 'headline') {
            this._onSystemMessageListener(stanza);
          } else if (stanza.attrs.type === 'error') {
            this._onMessageErrorListener(stanza);
          } else {
            this._onMessage(stanza);
          }
        }
      };
      this.xmppClient.on('stanza', callbackStanza);
      this.xmppClientListeners.push({ name: 'stanza', callback: callbackStanza });

      const callbackError = err => {
        console.log('[Chat]', 'ERROR:', err);

        if (err.name == 'SASLError') {
          err = err.text;
          reject(err);
          this._isLogout = true;
          this.xmppClient.stop();
        }

        this.isConnected = false;
        this._isConnecting = false;
      };
      this.xmppClient.on('error', callbackError);
      this.xmppClientListeners.push({ name: 'error', callback: callbackError });


      // save user connection data so they will be used when authenticate (above)
      this.xmppClient.options.username = params.jid;
      this.xmppClient.options.password = params.password;

      this.xmppClient.start().catch(err => console.log(err));

    });
  }

  send() { }

  sendSystemMessage(jidOrUserId, message) { }

  sendIsTypingStatus(jidOrUserId) { }

  sendIsStopTypingStatus(jidOrUserId) { }

  sendDeliveredStatus(params) { }

  sendReadStatus(params) { }

  getLastUserActivity(jidOrUserId) { }

  markActive() { }

  markInactive() { }

  // Private Methods
  _onMessage(stanza) {
    let forwaredStanza = ChatUtils.getElementTreePath(stanza, ['sent', 'forwarded', 'message']);

    if (forwaredStanza) stanza = forwaredStanza;

    let from = ChatUtils.getAttr(stanza, 'from'),
      type = ChatUtils.getAttr(stanza, 'type'),
      messageId = ChatUtils.getAttr(stanza, 'id'),
      markable = ChatUtils.getElement(stanza, 'markable'),
      delivered = ChatUtils.getElement(stanza, 'received'),
      read = ChatUtils.getElement(stanza, 'displayed'),
      composing = ChatUtils.getElement(stanza, 'composing'),
      paused = ChatUtils.getElement(stanza, 'paused'),
      invite = ChatUtils.getElement(stanza, 'invite'),
      delay = ChatUtils.getElement(stanza, 'delay'),
      active = ChatUtils.getElement(stanza, 'active'),
      extraParams = ChatUtils.getElement(stanza, 'extraParams'),
      bodyContent = ChatUtils.getElementText(stanza, 'body'),
      forwarded = ChatUtils.getElement(stanza, 'forwarded'),
      extraParamsParsed,
      recipientId,
      recipient;

    // console.log(stanza.toString())
    const forwardedMessage = forwarded ? ChatUtils.getElement(forwarded, 'message') : null;

    recipient = forwardedMessage ? ChatUtils.getAttr(forwardedMessage, 'to') : null;
    recipientId = recipient ? this.helpers.getUserIdFromJID(recipient) : null;

    let senderId = this.helpers.getUserIdFromJID(from),
      marker = delivered || read || null;

    if (extraParams) {
      extraParamsParsed = ChatUtils.parseExtraParams(extraParams);

      if (extraParamsParsed.dialogId) {
        dialogId = extraParamsParsed.dialogId;
      }
    }

    if (composing || paused) {
      if (
        typeof this.onMessageTypingListener === 'function' &&
        (type === 'chat' || !delay)) {
        ChatUtils.safeCallbackCall(this.onMessageTypingListener, !!composing, userId, dialogId);
      }

      return true;
    }

    if (marker) {
      if (delivered) {
        console.log(['delivered'], delivered);
      } else {
        console.log(['read'], read);
      }

      return;
    }

    const message = {
      id: messageId,
      type: type,
      body: bodyContent,
      sender_id: senderId
    };

    if (typeof this.onMessageListener === 'function' && type === 'chat' && bodyContent !== null)
      ChatUtils.safeCallbackCall(this.onMessageListener, message)
  }

  _onPresence(stanza) {
    let from = ChatUtils.getAttr(stanza, 'from');
    const dialogId = this.helpers.getDialogIdFromJID(from);
    console.log('[_onPresence]', from)
  }

  _onIQ(stanza) {
    console.log('[_onIQ]', stanza)
  }

  _onSystemMessageListener(stanza) {
    console.log('[_onSystemMessageListener]', stanza)
  }

  _onMessageErrorListener(stanza) { }

  _postConnectActions() {
    console.log('[Chat]', 'CONNECTED');
    this.isConnected = true;
    this._isConnecting = false;
    this.xmppClient.send(xml('presence'));
  }

  _establishConnection(params) {
    if (this._isLogout || this._checkConnectionTimer) {
      return;
    }

    const _connect = () => {
      if (!this.isConnected && !this._isConnecting) {
        this.connect(params);
      } else {
        clearInterval(this._checkConnectionTimer);
        this._checkConnectionTimer = undefined;
      }
    };

    _connect();

    this._checkConnectionTimer = setInterval(() => {
      _connect();
    }, 5 * 1000);
  }

}

module.exports = ChatService
