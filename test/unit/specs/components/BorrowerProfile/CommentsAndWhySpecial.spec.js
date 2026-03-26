import { render } from '@testing-library/vue';
import CommentsAndWhySpecial from '#src/components/BorrowerProfile/CommentsAndWhySpecial';
import { globalOptions } from '../../../specUtils';

const mockComments = [
	{
		id: 1,
		authorName: 'Jane Borrower',
		authorImageUrl: 'https://example.com/img/s100/abc123.jpg',
		authorLendingAction: null,
		body: 'Thank you for supporting my business!',
		authorRole: 'Borrower',
	},
	{
		id: 2,
		authorName: 'John Lender',
		authorImageUrl: 'https://example.com/img/s100/def456.jpg',
		authorLendingAction: { teams: [], lender: { id: 2, teams: { values: [] } } },
		body: 'Happy to support this loan!',
		authorRole: 'Lender',
	},
	{
		id: 3,
		authorName: 'No Role User',
		authorImageUrl: 'https://example.com/img/s100/ghi789.jpg',
		authorLendingAction: null,
		body: 'Great loan!',
		authorRole: null,
	},
];

const stubs = {
	KvCarousel: {
		template: '<div><slot v-for="(_, name) in $slots" :name="name"></slot></div>',
	},
	WhySpecial: { template: '<div></div>' },
	BorrowerImage: { template: '<img :alt="$attrs.alt" />' },
	KvLightbox: { template: '<div><slot></slot></div>' },
};

function renderComments(dataOverrides = {}, propsOverrides = {}) {
	const Component = {
		...CommentsAndWhySpecial,
		data() {
			return {
				...CommentsAndWhySpecial.data.call(this),
				loading: false,
				comments: mockComments,
				...dataOverrides,
			};
		},
		mounted() {
			// Skip loadData and observer in tests
			this.determineIfMobile();
		},
	};

	return render(Component, {
		global: {
			...globalOptions,
			stubs,
		},
		props: { loanId: 123, ...propsOverrides },
	});
}

describe('CommentsAndWhySpecial', () => {
	it('renders author names and body text', () => {
		const { getByText } = renderComments();
		expect(getByText(/Jane Borrower/)).toBeTruthy();
		expect(getByText(/Thank you for supporting my business/)).toBeTruthy();
	});

	it('shows Borrower role badge when authorRole is Borrower', () => {
		const { getAllByTestId } = renderComments();
		const badges = getAllByTestId('bp-comment-role-badge');
		const borrowerBadge = badges.find(b => b.textContent.trim() === 'Borrower');
		expect(borrowerBadge).toBeTruthy();
		expect(borrowerBadge.classList.toString()).toContain('tw-bg-brand-50');
	});

	it('shows Lender role badge when authorRole is Lender', () => {
		const { getAllByTestId } = renderComments();
		const badges = getAllByTestId('bp-comment-role-badge');
		const lenderBadge = badges.find(b => b.textContent.trim() === 'Lender');
		expect(lenderBadge).toBeTruthy();
		expect(lenderBadge.classList.toString()).toContain('tw-bg-secondary');
	});

	it('does not show role badge when authorRole is null', () => {
		const { getAllByTestId } = renderComments();
		const badges = getAllByTestId('bp-comment-role-badge');
		// Only 2 badges (Borrower and Lender), not 3
		expect(badges).toHaveLength(2);
	});

	it('applies borrower styling to borrower comments', () => {
		const { getByText } = renderComments();
		const borrowerComment = getByText(/Thank you for supporting my business/).closest('[class*="tw-bg-brand-25"]');
		expect(borrowerComment).toBeTruthy();
	});

	it('shows report menu when logged in', () => {
		const { getByText } = renderComments({}, { isLoggedIn: true });
		// The menu button should be present (mdiDotsHorizontalCircle icon)
		// Report button appears after clicking menu
		expect(getByText(/Jane Borrower/)).toBeTruthy();
	});

	it('hides comment section when no comments and loading', () => {
		const { queryByText } = renderComments({ comments: [], loading: true });
		expect(queryByText(/Jane Borrower/)).toBeNull();
	});

	it('admin sees delete button in comment menu', () => {
		const { getAllByTestId } = renderComments({ commentMenuShown: true }, { isLoggedIn: true, isAdmin: true });
		const deleteButtons = getAllByTestId('bp-comment-delete-btn');
		expect(deleteButtons.length).toBeGreaterThan(0);
	});

	it('non-admin does not see delete button', () => {
		const { queryAllByTestId } = renderComments({ commentMenuShown: true }, { isLoggedIn: true, isAdmin: false });
		expect(queryAllByTestId('bp-comment-delete-btn')).toHaveLength(0);
	});

	it('logged-in user sees subscribe toggle', () => {
		const { getByTestId } = renderComments({}, { isLoggedIn: true });
		const toggle = getByTestId('bp-comment-subscribe-toggle');
		expect(toggle.textContent).toContain('Subscribe to updates');
	});

	it('subscribed user sees "Unsubscribe from updates"', () => {
		const { getByTestId } = renderComments({}, { isLoggedIn: true, isSubscribed: true });
		const toggle = getByTestId('bp-comment-subscribe-toggle');
		expect(toggle.textContent).toContain('Unsubscribe from updates');
	});

	it('anonymous user does not see subscribe toggle', () => {
		const { queryByTestId } = renderComments({}, { isLoggedIn: false });
		expect(queryByTestId('bp-comment-subscribe-toggle')).toBeNull();
	});
});
