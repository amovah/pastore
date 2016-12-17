# pastore

Keep your password safe. It's pastore API. you can write your own app by using this module.

# Installation

```sh
npm install --save pastore
```

# Usage

```js
import pastore from 'pastore';
```

## Property

### needInit

Return: `Boolean`

Check whether pastore need configuration or not.

Example:

```javascript
if (pastore.needInit) {
  console.log('You should initialize pastore');
} else {
  console.log('everthing is ready');
}
```

## Methods

### init

Usage: `pastore.init(password)`

Return: `Promise`

Arguments:

- `password`: type `String`, required. It's master password.

Initialize pastore with your master password.

You only need initializing if needInit is true. In other words, you only need initializing if it's first time and pastore need config, and you must initialize. you can know about first time or not, with `pastore.needInit` property.  if you have not initialized your pastore, module does not work functionally.

Example:

```javascript
if (pastore.needInit) {
  pastore.init('yourmasterpassword').then(() => {
    // Do what you want to do
  }).catch(error => { console.log(error); })
} else {
  console.log('pooof, nothing to do');
}
```

### load

Usage: `pastore.load(password).then(status)`

Return: `Promise`

Arguments:

- `password`: type `String`, required. It's master password.

Argument to Promise:

- `status`: type `Boolean`. if your master password is correct it will be `true` otherwise it will be `false`.

Load database.


Example:

```javascript
if (pastore.needInit) {
  pastore.init('yourmasterpassword').then(() => {
    // Do what you want to do
  }).catch(error => { console.log(error); })
} else {
  pastore.load('icantremember').then(status => {
    status ? console.log('it was your password man') : console.log('go to hell, brainless');
  }).catch(() => {
    console.log('initialize this shit');
  });
}
```

### clear

Usage: `pastore.clear()`

Return: `Promise`

Reset pastore to default. everything include database, will be removed and reset.

These below methods must run after initializing or loading database.

### add

Usage: `pastore.add(title, password, [info]).then(pass || false)`

Return: `Promise`

Arguments:

- `title`: type `String`, required. title of password. title must be unique.
- `password`: type `String`, required. password.
- `info`: type `String`, optional, default `''`. more information for password like email, site address or etc.

Arguments to Promise:

- `pass`: type `Object`. Password object which is saved.
- `false`: type `Boolean`. If your title is not unique, it will be false.

Add a password to database and save database.


### remove

Usage: `pastore.remove(title)`

Return: `Promise`

Arguments:

- `title`: type `String`, required. password title.

Remove a password from database.

### update

Usage: `pastore.update(title, update)`

Return: `Promise`

Arguments:

- `title`: type `String`, required. password title.
- `update`: type `Object`, required. object will be replaced with old stuff.

Update a password.

### find

Usage: `pastore.find(title)`

Return: `Object` or `undefined`.

Return undefined when there is no password with the `title`.

Arguments:

- `title`: type `String`, required. key for searching, like title.

Search and find password by specified title, like searching for a password that it has twitter as title.

Example:

```js
import pastore from 'pastore';

pastore.init('something').then(() => {
  pastore.add('twitter', '123123');

  pastore.find('twitter');

  /*
   * return
   *
   *  { title: 'twitter', password: '123123', info: ''},
   *
   */

  pastore.find('facebook');

  /**
   * return undefined
   */
});
```

### findAll

Usage: `pastore.findAll()`

Return: `Array`

Return passwords.

### findTitles

Usage: `pastore.findTitles()`

Return: `Array`

Return **only** titles.

### changePassword

Usage: `pastore.changePassword(password)`

Return: `Promise`

Arguments:

- `password`: type `String`, required. new password.

Change password, master one.


### exportDB

Usage: `pastore.exportDB()`

Return: `String`

Export encrypted database.

### importDB

Usage: `pastore.importDB(db, password)`

Return: `Promise`

Arguments:

- `db`: type `String`, required. encrypted database.
- `password`: type `String`, required. master password of this db, not current pastore.

Arguments to Promise:

- `status`: type `Boolean`. it will be true if your password is correct and otherwise it will be false.

Import database.

## Contributing

Any ideas and pull requests is appreciated. read [CONTRIBUTING.md](https://github.com/amovah/pastore/blob/master/CONTRIBUTING.md)

## LICENSE

MIT
