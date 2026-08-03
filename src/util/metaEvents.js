import { trackFBCustomEvent } from '@kiva/kv-analytics';

export const META_EVENTS = {
	ACCOUNT_CREATED: 'accountCreated',
	DONATION: 'donation',
	EMAIL_SIGN_UP: 'emailSignUp',
	KIVA_CARD_REDEMPTION: 'kivaCardRedemption',
};

export function trackMetaEvent(eventName, eventData = null) {
	if (eventData === null) {
		trackFBCustomEvent(eventName);
		return;
	}
	trackFBCustomEvent(eventName, eventData);
}

export function trackDonationMetaEvent(donationTotal) {
	const value = Number(donationTotal);
	if (!Number.isFinite(value) || value <= 0) {
		return false;
	}

	trackMetaEvent(META_EVENTS.DONATION, {
		donationTotal,
		value,
		currency: 'USD',
	});
	return true;
}
