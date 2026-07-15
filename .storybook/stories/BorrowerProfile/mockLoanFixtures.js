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
		authorName: 'Sarah',
		authorImageUrl: 'https://www.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
		authorRole: 'Lender',
		authorLendingAction: {
			teams: ['Kiva Lending Team'],
			lender: { id: 201, teams: { values: [{ id: 1, name: 'Kiva Lending Team', teamPublicId: 'kiva' }] } },
		},
		body: 'Best wishes for your business! I hope this loan helps you achieve your goals.',
	},
	{
		id: 102,
		authorName: 'Aisha',
		authorImageUrl: 'https://www.kiva.org/img/s100/9673d0722a7675b9b8d11f90849d9b44.jpg',
		authorRole: 'Borrower',
		authorLendingAction: null,
		body: 'Thank you so much for your support! I will use this loan wisely.',
	},
];

const mockLenders = [
	{
		id: 201, name: 'Sarah', publicId: 'sarah123', image: { hash: 'abc123' }, lenderPage: { whereabouts: 'Portland, OR' }
	},
	{
		id: 202, name: 'Mike', publicId: 'mike456', image: { hash: 'def456' }, lenderPage: { whereabouts: 'Austin, TX' }
	},
	{
		id: 203, name: 'Emma', publicId: 'emma789', image: { hash: 'ghi789' }, lenderPage: { whereabouts: 'London, UK' }
	},
];

const mockTeams = [
	{
		id: 1, name: 'Kiva Lending Team', teamPublicId: 'kiva', image: { hash: 'team1' }, lenderCount: 500, lenderCountForLoan: 3
	},
	{
		id: 2, name: 'Women Empowerment', teamPublicId: 'women', image: { hash: 'team2' }, lenderCount: 200, lenderCountForLoan: 1
	},
];

export const mockSimultaneousMatching = [
	{
		managedAccountId: 203995508, displayName: 'Capital One', ratio: 3, logo: null
	},
	{
		managedAccountId: 204181523, displayName: 'the Tripadvisor Foundation', ratio: 1, logo: null
	},
];

const mockUpdates = [
	{
		id: 301,
		body: 'Business is going well! I have bought two new heifers and milk production has increased.',
		subject: 'Update from Aisha',
		date: '2024-09-15T00:00:00Z',
		image: { url: 'https://www.kiva.org/img/w480h360/9673d0722a7675b9b8d11f90849d9b44.webp' },
	},
];

/**
 * Create a mock loan with fields for all child component queries.
 * @param {object} overrides - Properties to spread on top of the defaults.
 * @returns {object} A full loan object.
 */
export function createMockLoan(overrides = {}) {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 30);

	return {
		id: 1975833,
		__typename: 'LoanPartner',
		borrowerCount: 1,
		name: 'Aisha',
		businessName: '',
		gender: 'female',
		geocode: {
			city: 'Kochkor district, Naryn region',
			state: 'Naryn Region',
			latitude: 41.5,
			longitude: 75.8,
			country: {
				id: 1,
				name: 'Kyrgyzstan',
				isoCode: 'KG',
				region: 'Asia',
				numLoansFundraising: 342,
				ppp: '3870',
				geocode: { latitude: 41.2, longitude: 74.8 },
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
		// LoanStory figures (image/video carousel)
		figures: [
			{
				__typename: 'Image',
				id: 3838911,
				hash: '9673d0722a7675b9b8d11f90849d9b44',
			},
		],
		plannedExpirationDate: expirationDate.toISOString(),
		anonymizationLevel: 'none',
		loanAmount: '600.00',
		status: 'fundraising',
		use: 'to purchase heifers to increase headcount of cattle and sales of organic milk.',
		fullLoanUse: 'A loan of $600 helps to purchase heifers to increase headcount of cattle and sales of organic milk.',
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
		sector: { id: 1, name: 'Agriculture', __typename: 'Sector' },
		activity: { id: 61, name: 'Dairy', __typename: 'Activity' },
		paidAmount: '0.00',
		expiredDate: '',
		refundedDate: '',
		defaultedDate: '',
		endedDate: '',
		disbursalDate: '2024-06-15T00:00:00Z',
		distributionModel: 'partner',
		partnerName: 'Bai Tushum Bank',
		partner: {
			id: 100,
			name: 'Bai Tushum Bank',
			countries: [{ id: 1, name: 'Kyrgyzstan', __typename: 'Country' }],
			arrearsRate: 0.02,
			avgBorrowerCost: 15.5,
			avgBorrowerCostType: 'interest',
			chargesFeesInterest: true,
			defaultRate: 0.01,
			avgProfitability: 2.5,
			loansAtRiskRate: 0.04,
			currencyExchangeLossRate: 0.01,
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
		simultaneousMatching: [],
		// LoanStory fields
		description: 'Aisha is a 35-year-old woman living in Kyrgyzstan. She has been raising cattle for 10 years and wants to expand her dairy farm.',
		descriptionInOriginalLanguage: '',
		originalLanguage: null,
		borrowers: [{
			id: 1, firstName: 'Aisha', gender: 'female', isPrimary: true
		}],
		reviewer: null,
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
			currency: 'KGS',
			currencyFullName: 'Kyrgyzstani Som',
			flexibleFundraisingEnabled: false,
			lenderRepaymentTerm: 26,
			lossLiabilityCurrencyExchange: 'shared',
			__typename: 'LoanTerm',
		},
		trustee: null,
		endorsement: null,
		// MoreAboutLoan fields
		whySpecial: 'It supports organic farming and includes a lower interest rate.',
		dualStatementNote: '',
		moreInfoAboutLoan: 'This loan helps rural farmers in Kyrgyzstan.',
		tags: ['user_favorite'],
		...overrides,
	};
}

// ---------------------------------------------------------------------------
// Real PII-anonymized loan content
// ---------------------------------------------------------------------------

export const ANONYMIZED_BORROWER_NAME = 'Anonymized Kivan';
export const ANONYMIZED_GROUP_NAME = 'Anonymized Kivans';

export const anonymizedLoanDescription = 'This loan supported a farmer’s plan to buy two cows for work on '
	+ 'her rice field and for breeding, with the aim of creating additional income through animal raising.';

export const anonymizedGroupLoanDescription = 'This loan supported a grocer’s plan to build a house for '
	+ 'herself and her husband, with the aim of living apart from their parents.';

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
			general: {
				uiExperimentSetting: null,
				multiMatchingEnabled: { key: 'multiMatchingEnabled', value: 'true' },
			},
			community: { lender: null },
		},
	};
}

