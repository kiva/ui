/**
 * Shared mock loan fixtures for BorrowerProfile stories.
 *
 * - createMockLoan(overrides) returns a full loan object with fields
 *   for ALL child component queries (SummaryCard, LendCta, LoanStory,
 *   CommentsAndWhySpecial, DetailsTabs, MoreAboutLoan, BorrowerCountry,
 *   LendersAndTeams, JournalUpdates).
 * - createQueryResult(loan, userOverrides) wraps a loan in the full
 *   query result shape expected by apolloStoryMixin.
 * - Named fixtures call createMockLoan with status-specific overrides.
 */

// ---------------------------------------------------------------------------
// User context helpers
// ---------------------------------------------------------------------------

export const anonymousUser = {};

export const loggedInUser = {
	id: 'user-1',
	userAccount: {
		id: 123, balance: '50.00', inviterName: '', public: true
	},
};

// ---------------------------------------------------------------------------
// Base factory
// ---------------------------------------------------------------------------

const mockComments = [
	{
		id: 101,
		authorName: 'Super Kiva Lender',
		authorImageUrl: 'https://www.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
		authorRole: 'Lender',
		authorLendingAction: {
			teams: ['Kiva Lending Team'],
			lender: { id: 201, teams: { values: [{ id: 1, name: 'Kiva Lending Team', teamPublicId: 'kiva' }] } },
		},
		body: 'This journal is so happy! I am really great to be a part of this loan.',
	},
	{
		id: 102,
		authorName: 'New Kiva Lender',
		authorImageUrl: 'https://www.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
		authorRole: 'Lender',
		authorLendingAction: null,
		body: 'Thanks for your positive comments.',
	},
];

const mockLenders = [
	{
		id: 201, name: 'Lucy D', publicId: 'lucy', image: { hash: 'abc123' }, lenderPage: { whereabouts: 'Beverly Hills, CA' }
	},
	{
		id: 202, name: 'Erica', publicId: 'erica', image: { hash: 'def456' }, lenderPage: { whereabouts: 'Anytown, CA' }
	},
	{
		id: 203, name: 'Joy', publicId: 'joy', image: { hash: 'ghi789' }, lenderPage: { whereabouts: 'San Francisco, CA' }
	},
];

const mockTeams = [
	{
		id: 1, name: 'Kiva Lending Team', teamPublicId: 'kiva', image: { hash: 'team1' }, lenderCount: 500, lenderCountForLoan: 3
	},
	{
		id: 2, name: 'The A Team', teamPublicId: 'theateam', image: { hash: 'team2' }, lenderCount: 200, lenderCountForLoan: 1
	},
];

const mockUpdates = [
	{
		id: 301,
		body: 'When in doubt, yell!',
		subject: 'Just another Journal Entry',
		date: '2024-09-15T00:00:00Z',
		image: { url: 'https://www.kiva.org/img/w480h360/9673d0722a7675b9b8d11f90849d9b44.webp' },
	},
];

/**
 * Create a mock loan with fields for all child component queries.
 * @param {object} overrides - Properties to spread on top of the defaults.
 * @returns {object} A full loan object.
 */
// Fixed expiration date keeps story fixtures deterministic for visual
// regression (avoids `new Date()`, which made snapshots drift day to day).
const PLANNED_EXPIRATION_DATE = '2026-12-31T00:00:00.000Z';

