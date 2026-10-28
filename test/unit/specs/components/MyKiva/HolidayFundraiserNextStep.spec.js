import { nextTick } from 'vue';
import { render } from '@testing-library/vue';
import HolidayFundraiserNextStep from '#src/components/MyKiva/HolidayFundraiserNextStep';

const trackedClicks = [];

const renderComponent = () => render(HolidayFundraiserNextStep, {
	global: {
		provide: {
			$kvTrackEvent: vi.fn(),
		},
		directives: {
			'kv-track-event': {
				mounted(el, binding) {
					trackedClicks.push(binding.value);
				},
			},
		},
	},
});

describe('HolidayFundraiserNextStep', () => {
	beforeEach(() => {
		trackedClicks.length = 0;
	});

	it('renders the badge, heading and body copy', () => {
		const { getByText } = renderComponent();

		expect(getByText('New Kiva Fundraisers')).toBeTruthy();
		expect(getByText('Give back this holiday season with Kiva fundraisers')).toBeTruthy();
		expect(getByText('Support the causes you care about with the people that mean the most to you.'))
			.toBeTruthy();
	});

	it('links the button to the holiday fundraiser create flow in a new tab', () => {
		const { getByRole } = renderComponent();
		const link = getByRole('link', { name: 'Start a holiday fundraiser' });

		expect(link.getAttribute('href')).toBe('/gf/configure?occasion=holiday');
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toBe('noopener');
	});

	it('tracks button clicks', () => {
		renderComponent();

		expect(trackedClicks).toEqual([['portfolio', 'click', 'next-step-holiday-fundraiser']]);
	});

	describe('snowfall', () => {
		let observerCallbacks;

		beforeEach(() => {
			observerCallbacks = [];
			vi.stubGlobal('IntersectionObserver', class {
				constructor(callback) {
					observerCallbacks.push(callback);
				}

				observe() {} // eslint-disable-line class-methods-use-this

				disconnect() {} // eslint-disable-line class-methods-use-this
			});
			// observerUtils only treats IntersectionObserver as supported when this exists too
			const IntersectionObserverEntry = function IntersectionObserverEntry() {};
			IntersectionObserverEntry.prototype.intersectionRatio = 0;
			vi.stubGlobal('IntersectionObserverEntry', IntersectionObserverEntry);
		});

		afterEach(() => {
			vi.unstubAllGlobals();
		});

		const setInView = isIntersecting => observerCallbacks.forEach(callback => callback([{ isIntersecting }]));

		it('renders decorative flakes hidden from assistive technology', () => {
			const { getByTestId } = renderComponent();
			const snowfall = getByTestId('holiday-snowfall');

			expect(snowfall.getAttribute('aria-hidden')).toBe('true');
			expect(snowfall.querySelectorAll('.snowflake')).toHaveLength(12);
		});

		it('only animates while the card is in view', async () => {
			const { getByTestId } = renderComponent();
			const snowfall = getByTestId('holiday-snowfall');

			setInView(true);
			await nextTick();
			expect(snowfall.classList.contains('snowfall--paused')).toBe(false);

			setInView(false);
			await nextTick();
			expect(snowfall.classList.contains('snowfall--paused')).toBe(true);
		});
	});
});
