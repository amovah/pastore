import fs from 'fs-extra';
import { stat, writeFile, readFile } from 'fs';
import cr from 'crypto-js';

export function writeJSON(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeJson(path, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export function readJSON(path) {
  return new Promise((resolve, reject) => {
    fs.readJson(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function remove(path) {
  return new Promise((resolve, reject) => {
    fs.remove(path, err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export function read(path) {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export function write(path, data) {
  return new Promise((resolve, reject) => {
    writeFile(path, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export function exist(path) {
  return new Promise(resolve => {
    stat(path, err => {
      if (err === null) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export function enc(string, password, method) {
  return cr[method].encrypt(string, password).toString();
}

export function dec(string, password, method) {
  return cr[method].decrypt(string, password).toString(cr.enc.Utf8);
}
