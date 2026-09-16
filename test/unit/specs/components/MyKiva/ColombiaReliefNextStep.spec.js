import { render, fireEvent } from '@testing-library/vue';
import ColombiaReliefNextStep from '#src/components/MyKiva/ColombiaReliefNextStep';
import { givingFundIds } from '#src/util/givingFundUtils';

const mockTrackEvent = vi.fn();

const renderComponent = () => {
	return render(ColombiaReliefNextStep, {
		global: {
			provide: {
				$kvTrackEvent: mockTrackEvent,
			},
		},
	});
};

describe('ColombiaReliefNextStep', () => {
	beforeEach(() => {
		mockTrackEvent.mockClear();
	});

	it('renders the card with correct heading', () => {
		const { getByText } = renderComponent();
		expect(getByText('Support Colombia earthquake disaster relief')).toBeTruthy();
	});

	it('renders the Support today badge', () => {
		const { getByText } = renderComponent();
		expect(getByText('Support today')).toBeTruthy();
	});

	it('renders the CTA button', () => {
		const { getByText } = renderComponent();
		expect(getByText('Go to fundraiser')).toBeTruthy();
	});

	it('navigates to the Colombia giving fund on CTA click', async () => {
		const { getByText } = renderComponent();
		await fireEvent.click(getByText('Go to fundraiser'));
		expect(window.location.href).toContain(`/gf/${givingFundIds.COLOMBIA_DISASTER_RELIEF}`);
	});

	it('tracks click event on CTA click', async () => {
		const { getByText } = renderComponent();
		await fireEvent.click(getByText('Go to fundraiser'));
		expect(mockTrackEvent).toHaveBeenCalledWith(
			'portfolio',
			'click',
			'next-step-co-recovery-fund'
		);
	});
});
