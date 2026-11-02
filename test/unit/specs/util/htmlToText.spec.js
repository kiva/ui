import htmlToText from '#src/util/htmlToText';

describe('htmlToText', () => {
	it('strips tags', () => {
		expect(htmlToText('<p>Hello <b>there</b> <a href="/x">friend</a></p>')).toBe('Hello there friend');
	});

	it('keeps words apart across line breaks and paragraphs', () => {
		expect(htmlToText('<p>One</p><p>Two</p>Three<br>Four<br />Five')).toBe('One Two Three Four Five');
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
