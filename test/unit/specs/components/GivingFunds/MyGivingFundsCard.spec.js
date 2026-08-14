/* eslint-disable import/no-extraneous-dependencies */
import { render, screen } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import MyGivingFundsCard from '#src/components/GivingFunds/MyGivingFundsCard';
import useGivingFund from '#src/composables/useGivingFund';
import { givingFundIds } from '#src/util/givingFundUtils';

vi.mock('#src/composables/useGivingFund', () => ({
	default: vi.fn(),
}));

vi.mock('@kiva/kv-components', () => ({
	KvButton: {
		name: 'KvButton',
		props: ['to'],
		template: '<a :href="to"><slot /></a>',
	},
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		template: '<span />',
	},
}));

describe('MyGivingFundsCard', () => {
	const mockUseGivingFund = ({ myFundsCount = 0, contributedFundIds = [] } = {}) => {
		const mocks = {
			fetchMyGivingFundsCount: vi.fn().mockResolvedValue({ givingFunds: { totalCount: myFundsCount } }),
			getFundsContributedToIds: vi.fn().mockResolvedValue(contributedFundIds),
		};
		useGivingFund.mockReturnValue(mocks);
		return mocks;
	};

	const mountCard = ({ props = {}, $kvTrackEvent = vi.fn() } = {}) => {
		const wrapper = render(MyGivingFundsCard, {
			props,
			global: {
				provide: {
					apollo: {},
					$kvTrackEvent,
				},
				directives: {
					kvTrackEvent: () => {},
				},
			},
		});
		return { ...wrapper, $kvTrackEvent };
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the default card immediately and shows the funds copy once data resolves', async () => {
		mockUseGivingFund({ myFundsCount: 2, contributedFundIds: ['fund-1', 'fund-2'] });

		mountCard();

		expect(screen.getByText('Check in on your giving funds')).toBeTruthy();
		const link = screen.getByText('See your giving funds').closest('a');
		expect(link.getAttribute('href')).toBe('/gfm');

		await flushPromises();

		expect(screen.getByText(
			'You have 2 funds making an impact and have contributed to 2 funds.'
		)).toBeTruthy();
	});

	it('renders the disaster-relief variant from the prop, fetching nothing, firing the view event once', async () => {
		const $kvTrackEvent = vi.fn();
		const mocks = mockUseGivingFund();

		mountCard({ props: { isDisasterReliefOnly: true }, $kvTrackEvent });

		expect(screen.getByText('Check in on the Colombia earthquake recovery fund')).toBeTruthy();
		const link = screen.getByText('View fund').closest('a');
		expect(link.getAttribute('href')).toBe(`/gf/${givingFundIds.COLOMBIA_DISASTER_RELIEF}`);
		expect(screen.queryByText(/You have/)).toBeFalsy();

		await flushPromises();

		expect($kvTrackEvent).toHaveBeenCalledTimes(1);
		expect($kvTrackEvent).toHaveBeenCalledWith('portfolio', 'view', 'see-your-giving-funds', 'disaster-relief');
		expect(mocks.fetchMyGivingFundsCount).not.toHaveBeenCalled();
		expect(mocks.getFundsContributedToIds).not.toHaveBeenCalled();
	});

	it('never fires the view event when isDisasterReliefOnly is not set', async () => {
		const $kvTrackEvent = vi.fn();
		mockUseGivingFund({ myFundsCount: 1, contributedFundIds: ['fund-1'] });

		mountCard({ $kvTrackEvent });

		await flushPromises();

		expect($kvTrackEvent).not.toHaveBeenCalled();
	});
});
