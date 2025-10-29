// @vitest-environment jsdom
import CookieStore from '../../../../src/util/cookieStore';
import clearDocumentCookies from '../../setup/clearDocumentCookies';

describe('cookieStore.js', () => {
	afterEach(() => {
		clearDocumentCookies();
	});

	describe('get', () => {
		it('reads document cookies when no request cookies are defined', () => {
			document.cookie = 'test=client_value';
			const cookieStore = new CookieStore();
			expect(cookieStore.get('test')).toEqual('client_value');
		});

		it('only reads request cookies when they are defined', () => {
			document.cookie = 'test1=client_value';
			const cookieStore = new CookieStore({ test2: 'server_value' });
			expect(cookieStore.get('test2')).toEqual('server_value');
			expect(cookieStore.get('test1')).not.toBeDefined();
		});
	});

	describe('getAll', () => {
		it('reads document cookies when no request cookies are defined', () => {
			document.cookie = 'test1=value1';
			document.cookie = 'test2=value2';
			const cookieStore = new CookieStore();
			expect(cookieStore.getAll()).toEqual({
				test1: 'value1',
				test2: 'value2'
			});
		});

		it('only reads request cookies when they are defined', () => {
			document.cookie = 'test=client_value';
			const serverCookies = {
				test1: 'server_value1',
				test2: 'server_value2'
			};
			const cookieStore = new CookieStore(serverCookies);
			expect(cookieStore.getAll()).toEqual(serverCookies);
		});
	});

	describe('getSetCookies', () => {
		it('returns an empty array if no cookies have been set', () => {
			const cookieStore = new CookieStore();
			expect(cookieStore.getSetCookies()).toHaveLength(0);
		});

		it('returns all SetCookie header strings for cookies that have been set', () => {
			const cookieStore = new CookieStore();
			cookieStore.set('test1', 'value1');
			cookieStore.set('test2', 'value2');
			const setCookies = cookieStore.getSetCookies();
			expect(setCookies).toHaveLength(2);
			expect(setCookies).toContain('test1=value1');
			expect(setCookies).toContain('test2=value2');
		});
	});

	describe('has', () => {
		it('reports unknown cookies not found', () => {
			const cookieStore = new CookieStore();
			expect(cookieStore.has('not-a-cookie')).toBe(false);
		});

		it('finds cookies from the browser if no request cookies are defined', () => {
			document.cookie = 'test=value';
			const cookieStore = new CookieStore();
			expect(cookieStore.has('test')).toBe(true);
		});

		it('only finds cookies from the request if they are defined', () => {
			document.cookie = 'test1=value';
			const cookieStore = new CookieStore({ test2: 'value' });
			expect(cookieStore.has('test2')).toBe(true);
			expect(cookieStore.has('test1')).toBe(false);
		});
	});

	describe('remove', () => {
		it('removes a cookie from request cookies', () => {
			const cookieStore = new CookieStore({ test: 'value' });
			expect(cookieStore.get('test')).toEqual('value');
			cookieStore.remove('test');
			expect(cookieStore.get('test')).not.toBeDefined();
		});

		it('removes a cookie from browser cookies', () => {
			document.cookie = 'test=value';
			const cookieStore = new CookieStore();
			expect(cookieStore.get('test')).toEqual('value');
			cookieStore.remove('test');
			expect(cookieStore.get('test')).not.toBeDefined();
		});

		it('adds a deleted SetCookie header', () => {
			const cookieStore = new CookieStore({ test: 'value' });
			cookieStore.remove('test');
			const setCookieHeader = cookieStore.getSetCookies()[0];
			expect(setCookieHeader).toEqual(expect.stringContaining('test=deleted; Expires='));
		});
	});

	describe('set', () => {
		it('sets a cookie value in the browser', () => {
			const cookieStore = new CookieStore();
			cookieStore.set('test', 'value');
			expect(cookieStore.get('test')).toEqual('value');
			expect(cookieStore.getSetCookies()[0]).toEqual('test=value');
		});

		it('sets a cookie value on the server', () => {
			const cookieStore = new CookieStore({ test: 'value1' });
			cookieStore.set('test', 'value2');
			expect(cookieStore.get('test')).toEqual('value2');
			expect(cookieStore.getSetCookies()[0]).toEqual('test=value2');
		});
	});
});
