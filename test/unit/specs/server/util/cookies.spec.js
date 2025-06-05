import { decodeCookieValue, getCookieHeader } from '#server/util/cookies';

describe('decodeCookieValue', () => {
	it('decodes a valid URI component', () => {
		expect(decodeCookieValue('foo%20bar')).toBe('foo bar');
	});

	it('returns the value as-is if decoding throws', () => {
		// %E0%A4%A is an incomplete multi-byte sequence and will throw
		const badValue = '%E0%A4%A';
		expect(decodeCookieValue(badValue)).toBe(badValue);
	});

	it('returns the value as-is for non-encoded input', () => {
		expect(decodeCookieValue('plainstring')).toBe('plainstring');
	});
});

describe('getCookieHeader', () => {
	it('returns a cookie header string for a simple object', () => {
		const cookies = { foo: 'bar', baz: 'qux' };
		const header = getCookieHeader(cookies);
		expect(header).toBe('foo=bar;baz=qux');
	});

	it('encodes special characters in keys and values', () => {
		const cookies = { 'f o=o': 'b@r;baz', 'a&b': 'c=d' };
		const header = getCookieHeader(cookies);
		const expected = `${encodeURIComponent('f o=o')}=${encodeURIComponent('b@r;baz')};`
			+ `${encodeURIComponent('a&b')}=${encodeURIComponent('c=d')}`;
		expect(header).toBe(expected);
	});

	it('returns an empty string for an empty object', () => {
		const header = getCookieHeader({});
		expect(header).toBe('');
	});
});
