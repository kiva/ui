import renderDocumentCookies from '../../../../src/rendering/documentCookies';

describe('renderDocumentCookies', () => {
	it('renders a script tag with document.cookie assignments', () => {
		const cookieStore = {
			getSetCookies: () => [
				'foo=bar; Path=/',
				'baz=qux; Path=/'
			]
		};
		const expected = '<script>document.cookie=\'foo=bar; Path=/\';'
			+ 'document.cookie=\'baz=qux; Path=/\';</script>';
		const result = renderDocumentCookies(cookieStore);
		expect(result).toBe(expected);
	});

	it('returns an empty string if there are no cookies', () => {
		const cookieStore = { getSetCookies: () => [] };
		const result = renderDocumentCookies(cookieStore);
		expect(result).toBe('');
	});
});