// ---------------------------------------------------------------------------
// Named loan fixtures
// ---------------------------------------------------------------------------

/** Fundraising partner loan (default). */
export const fundraisingPartnerLoan = createMockLoan();

/** Fundraising direct loan (US-based). */
export const fundraisingDirectLoan = createMockLoan({
	id: 2000001,
	__typename: 'LoanDirect',
	distributionModel: 'direct',
	partnerName: '',
	partner: null,
	name: 'Maria',
	businessName: 'Maria\'s Bakery',
	businessDescription: 'A family-owned bakery specializing in artisan breads.',
	purpose: 'To buy a commercial oven and expand production.',
	yearsInBusiness: 5,
	socialLinks: {},
	geocode: {
		city: 'Portland',
		state: 'Oregon',
		latitude: 45.5,
		longitude: -122.7,
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
	use: 'to expand her bakery business and buy new equipment.',
	fullLoanUse: 'A loan of $5,000 helps to expand her bakery business and buy new equipment.',
	loanAmount: '5000.00',
	loanFundraisingInfo: {
		id: 2000001, fundedAmount: '3750.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
	},
	unreservedAmount: '1250.00',
	fundraisingPercent: 0.75,
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

/** Paying back loan whose repayments exceed the loan amount (final-payment overage). */
export const overpaidPayingBackLoan = createMockLoan({
	id: 2000009,
	status: 'payingBack',
	fundraisingPercent: 1,
	paidAmount: '615.00',
	loanFundraisingInfo: {
		id: 2000009, fundedAmount: '600.00', reservedAmount: '0.00', isExpiringSoon: false, __typename: 'LoanFundraisingInfo'
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
	name: 'Aisha\'s Group',
	borrowerCount: 3,
	borrowers: [
		{
			id: 1, firstName: 'Aisha', gender: 'female', isPrimary: true
		},
		{
			id: 2, firstName: 'Fatima', gender: 'female', isPrimary: false
		},
		{
			id: 3, firstName: 'Nadia', gender: 'female', isPrimary: false
		},
	],
});

/** Fundraising loan with simultaneous matching partners. */
export const multiMatchedLoan = createMockLoan({
	id: 2000018,
	simultaneousMatching: mockSimultaneousMatching,
});

/** Repeat borrower loan (has previous loan). */
export const repeatBorrowerLoan = createMockLoan({
	id: 2000016,
	previousLoanId: 1900000,
});

/** Direct loan with trustee. */
export const directLoanWithTrustee = createMockLoan({
	id: 2000017,
	__typename: 'LoanDirect',
	distributionModel: 'direct',
	partnerName: '',
	partner: null,
	name: 'James',
	trustee: {
		id: 50,
		organizationName: 'Accion',
		stats: {
			id: 1,
			numDefaultedLoans: 0,
			numLoansEndorsedPublic: 120,
			repaymentRate: 0.98,
			totalLoansValue: '2000000.00',
		},
	},
	endorsement: 'Accion endorses this loan for responsible lending.',
});
