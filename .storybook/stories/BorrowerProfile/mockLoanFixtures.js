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
// Avatar image hashes
// ---------------------------------------------------------------------------

// Real hashes that resolve against the production photo path, so the photo
// branch renders an actual image rather than a broken one. Invented hashes 404.
const PHOTO_HASH = '9673d0722a7675b9b8d11f90849d9b44';
const PHOTO_HASH_ALT = '093374973a7cfb1f18652d3aac5bbd05';

// kv-components treats this hash as a legacy placeholder, so a comment carrying
// it renders the letter avatar instead of a photo.
const LEGACY_PLACEHOLDER_HASH = '4d844ac2c0b77a8a522741b908ea5c32';

const avatarUrl = hash => `https://www.kiva.org/img/s100/${hash}.jpg`;

// ---------------------------------------------------------------------------
// Base factory
// ---------------------------------------------------------------------------

/**
 * Comments in the shape the loanComments queries return: the author is a nested
 * CommentAuthor, and `role` is the lowercase CommentAuthorRole enum. The flat
 * `authorName` / `authorImageUrl` / `lendingAction.teams` fields are deprecated
 * in the schema and are not what the components read.
 */
const mockComments = [
	{
		id: 101,
		author: {
			name: 'Sarah',
			imageUrl: avatarUrl(PHOTO_HASH_ALT),
			role: 'lender',
			lendingAction: {
				supportingTeams: {
					values: [{ id: 1, name: 'Kiva Lending Team', teamPublicId: 'kiva' }],
					__typename: 'TeamCollection',
				},
				__typename: 'LendingAction',
			},
			__typename: 'CommentAuthor',
		},
		body: 'Best wishes for your business! I hope this loan helps you achieve your goals.',
		date: '2025-03-15T18:30:00.000Z',
	},
	{
		id: 102,
		author: {
			name: 'Aisha',
			imageUrl: avatarUrl(PHOTO_HASH),
			// Borrowers have no lending action on their own loan.
			role: 'borrower',
			lendingAction: null,
			__typename: 'CommentAuthor',
		},
		body: 'Thank you so much for your support! I will use this loan wisely.',
		date: '2025-03-14T09:15:00.000Z',
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
			// The base loan is fundraising, so it has not disbursed. Fixtures for disbursed
			// loans set this themselves.
			disbursalDate: null,
			expectedPayments: [],
			flexibleFundraisingEnabled: false,
			lenderRepaymentTerm: 26,
			loanAmount: '600.00',
			lossLiabilityCurrencyExchange: 'shared',
			__typename: 'LoanTerm',
		},
		repayments: [],
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
// Comment fixtures in the loanComments query shape
// ---------------------------------------------------------------------------

/**
 * CommentsAndWhySpecial reads `author.name`, `author.imageUrl` and
 * `author.lendingAction.supportingTeams`, which is the shape the
 * loanComments query returns. These fixtures exercise each of the three
 * avatar branches against a team name long enough to wrap.
 */
const LONG_TEAM_NAME = 'LGBTQIA (Lesbian, Gay, Bisexual, Transgender, Queer/Questioning, Intersex, '
	+ 'and Asexual) Kivans & Friends';

const supportingTeams = (name, teamPublicId) => ({
	supportingTeams: {
		values: [{ id: 1, name, teamPublicId }],
		__typename: 'TeamCollection',
	},
	__typename: 'LendingAction',
});

const longTeamNameComment = (id, name, hash, body, teamName = LONG_TEAM_NAME) => ({
	id,
	author: {
		name,
		imageUrl: hash ? avatarUrl(hash) : null,
		role: 'lender',
		lendingAction: supportingTeams(teamName, teamName === LONG_TEAM_NAME ? 'lgbtqia' : 'kiva'),
		__typename: 'CommentAuthor',
	},
	body,
	date: '2025-03-15T18:30:00.000Z',
});

export const longTeamNameComments = [
	longTeamNameComment(301, 'Sarah', PHOTO_HASH, 'Photo avatar, wrapping team name.'),
	longTeamNameComment(302, 'Hed', LEGACY_PLACEHOLDER_HASH, 'Letter avatar, wrapping team name.'),
	longTeamNameComment(303, 'Anonymous', null, 'Anonymous Kiva K avatar, wrapping team name.'),
	longTeamNameComment(304, 'Mike', PHOTO_HASH_ALT, 'Short team name — control case.', 'Kiva Lending Team'),
];

// ---------------------------------------------------------------------------
// Named loan fixtures
// ---------------------------------------------------------------------------

/** Fundraising partner loan (default). */
export const fundraisingPartnerLoan = createMockLoan();

/** Loan whose comments carry a team name long enough to wrap. */
export const longTeamNameCommentsLoan = createMockLoan({
	id: 2000099,
	comments: {
		totalCount: longTeamNameComments.length,
		values: longTeamNameComments,
		__typename: 'CommentCollection',
	},
});

/** Partner loan whose city is long enough to wrap inside the location pill. */
export const longLocationPartnerLoan = createMockLoan({
	geocode: {
		city: 'Sralab, Sralab, Tboung Khmum, Tboung Khmum Cambodian District Tboung Khmum',
		country: { name: 'Cambodia', isoCode: 'KH', __typename: 'Country' },
		__typename: 'Geocode',
	},
});

/**
 * A partner loan's repayment periods, covering every way a period can present:
 * received, delinquent with an attribution, delinquent with currency loss, and upcoming.
 */
export const partnerRepaymentPeriods = [
	{
		dueDate: '2024-07-01T07:00:00Z',
		status: 'repaid',
		delinquencyAttribution: '',
		expectedAmountToLenders: '265.83',
		actualAmountToLenders: '265.83',
		currencyLossToLenders: null,
		// Two expected repayments settled by a single recorded one, so the advanced view
		// has an uneven period to lay out.
		expectedRepayments: [
			{ effectiveDate: '2024-07-01T07:00:00Z', amount: '15000', __typename: 'LoanRepaymentPartner' },
			{ effectiveDate: '2024-07-15T07:00:00Z', amount: '8000', __typename: 'LoanRepaymentPartner' },
		],
		actualRepayments: [
			{ effectiveDate: '2024-07-18T07:00:00Z', amount: '23000', __typename: 'LoanRepaymentPartner' },
		],
		__typename: 'LoanRepaymentPeriod',
	},
	{
		dueDate: '2024-08-01T07:00:00Z',
		status: 'repaid',
		delinquencyAttribution: '',
		expectedAmountToLenders: '265.84',
		actualAmountToLenders: '253.50',
		currencyLossToLenders: '12.34',
		expectedRepayments: [],
		actualRepayments: [],
		__typename: 'LoanRepaymentPeriod',
	},
	{
		dueDate: '2024-09-01T07:00:00Z',
		status: 'delinquent',
		delinquencyAttribution: 'Lending partner behind in repayment',
		expectedAmountToLenders: '265.83',
		actualAmountToLenders: null,
		currencyLossToLenders: null,
		expectedRepayments: [],
		actualRepayments: [],
		__typename: 'LoanRepaymentPeriod',
	},
	{
		dueDate: '2999-10-01T07:00:00Z',
		status: 'future',
		delinquencyAttribution: '',
		expectedAmountToLenders: '265.83',
		actualAmountToLenders: null,
		currencyLossToLenders: null,
		expectedRepayments: [],
		actualRepayments: [],
		__typename: 'LoanRepaymentPeriod',
	},
];

/** Paying back partner loan carrying a full repayment schedule. */
export const payingBackPartnerLoanWithRepayments = createMockLoan({
	id: 2000010,
	status: 'payingBack',
	fundraisingPercent: 1,
	paidAmount: '785.17',
	repayments: partnerRepaymentPeriods,
});

/** Disbursed direct loan whose collected total stops part-way through an installment. */
export const disbursedDirectLoanWithInstallments = createMockLoan({
	id: 2000014,
	__typename: 'LoanDirect',
	status: 'payingBack',
	fundraisingPercent: 1,
	distributionModel: 'direct',
	partnerName: '',
	partner: null,
	loanAmount: '5000.00',
	terms: {
		currency: 'USD',
		currencyFullName: 'US Dollar',
		disbursalDate: '2015-01-29T08:00:00Z',
		expectedPayments: [],
		flexibleFundraisingEnabled: false,
		lenderRepaymentTerm: 24,
		loanAmount: '5000.00',
		lossLiabilityCurrencyExchange: 'none',
		__typename: 'LoanTerm',
	},
	repayments: [
		{
			dueDate: '2015-03-01T08:00:00Z',
			amount: '208.33',
			amountPaid: '208.33',
			status: 'repaid',
			__typename: 'LoanRepaymentDirect',
		},
		{
			dueDate: '2015-04-01T07:00:00Z',
			amount: '208.33',
			amountPaid: '91.71',
			status: 'partial',
			__typename: 'LoanRepaymentDirect',
		},
		{
			dueDate: '2015-05-01T07:00:00Z',
			amount: '208.33',
			amountPaid: null,
			status: 'future',
			__typename: 'LoanRepaymentDirect',
		},
	],
});

/** Dual-statement partner loan, which hides the advanced view. */
export const dualStatementPartnerLoan = createMockLoan({
	id: 2000013,
	status: 'payingBack',
	fundraisingPercent: 1,
	paidAmount: '785.17',
	dualStatementNote: 'This loan is part of a dual statement arrangement with the lending partner.',
	repayments: partnerRepaymentPeriods,
});

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

/** Matched fundraising loan that nobody has lent to yet. */
export const matchedNoLendersLoan = createMockLoan({
	id: 2000019,
	matchingText: 'Cisco',
	matchRatio: 1,
	simultaneousMatching: mockSimultaneousMatching,
	unreservedAmount: '600.00',
	loanFundraisingInfo: {
		id: 2000019,
		fundedAmount: '0.00',
		reservedAmount: '0.00',
		isExpiringSoon: false,
		__typename: 'LoanFundraisingInfo',
	},
	lenders: { totalCount: 0, values: [], __typename: 'LenderCollection' },
});

/** Fundraising loan with exactly one lender. */
export const singleLenderLoan = createMockLoan({
	id: 2000020,
	lenders: { totalCount: 1, values: mockLenders.slice(0, 1), __typename: 'LenderCollection' },
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
			numFundraisingLoans: 4,
			numPayingOnTimeLoans: 35,
			numPayingBackDelinquentLoans: 2,
			numRepaidInFullLoans: 78,
			repaymentRate: 98,
			totalLoansValue: '2000000.00',
		},
	},
	endorsement: 'Accion endorses this loan for responsible lending.',
});

/** Direct loan whose trustee has no stats data. */
export const directLoanWithTrusteeNoStats = {
	...directLoanWithTrustee,
	id: 2000021,
	trustee: {
		...directLoanWithTrustee.trustee,
		stats: {
			id: 2,
			numDefaultedLoans: null,
			numLoansEndorsedPublic: null,
			numFundraisingLoans: null,
			numPayingOnTimeLoans: null,
			numPayingBackDelinquentLoans: null,
			numRepaidInFullLoans: null,
			repaymentRate: null,
			totalLoansValue: null,
		},
	},
};
