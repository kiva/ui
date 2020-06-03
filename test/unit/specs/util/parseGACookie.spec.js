import cookieStore from '@/util/cookieStore';
import parseGACookie from '@/util/parseGACookie';

describe('parseGACookie.js', () => {
	afterEach(() => {
		cookieStore.reset({});
	});

	it('returns the campaign, campaign content, gclid, medium, and source from the GA cookie', () => {
		cookieStore.reset({
			// eslint-disable-next-line max-len
			__utmz: '157125126.1563567366.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)|utmcct=(some,content)|utmgclid=(an-id)',
		});
		expect(parseGACookie()).toEqual({
			campaign: 'direct',
			campaignContent: 'somecontent',
			gclid: 'an-id',
			medium: 'none',
			source: 'direct',
		});
	});

	it('returns a partial object if only some of the wanted data is defined in the GA cookie', () => {
		cookieStore.reset({
			__utmz: '157125126.1563567366.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)',
		});
		expect(parseGACookie()).toEqual({
			campaign: 'direct',
			medium: 'none',
			source: 'direct',
		});
	});

	it('returns an empty object if the GA cookie contains no relevant values', () => {
		cookieStore.reset({
			__utmz: '157125126.1563567366.1.1.utmcx=(n/a)|utmcll=(no-show)',
		});
		expect(parseGACookie()).toEqual({});
	});

	it('returns an empty object if the GA cookie is not present', () => {
		expect(parseGACookie()).toEqual({});
	});
});
