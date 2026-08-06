import InstantDonationThanks from '#src/pages/InstantActions/InstantDonationThanks';
import { trackDonationMetaEvent } from '#src/util/metaEvents';

vi.mock('#src/util/metaEvents', () => ({
	trackDonationMetaEvent: vi.fn(),
}));

describe('InstantDonationThanks donation Meta event', () => {
	beforeEach(() => {
		trackDonationMetaEvent.mockClear();
	});

	it('reports the confirmed donation amount', () => {
		InstantDonationThanks.mounted.call({
			resultData: { amount: '25.00', transactionId: '12345' },
		});

		expect(trackDonationMetaEvent).toHaveBeenCalledWith('25.00');
	});

	it('does not report a result without a confirmed transaction', () => {
		InstantDonationThanks.mounted.call({
			resultData: { amount: null, transactionId: null },
		});

		expect(trackDonationMetaEvent).not.toHaveBeenCalled();
	});
});