export function createMockLoan(overrides = {}) {
	return {
		id: 1975833,
		__typename: 'LoanPartner',
		borrowerCount: 1,
		name: 'Wanda',
		businessName: '',
		gender: 'female',
		geocode: {
			city: 'Managua',
			state: 'Managua',
			latitude: 12.1364,
			longitude: -86.2514,
			country: {
				id: 1,
				name: 'Nicaragua',
				isoCode: 'NI',
				region: 'Central America',
				numLoansFundraising: 342,
				ppp: '5470',
				geocode: { latitude: 12.8654, longitude: -85.2072 },
				__typename: 'Country',
			},
			__typename: 'Geocode',
		},
		image: {
			id: 3838911,
			default: 'https://www.kiva.org/img/w480h360/9673d0722a7675b9b8d11f90849d9b44.webp',
			retina: 'https://www.kiva.org/img/w960h720/9673d0722a7675b9b8d11f90849d9b44.webp',
			url: 'https://www.kiva.org/img/w150h138/9673d0722a7675b9b8d11f90849d9b44.webp',
			hash: '9673d0722a7675b9b8d11f90849d9b44',
			__typename: 'Image',
		},
		plannedExpirationDate: PLANNED_EXPIRATION_DATE,
		anonymizationLevel: 'none',
		loanAmount: '600.00',
		status: 'fundraising',
		use: 'to buy more inventory for her market stall.',
		fullLoanUse: 'A loan of $600 helps to buy more inventory for her market stall.',
		fundraisingPercent: 0.875,
		fundraisingTimeLeft: '30 days',
		fundraisingTimeLeftMilliseconds: 2592000000,
		loanFundraisingInfo: {
			id: 1975833,
			fundedAmount: '525.00',
			reservedAmount: '0.00',
			isExpiringSoon: false,
			__typename: 'LoanFundraisingInfo',
		},
		inPfp: false,
		pfpMinLenders: 0,
		sector: { id: 1, name: 'Clothing', __typename: 'Sector' },
		activity: { id: 2, name: 'Clothing Sales', __typename: 'Activity' },
		paidAmount: '0.00',
		expiredDate: '',
		refundedDate: '',
		defaultedDate: '',
		endedDate: '',
		disbursalDate: '2024-06-15T00:00:00Z',
		distributionModel: 'partner',
		partnerName: 'AFODENIC',
		partner: {
			id: 100,
			name: 'AFODENIC',
			countries: [{ id: 1, name: 'Nicaragua', __typename: 'Country' }],
			arrearsRate: 0.02,
			avgBorrowerCost: 15.5,
			avgBorrowerCostType: 'interest',
			chargesFeesInterest: true,
			defaultRate: 0.01,
			loanAlertText: '',
			riskRating: 3.5,
			totalAmountRaised: '5000000.00',
			startDate: '2018-06-01',
			loansPosted: 1200,
			avgLoanSizePercentPerCapitaIncome: 45.5,
			__typename: 'Partner',
		},
		// User properties
		userProperties: {
			lentTo: false,
			isPrivileged: false,
			isAdmin: false,
			subscribed: false,
			favorited: false,
			promoEligible: false,
			__typename: 'LoanUserProperties',
		},
		// LendCta fields
		minNoteSize: '25.00',
		matchingText: '',
		matchRatio: 0,
		unreservedAmount: '75.00',
		// LoanStory fields
		description: 'Wanda runs a small market stall and would like a loan to buy more inventory. '
			+ '(Placeholder text for layout testing.)',
		descriptionInOriginalLanguage: 'Wanda tiene un pequeño puesto en el mercado y desea un préstamo '
			+ 'para comprar más inventario. (Texto de ejemplo.)',
		originalLanguage: { id: '2', name: 'Spanish' },
		borrowers: [{
			id: 1, firstName: 'Wanda', gender: 'female', isPrimary: true
		}],
		reviewer: { bylineName: 'Rita Rocket', showName: true },
		previousLoanId: null,
		video: null,
		// Comments
		comments: {
			totalCount: 2,
			values: mockComments,
			__typename: 'CommentCollection',
		},
		// Lenders and teams
		lenders: {
			totalCount: 34,
			values: mockLenders,
			__typename: 'LenderCollection',
		},
		teams: {
			totalCount: 2,
			values: mockTeams,
			__typename: 'TeamCollection',
		},
		// Journal updates
		updates: {
			totalCount: 1,
			values: mockUpdates,
			__typename: 'UpdateCollection',
		},
		// DetailsTabs fields
		lenderRepaymentTerm: 26,
		repaymentInterval: 'monthly',
		terms: {
			currency: 'NIO',
			currencyFullName: 'Nicaraguan Córdoba',
			flexibleFundraisingEnabled: false,
			lenderRepaymentTerm: 26,
			lossLiabilityCurrencyExchange: 'shared',
			__typename: 'LoanTerm',
		},
		trustee: null,
		endorsement: null,
		// MoreAboutLoan fields
		whySpecial: 'It supports women in a country where financing options are scarce.',
		dualStatementNote: '',
		moreInfoAboutLoan: 'This loan helps small-business owners invest in their businesses and support their families.',
		tags: ['user_favorite'],
		...overrides,
	};
}

