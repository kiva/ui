import {
	parseQueryStringCookie,
	buildQueryStringCookie,
} from '#src/util/queryStringCookie';

describe('queryStringCookie util', () => {
	describe('parseQueryStringCookie', () => {
		it('parses a query string into an object', () => {
			expect(parseQueryStringCookie('key=value&foo=bar')).toEqual({
				key: 'value',
				foo: 'bar',
			});
		});

		it('parses a single key-value pair', () => {
			expect(parseQueryStringCookie('flag=true')).toEqual({ flag: 'true' });
		});

		it('returns empty object for empty string', () => {
			expect(parseQueryStringCookie('')).toEqual({});
		});

		it('returns empty object for null', () => {
			expect(parseQueryStringCookie(null)).toEqual({});
		});

		it('returns empty object for undefined', () => {
			expect(parseQueryStringCookie(undefined)).toEqual({});
		});

		it('returns empty object for non-string input', () => {
			expect(parseQueryStringCookie(123)).toEqual({});
			expect(parseQueryStringCookie({})).toEqual({});
		});

		it('handles URL-encoded values', () => {
			expect(parseQueryStringCookie('msg=hello%20world')).toEqual({
				msg: 'hello world',
			});
		});
	});

	describe('buildQueryStringCookie', () => {
		it('builds a query string from an object', () => {
			expect(
				buildQueryStringCookie({ key: 'value', foo: 'bar' })
			).toBe('key=value&foo=bar');
		});

		it('filters out null values', () => {
			expect(
				buildQueryStringCookie({ a: 'x', b: null, c: 'z' })
			).toBe('a=x&c=z');
		});

		it('filters out undefined values', () => {
			expect(
				buildQueryStringCookie({ a: 'x', b: undefined, c: 'z' })
			).toBe('a=x&c=z');
		});

		it('filters out empty string values', () => {
			expect(
				buildQueryStringCookie({ a: 'x', b: '', c: 'z' })
			).toBe('a=x&c=z');
		});

		it('returns empty string for empty object', () => {
			expect(buildQueryStringCookie({})).toBe('');
		});

		it('returns empty string when all values are null/undefined/empty', () => {
			expect(
				buildQueryStringCookie({ a: null, b: undefined, c: '' })
			).toBe('');
		});

		it('includes zero and false as valid values', () => {
			expect(
				buildQueryStringCookie({ n: 0, f: false })
			).toBe('n=0&f=false');
		});

		it('encoding and decoding produce the same object', () => {
			const obj = { key: 'value', foo: 'bar', flag: 'true' };
			const str = buildQueryStringCookie(obj);
			expect(parseQueryStringCookie(str)).toEqual(obj);
		});
	});
});
