import { expect } from 'chai';
import { join } from 'path';
import * as _ from '../../build/utils';
import Pastore from '../../build';

describe('Pastore API:', () => {
  describe('#init() - initialize first pastore database and password', () => {
    it('type of function is promise', () => {
      let pastore = new Pastore();
      expect(pastore.init('test').then).to.be.a('function');
    });

    it('set password', () => {
      let pastore = new Pastore();
      pastore.init('test');
      expect(pastore.password).to.equal('test');
    });

    it('set testString to encrypted \'test\' string by password as key', () => {
      let pastore = new Pastore();
      pastore.init('test');
      expect(pastore.config.testString).to.be.a('string');
    });

    it('save config file', done => {
      let pastore = new Pastore();
      pastore.init('test').then(() => {
        _.readJSON(join(__dirname, '../../build/config.json')).then(data => {
          try {
            expect(data.testString).to.be.a('string');
            done();
          } catch(err) {
            done(err);
          }
        }, done);
      }, done);
    });
  });

});
