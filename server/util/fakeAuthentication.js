function fakeAuthEnabled(config) {
	return config?.auth0?.checkFakeAuth ?? false;
}

function usingFakeAuth(config, req) {
	return fakeAuthEnabled(config) && (req.headers?.cookie ?? '').includes('kvfa=');
}

module.exports = {
	fakeAuthEnabled,
	usingFakeAuth,
};
