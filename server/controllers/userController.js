'use strict';

module.exports = function(io) {

	class User {
		constructor(id, username) {
			this.id = id;
			this.username = username;
			this.socketId = '';
			this.room = '';
		}

		sendMessage(message, cb) {
			io.sockets.connected[this.socketId].emit('privateMessage', message, () => {
				if (cb) {cb()};
			})
		}

		setSocketId(sId) {
			this.socketId = sId;
		}

		joinRoom(room, cb) {
			this.room = room;
			io.sockets.connected[this.socketId].join(room);
			if (cb) {cb();}
		}
	}

}