// ---------------------------------------------------------------------------
// Query result wrapper
// ---------------------------------------------------------------------------

/**
 * Wraps a loan in the full query result shape that apolloStoryMixin expects.
 * Includes shop, my, general, and community data that child components query.
 *
 * @param {object} loan - A loan from createMockLoan()
 * @param {object} [myUser] - Override for `my` (user context). Pass loggedInUser or null.
 * @returns {object} queryResult for apolloStoryMixin
 */
export function createQueryResult(loan, myUser = null) {
	return {
		data: {
			lend: { loan },
			shop: {
				id: 'shop',
				basket: {
					id: 'basket',
					hasFreeCredits: false,
					items: { values: [] },
				},
				nonTrivialItemCount: 0,
			},
			my: myUser || { id: null },
			general: { uiExperimentSetting: null },
			community: { lender: null },
		},
	};
}

// ---------------------------------------------------------------------------
// Named loan fixtures
// ---------------------------------------------------------------------------

/** Fundraising partner loan (default). */
export const fundraisingPartnerLoan = createMockLoan();

const directLoanDescription = 'This business sells household goods and would like a loan to buy more '
	+ 'inventory. (Placeholder text.)';

const directLoanOverrides = {
	__typename: 'LoanDirect',
	distributionModel: 'direct',
	partnerName: '',
	partner: null,
	name: 'Sample borrower',
	gender: 'male',
	businessName: 'Sample Business',
	businessDescription: directLoanDescription,
	purpose: 'To buy more inventory for the business.',
	yearsInBusiness: 5,
	socialLinks: {},
	geocode: {
		city: 'San Francisco',
		state: 'California',
		latitude: 37.7749,
		longitude: -122.4194,
		country: {
			id: 2,
			name: 'United States',
			isoCode: 'US',
			region: 'North America',
			geocode: { latitude: 37.1, longitude: -95.7 },
			__typename: 'Country',
		},
		__typename: 'Geocode',
	},
	use: 'to buy more inventory for the business.',
	fullLoanUse: 'A loan of $750 helps to buy more inventory for the business.',
	description: directLoanDescription,
	descriptionInOriginalLanguage: '',
	originalLanguage: { id: '1', name: 'English' },
	reviewer: { bylineName: 'Rita Rocket', showName: true },
	borrowers: [{
		id: 1, firstName: 'Sample', gender: 'male', isPrimary: true
	}],
};

