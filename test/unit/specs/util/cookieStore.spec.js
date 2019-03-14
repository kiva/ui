import cookieStore from '@/util/cookieStore';

describe('cookieStore.js', () => {
	afterEach(() => {
		cookieStore.reset();
	});

	describe('get', () => {
		it('reads document cookies when no request cookies are defined', () => {
			document.cookie = 'test=client_value';
			expect(cookieStore.get('test')).toEqual('client_value');
		});

		it('only reads request cookies when they are defined', () => {
			document.cookie = 'test_client=client_value';
			cookieStore.reset({ test_server: 'server_value' });
			expect(cookieStore.get('test_server')).toEqual('server_value');
			expect(cookieStore.get('test_client')).not.toBeDefined();
		});
	});

	describe('getCookieString', () => {
		it('returns the request cookies as a serialized string', () => {
			cookieStore.reset({
				test1: 'value1',
				test2: 'value2',
			});
			expect(cookieStore.getCookieString()).toEqual('test1=value1; test2=value2');
		});
	});

	describe('has', () => {
		it('reports unknown cookies not found', () => {
			expect(cookieStore.has('not-a-cookie')).toBe(false);
		});

		it('finds cookies from the browser if no request cookies are defined', () => {
			document.cookie = 'test_client=value';
			expect(cookieStore.has('test_client')).toBe(true);
		});

		it('only finds cookies from the request if they are defined', () => {
			document.cookie = 'test_client=value';
			cookieStore.reset({ test_server: 'value' });
			expect(cookieStore.has('test_server')).toBe(true);
			expect(cookieStore.has('test_client')).toBe(false);
		});
	});
});
