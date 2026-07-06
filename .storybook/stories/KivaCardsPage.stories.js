import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

import KivaCardsPage from '#src/pages/Portfolio/KivaCards/KivaCardsPage';
import { ACTIVE, REDEEMED, EXPIRED, CANCELLED } from '#src/api/fixtures/KivaCardStatusEnum';
import { EMAIL, LENDER, POSTAL } from '#src/api/fixtures/KivaCardDeliveryEnum';

export default {
	title: 'Page/Portfolio/Kiva Cards',
	component: KivaCardsPage,
	// Render edge-to-edge (no Storybook canvas padding) since these stories mount the
	// full WwwPage frame; 'padded' would fake side whitespace around the page.
	parameters: { layout: 'fullscreen' },
};

// Fixed Unix timestamps (seconds) so the rendered dates stay deterministic.
const PURCHASED_ON = 1704067200; // Jan 1, 2024
const REDEEMED_ON = 1706745600; // Feb 1, 2024
const DELIVERED_ON = 1704153600; // Jan 2, 2024
const SCHEDULED_ON = 1735732800; // Jan 1, 2025
const DONATION_ON = 1767139200; // Dec 31, 2025
const CANCELLED_ON = 1704240000; // Jan 3, 2024

// Build a card with sensible defaults; each fixture overrides only the fields it needs.
let nextId = 0;
const card = overrides => {
	nextId += 1;
	return {
		id: nextId,
		amount: 25,
		code: 'ABCD-1234-EFGH',
		status: ACTIVE,
		createTime: PURCHASED_ON,
		redeemTime: 0,
		deliveryType: EMAIL,
		recipientName: '',
		recipientEmail: '',
		recipientLender: '',
		notifyRecipient: false,
		expiresOn: 0,
		cancelTime: 0,
		scheduledDeliveryDate: 0,
		actualDeliveryDate: 0,
		mailing: null,
		redeemer: null,
		...overrides,
	};
};

// One card per row state, so the populated page exercises every KivaCardListItem branch.
const allCards = [
	// Redeemed by a public lender: avatar + linked profile name.
	card({
		status: REDEEMED,
		amount: 50,
		redeemTime: REDEEMED_ON,
		redeemer: {
			isPublic: true,
			name: 'Jamie Rivera',
			lenderPublicId: 'jamie-rivera',
			image: { id: 1, url: 'https://placehold.co/80x80' },
		},
	}),
	// Redeemed by a private lender: name only.
	card({
		status: REDEEMED,
		redeemTime: REDEEMED_ON,
		redeemer: { isPublic: false, name: 'Anonymous Lender', lenderPublicId: null, image: null },
	}),
	// Redeemed but the redeemer record is missing.
	card({ status: REDEEMED, redeemTime: REDEEMED_ON, redeemer: null }),
	// Postal delivery, not yet redeemed: mailing address block + print link.
	card({
		deliveryType: POSTAL,
		amount: 100,
		mailing: {
			firstName: 'Dana',
			lastName: 'Lee',
			address: '123 Main St',
			address2: 'Apt 4',
			city: 'Portland',
			state: 'OR',
			zip: '97201',
		},
	}),
	// Email delivery, notified and delivered: "Sent to:" + Remind button + delivered date.
	card({
		deliveryType: EMAIL,
		amount: 35,
		notifyRecipient: true,
		recipientName: 'Sam Carter',
		recipientEmail: 'sam@example.com',
		actualDeliveryDate: DELIVERED_ON,
	}),
	// Email delivery, notified but not yet sent: "Will be sent to:" + target delivery date.
	card({
		deliveryType: EMAIL,
		amount: 20,
		notifyRecipient: true,
		recipientName: 'Priya Nair',
		recipientEmail: 'priya@example.com',
		scheduledDeliveryDate: SCHEDULED_ON,
	}),
	// Lender delivery: recipient shown as the lender handle.
	card({
		deliveryType: LENDER,
		amount: 40,
		notifyRecipient: true,
		recipientName: 'Alex Chen',
		recipientLender: 'kiva-team-lender',
		actualDeliveryDate: DELIVERED_ON,
	}),
	// Not notified ("Intended for:"), active, and will convert to a donation on a future date.
	card({ deliveryType: EMAIL, recipientName: 'Taylor Brooks', expiresOn: DONATION_ON }),
	// Expired card that was converted to a donation.
	card({ status: EXPIRED, amount: 15, deliveryType: EMAIL, recipientName: 'Jordan Kim', expiresOn: DONATION_ON }),
	// Cancelled card.
	card({ status: CANCELLED, deliveryType: EMAIL, recipientName: 'Casey Wong', cancelTime: CANCELLED_ON }),
];

const operationName = op => op?.definitions
	?.find(def => def.kind === 'OperationDefinition')?.name?.value;

// Apollo mock that only intercepts the page's MyKivaCards query (loading / error / data),
// and defers every other operation (site frame, menus) to the generic story mock so the
// surrounding WwwPage chrome still renders.
const kivaCardsApollo = ({ result, loading = false, error = false } = {}) => {
	const base = apolloStoryMixin();
	return {
		provide: {
			...base.provide,
			apollo: {
				...base.provide.apollo,
				query(options) {
					if (operationName(options?.query) !== 'MyKivaCards') {
						return base.provide.apollo.query(options);
					}
					if (loading) {
						return new Promise(() => {});
					}
					if (error) {
						return Promise.reject(new Error('Failed to load Kiva Cards'));
					}
					return Promise.resolve({
						data: {
							my: { id: 'me', userAccount: { id: 'acct', purchasedKivaCards: result } },
						},
					});
				},
			},
		},
	};
};

const page = mixin => () => ({
	mixins: [mixin, cookieStoreStoryMixin(), kvAuth0StoryMixin],
	components: { KivaCardsPage },
	template: '<kiva-cards-page />',
});

// A withdrawable account with a card in every state.
export const Populated = page(kivaCardsApollo({
	result: { total: allCards.length, canWithdraw: true, values: allCards },
}));

// Same data but a large total, so the pager renders.
export const WithPagination = page(kivaCardsApollo({
	result: { total: 24, canWithdraw: true, values: allCards },
}));

// Query never resolves: the page shows its loading skeleton.
export const Loading = page(kivaCardsApollo({ loading: true }));

// Query rejects: the list shows the error state.
export const ErrorState = page(kivaCardsApollo({ error: true }));

// Withdrawable account with no cards: shows the "purchased no Kiva Cards" prompt.
export const EmptyWithdrawable = page(kivaCardsApollo({
	result: { total: 0, canWithdraw: true, values: [] },
}));

// Non-withdrawable account with no cards: shows the non-withdrawable warning instead.
export const EmptyNonWithdrawable = page(kivaCardsApollo({
	result: { total: 0, canWithdraw: false, values: [] },
}));
