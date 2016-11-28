import 'babel-polyfill';
import { unique } from 'stringing';
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
    this.db = [{ id: '51910bD417a434bdCd2bEfdf47357932',
    title: 'first',
    password: 'hhmm',
    moreInfo: 'more info' }];
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
    this.db = {};

    await this.saveConfig();
    await this.clearDB();
  }

  add(title, password, moreInfo = '') {
    this.db.push({ id: unique(32), title, password, moreInfo });

    return this.saveDB();
  }

  remove(id) {
    let index = _.find(this.db, id);

    this.db = [ ...this.db.slice(0, index), ...this.db.slice(index + 1)];

    return this.saveDB();
  }

  update(id, update) {
    let index = _.find(this.db, id);

    this.db = [
      ...this.db.slice(0, index),
      Object.assign({}, this.db[index], update),
      ...this.db.slice(index + 1)
    ];

    return this.saveDB();
  }

  find(id) {
    for (let pass of this.db) {
      if (pass.id === id) {
        return pass;
      }
    }
  }

  findAll() {
    return this.db;
  }

  async changePassword(password) {
    this.password = password;
    this.config.testString = _.enc('pastore', password, this.config.method);
  }
}
