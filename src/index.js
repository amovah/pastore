import { join } from 'path';
import * as _ from './utils';
import config from './config';

class Pastore {
  constructor() {
    this.config = config;
    this.paths = {
      config: join(__dirname + '/config.json'),
      database: join(__dirname + '/database')
    };
    this.db = {
      titles: [],
      passwords: []
    };
    this.password = null;
  }

  async init(password) {
    this.password = password;
    this.config.testString = _.enc('pastore', password, this.config.method);

    await this.saveConfig();
    await this.saveDB();
  }

  async load(password) {
    this.password = password;

    let testString = _.dec(
      this.config.testString,
      this.password,
      this.config.method
    );

    if (testString === 'pastore') {
      this.db = await this.loadDB();
      return true;
    } else {
      return false;
    }
  }

  get needInit() {
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

  async loadDB() {
    let db = await _.read(this.paths.database);
    return JSON.parse(_.dec(db, this.password, this.config.method));
  }

  clearDB() {
    return _.remove(this.paths.database);
  }

  async clear() {
    this.config = {
      testString: null,
      method: 'AES'
    };
    this.db = {
      titles: [],
      passwords: []
    };

    await this.saveConfig();
    await this.clearDB();
  }

  async add(title, password, info = '') {
    if (!this.db.titles.includes(title)) {
      this.db.passwords.push({title, password, info });

      await this.saveDB();

      return this.find(title);
    } else {
      return false;
    }
  }

  remove(title) {
    let index = _.find(this.db.passwords, title);

    if (index !== undefined) {
      this.db.passwords = [
        ...this.db.passwords.slice(0, index),
        ...this.db.passwords.slice(index + 1)
      ];
      return this.saveDB();
    }

    return Promise.reject();
  }

  update(title, update) {
    if (
      typeof update.title === 'string'
      && this.db.titles.includes(update.title)
    ) {
      return Promise.reject();
    } else {
      let index = _.find(this.db.passwords, title);

      this.db = [
        ...this.db.slice(0, index),
        Object.assign({}, this.db[index], _.removeUndefined({
          title: update.title,
          password: update.password,
          info: update.info
        })),
        ...this.db.slice(index + 1)
      ];

      return this.saveDB();
    }
  }

  find(title) {
    return this.db.passwords[_.find(this.db.passwords, title)];
  }

  findPasswords() {
    return this.db.passwords;
  }

  findTitles() {
    return this.db.titles;
  }

  async changePassword(password) {
    this.password = password;
    this.config.testString = _.enc('pastore', password, this.config.method);

    await this.saveConfig();
    await this.saveDB();
  }
}

export default new Pastore();
