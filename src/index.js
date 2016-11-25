import 'babel-polyfill';
import { join } from 'path';
import * as _ from './utils';
import config from './config';

export default class Pastore {
  constructor() {
    this.config = config;
    this.paths = {
      config: join(__dirname + '/config.json'),
      database: join(__dirname + '/database')
    };
    this.db = {};
    this.password = null;
  }

  async init(password) {
    this.password = password;
    this.config.testString = _.enc('pastore', password, this.config.method);

    let saveConfig = await this.saveConfig();
    let saveDB = await this.saveDB();
  
    if (saveConfig === true && saveDB === true) {
      return Promise.resolve(true);
    }
  }

  password(password) {

  }

  get needConfig() {
    return !this.config.testString;
  }

  saveConfig() {
    return _.writeJSON(this.paths.config, this.config);
  }

  saveDB() {
    let encrypted = _.enc(
      JSON.stringify(this.db),
      this.password,
      this.config.method
    );

    return _.write(this.paths.database, encrypted);
  }

  clearDB() {
    return _.remove(this.paths.database);
  }

  async clear() {
    this.config = {
      testString: null,
      method: 'AES'
    };
    this.db = {};
    let save = await this.saveConfig();
    let clearDB = await this.clearDB();

    if (save === true && clearDB === true) {
      return Promise.resolve(true);
    }
  }
}
