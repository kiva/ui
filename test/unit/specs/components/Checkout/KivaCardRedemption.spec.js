import KivaCardRedemption from '#src/components/Checkout/KivaCardRedemption';
import { trackMetaEvent } from '#src/util/metaEvents';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { flushPromises } from '@vue/test-utils';

vi.mock('#src/util/metaEvents', () => ({
	META_EVENTS: { KIVA_CARD_REDEMPTION: 'kivaCardRedemption' },
	trackMetaEvent: vi.fn(),
}));

// The component is mostly presentational; these cover the redemption result handling,
// exercising the method directly rather than mounting the lightbox and image assets.
// updateKivaCard does not return its promise chain, so each case flushes before asserting.
describe('KivaCardRedemption updateKivaCard', () => {
	const makeContext = (mutationResult = {}) => ({
		apollo: { mutate: vi.fn().mockResolvedValue(mutationResult) },
		kivaCardCode: 'ABC123',
		$emit: vi.fn(),
		$kvTrackEvent: vi.fn(),
		$showTipMsg: vi.fn(),
	});

	beforeEach(() => {
		trackMetaEvent.mockClear();
	});

	it('reports kivaCardRedemption when the code is applied', async () => {
		const context = makeContext();

		KivaCardRedemption.methods.updateKivaCard.call(context, 'redemption_code');
		await flushPromises();

		expect(trackMetaEvent).toHaveBeenCalledWith('kivaCardRedemption');
		expect(context.$emit).toHaveBeenCalledWith('refreshtotals', 'kiva-card-applied');
	});

	it('does not report when the mutation returns errors', async () => {
		const context = makeContext({ errors: [{ message: 'Invalid code' }] });

		KivaCardRedemption.methods.updateKivaCard.call(context, 'redemption_code');
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith('Invalid code', 'error');
		expect(trackMetaEvent).not.toHaveBeenCalled();
	});

	it('does not report when the mutation rejects', async () => {
		// the component logs the failure itself; keep it out of the test output
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		const context = makeContext();
		context.apollo.mutate.mockRejectedValue(new Error('network'));

		KivaCardRedemption.methods.updateKivaCard.call(context, 'redemption_code');
		await flushPromises();

		expect(trackMetaEvent).not.toHaveBeenCalled();
		expect(consoleError).toHaveBeenCalled();
		consoleError.mockRestore();
	});
});
