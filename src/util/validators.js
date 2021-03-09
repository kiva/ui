// This validator was copied from the Kiva Auth0 repo as-is
export function email(value) {
	return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
}

export function match(value, other) {
	return value === other;
}

export function password(value) {
	return typeof value === 'string' && value.length >= 12;
}

export function required(value) {
	return !!value;
}

export function getFailures(validators, value, ...args) {
	if (typeof validators !== 'object') return [];

	return Object.entries(validators)
		.filter(v => !v[1](value, ...args))
		.map(v => v[0]);
}
