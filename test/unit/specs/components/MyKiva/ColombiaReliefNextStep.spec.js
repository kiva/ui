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
		expect(getByText('Donate to communities impacted by the Colombia earthquake')).toBeTruthy();
	});

	it('renders the Recovery fund badge', () => {
		const { getByText } = renderComponent();
		expect(getByText('Recovery fund')).toBeTruthy();
	});

	it('renders the CTA button', () => {
		const { getByText } = renderComponent();
		expect(getByText('Donate')).toBeTruthy();
	});

	it('navigates to the Colombia giving fund on CTA click', async () => {
		const { getByText } = renderComponent();
		await fireEvent.click(getByText('Donate'));
		expect(window.location.href).toContain(`/gf/${givingFundIds.COLOMBIA_DISASTER_RELIEF}`);
	});

	it('tracks click event on CTA click', async () => {
		const { getByText } = renderComponent();
		await fireEvent.click(getByText('Donate'));
		expect(mockTrackEvent).toHaveBeenCalledWith(
			'portfolio',
			'click',
			'next-step-co-recovery-fund'
		);
	});
});
