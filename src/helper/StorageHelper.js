import {AsyncStorage} from 'react-native';

const SAVE_USER = '1';
const SAVE_TOKEN = '2';
const IS_UPDATED = '3';
const CLIENT = '4';
const IS_ADMIN = '5';
const SAVE_STATES = '6';
const SELECTED_USERS = '7';
const SELECTED_DASHBOARD = '8';
const REFRESH_TOKEN = '9';


class StorageHelper {
  static saveUser(user) {
    AsyncStorage.setItem(SAVE_USER, JSON.stringify(user));
  }

  static getUser() {
    return AsyncStorage.getItem(SAVE_USER).then(x => JSON.parse(x));
  }

  static saveState(states) {
    AsyncStorage.setItem(SAVE_STATES, JSON.stringify(states));
  }

  static getStates() {
    return AsyncStorage.getItem(SAVE_STATES).then(x => JSON.parse(x));
  }

  static clear() {
    AsyncStorage.clear();
  }

  static saveToken(token) {
    console.log('token === ', token);
    AsyncStorage.setItem(SAVE_TOKEN, JSON.stringify(token))
  }

  static getToken() {
    return AsyncStorage.getItem(SAVE_TOKEN).then(x => JSON.parse(x));
  }

  static saveRefreshToken(token) {
    AsyncStorage.setItem(REFRESH_TOKEN, JSON.stringify(token))
  }

  static getRefreshToken() {
    return AsyncStorage.getItem(REFRESH_TOKEN).then(x => JSON.parse(x));
  }

  static isUpdated() {
    return AsyncStorage.getItem(IS_UPDATED).then(x => JSON.parse(x))
  }

  static setUpdated(status) {
    AsyncStorage.setItem(IS_UPDATED, JSON.stringify(status));
  }

  static saveClient(client) {
    AsyncStorage.setItem(CLIENT, JSON.stringify(client));
  }

  static getClient() {
    return AsyncStorage.getItem(CLIENT).then(x => JSON.parse(x));
  }

  static isAdminUser() {
    return AsyncStorage.getItem(IS_ADMIN).then(x => JSON.parse(x))
  }

  static setAdminUser(status) {
    AsyncStorage.setItem(IS_ADMIN, JSON.stringify(status));
  }
  static getSelectedUsersIds() {
    return AsyncStorage.getItem(SELECTED_USERS).then(x => JSON.parse(x))
  }
  static setSelectedUsersIds(ids) {
    AsyncStorage.setItem(SELECTED_USERS, JSON.stringify(ids));
  }
  static setSelectedDashboard(link) {
    return AsyncStorage.setItem(SELECTED_DASHBOARD, JSON.stringify(link))
  }
  static getSelectedDashBoard(){
    return AsyncStorage.getItem(SELECTED_DASHBOARD).then(x => JSON.parse(x));
  }
}

export default StorageHelper;
