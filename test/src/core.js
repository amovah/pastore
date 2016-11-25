import { join } from 'path';
import { expect } from 'chai';
import * as _ from '../../build/utils';
import Pastore from '../../build';

describe('Core:', () => {
  describe('#saveConfig() - save config to config.json file:', () => {
    it('type of function is promise', () => {
      let pastore = new Pastore();
      expect(pastore.saveConfig().then).to.be.a('function');
    });

    it('change config and check config.json file', done => {
      let pastore = new Pastore();
      pastore.config.test = 'test';

      pastore.saveConfig().then(() => {
        _.readJSON(join(__dirname, '../../build/config.json')).then(config => {
          try {
            expect(config.test).to.equal('test');
            done();
          } catch(err) {
            done(err);
          }
        }, done);
      });
    });
  });

  describe('#clearDB() - clear database directory:', () => {
    it('type of function is promise', () => {
      let pastore = new Pastore();
      expect(pastore.clearDB().then).to.be.a('function');
    });

    it('create database file and remove it by pastore.clear()', done => {
      let path = join(__dirname, '../../build/database');
      _.write(path, 'test');
      let pastore = new Pastore();

      pastore.clearDB().then(() => {
        _.exist(path).then(result => {
          try {
            expect(result).to.equal(false);
            done();
          } catch(err) {
            done(err);
          }
        }, done);
      }, done);
    });
  });

  describe(
    '#clear() - reset config file and clear database and config file:',
    () => {
    it('type of function is promise', () => {
      let pastore = new Pastore();
      expect(pastore.clear().then).to.be.a('function');
    });

    it('reset config file to default', () => {
      let pastore = new Pastore();
      pastore.config.test = 'test';

      pastore.clear().then(() => {
          expect(pastore.config.test).to.equal(undefined);
      });
    }
  );

    it('save default config to config.json file', done => {
      let pastore = new Pastore();

      pastore.clear().then(() => {
        _.readJSON(join(__dirname, '../../build/config.json')).then(config => {
          try {
            let keys = Object.keys(config);
            expect(keys.length).to.equal(2);

            let defaultKeys = ['testString', 'method'];
            expect(
              keys
                .map(item => defaultKeys.indexOf(item))
                .every(item => item !== -1)
            ).to.equal(true);

            done();
          } catch(err) {
            done(err);
          }
        }, done);
      });
    });

    it('clean database directory', done => {
      let path = join(__dirname, '../../build/database');
      _.write(path, 'test');
      let pastore = new Pastore();

      pastore.clear().then(() => {
        _.exist(path).then(result => {
          try {
            expect(result).to.equal(false);
            done();
          } catch(err) {
            done(err);
          }
        }, done);
      }, done);
    });

    it('reset database property to default', done => {
      let pastore = new Pastore();
      pastore.db.test = 'test';

      pastore.clear().then(() => {
        try {
          expect(Object.keys(pastore.db).length).to.equal(0);
          done();
        } catch(err) {
          done(err);
        }
      }, done);
    });
  });

  describe('#saveDB() - save database to database file:', done => {
    it('type of function is promise', () => {
      try {
        let pastore = new Pastore();
        pastore.password = 'test';
        expect(pastore.saveDB().then).to.be.a('function');
      } catch(err) {
        done(err);
      }
    });

    it('write encrypted databas to database file', done => {
      let pastore = new Pastore();
      pastore.password = 'test';
      pastore.saveDB().then(() => {
        _.read(join(__dirname, '../../build/database')).then(data => {
          try {
            expect(data).to.not.equal('{}');
            expect(data).to.not.equal('');
            done();
          } catch(err) {
            done(err);
          }
        });
      }, done);
    });
  });

  describe('#needConfig() - check whether pastore needs config or not:', () => {
    it('type of get method is boolean', () => {
      let pastore = new Pastore();
      expect(pastore.needConfig).to.be.a('boolean');
    });

    it('config is reseted and needConfig() should return true', () => {
      let pastore = new Pastore();
      pastore.clear().then(() => {
        expect(pastore.needConfig).to.equal(true);
      });
    });

    it('config is set and needConfig() should return false', () => {
      let pastore = new Pastore();
      pastore.config.testString = 'test';
      expect(pastore.needConfig).to.equal(false);
    });
  });
});
