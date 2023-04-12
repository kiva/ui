import { getFullUrl } from '@/util/urlUtils';

describe('urlUtils.js', () => {
	describe('getFullUrl', () => {
		it('return a valid url', () => {
			expect(getFullUrl('https://www.facebook.com/dialog/share', {
				app_id: 123,
				display: 'page',
				href: 'http://kiva.org',
				redirect_uri: 'http://kiva.org',
				quote: 'message here',
			}))
				// eslint-disable-next-line max-len
				.toBe('https://www.facebook.com/dialog/share?app_id=123&display=page&href=http%3A%2F%2Fkiva.org&redirect_uri=http%3A%2F%2Fkiva.org&quote=message%20here');
		});
		it('return a valid url with encoded params', () => {
			expect(getFullUrl('https://www.facebook.com/dialog/share', {
				quote: 'Does your quote include characters that need to be encoded? #kiva #kiva/test',
			}))
				// eslint-disable-next-line max-len
				.toBe('https://www.facebook.com/dialog/share?quote=Does%20your%20quote%20include%20characters%20that%20need%20to%20be%20encoded%3F%20%23kiva%20%23kiva%2Ftest');
		});
		it('return a valid url if args contain query strings already', () => {
			expect(getFullUrl('https://www.facebook.com/dialog/share', {
				app_id: 123,
				display: 'page',
				href: '&utm_source=facebook.com&utm_medium=social&utm_campaign=social_share_bp_pfp',
				redirect_uri: 'http://kiva.org?kiva_transaction_id=123',
				quote: 'message here',
			}))
				// eslint-disable-next-line max-len
				.toBe('https://www.facebook.com/dialog/share?app_id=123&display=page&href=%26utm_source%3Dfacebook.com%26utm_medium%3Dsocial%26utm_campaign%3Dsocial_share_bp_pfp&redirect_uri=http%3A%2F%2Fkiva.org%3Fkiva_transaction_id%3D123&quote=message%20here');
		});
		it('return a valid url if missing args', () => {
			expect(getFullUrl('https://www.twitter.com/')).toBe('https://www.twitter.com/');
		});
		it('return a valid url if empty args', () => {
			expect(getFullUrl('https://www.facebook.com/dialog/share', {}))
				.toBe('https://www.facebook.com/dialog/share');
		});
	});
});
