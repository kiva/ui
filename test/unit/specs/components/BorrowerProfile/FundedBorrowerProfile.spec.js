import { render, waitFor } from '@testing-library/vue';
import FundedBorrowerProfile from '../../../../../src/components/BorrowerProfile/FundedBorrowerProfile';

// Mock child components
vi.mock('#src/components/Kv/KvLoadingSpinner', () => ({
	default: { name: 'KvLoadingSpinner', template: '<div data-testid="loading-spinner">Loading...</div>' }
}));

vi.mock('#src/components/BorrowerProfile/HeroBackground', () => ({
	default: { name: 'HeroBackground', template: '<div data-testid="hero-background"></div>' }
}));

vi.mock('#src/components/BorrowerProfile/BorrowerName', () => ({
	default: { name: 'BorrowerName', template: '<div data-testid="borrower-name"></div>', props: ['name'] }
}));

vi.mock('#src/components/BorrowerProfile/LoanProgress', () => ({
	default: {
		name: 'LoanProgress',
		template: '<div data-testid="loan-progress"></div>',
		props: ['progressPercent', 'loading', 'loanStatus']
	}
}));

vi.mock('#src/components/BorrowerProfile/BorrowerImage', () => ({
	default: {
		name: 'BorrowerImage',
		template: '<div data-testid="borrower-image"></div>',
		props: ['alt', 'aspectRatio', 'hash', 'defaultImage', 'images']
	}
}));

vi.mock('#src/components/LoanCollections/KivaClassicLoanCarousel', () => ({
	default: {
		name: 'KivaClassicLoanCarousel',
		template: '<div data-testid="loan-carousel"></div>',
		props: ['isVisible', 'loanIds', 'expLabel', 'lendNowButton']
	}
}));

vi.mock('#src/components/LoanCards/LoanCardController', () => ({
	default: {
		name: 'LoanCardController',
		template: '<div data-testid="loan-card"></div>',
		props: ['categorySetId', 'enableTracking', 'loan', 'loanCardType', 'position', 'rowNumber', 'isVisitor']
	}
}));

vi.mock('@kiva/kv-components', () => ({
	KvGrid: { name: 'KvGrid', template: '<div data-testid="kv-grid"><slot /></div>' },
	KvPageContainer: { name: 'KvPageContainer', template: '<div data-testid="kv-page-container"><slot /></div>' }
}));

vi.mock('#src/util/logReadQueryError');

const mockCreateObserver = vi.fn();
vi.mock('#src/util/observerUtils', () => ({
	createIntersectionObserver: () => mockCreateObserver()
}));

const mockApollo = {
	query: vi.fn()
};

const mockCookieStore = {};

const mockKvTrack = vi.fn();

