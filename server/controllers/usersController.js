'use strict';

var User = require('./userController');

class Users {
	constructor() {
		this.users = {};
	}

	addUser(id, username) {
		this.users[id] = new User(id, username);
	}

	getUser(id) {
		return this.users[id];
	}

	removeUser(id) {
		delete this.users[id];
	}
}