export function fakeAuthEnabled(config) {
	return config?.auth0?.checkFakeAuth ?? false;
}

export function usingFakeAuth(config, req) {
	return fakeAuthEnabled(config) && (req.headers?.cookie ?? '').includes('kvfa=');
}

export default {
	fakeAuthEnabled,
	usingFakeAuth
};
