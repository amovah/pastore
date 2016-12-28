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
    this.algorithm = null;
  }

  async init(password, algorithm) {
    let status = [
      'AES',
      'DES',
      'TripleDES',
      'RC4',
      'RC4Drop',
      'Rabbit',
      'RabbitLegacy'
    ].includes(algorithm);

    if (status) {
      this.password = password;
      this.algorithm = algorithm;
      this.config.algorithm = _.enc(algorithm, password, 'AES');

      await this.saveConfig();
      await this.saveDB();
    } else {
      throw new Error('invalid algorithm');
    }
  }

  async load(password) {
    try {
      this.password = password;
      this.algorithm = _.dec(this.config.algorithm, password, 'AES');

      this.db = await this.loadDB();
    } catch(e) {
      throw new Error('password is not correct');
    }
  }

  get needInit() {
    return !this.config.algorithm;
  }

  saveConfig() {
    return _.writeJSON(this.paths.config, this.config);
  }

  saveDB() {
    let encrypted = _.enc(
      JSON.stringify(this.db),
      this.password,
      this.algorithm
    );


    return _.write(this.paths.database, encrypted);
  }

  async loadDB() {
    let db = await _.read(this.paths.database);
    return JSON.parse(_.dec(db, this.password, this.algorithm));
  }

  clearDB() {
    return _.remove(this.paths.database);
  }

  async clear() {
    this.config = {};
    this.db = {
      titles: [],
      passwords: []
    };
    this.password = null;
    this.algorithm = null;

    await this.saveConfig();
    await this.clearDB();
  }

  async add(title, password, info = null, tag = null) {
    if (!this.db.titles.includes(title)) {
      this.db.passwords.push({ title, password, info, tag });
      this.db.titles.push(title);

      await this.saveDB();

      return this.find(title);
    } else {
      throw new Error('duplicated title');
    }
  }

  remove(title) {
    let indexPass = _.find(this.db.passwords, title);
    let indexTitle = this.db.titles.indexOf(title);

    if (indexPass !== undefined) {
      this.db.passwords = [
        ...this.db.passwords.slice(0, indexPass),
        ...this.db.passwords.slice(indexPass + 1)
      ];

      this.db.titles = [
        ...this.db.titles.slice(0, indexTitle),
        ...this.db.titles.slice(indexTitle + 1)
      ];

      return this.saveDB();
    } else {
      return Promise.reject(new Error('password not found'));
    }
  }

  update(title, update) {
    if (
      typeof update.title === 'string'
      && this.db.titles.includes(update.title)
    ) {
      return Promise.reject(new Error('duplicated title'));
    } else {
      let indexPass = _.find(this.db.passwords, title);
      let indexTitle = this.db.titles.indexOf(title);

      if (typeof update.title === 'string') {
        this.db.titles = [
          ...this.db.titles.slice(0, indexTitle),
          update.title,
          ...this.db.titles.slice(indexTitle + 1)
        ];
      }

      this.db.passwords = [
        ...this.db.passwords.slice(0, indexPass),
        Object.assign({}, this.db.passwords[indexPass], _.removeUndefined({
          title: update.title,
          password: update.password,
          info: update.info,
          tag: update.tag
        })),
        ...this.db.passwords.slice(indexPass + 1)
      ];

      return this.saveDB();
    }
  }

  find(title) {
    return this.db.passwords[_.find(this.db.passwords, title)];
  }

  findByTag(tag) {
    let result = [];
    for (let password of this.db.passwords) {
      if (password.tag === tag) {
        result.push(password);
      }
    }

    return result;
  }

  async removeByTag(tag) {
    for (let password of this.findByTag(tag)) {
      await this.remove(password.title);
    }
  }

  findPasswords() {
    return this.db.passwords;
  }

  findTitles() {
    return this.db.titles;
  }

  async changePassword(password) {
    this.password = password;
    this.config.algorithm = _.enc(this.algorithm, password, 'AES');

    await this.saveConfig();
    await this.saveDB();
  }

  async changeAlgorithm(algorithm) {
    let status = [
      'AES',
      'DES',
      'TripleDES',
      'RC4',
      'RC4Drop',
      'Rabbit',
      'RabbitLegacy'
    ].includes(algorithm);

    if (status) {
      this.algorithm = algorithm;
      this.config.algorithm = _.enc(algorithm, this.password, 'AES');

      await this.saveConfig();
      await this.saveDB();
    } else {
      throw new Error('invalid algorithm');
    }
  }

  exportDB() {
    return _.enc(
      JSON.stringify(this.db),
      this.password,
      this.algorithm
    );
  }

  importDB(db, password, algorithm) {
    this.db = JSON.parse(_.dec(db, password, algorithm));

    return this.saveDB();
  }
}

export default new Pastore();
