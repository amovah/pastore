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
  console.log('everthing is ready');
} else {
  console.log('You should initialize pastore');
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

- `passowrd`: type `String`, required. It's master password.

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

These below methods must run after initializing or loading database.

### add

Usage: `pastore.add(title, password, [moreInfo])`

Return: `Promise`

Arguments:

- `title`: type `String`, required. title of password.
- `password`: type `String`, required. password.
- `moreInfo`: type `String`, optional, default `''`. more information for password like email, address of site or etc.

Add a password to database and save database. It will add automatically a unique id for each password.

### remove

Usage: `pastore.remove(id)`

Return: `Promise`

Arguments:

- `id`: type `String`, required. password unique id.

Remove a password from database and save it.

### update

Usage: `pastore.update(id, update)`

Return: `Promise`

Arguments:

- `id`: type `String`, required. password unique id.
- `update`: type `Object`, required. object replace with old stuff.

Update a password. You are allowed only to change title, password and more info, not unique id.

### findById

Usage: `pastore.findById(id)`

Return: `Object` or `undefined`.

return undefined when there is no password with that condition

Arguments:

- `id`: type `String`, required. password unique id.

Search and find a password by specified id and return the password.

### find

Usage: `pastore.find(key, value)`

Return: `Object` or `undefined`.

return undefined when there is no password with that condition.

Arguments:

- `key`: type `String`, required. key for searching, like title.
- `value`: type `String`, required. value for searching, like twitter.

Search and find all passwords by specified key and value, like searching for a password that it has twitter as title.

Example:

```js
import pastore from 'pastore';

pastore.init('something').then(() => {
  pastore.add('twitter', '123123');
  pastore.add('twitter', '124124');

  pastore.find('title', 'twitter');

  /*
   * return
   * [
   *  { id, title: 'twitter', password: '123123', moreInfo: ''},
   *  { id, title: 'twitter', password: '124124', moreInfo: ''}
   * ]
   */

  pastore.find('title', 'facebook');

  /**
   * return undefined
   */
});
```

### findAll

Usage: `pastore.findAll()`

Return: `Array`

Return password database, all passwords.

### changePassword

Usage: `pastore.changePassword(password)`

Return: `Promise`

Arguments:

- `password`: type `String`, required. new password.

## Contributing

any ideas and pull requests is appreciated.

## LICENSE

MIT
