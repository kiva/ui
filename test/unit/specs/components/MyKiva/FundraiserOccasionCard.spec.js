import { render } from '@testing-library/vue';
import FundraiserOccasionCard from '#src/components/MyKiva/FundraiserOccasionCard';

const props = {
	id: 'holiday',
	title: 'Holiday',
	description: 'Tis the season to give back',
	to: '/gf/configure?occasion=holiday',
	image: 'https://images.ctfassets.net/j0p9a6ql0rn7/abc/def/fundraiser-occasion-holiday.jpg',
	imageAlt: 'A red heart ornament hanging on a lit holiday tree',
};

const renderComponent = (overrides = {}) => render(FundraiserOccasionCard, {
	props: { ...props, ...overrides },
	global: {
		directives: {
			'kv-track-event': {},
		},
	},
});

describe('FundraiserOccasionCard', () => {
	it('renders the occasion name and description', () => {
		const { getByText } = renderComponent();
		expect(getByText('Holiday')).toBeTruthy();
		expect(getByText('Tis the season to give back')).toBeTruthy();
	});

	it('makes the whole card a real navigation to the configure flow', () => {
		// /gf/configure is served by cms-page-server, so a router-link would hit the SPA 404.
		const { getByRole } = renderComponent();
		expect(getByRole('link').getAttribute('href')).toBe('/gf/configure?occasion=holiday');
	});

	it('renders the image with its alt text', () => {
		const { getByAltText } = renderComponent();
		expect(getByAltText(props.imageAlt)).toBeTruthy();
	});

	it('requests a width-constrained Contentful image', () => {
		const { getByAltText } = renderComponent();
		const src = getByAltText(props.imageAlt).getAttribute('src');
		expect(src).toContain('w=224');
		expect(src).toContain('fm=webp');
	});
});
