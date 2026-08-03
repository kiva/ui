import { trackFBCustomEvent } from '@kiva/kv-analytics';
import { META_EVENTS, trackDonationMetaEvent } from '#src/util/metaEvents';

vi.mock('@kiva/kv-analytics', () => ({ trackFBCustomEvent: vi.fn() }));

describe('metaEvents.js', () => {
	beforeEach(() => {
		trackFBCustomEvent.mockClear();
	});

	it('defines the UI Meta event names', () => {
		expect(META_EVENTS).toEqual({
			ACCOUNT_CREATED: 'accountCreated',
			DONATION: 'donation',
			EMAIL_SIGN_UP: 'emailSignUp',
			KIVA_CARD_REDEMPTION: 'kivaCardRedemption',
		});
	});

	it('tracks a positive donation with consistent properties', () => {
		expect(trackDonationMetaEvent('25.00')).toBe(true);
		expect(trackFBCustomEvent).toHaveBeenCalledWith('donation', {
			donationTotal: '25.00',
			value: 25,
			currency: 'USD',
		});
	});

	it.each([null, undefined, '', '0.00', '-1', 'invalid'])('ignores invalid donation total %s', total => {
		expect(trackDonationMetaEvent(total)).toBe(false);
		expect(trackFBCustomEvent).not.toHaveBeenCalled();
	});
});
