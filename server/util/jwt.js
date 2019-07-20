const { isPast } = require('date-fns');
const jwt = require('jsonwebtoken');

module.exports = {
	isExpired: token => {
		const { exp } = jwt.decode(token) || { exp: 0 };
		const expires = new Date(exp * 1000);
		return isPast(expires);
	},
};
