import { render, fireEvent } from '@testing-library/vue';
import AlmostFundedNextStep from '#src/components/MyKiva/AlmostFundedNextStep';

const mockTrackEvent = vi.fn();
const mockPush = vi.fn();

vi.mock('vue-router', () => ({
	useRouter: () => ({ push: mockPush }),
}));

const renderComponent = () => {
	return render(AlmostFundedNextStep, {
		global: {
			provide: {
				$kvTrackEvent: mockTrackEvent,
			},
		},
	});
};

describe('AlmostFundedNextStep', () => {
	beforeEach(() => {
		mockTrackEvent.mockClear();
		mockPush.mockClear();
	});

	it('renders the card with correct heading', () => {
		const { getByText } = renderComponent();
		expect(getByText('Help these borrowers over the finish line')).toBeTruthy();
	});

	it('renders the Almost funded badge', () => {
		const { getByText } = renderComponent();
		expect(getByText('Almost funded!')).toBeTruthy();
	});

	it('renders the CTA button', () => {
		const { getByText } = renderComponent();
		expect(getByText('See almost funded loans')).toBeTruthy();
	});

	it('navigates to combo page on CTA click', async () => {
		const { getByText } = renderComponent();
		await fireEvent.click(getByText('See almost funded loans'));
		expect(mockPush).toHaveBeenCalledWith('/lend/filter?sortBy=amountLeft');
	});

	it('tracks click event on CTA click', async () => {
		const { getByText } = renderComponent();
		await fireEvent.click(getByText('See almost funded loans'));
		expect(mockTrackEvent).toHaveBeenCalledWith(
			'portfolio',
			'click',
			'next-step-almost-funded'
		);
	});
});
