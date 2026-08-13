/* eslint-disable import/no-extraneous-dependencies */
import { render, screen, waitFor } from '@testing-library/vue';
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
		useGivingFund.mockReturnValue({
			fetchMyGivingFundsCount: vi.fn().mockResolvedValue({ givingFunds: { totalCount: myFundsCount } }),
			getFundsContributedToIds: vi.fn().mockResolvedValue(contributedFundIds),
		});
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

	it('shows the disaster-relief-only variant and fires a single view event', async () => {
		const $kvTrackEvent = vi.fn();
		mockUseGivingFund({ myFundsCount: 0, contributedFundIds: [givingFundIds.COLOMBIA_DISASTER_RELIEF] });

		mountCard({ $kvTrackEvent });

		await flushPromises();

		await waitFor(() => {
			expect(screen.getByText('Check in on the Colombia earthquake recovery fund')).toBeTruthy();
		});

		const link = screen.getByText('View fund').closest('a');
		expect(link.getAttribute('href')).toBe(`/gf/${givingFundIds.COLOMBIA_DISASTER_RELIEF}`);
		expect(screen.queryByText(/You have/)).toBeFalsy();

		expect($kvTrackEvent).toHaveBeenCalledTimes(1);
		expect($kvTrackEvent).toHaveBeenCalledWith('portfolio', 'view', 'see-your-giving-funds', 'disaster-relief');
	});

	it('keeps the normal card for mixed participation and does not fire a view event', async () => {
		const $kvTrackEvent = vi.fn();
		mockUseGivingFund({
			myFundsCount: 0,
			contributedFundIds: [givingFundIds.COLOMBIA_DISASTER_RELIEF, 'other-id'],
		});

		mountCard({ $kvTrackEvent });

		await flushPromises();

		expect(screen.getByText('Check in on your giving funds')).toBeTruthy();
		const link = screen.getByText('See your giving funds').closest('a');
		expect(link.getAttribute('href')).toBe('/gfm');

		expect($kvTrackEvent).not.toHaveBeenCalled();
	});

	it('renders nothing when hideDisasterReliefOnly is true and the lender is disaster-relief-only', async () => {
		const $kvTrackEvent = vi.fn();
		mockUseGivingFund({ myFundsCount: 0, contributedFundIds: [givingFundIds.COLOMBIA_DISASTER_RELIEF] });

		const { container } = mountCard({ props: { hideDisasterReliefOnly: true }, $kvTrackEvent });

		await flushPromises();

		expect(container.querySelector('.giving-fund-card')).toBeFalsy();
		expect($kvTrackEvent).not.toHaveBeenCalled();
	});

	it('renders the card when hideDisasterReliefOnly is true but the lender has normal fund activity', async () => {
		mockUseGivingFund({ myFundsCount: 1, contributedFundIds: [] });

		const { container } = mountCard({ props: { hideDisasterReliefOnly: true } });

		expect(container.querySelector('.giving-fund-card')).toBeFalsy();

		await flushPromises();

		await waitFor(() => {
			expect(container.querySelector('.giving-fund-card')).toBeTruthy();
		});
		expect(screen.getByText('Check in on your giving funds')).toBeTruthy();
	});
});
