import AsyncStorage from '@react-native-community/async-storage';
import BeemoApp from '~/Beemo/lib/beemoMain';
import User from '../models/user';
import store from '../store';
import { setCurrentUser, updateCurrentUser } from '../actions/currentUser'

class AuthService {
  static CURRENT_USER_SESSION_KEY = 'CURRENT_USER_SESSION_KEY'
  static DEVICE_TOKEN_KEY = 'DEVICE_TOKEN_KEY'

  async init() {
    await BeemoApp.init();
    return this.autologin();
  }

  async updateCurrentUser({ image, full_name, login }) { }

  async autologin() {
    const checkUserSessionFromStore = await this.getUserSession()
    if (checkUserSessionFromStore) {
      const data = JSON.parse(checkUserSessionFromStore)
      await this.signIn({ jid: data.jid, password: data.password })
      return 'Dialogs'
    } else {
      // return 'Auth'
      await this.signIn({ jid: 'user1@localhost', password: 'passw0rd' })
      return 'Dialogs'
    }
  }

  async signIn(params) {
    await this.connect(params.jid, params.password);
    const currentUser = new User(params);
    store.dispatch(setCurrentUser(currentUser));
    this.setUserSession(params);
    // const customSession = Object.assign({}, currentUser, { password: params.password })
  }

  async signUp(params) { }

  async setUserSession(userSession) {
    return AsyncStorage.setItem(AuthService.CURRENT_USER_SESSION_KEY, JSON.stringify(userSession))
  }

  async getUserSession() {
    return await AsyncStorage.getItem(AuthService.CURRENT_USER_SESSION_KEY)
  }

  async unsubscribePushNotifications() { }

  async getStoreToken() {
    return await AsyncStorage.getItem(AuthService.DEVICE_TOKEN_KEY)
  }

  async logout() { }

  async connect(jid, password) {
    return BeemoApp.chat.connect({ jid, password })
  }

  get currentUser() { }
}

const authService = new AuthService()

Object.freeze(authService)

export default authService
