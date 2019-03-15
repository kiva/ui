import cookieStore from '@/util/cookieStore';

describe('cookieStore.js', () => {
	afterEach(() => {
		cookieStore.remove('test');
		cookieStore.remove('test1');
		cookieStore.remove('test2');
		cookieStore.reset();
	});

	describe('get', () => {
		it('reads document cookies when no request cookies are defined', () => {
			document.cookie = 'test=client_value';
			expect(cookieStore.get('test')).toEqual('client_value');
		});

		it('only reads request cookies when they are defined', () => {
			document.cookie = 'test1=client_value';
			cookieStore.reset({ test2: 'server_value' });
			expect(cookieStore.get('test2')).toEqual('server_value');
			expect(cookieStore.get('test1')).not.toBeDefined();
		});
	});

	describe('getCookieString', () => {
		it('returns the request cookies as a serialized string', () => {
			cookieStore.reset({
				test1: 'value1',
				test2: 'value2',
			});
			const cookieString = 'test1=value1; test2=value2';
			expect(cookieStore.getCookieString()).toEqual(cookieString);
		});
	});

	describe('getSetCookies', () => {
		it('returns an empty array if no cookies have been set', () => {
			expect(cookieStore.getSetCookies()).toHaveLength(0);
		});

		it('returns all SetCookie header strings for cookies that have been set', () => {
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
			expect(cookieStore.has('not-a-cookie')).toBe(false);
		});

		it('finds cookies from the browser if no request cookies are defined', () => {
			document.cookie = 'test=value';
			expect(cookieStore.has('test')).toBe(true);
		});

		it('only finds cookies from the request if they are defined', () => {
			document.cookie = 'test1=value';
			cookieStore.reset({ test2: 'value' });
			expect(cookieStore.has('test2')).toBe(true);
			expect(cookieStore.has('test1')).toBe(false);
		});
	});

	describe('remove', () => {
		it('removes a cookie from request cookies', () => {
			cookieStore.reset({ test: 'value' });
			expect(cookieStore.get('test')).toEqual('value');
			cookieStore.remove('test');
			expect(cookieStore.get('test')).not.toBeDefined();
		});

		it('removes a cookie from browser cookies', () => {
			document.cookie = 'test=value';
			expect(cookieStore.get('test')).toEqual('value');
			cookieStore.remove('test');
			expect(cookieStore.get('test')).not.toBeDefined();
		});

		it('adds a deleted SetCookie header', () => {
			cookieStore.reset({ test: 'value' });
			cookieStore.remove('test');
			const setCookieHeader = cookieStore.getSetCookies()[0];
			expect(setCookieHeader).toEqual(expect.stringContaining('test=deleted; Expires='));
		});
	});

	describe('reset', () => {
		it('clears request cookies and newly set cookies from the store', () => {
			cookieStore.reset();
			expect(cookieStore.getCookieString()).toHaveLength(0);
			expect(cookieStore.getSetCookies()).toHaveLength(0);
		});

		it('sets new request cookies in the store', () => {
			expect(cookieStore.get('test')).not.toBeDefined();
			cookieStore.reset({ test: 'value' });
			expect(cookieStore.get('test')).toEqual('value');
		});
	});

	describe('set', () => {
		it('sets a cookie value', () => {
			cookieStore.set('test', 'value');
			expect(cookieStore.get('test')).toEqual('value');
			expect(cookieStore.getSetCookies()[0]).toEqual('test=value');
		});
	});
});
