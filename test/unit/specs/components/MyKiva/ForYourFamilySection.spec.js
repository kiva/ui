import { render } from '@testing-library/vue';
import ForYourFamilySection from '#src/components/MyKiva/ForYourFamilySection';

const trackedClicks = [];

const renderComponent = () => render(ForYourFamilySection, {
	global: {
		directives: {
			'kv-track-event': {
				mounted(el, binding) {
					trackedClicks.push(binding.value);
				},
			},
		},
	},
});

describe('ForYourFamilySection', () => {
	beforeEach(() => {
		trackedClicks.length = 0;
	});

	it('renders the section heading and card copy', () => {
		const { getByRole, getByText } = renderComponent();

		expect(getByRole('heading', { name: 'For your family' })).toBeTruthy();
		expect(getByRole('heading', { name: 'Happy birthday Tanya!' })).toBeTruthy();
		expect(getByText('You have funds ready to lend.')).toBeTruthy();
		expect(getByRole('heading', { name: 'Involve the whole family.' })).toBeTruthy();
		expect(getByText('Discuss how the borrower’s life differs from yours.')).toBeTruthy();
		expect(getByRole('heading', { name: 'See who you helped anytime.' })).toBeTruthy();
	});

	it('links each card button to its destination', () => {
		const { getByRole } = renderComponent();

		expect(getByRole('link', { name: 'Get started' }).getAttribute('href')).toBe('/lend');
		expect(getByRole('link', { name: 'Browse loans' }).getAttribute('href')).toBe('/lend');
		expect(getByRole('link', { name: 'View your impact' }).getAttribute('href')).toBe('/portfolio');
	});

	it('tracks button clicks', () => {
		renderComponent();

		expect(trackedClicks).toEqual([
			['portfolio', 'click', 'for-your-family-birthday'],
			['portfolio', 'click', 'for-your-family-browse-loans'],
			['portfolio', 'click', 'for-your-family-view-impact'],
		]);
	});
});