/** Fundraising direct loan (US-based). */
export const fundraisingDirectLoan = createMockLoan({
	id: 2000001,
	...directLoanOverrides,
	loanAmount: '750.00',
	loanFundraisingInfo: {
		id: 2000001, fundedAmount: '500.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '250.00',
	fundraisingPercent: 0.67,
});

/** Private fundraising period loan. */
export const pfpLoan = createMockLoan({
	id: 2000002,
	inPfp: true,
	pfpMinLenders: 700,
	lenders: { totalCount: 150, values: mockLenders, __typename: 'LenderCollection' },
});

/** Fully funded loan (virtual status for public users). */
export const fullyFundedLoan = createMockLoan({
	id: 2000003,
	status: 'funded',
	fundraisingPercent: 1,
	loanFundraisingInfo: {
		id: 2000003, fundedAmount: '600.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Raised loan (privileged-only real status). */
export const raisedLoan = createMockLoan({
	id: 2000004,
	status: 'raised',
	fundraisingPercent: 1,
	loanFundraisingInfo: {
		id: 2000004, fundedAmount: '600.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Paying back loan (privileged-only; public sees "funded"). */
export const payingBackLoan = createMockLoan({
	id: 2000005,
	status: 'payingBack',
	fundraisingPercent: 1,
	paidAmount: '275.00',
	loanFundraisingInfo: {
		id: 2000005, fundedAmount: '600.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Ended loan (privileged-only; public sees "funded"). */
export const endedLoan = createMockLoan({
	id: 2000006,
	status: 'ended',
	fundraisingPercent: 1,
	paidAmount: '600.00',
	endedDate: '2025-01-15T12:00:00Z',
	loanFundraisingInfo: {
		id: 2000006, fundedAmount: '600.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Defaulted loan (privileged-only; public sees "funded"). */
export const defaultedLoan = createMockLoan({
	id: 2000007,
	status: 'defaulted',
	fundraisingPercent: 1,
	paidAmount: '150.00',
	defaultedDate: '2025-02-20T12:00:00Z',
	loanFundraisingInfo: {
		id: 2000007, fundedAmount: '600.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Expired loan. Shown as-is to all users. */
export const expiredLoan = createMockLoan({
	id: 2000008,
	status: 'expired',
	fundraisingPercent: 0.5,
	expiredDate: '2025-03-01T12:00:00Z',
	disbursalDate: '',
	loanFundraisingInfo: {
		id: 2000008, fundedAmount: '300.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Refunded loan. Shown as-is to all users. */
export const refundedLoan = createMockLoan({
	id: 2000009,
	status: 'refunded',
	fundraisingPercent: 1,
	refundedDate: '2025-02-10T12:00:00Z',
	loanFundraisingInfo: {
		id: 2000009, fundedAmount: '600.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Inactive loan (privileged-only). */
export const inactiveLoan = createMockLoan({
	id: 2000010,
	status: 'inactive',
	fundraisingPercent: 0,
	loanFundraisingInfo: {
		id: 2000010, fundedAmount: '0.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Inactive expired loan (privileged-only). */
export const inactiveExpiredLoan = createMockLoan({
	id: 2000011,
	status: 'inactiveExpired',
	fundraisingPercent: 0,
	expiredDate: '2024-12-01T12:00:00Z',
	loanFundraisingInfo: {
		id: 2000011, fundedAmount: '0.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Reviewed loan (privileged-only). */
export const reviewedLoan = createMockLoan({
	id: 2000012,
	status: 'reviewed',
	fundraisingPercent: 0,
	loanFundraisingInfo: {
		id: 2000012, fundedAmount: '0.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Deleted loan (privileged-only). */
export const deletedLoan = createMockLoan({
	id: 2000013,
	status: 'deleted',
	fundraisingPercent: 0,
	loanFundraisingInfo: {
		id: 2000013, fundedAmount: '0.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Issue loan (privileged-only). */
export const issueLoan = createMockLoan({
	id: 2000014,
	status: 'issue',
	fundraisingPercent: 0,
	loanFundraisingInfo: {
		id: 2000014, fundedAmount: '0.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '0.00',
});

/** Group loan (multiple borrowers). */
export const groupLoan = createMockLoan({
	id: 2000015,
	name: 'Sample Group',
	borrowerCount: 3,
	borrowers: [
		{
			id: 1, firstName: 'Wanda', gender: 'female', isPrimary: true
		},
		{
			id: 2, firstName: 'Lucy', gender: 'female', isPrimary: false
		},
		{
			id: 3, firstName: 'Rita', gender: 'female', isPrimary: false
		},
	],
});

/** Repeat borrower loan (has previous loan). */
export const repeatBorrowerLoan = createMockLoan({
	id: 2000016,
	previousLoanId: 1900000,
});

/** Direct loan with trustee. */
export const directLoanWithTrustee = createMockLoan({
	id: 2000017,
	...directLoanOverrides,
	trustee: {
		id: 50,
		organizationName: 'Willy Wonka',
		stats: {
			numDefaultedLoans: 0,
			numLoansEndorsedPublic: 120,
			repaymentRate: 0.98,
			totalLoansValue: 2000000,
		},
	},
	endorsement: 'This borrower has been endorsed by a local Kiva trustee.',
});
