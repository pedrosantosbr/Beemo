class BeemoApp {
  init() {
    const Chat = require('./messaging/beemoChat')

    this.chat = new Chat()
  }
}

const BA = new BeemoApp();
BA.beemoApp = BeemoApp;
module.exports = BA
