import CookieStore from '../../../../src/util/cookieStore';
import parseGACookie from '../../../../src/util/parseGACookie';

describe('parseGACookie.js', () => {
	it('returns the campaign, campaign content, gclid, medium, and source from the GA cookie', () => {
		const cookieStore = new CookieStore({
			// eslint-disable-next-line max-len
			__utmz: '157125126.1563567366.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)|utmcct=(some,content)|utmgclid=(an-id)',
		});
		expect(parseGACookie(cookieStore)).toEqual({
			campaign: 'direct',
			campaignContent: 'somecontent',
			gclid: 'an-id',
			medium: 'none',
			source: 'direct',
		});
	});

	it('returns a partial object if only some of the wanted data is defined in the GA cookie', () => {
		const cookieStore = new CookieStore({
			__utmz: '157125126.1563567366.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)',
		});
		expect(parseGACookie(cookieStore)).toEqual({
			campaign: 'direct',
			medium: 'none',
			source: 'direct',
		});
	});

	it('returns an empty object if the GA cookie contains no relevant values', () => {
		const cookieStore = new CookieStore({
			__utmz: '157125126.1563567366.1.1.utmcx=(n/a)|utmcll=(no-show)',
		});
		expect(parseGACookie(cookieStore)).toEqual({});
	});

	it('returns an empty object if the GA cookie is not present', () => {
		const cookieStore = new CookieStore();
		expect(parseGACookie(cookieStore)).toEqual({});
	});
});
