import { isPast } from 'date-fns';
import jwt from 'jsonwebtoken';

export const isExpired = token => {
	const { exp } = jwt.decode(token) || { exp: 0 };
	const expires = new Date(exp * 1000);
	return isPast(expires);
};

export default {
	isExpired
};