describe('FundedBorrowerProfile', () => {
	const createWrapper = (props = {}) => {
		const defaultProps = {
			loan: {
				id: 123,
				name: 'John Doe',
				loanAmount: 500,
				status: 'funded',
				use: 'buy farming supplies',
				gender: 'female',
				sector: {
					id: 1,
					name: 'Agriculture'
				},
				geocode: {
					country: {
						name: 'Kenya',
						isoCode: 'KE'
					}
				},
				loanFundraisingInfo: {
					fundedAmount: 500
				},
				anonymizationLevel: 'none'
			},
			hash: 'abc123',
			itemsInBasket: [],
			inviterName: ''
		};

		return render(FundedBorrowerProfile, {
			props: {
				...defaultProps,
				...props
			},
			global: {
				provide: {
					apollo: mockApollo,
					cookieStore: mockCookieStore
				},
				mocks: {
					$kvTrackSelfDescribingEvent: mockKvTrack
				}
			}
		});
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockApollo.query.mockResolvedValue({ data: {} });
		// Mock createIntersectionObserver to return a mock observer by default (prevents auto-fetching)
		mockCreateObserver.mockReturnValue({ disconnect: vi.fn() });
	});

	describe('Component Structure', () => {
		it('should have the correct name', () => {
			expect(FundedBorrowerProfile.name).toBe('FundedBorrowerProfile');
		});

		it('should inject apollo and cookieStore', () => {
			expect(FundedBorrowerProfile.inject).toEqual(['apollo', 'cookieStore']);
		});

		it('should declare props correctly', () => {
			expect(FundedBorrowerProfile.props).toHaveProperty('loan');
			expect(FundedBorrowerProfile.props).toHaveProperty('hash');
			expect(FundedBorrowerProfile.props).toHaveProperty('itemsInBasket');
			expect(FundedBorrowerProfile.props).toHaveProperty('inviterName');
		});

		it('should register required components', () => {
			const {
				KvLoadingSpinner,
				HeroBackground,
				BorrowerName,
				LoanProgress,
				BorrowerImage,
				KvGrid,
				KvPageContainer,
				KivaClassicLoanCarousel,
				LoanCardController
			} = FundedBorrowerProfile.components;
			expect(KvLoadingSpinner).toBeDefined();
			expect(HeroBackground).toBeDefined();
			expect(BorrowerName).toBeDefined();
			expect(LoanProgress).toBeDefined();
			expect(BorrowerImage).toBeDefined();
			expect(KvGrid).toBeDefined();
			expect(KvPageContainer).toBeDefined();
			expect(KivaClassicLoanCarousel).toBeDefined();
			expect(LoanCardController).toBeDefined();
		});
	});

	describe('Initial State', () => {
		it('should initialize with correct default data', () => {
			const instance = FundedBorrowerProfile.data();
			expect(instance.viewportObserver).toBeNull();
			expect(instance.isLoading).toBe(true);
			expect(instance.categories).toEqual([]);
			expect(instance.rows).toBeNull();
			expect(instance.isVisitor).toBe(true);
			expect(instance.loanRowsCount).toBe(4);
		});
	});

	describe('Head Metadata', () => {
		it('should generate correct head metadata for non-anonymous loan', () => {
			const loan = {
				name: 'John Doe',
				loanAmount: 500,
				use: 'buy farming supplies',
				geocode: {
					country: {
						name: 'Kenya'
					}
				},
				anonymizationLevel: 'none'
			};
			const shareTitle = 'A loan of $500 made a difference for John Doe';
			const shareDescription = 'Kiva is a loan, not a donation. '
				+ 'With Kiva you can lend as little as $25 and make a big change in someone\'s life.';
			const context = {
				loan,
				shareTitle,
				shareDescription
			};
			const head = FundedBorrowerProfile.head.call(context);

			expect(head.title).toBe('John Doe from Kenya\'s loan has been funded!');
			expect(head.meta).toEqual(expect.arrayContaining([
				expect.objectContaining({ name: 'description', content: 'A loan helped buy farming supplies' })
			]));
		});

		it('should generate correct head metadata for fully anonymous loan', () => {
			const loan = {
				name: 'John Doe',
				loanAmount: 500,
				use: 'buy farming supplies',
				geocode: {
					country: {
						name: 'Kenya'
					}
				},
				anonymizationLevel: 'full'
			};
			const shareTitle = 'A loan of $500 made a difference';
			const shareDescription = 'Kiva is a loan, not a donation. '
				+ 'With Kiva you can lend as little as $25 and make a big change in someone\'s life.';
			const context = {
				loan,
				shareTitle,
				shareDescription
			};
			const head = FundedBorrowerProfile.head.call(context);

			expect(head.title).toBe('John Doe from Kenya\'s loan has been funded!');
		});
	});

	describe('Computed Properties', () => {
		describe('shareTitle', () => {
			it('should include borrower name for non-anonymous loans', () => {
				const loan = { anonymizationLevel: 'none', loanAmount: 500, name: 'John Doe' };
				const result = FundedBorrowerProfile.computed.shareTitle.call({ loan });
				expect(result).toBe('A loan of $500 made a difference for John Doe');
			});

			it('should exclude borrower name for fully anonymous loans', () => {
				const loan = { anonymizationLevel: 'full', loanAmount: 500, name: 'John Doe' };
				const result = FundedBorrowerProfile.computed.shareTitle.call({ loan });
				expect(result).toBe('A loan of $500 made a difference');
			});
		});

		describe('shareDescription', () => {
			it('should return standard Kiva description', () => {
				const result = FundedBorrowerProfile.computed.shareDescription.call({});
				const expected = 'Kiva is a loan, not a donation. '
					+ 'With Kiva you can lend as little as $25 and make a big change in someone\'s life.';
				expect(result).toBe(expected);
			});
		});

		describe('loanStatus', () => {
			it('should return "funded" when status is "fundraising"', () => {
				const loan = { status: 'fundraising' };
				const result = FundedBorrowerProfile.computed.loanStatus.call({ loan });
				expect(result).toBe('funded');
			});

			it('should return actual status when not fundraising', () => {
				const loan = { status: 'payingBack' };
				const result = FundedBorrowerProfile.computed.loanStatus.call({ loan });
				expect(result).toBe('payingBack');
			});

			it('should default to "funded" when status is missing', () => {
				const loan = {};
				const result = FundedBorrowerProfile.computed.loanStatus.call({ loan });
				expect(result).toBe('funded');
			});
		});

		describe('progressPercent', () => {
			it('should return 1 when loan status is "funded"', () => {
				const loan = { status: 'funded' };
				const context = { loan, loanStatus: 'funded' };
				const result = FundedBorrowerProfile.computed.progressPercent.call(context);
				expect(result).toBe(1);
			});

			it('should calculate progress percent when not fully funded', () => {
				const loan = {
					status: 'fundraising',
					loanAmount: 500,
					loanFundraisingInfo: {
						fundedAmount: 250
					}
				};
				const context = { loan, loanStatus: 'funded' }; // Status is "funded" per loanStatus computed
				const result = FundedBorrowerProfile.computed.progressPercent.call(context);
				expect(result).toBe(1); // Because loanStatus returns "funded" for fundraising
			});

			it('should handle missing funding info', () => {
				const loan = { status: 'payingBack', loanAmount: 500 };
				const context = { loan, loanStatus: 'payingBack' };
				const result = FundedBorrowerProfile.computed.progressPercent.call(context);
				expect(result).toBe(0);
			});
		});
	});

	describe('Rendered Content', () => {
		it('should render hero section with borrower details', async () => {
			const { getByTestId } = createWrapper();

			await waitFor(() => {
				expect(getByTestId('hero-background')).toBeTruthy();
				expect(getByTestId('bp-summary-image')).toBeTruthy();
				expect(getByTestId('bp-summary-borrower-name')).toBeTruthy();
				expect(getByTestId('bp-summary-progress')).toBeTruthy();
			});
		});

		it('should render loading spinner when isLoading is true', async () => {
			const { getByTestId } = createWrapper();

			await waitFor(() => {
				expect(getByTestId('loading-spinner')).toBeTruthy();
			});
		});

		it('should render heading for similar borrowers section', async () => {
			const { getByText } = createWrapper();

			await waitFor(() => {
				expect(getByText('Similar borrowers that need your support')).toBeTruthy();
			});
		});
	});
});
