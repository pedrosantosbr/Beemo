import { xml, jid, client } from '@xmpp/client';

class ChatInternalUtils {
  static createMessageStanza(params) {
    return xml('message', params);
  }

  static createIqStanza(params) {
    return xml('iq', params);
  }

  static createPresenceStanza(params) {
    return xml('presence', params);
  }

  static getElement(stanza, elName) {
    let el;

    if (typeof stanza.querySelector === 'function') {
      el = stanza.querySelector(elName);
    } else if (typeof stanza.getChild === 'function') {
      el = stanza.getChild(elName);
    }

    return el;
  }

  static getElementTreePath(stanza, elementsPath) {
    return elementsPath.reduce((prevStanza, elem) => prevStanza ? this.getElement(prevStanza, elem) : prevStanza, stanza)
  }

  static getAttr(el, attrName) {
    if (!el) {
      return null;
    }

    let attr;
    if (typeof el.getAttribute === 'function') {
      attr = el.getAttribute(attrName);
    } else if (el.attrs) {
      attr = el.attrs[attrName];
    }

    return attr;
  }

  static getElement(stanza, elName) {
    let el;

    if (typeof stanza.querySelector === 'function') {
      el = stanza.querySelector(elName);
    } else if (typeof stanza.getChild === 'function') {
      el = stanza.getChild(elName);
    }

    return el;
  }

  static getElementText(stanza, elName) {
    let el, txt;

    if (typeof stanza.querySelector === 'function') {
      el = stanza.querySelector(elName);
      txt = el ? el.textContent : null;
    } else if (typeof stanza.getChildText === 'function') {
      txt = stanza.getChildText(elName);
    }

    return txt;
  }

  static safeCallbackCall() {
    const callback = arguments[0];
    if (typeof callback !== 'function') {
      return;
    }

    const callbackString = callback.toString()
    const callbackName = callbackString.split('(')[0].split(' ')[1]

    const argumentsCopy = []
    let listenerCall

    for (let i = 0; i < arguments.length; i++) {
      argumentsCopy.push(arguments[i])
    }

    listenerCall = argumentsCopy.shift()

    try {
      listenerCall.apply(null, argumentsCopy)
    } catch (err) {
      if (callbackName === '') {
        console.error('Error: ' + err)
      } else {
        console.error('Error in listener ' + callbackName + ': ' + err)
      }
    }
  }

  static filledExtraParams(stanza, extension) {
    Object.keys(extension).forEach(field => {
      if (field === 'attachments') {
        extension[field].forEach(attach => {
          stanza
            .getChild('extraParams')
            .c('attachment', attach)
            .up();

        });
      } else if (typeof extension[field] === 'object') {
        this._JStoXML(field, extension[field], stanza);
      } else {
        stanza
          .getChild('extraParams')
          .c(field)
          .t(extension[field])
          .up();

      }
    });

    stanza.up();

    return stanza;
  }

  static parseExtraParams(extraParams) {
    if (!extraParams) {
      return null;
    }

    let extension = {};

    let dialogId, attach, attributes;

    let attachments = [];

    for (let c = 0, lenght = extraParams.children.length; c < lenght; c++) {
      if (extraParams.children[c].name === 'attachment') {
        attach = {};
        attributes = extraParams.children[c].attrs;

        let attrKeys = Object.keys(attributes);

        for (let l = 0; l < attrKeys.length; l++) {
          if (attrKeys[l] === 'size') {
            attach.size = parseInt(attributes.size);
          } else {
            attach[attrKeys[l]] = attributes[attrKeys[l]];
          }
        }

        attachments.push(attach);
      } else if (extraParams.children[c].name === 'dialog_id') {
        dialogId = extraParams.getChildText('dialog_id');
        extension.dialog_id = dialogId;
      }

      if (extraParams.children[c].children.length === 1) {
        let child = extraParams.children[c];

        extension[child.name] = child.children[0];
      }
    }

    if (attachments.length > 0) {
      extension.attachments = attachments;
    }

    if (extension.moduleIdentifier) {
      delete extension.moduleIdentifier;
    }

    return {
      extension: extension,
      dialogId: dialogId
    };
  }
}

module.exports = ChatInternalUtils;
