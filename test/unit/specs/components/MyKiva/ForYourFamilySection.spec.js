import { render } from '@testing-library/vue';
import ForYourFamilySection from '#src/components/MyKiva/ForYourFamilySection';

const trackedClicks = [];

const renderComponent = (props = {}) => render(ForYourFamilySection, {
	props,
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
		expect(getByRole('heading', { name: 'Happy birthday!' })).toBeTruthy();
		expect(getByText('You have funds ready to lend.')).toBeTruthy();
		expect(getByRole('heading', { name: 'Involve the whole family.' })).toBeTruthy();
		expect(getByText('Discuss how the borrower’s life differs from yours.')).toBeTruthy();
		expect(getByRole('heading', { name: 'See who you helped anytime.' })).toBeTruthy();
	});

	it('names the birthday person when given a name', () => {
		const { getByRole } = renderComponent({ bdayCardName: 'Tanya' });

		expect(getByRole('heading', { name: 'Happy birthday Tanya!' })).toBeTruthy();
	});

	it('hides the birthday card when asked', () => {
		const { queryByRole, getByRole } = renderComponent({ hideBdayCard: true });

		expect(queryByRole('heading', { name: /Happy birthday/ })).toBeNull();
		expect(queryByRole('link', { name: 'Get started' })).toBeNull();
		expect(getByRole('link', { name: 'Browse loans' })).toBeTruthy();
		expect(getByRole('link', { name: 'View your impact' })).toBeTruthy();
	});

	it('links each card button to its destination', () => {
		const { getByRole } = renderComponent();

		expect(getByRole('link', { name: 'Get started' }).getAttribute('href')).toBe('/lend');
		expect(getByRole('link', { name: 'Browse loans' }).getAttribute('href')).toBe('/lend');
		expect(getByRole('link', { name: 'View your impact' }).getAttribute('href')).toBe('/portfolio');
	});

	it('links each card button to its override when given one', () => {
		const { getByRole } = renderComponent({
			bdayCardLinkOverride: '/lend/filter?gender=female',
			lendLinkOverride: '/lend-by-category/education',
			impactLinkOverride: '/portfolio/lending-stats',
		});

		expect(getByRole('link', { name: 'Get started' }).getAttribute('href')).toBe('/lend/filter?gender=female');
		expect(getByRole('link', { name: 'Browse loans' }).getAttribute('href')).toBe('/lend-by-category/education');
		expect(getByRole('link', { name: 'View your impact' }).getAttribute('href')).toBe('/portfolio/lending-stats');
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
