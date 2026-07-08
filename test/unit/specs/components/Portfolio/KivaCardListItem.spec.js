import { render } from '@testing-library/vue';
import KivaCardListItem from '#src/components/Portfolio/KivaCardListItem';
import numeralFilter from '#src/plugins/numeral-filter';

const baseCard = {
	id: 111,
	amount: '50.00',
	code: 'TP9J-RHH9-QTJR-Y7XU',
	status: 'active',
	createTime: 1450000000,
	redeemTime: null,
	deliveryType: 'email',
	recipientName: null,
	recipientEmail: null,
	recipientLender: null,
	notifyRecipient: false,
	message: null,
	expireable: false,
	expiresOn: null,
	cancelTime: null,
	scheduledDeliveryDate: null,
	actualDeliveryDate: null,
	mailing: null,
	redeemer: null,
};

const renderItem = card => render(KivaCardListItem, {
	props: { card: { ...baseCard, ...card } },
	global: {
		directives: { 'kv-track-event': {} },
		mocks: {
			$filters: { numeral: numeralFilter },
		},
		stubs: {
			KvGrid: { template: '<div><slot /></div>' },
		},
	},
});

describe('KivaCardListItem', () => {
	it('formats the amount and shows the code', () => {
		const { getByText } = renderItem({});
		expect(getByText('$50.00')).toBeTruthy();
		expect(getByText('TP9J-RHH9-QTJR-Y7XU')).toBeTruthy();
	});

	it('shows the print link for an active, not-redeemed card with the raw code', () => {
		const { getByText } = renderItem({ status: 'active' });
		const link = getByText('(print this Kiva Card)');
		expect(link.getAttribute('href')).toBe('/gifts/kiva-cards/print?giftCode=TP9JRHH9QTJRY7XU');
		expect(getByText('Not redeemed')).toBeTruthy();
	});

	it('links to the redeemer profile for a public-lender redemption', () => {
		const { getByText } = renderItem({
			status: 'redeemed',
			redeemTime: 1487000000,
			redeemer: {
				isPublic: true,
				name: 'Casey',
				lenderPublicId: 'casey8526',
				image: { id: '1', url: 'https://example.com/a.jpg' },
			},
		});
		const link = getByText('Casey');
		expect(link.getAttribute('href')).toBe('/lender/casey8526');
		expect(getByText('Redeemed on Date:')).toBeTruthy();
	});

	it('shows the private redeemer name without a profile link', () => {
		const { getByText, queryByText } = renderItem({
			status: 'redeemed',
			redeemer: {
				isPublic: false, name: 'Jane Doe', lenderPublicId: null, image: null
			},
		});
		expect(getByText('Jane Doe')).toBeTruthy();
		expect(queryByText('(print this Kiva Card)')).toBeNull();
	});

	it('shows the postal mailing address for postal delivery', () => {
		const { getByText } = renderItem({
			deliveryType: 'postal',
			mailing: {
				firstName: 'Olson',
				lastName: 'Family',
				address: '123 Main St',
				address2: '',
				city: 'Portland',
				state: 'OR',
				zip: '97201',
			},
		});
		expect(getByText('Intended for:')).toBeTruthy();
		expect(getByText(/Olson Family/)).toBeTruthy();
		expect(getByText(/Portland, OR 97201/)).toBeTruthy();
	});

	it('shows converted-to-donation for an expired card', () => {
		const { getByText } = renderItem({ status: 'expired', expiresOn: 1500000000 });
		expect(getByText('Converted to donation on:')).toBeTruthy();
	});

	it('shows a Remind link only for a delivered, non-expired card with a recipient email', () => {
		const { getByText } = renderItem({
			status: 'active',
			notifyRecipient: true,
			recipientName: 'Sam',
			recipientEmail: 'sam@example.com',
			actualDeliveryDate: 1460000000,
		});
		const remind = getByText('Remind');
		expect(remind.getAttribute('href')).toBe('/gifts/kiva-cards/remind?id=111');
	});

	it('shows "name at <email>" for a delivered email gift', () => {
		const { getByText } = renderItem({
			status: 'active',
			deliveryType: 'email',
			notifyRecipient: true,
			recipientName: 'Sam',
			recipientEmail: 'sam@example.com',
			actualDeliveryDate: 1460000000,
		});
		expect(getByText('Sent to:')).toBeTruthy();
		expect(getByText('Sam at <sam@example.com>')).toBeTruthy();
	});

	it('shows the recipient name (not the lender) for a lender gift that is not notified', () => {
		const { getByText, queryByText } = renderItem({
			status: 'active',
			deliveryType: 'lender',
			notifyRecipient: false,
			recipientName: 'Sam Recipient',
			recipientLender: 'lenderpublicid',
		});
		expect(getByText('Intended for:')).toBeTruthy();
		expect(getByText('Sam Recipient')).toBeTruthy();
		expect(queryByText('lenderpublicid')).toBeNull();
	});

	it('shows "Will be sent to" and the target delivery date for a scheduled, undelivered gift', () => {
		const { getByText } = renderItem({
			status: 'active',
			deliveryType: 'email',
			notifyRecipient: true,
			recipientName: 'Sam',
			recipientEmail: 'sam@example.com',
			scheduledDeliveryDate: 1490000000,
		});
		expect(getByText('Will be sent to:')).toBeTruthy();
		expect(getByText('Sam at <sam@example.com>')).toBeTruthy();
		expect(getByText('Target Delivery Date:')).toBeTruthy();
	});

	it('shows the delivered date for a delivered gift', () => {
		const { getByText } = renderItem({
			status: 'active',
			notifyRecipient: true,
			recipientName: 'Sam',
			recipientEmail: 'sam@example.com',
			actualDeliveryDate: 1460000000,
		});
		expect(getByText('Delivered on Date:')).toBeTruthy();
	});

	it('shows the cancelled date for a cancelled card', () => {
		const { getByText } = renderItem({ status: 'cancelled', cancelTime: 1470000000 });
		expect(getByText('Cancelled on Date:')).toBeTruthy();
	});

	it('shows "will become a donation on" for an active card with a future expiration', () => {
		const { getByText } = renderItem({ status: 'active', expiresOn: 1500000000 });
		expect(getByText('Will become a donation on:')).toBeTruthy();
		expect(getByText('Not redeemed')).toBeTruthy();
	});
});
