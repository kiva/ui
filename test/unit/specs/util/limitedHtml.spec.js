import { htmlToText, sanitizeLimitedHtml } from '#src/util/limitedHtml';

describe('limitedHtml', () => {
	describe('htmlToText', () => {
		it('strips tags', () => {
			expect(htmlToText('<p>Hello <b>there</b> <a href="/x">friend</a></p>')).toBe('Hello there friend');
		});

		it('keeps words apart across line breaks and paragraphs', () => {
			expect(htmlToText('<p>One</p><p>Two</p>Three<br>Four<br />Five')).toBe('One Two Three Four Five');
		});

		it('drops script and style content and comments', () => {
			expect(htmlToText('a <script>alert(1)</script>b<style>p{}</style> c<!-- note -->')).toBe('a b c');
		});

		it('decodes named and numeric entities', () => {
			expect(htmlToText('Fish &amp; chips &lt;3 &quot;yum&quot; &#39;ok&#39; caf&#233; &#x2014;&nbsp;done'))
				.toBe('Fish & chips <3 "yum" \'ok\' café — done');
		});

		it('does not turn decoded entities back into tags', () => {
			expect(htmlToText('&lt;script&gt;alert(1)&lt;/script&gt;')).toBe('<script>alert(1)</script>');
		});

		it('collapses whitespace and trims', () => {
			expect(htmlToText('  a\n\n  b\t c  ')).toBe('a b c');
		});

		it('returns an empty string for missing input', () => {
			expect(htmlToText(undefined)).toBe('');
			expect(htmlToText(null)).toBe('');
		});
	});

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
			expect(sanitizeLimitedHtml('1 < 2 & "3" &lt;script&gt;'))
				.toBe('1 &lt; 2 &amp; &quot;3&quot; &lt;script&gt;');
		});

		it('balances tags', () => {
			expect(sanitizeLimitedHtml('<b>bold <p>para')).toBe('<b>bold <p>para</p></b>');
			expect(sanitizeLimitedHtml('text</b></p>')).toBe('text');
			expect(sanitizeLimitedHtml('<p><b>a</p>b')).toBe('<p><b>a</b></p>b');
		});

		it('turns newlines into breaks', () => {
			expect(sanitizeLimitedHtml('One\nTwo\r\nThree')).toBe('One<br>Two<br>Three');
		});

		it('collapses runs of breaks to one', () => {
			expect(sanitizeLimitedHtml('One<br><br />Two<br/>\r\n<br>\n\nThree')).toBe('One<br>Two<br>Three');
			expect(sanitizeLimitedHtml('One<br />\r\nTwo')).toBe('One<br>Two');
			expect(sanitizeLimitedHtml('One<br><b><br>Two</b>')).toBe('One<br><b>Two</b>');
		});

		it('drops breaks at the edges of the fragment and of paragraphs', () => {
			expect(sanitizeLimitedHtml('\n<br>Thanks!<br>\n\n')).toBe('Thanks!');
			expect(sanitizeLimitedHtml('<p><br>One<br></p>\n<p>Two<b><br></b></p>'))
				.toBe('<p>One</p><p>Two<b></b></p>');
		});

		it('drops empty paragraphs', () => {
			expect(sanitizeLimitedHtml('<p>One</p><p>&nbsp;</p><p><br></p><p>Two</p>')).toBe('<p>One</p><p>Two</p>');
		});

		it('returns an empty string for empty input', () => {
			expect(sanitizeLimitedHtml(null)).toBe('');
			expect(sanitizeLimitedHtml(undefined)).toBe('');
		});
	});
});
