import { render } from '@testing-library/vue';
import SimultaneousMatchingInfo from '#src/components/BorrowerProfile/SimultaneousMatchingInfo';

// Real data from loan 3175014 on dk1
const loanMatchers = [
	{
		managedAccountId: 203995508,
		displayName: 'Capital One',
		ratio: 3,
		logo: null,
	},
	{
		managedAccountId: 204181523,
		displayName: 'the Tripadvisor Foundation',
		ratio: 1,
		logo: null,
	},
];

function renderComponent(props) {
	return render(SimultaneousMatchingInfo, { props });
}

describe('SimultaneousMatchingInfo', () => {
	describe('matched amount calculation', () => {
		it('calculates correctly for multiple matchers from real loan data', () => {
			// $25 (you) + $25*3 Capital One + $25*1 Tripadvisor = $25 + $75 + $25 = $125
			const { getByText } = renderComponent({ simultaneousMatching: loanMatchers, lendAmount: 25 });
			getByText(/\$25 becomes \$125/);
		});

		it('calculates correctly for a single 3x matcher', () => {
			// $25 (you) + $25*3 Capital One = $25 + $75 = $100
			const { getByText } = renderComponent({
				simultaneousMatching: [loanMatchers[0]],
				lendAmount: 25,
			});
			getByText(/\$25 becomes \$100/);
		});

		it('calculates correctly for a single 1x matcher', () => {
			// $25 (you) + $25*1 Tripadvisor = $25 + $25 = $50
			const { getByText } = renderComponent({
				simultaneousMatching: [loanMatchers[1]],
				lendAmount: 25,
			});
			getByText(/\$25 becomes \$50/);
		});

		it('respects the lendAmount prop', () => {
			// $100 (you) + $100*3 Capital One + $100*1 Tripadvisor = $100 + $300 + $100 = $500
			const { getByText } = renderComponent({ simultaneousMatching: loanMatchers, lendAmount: 100 });
			getByText(/\$100 becomes \$500/);
		});

		it('defaults to $25 lend amount', () => {
			// $25 (you) + $25*3 Capital One = $100
			const { getByText } = renderComponent({ simultaneousMatching: [loanMatchers[0]] });
			getByText(/\$25 becomes \$100/);
		});

		it('formats large amounts with thousands separators', () => {
			// $1,000 (you) + $1,000*3 Capital One + $1,000*1 Tripadvisor = $1,000 + $3,000 + $1,000 = $5,000
			const { getByText } = renderComponent({ simultaneousMatching: loanMatchers, lendAmount: 1000 });
			getByText(/\$1,000 becomes \$5,000/);
		});
	});

	describe('partner name formatting', () => {
		it('formats two partner names with "and"', () => {
			const { getByText } = renderComponent({ simultaneousMatching: loanMatchers, lendAmount: 25 });
			getByText(/Capital One and the Tripadvisor Foundation/);
		});

		it('formats a single partner name without conjunction', () => {
			const { getByText } = renderComponent({
				simultaneousMatching: [loanMatchers[0]],
				lendAmount: 25,
			});
			getByText(/by Capital One while funds last/);
		});

		it('formats three partner names with Oxford comma', () => {
			const threeMatchers = [
				...loanMatchers,
				{
					managedAccountId: 999, displayName: 'Visa', ratio: 1, logo: null
				},
			];
			const { getByText } = renderComponent({ simultaneousMatching: threeMatchers, lendAmount: 25 });
			getByText(/Capital One, the Tripadvisor Foundation, and Visa/);
		});

		it('shows "a Kiva supporter" for null displayName', () => {
			const { getByText } = renderComponent({
				simultaneousMatching: [{
					managedAccountId: 1, displayName: null, ratio: 1, logo: null
				}],
				lendAmount: 25,
			});
			getByText(/by a Kiva supporter while funds last/);
		});

		it('formats two anonymous matchers with "and"', () => {
			const twoAnon = [
				{
					managedAccountId: 1, displayName: null, ratio: 1, logo: null
				},
				{
					managedAccountId: 2, displayName: null, ratio: 1, logo: null
				},
			];
			const { getByText } = renderComponent({ simultaneousMatching: twoAnon, lendAmount: 25 });
			getByText(/a Kiva supporter and a Kiva supporter/);
		});
	});

	describe('partner avatars', () => {
		it('renders one avatar letter per matcher', () => {
			const { getAllByText } = renderComponent({ simultaneousMatching: loanMatchers, lendAmount: 25 });
			// KvUserAvatar renders the first character of lenderName uppercased as visible SVG text
			// "Capital One" → "C", "the Tripadvisor Foundation" → "T"
			expect(getAllByText('C').length).toBeGreaterThanOrEqual(1);
			expect(getAllByText('T').length).toBeGreaterThanOrEqual(1);
		});

		it('renders an image when logo url is provided', () => {
			const withLogo = [
				{
					managedAccountId: 1,
					displayName: 'Visa',
					ratio: 1,
					logo: { id: 10, url: 'https://example.com/visa.png' },
				},
			];
			const { getByAltText } = renderComponent({ simultaneousMatching: withLogo, lendAmount: 25 });
			// KvUserAvatar hides the img until loaded; query with hidden:true to find it in jsdom
			const img = getByAltText('Image of lender', { hidden: true });
			expect(img.src).toBe('https://example.com/visa.png');
		});

		it('renders a letter avatar when logo is null', () => {
			const { getByText } = renderComponent({
				simultaneousMatching: [loanMatchers[0]],
				lendAmount: 25,
			});
			getByText('C');
		});

		it('renders the avatar image when avatar url is provided', () => {
			const withAvatar = [
				{
					managedAccountId: 1,
					displayName: 'Visa',
					ratio: 1,
					avatar: { id: 20, url: 'https://example.com/visa-avatar.png' },
					logo: { id: 10, url: 'https://example.com/visa-logo.png' },
				},
			];
			const { getByAltText } = renderComponent({ simultaneousMatching: withAvatar, lendAmount: 25 });
			const img = getByAltText('Image of lender', { hidden: true });
			expect(img.src).toBe('https://example.com/visa-avatar.png');
		});

		it('falls back to the logo image when avatar is null', () => {
			const logoOnly = [
				{
					managedAccountId: 1,
					displayName: 'Visa',
					ratio: 1,
					avatar: null,
					logo: { id: 10, url: 'https://example.com/visa-logo.png' },
				},
			];
			const { getByAltText } = renderComponent({ simultaneousMatching: logoOnly, lendAmount: 25 });
			const img = getByAltText('Image of lender', { hidden: true });
			expect(img.src).toBe('https://example.com/visa-logo.png');
		});
	});

	it('is hidden on mobile via tw-hidden class on the wrapper', () => {
		const { container } = renderComponent({ simultaneousMatching: loanMatchers, lendAmount: 25 });
		expect(container.firstChild.classList.contains('tw-hidden')).toBe(true);
	});
});
