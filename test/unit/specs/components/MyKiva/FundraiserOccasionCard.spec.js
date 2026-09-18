import { render } from '@testing-library/vue';
import FundraiserOccasionCard from '#src/components/MyKiva/FundraiserOccasionCard';

const props = {
	id: 'holiday',
	title: 'This holiday, ask for real impact instead of another pair of socks.',
	linkLabel: 'Start here',
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
	it('renders the title and link label', () => {
		const { getByText } = renderComponent();
		expect(getByText(props.title)).toBeTruthy();
		expect(getByText('Start here')).toBeTruthy();
	});

	it('links to the configure flow as a real navigation', () => {
		// /gf/configure is served by cms-page-server, so a router-link would hit the SPA 404.
		const { getByText } = renderComponent();
		expect(getByText('Start here').closest('a').getAttribute('href'))
			.toBe('/gf/configure?occasion=holiday');
	});

	it('renders the image with its alt text', () => {
		const { getByAltText } = renderComponent();
		expect(getByAltText(props.imageAlt)).toBeTruthy();
	});

	it('requests a width-constrained Contentful image', () => {
		const { getByAltText } = renderComponent();
		const src = getByAltText(props.imageAlt).getAttribute('src');
		expect(src).toContain('w=160');
		expect(src).toContain('fm=webp');
	});
});
