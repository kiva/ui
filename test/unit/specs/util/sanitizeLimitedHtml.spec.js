import sanitizeLimitedHtml from '#src/util/sanitizeLimitedHtml';

describe('sanitizeLimitedHtml', () => {
	it('keeps b, br and p tags', () => {
		expect(sanitizeLimitedHtml('<p>Thanks to <B>you</B>!<br/>Maria</p>'))
			.toBe('<p>Thanks to <b>you</b>!<br>Maria</p>');
	});

	it('keeps links with an http(s) or root-relative href and drops other attributes', () => {
		expect(sanitizeLimitedHtml('<a href="https://kiva.org/lend" onclick="x()">Kiva</a>'))
			.toBe('<a href="https://kiva.org/lend" rel="nofollow noopener">Kiva</a>');
		expect(sanitizeLimitedHtml('<a href=\'/lend/1\'>loan</a>'))
			.toBe('<a href="/lend/1" rel="nofollow noopener">loan</a>');
	});

	it('drops unsafe hrefs', () => {
		expect(sanitizeLimitedHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>');
		expect(sanitizeLimitedHtml('<a href="java&#115;cript:alert(1)">x</a>')).toBe('<a>x</a>');
		expect(sanitizeLimitedHtml('<a href="data:text/html,hi">x</a>')).toBe('<a>x</a>');
	});

	it('strips other tags but keeps their text', () => {
		expect(sanitizeLimitedHtml('<div><img src=x onerror="alert(1)"><i>Hello</i></div>')).toBe('Hello');
	});

	it('drops script and style content and comments', () => {
		expect(sanitizeLimitedHtml('a<script>alert(1)</script>b<style>p{}</style>c<!-- note -->d')).toBe('abcd');
	});

	it('escapes text, including encoded markup', () => {
		expect(sanitizeLimitedHtml('1 < 2 & "3" &lt;script&gt;')).toBe('1 &lt; 2 &amp; &quot;3&quot; &lt;script&gt;');
	});

	it('balances tags', () => {
		expect(sanitizeLimitedHtml('<b>bold <p>para')).toBe('<b>bold <p>para</p></b>');
		expect(sanitizeLimitedHtml('text</b></p>')).toBe('text');
		expect(sanitizeLimitedHtml('<p><b>a</p>b')).toBe('<p><b>a</b></p>b');
	});

	it('trims surrounding whitespace', () => {
		expect(sanitizeLimitedHtml('\n Thanks!\n\n')).toBe('Thanks!');
	});

	it('returns an empty string for empty input', () => {
		expect(sanitizeLimitedHtml(null)).toBe('');
		expect(sanitizeLimitedHtml(undefined)).toBe('');
	});
});
