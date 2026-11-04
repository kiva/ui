// @vitest-environment node
import express from 'express';
import session from 'express-session';
import authRouter from '#server/auth-router';

vi.mock('#server/util/log', () => ({
	info: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
}));

const config = {
	host: 'www.kiva.org',
	auth0: {
		domain: 'login.kiva.org',
		serverClientID: 'server-client-id',
		serverCallbackUri: 'https://www.kiva.org/process-ssr-auth',
		apiAudience: 'https://api.kivaws.org/graphql',
		scope: 'openid',
	},
};

// Requests /ui-login from an app with the auth router mounted and returns the Auth0 authorize params
async function authorizeParams(query, headers = {}, routerConfig = config) {
	const app = express();
	app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
	app.use(authRouter(routerConfig));

	const server = await new Promise(resolve => {
		const listening = app.listen(0, () => resolve(listening));
	});
	try {
		const { port } = server.address();
		const response = await fetch(`http://localhost:${port}/ui-login?${query}`, { headers, redirect: 'manual' });
		const location = new URL(response.headers.get('location'));
		expect(`${location.origin}${location.pathname}`).toBe('https://login.kiva.org/authorize');
		return location.searchParams;
	} finally {
		server.close();
	}
}

describe('auth-router /ui-login', () => {
	beforeEach(() => {
		vi.stubEnv('UI_AUTH0_CLIENT_SECRET', 'secret');
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('sends each Kiva login option with and without the ext- prefix', async () => {
		const params = await authorizeParams(
			'ssoRedirect=oidc-managed-lending&kivaCorpPartner=true&partnerContentId=partner-page&earnBadge=true',
			{ cookie: 'opt_in_comms=1' },
		);

		expect(params.get('ssoRedirect')).toBe('oidc-managed-lending');
		expect(params.get('ext-ssoRedirect')).toBe('oidc-managed-lending');
		expect(params.get('kiva_corp_partner')).toBe('true');
		expect(params.get('ext-kiva_corp_partner')).toBe('true');
		expect(params.get('partnerContentId')).toBe('partner-page');
		expect(params.get('ext-partnerContentId')).toBe('partner-page');
		expect(params.get('optInComms')).toBe('1');
		expect(params.get('ext-optInComms')).toBe('1');
		expect(params.get('earn_badge')).toBe('true');
		expect(params.get('ext-earn_badge')).toBe('true');
		expect(params.get('login_hint')).toBe('signUp');
	});

	it('sends no ext- params when no Kiva login options are set', async () => {
		const params = await authorizeParams('force=true');

		expect([...params.keys()].filter(key => key.startsWith('ext-'))).toEqual([]);
		expect(params.get('prompt')).toBe('login');
	});

	it('sends the email connection for a passwordless login when sending the connection is on', async () => {
		const params = await authorizeParams('passwordless=true', {}, {
			...config,
			auth0: { ...config.auth0, sendPasswordlessConnection: true },
		});

		expect(params.get('connection')).toBe('email');
		expect(params.get('passwordless')).toBe('true');
	});

	it('sends no connection for a passwordless login when sending the passwordless connection is off', async () => {
		const params = await authorizeParams('passwordless=true');

		expect(params.has('connection')).toBe(false);
		expect(params.get('passwordless')).toBe('true');
	});

	it('sends no connection for a password login when sending the passwordless connection is on', async () => {
		const params = await authorizeParams('force=true', {}, {
			...config,
			auth0: { ...config.auth0, sendPasswordlessConnection: true },
		});

		expect(params.has('connection')).toBe(false);
	});
});
