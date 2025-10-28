import { render } from '@testing-library/vue';
import {
	vi, describe, it, expect, beforeEach
} from 'vitest';
import LendCta from '#src/components/BorrowerProfile/LendCta';

// Mock child components
vi.mock('#src/components/BorrowerProfile/JumpLinks', () => ({
	default: { name: 'JumpLinks', template: '<div data-testid="jump-links"></div>' }
}));

vi.mock('#src/components/BorrowerProfile/LoanBookmark', () => ({
	default: {
		name: 'LoanBookmark',
		template: '<div data-testid="loan-bookmark"></div>',
		props: ['loanId']
	}
}));

vi.mock('#src/components/LoanCards/Buttons/LendAmountButton', () => ({
	default: {
		name: 'LendAmountButton',
		template: '<button data-testid="lend-amount-button"></button>',
		props: ['loanId', 'showNow', 'amountLeft', 'completeLoan']
	}
}));

vi.mock('#src/components/BorrowerProfile/CompleteLoanWrapper', () => ({
	default: {
		name: 'CompleteLoanWrapper',
		template: '<div><slot name="button"></slot></div>',
		props: ['isCompleteLoanActive']
	}
}));

vi.mock('#src/components/Kv/KvIcon', () => ({
	default: {
		name: 'KvIcon',
		template: '<span data-testid="kv-icon"></span>',
		props: ['name']
	}
}));

vi.mock('#src/components/WwwFrame/Header/KvAtbModalContainer', () => ({
	default: {
		name: 'KvAtbModalContainer',
		template: '<div data-testid="kv-atb-modal"></div>',
		props: ['addedLoan']
	}
}));

vi.mock('@kiva/kv-components', () => ({
	KvSelect: {
		name: 'KvSelect',
		template: '<select data-testid="kv-select"><slot /></select>',
		props: ['id', 'modelValue']
	},
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		template: '<span data-testid="kv-material-icon"></span>',
		props: ['icon']
	},
	KvButton: {
		name: 'KvButton',
		template: '<button data-testid="kv-button"><slot /></button>',
		props: ['to', 'type']
	},
	KvGrid: {
		name: 'KvGrid',
		template: '<div data-testid="kv-grid"><slot /></div>'
	}
}));

vi.mock('#src/util/basketUtils', () => ({
	setLendAmount: vi.fn(),
	INVALID_BASKET_ERROR: 'Invalid basket error'
}));

vi.mock('#src/util/loanUtils', () => ({
	getDropdownPriceArray: vi.fn(() => [25, 50, 75, 100]),
	isMatchAtRisk: vi.fn(() => false),
	isLessThan25: vi.fn(amount => parseFloat(amount) < 25),
	isBetween25And500: vi.fn(amount => parseFloat(amount) >= 25 && parseFloat(amount) <= 500),
	getLendCtaSelectedOption: vi.fn(() => '25')
}));

vi.mock('#src/util/observerUtils', () => ({
	createIntersectionObserver: vi.fn()
}));

vi.mock('#src/util/experiment/experimentUtils', () => ({
	getExperimentSettingCached: vi.fn(),
	trackExperimentVersion: vi.fn()
}));

vi.mock('#src/util/teamChallengeUtils', () => ({
	setChallengeCookieData: vi.fn()
}));

vi.mock('#src/plugins/basket-modal-mixin', () => ({
	default: {
		methods: {
			handleCartModal: vi.fn()
		}
	}
}));

const mockApollo = {
	query: vi.fn()
};

const mockCookieStore = {};

const mockKvTrack = vi.fn();
const mockShowTipMsg = vi.fn();

describe('LendCta', () => {
	const createWrapper = (props = {}) => {
		const defaultProps = {
			loanId: 123,
			enableFiveDollarsNotes: false,
			teamData: null
		};

		return render(LendCta, {
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
					$kvTrackEvent: mockKvTrack,
					$showTipMsg: mockShowTipMsg,
					$route: {
						query: {}
					}
				},
				stubs: {
					'kv-atb-modal-container': true
				}
			}
		});
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockApollo.query.mockResolvedValue({ data: {} });
	});

	describe('Component Structure', () => {
		it('should have the correct name', () => {
			expect(LendCta.name).toBe('LendCta');
		});

		it('should inject apollo and cookieStore', () => {
			expect(LendCta.inject).toEqual(['apollo', 'cookieStore']);
		});

		it('should declare props correctly', () => {
			expect(LendCta.props).toHaveProperty('loanId');
			expect(LendCta.props.loanId.type).toBe(Number);
			expect(LendCta.props.loanId.default).toBe(0);

			expect(LendCta.props).toHaveProperty('enableFiveDollarsNotes');
			expect(LendCta.props.enableFiveDollarsNotes.type).toBe(Boolean);
			expect(LendCta.props.enableFiveDollarsNotes.default).toBe(false);

			expect(LendCta.props).toHaveProperty('teamData');
			expect(LendCta.props.teamData.type).toBe(Object);
			expect(LendCta.props.teamData.default).toBeNull();
		});

		it('should register required components', () => {
			const {
				LendAmountButton,
				KvGrid,
				KvIcon,
				KvMaterialIcon,
				KvUiButton,
				KvUiSelect,
				JumpLinks,
				LoanBookmark,
				CompleteLoanWrapper,
				KvAtbModalContainer
			} = LendCta.components;

			expect(LendAmountButton).toBeDefined();
			expect(KvGrid).toBeDefined();
			expect(KvIcon).toBeDefined();
			expect(KvMaterialIcon).toBeDefined();
			expect(KvUiButton).toBeDefined();
			expect(KvUiSelect).toBeDefined();
			expect(JumpLinks).toBeDefined();
			expect(LoanBookmark).toBeDefined();
			expect(CompleteLoanWrapper).toBeDefined();
			expect(KvAtbModalContainer).toBeDefined();
		});
	});

	describe('Initial State', () => {
		it('should initialize with correct default data', () => {
			const instance = LendCta.data();

			expect(instance.isLoggedIn).toBe(false);
			expect(instance.defaultSelectorAmount).toBe(25);
			expect(instance.selectedOption).toBe('25');
			expect(instance.loanAmount).toBe('');
			expect(instance.isExpiringSoon).toBe(false);
			expect(instance.fundedAmount).toBe('');
			expect(instance.reservedAmount).toBe('');
			expect(instance.unreservedAmount).toBe('');
			expect(instance.lentPreviously).toBe(false);
			expect(instance.promoEligible).toBe(false);
			expect(instance.minNoteSize).toBe('');
			expect(instance.status).toBe('');
			expect(instance.numLenders).toBe(0);
			expect(instance.lenderCountVisibility).toBe(false);
			expect(instance.matchingTextVisibility).toBe(false);
			expect(instance.matchingText).toBe('');
			expect(instance.matchRatio).toBe(0);
			expect(instance.basketItems).toEqual([]);
			expect(instance.isAdding).toBe(false);
			expect(instance.isLoading).toBe(true);
			expect(instance.hasFreeCredit).toBe(false);
			expect(instance.isSticky).toBe(false);
			expect(instance.wrapperHeight).toBe(0);
			expect(instance.wrapperObserver).toBeNull();
			expect(instance.name).toBe('');
			expect(instance.completeLoanView).toBe(true);
			expect(instance.slotMachineInterval).toBeNull();
			expect(instance.currentSlotStat).toBe('');
			expect(instance.matchingHighlightExpShown).toBe(false);
			expect(instance.inPfp).toBe(false);
			expect(instance.userBalance).toBeUndefined();
			expect(instance.loan).toBeNull();
			expect(instance.basketSize).toBe(0);
		});
	});

	describe('Computed Properties', () => {
		describe('isInBasket', () => {
			it('should return true when loan is in basket', () => {
				const context = {
					basketItems: [
						{ __typename: 'LoanReservation', id: 123 }
					],
					loanId: 123
				};
				const result = LendCta.computed.isInBasket.call(context);
				expect(result).toBe(true);
			});

			it('should return false when loan is not in basket', () => {
				const context = {
					basketItems: [
						{ __typename: 'LoanReservation', id: 456 }
					],
					loanId: 123
				};
				const result = LendCta.computed.isInBasket.call(context);
				expect(result).toBe(false);
			});

			it('should return false when basket is empty', () => {
				const context = {
					basketItems: [],
					loanId: 123
				};
				const result = LendCta.computed.isInBasket.call(context);
				expect(result).toBe(false);
			});
		});

		describe('state', () => {
			it('should return "loading" when isLoading is true', () => {
				const context = { isLoading: true, isAdding: false };
				const result = LendCta.computed.state.call(context);
				expect(result).toBe('loading');
			});

			it('should return "adding" when isAdding is true', () => {
				const context = {
					isLoading: false,
					isAdding: true,
					isInBasket: false
				};
				const result = LendCta.computed.state.call(context);
				expect(result).toBe('adding');
			});

			it('should return "basketed" when loan is in basket', () => {
				const context = {
					isLoading: false,
					isAdding: false,
					isInBasket: true
				};
				const result = LendCta.computed.state.call(context);
				expect(result).toBe('basketed');
			});

			it('should return "funded" when status is funded', () => {
				const context = {
					isLoading: false,
					isAdding: false,
					isInBasket: false,
					status: 'funded'
				};
				const result = LendCta.computed.state.call(context);
				expect(result).toBe('funded');
			});

			it('should return "fully-reserved" when allSharesReserved is true', () => {
				const context = {
					isLoading: false,
					isAdding: false,
					isInBasket: false,
					status: 'fundraising',
					allSharesReserved: true
				};
				const result = LendCta.computed.state.call(context);
				expect(result).toBe('fully-reserved');
			});

			it('should return "lent-to" when lentPreviously is true', () => {
				const context = {
					isLoading: false,
					isAdding: false,
					isInBasket: false,
					status: 'fundraising',
					allSharesReserved: false,
					lentPreviously: true
				};
				const result = LendCta.computed.state.call(context);
				expect(result).toBe('lent-to');
			});

			it('should return "lend" for normal lending state', () => {
				const context = {
					isLoading: false,
					isAdding: false,
					isInBasket: false,
					status: 'fundraising',
					allSharesReserved: false,
					lentPreviously: false
				};
				const result = LendCta.computed.state.call(context);
				expect(result).toBe('lend');
			});
		});

		describe('ctaButtonText', () => {
			it('should return "Lend now" when showSparkles is true', () => {
				const context = { showSparkles: true, state: 'lend' };
				const result = LendCta.computed.ctaButtonText.call(context);
				expect(result).toBe('Lend now');
			});

			it('should return "Loading..." when state is loading', () => {
				const context = { showSparkles: false, state: 'loading' };
				const result = LendCta.computed.ctaButtonText.call(context);
				expect(result).toBe('Loading...');
			});

			it('should return "Find another loan like this" when state is funded', () => {
				const context = { showSparkles: false, state: 'funded' };
				const result = LendCta.computed.ctaButtonText.call(context);
				expect(result).toBe('Find another loan like this');
			});

			it('should return "Find another loan" when state is expired', () => {
				const context = { showSparkles: false, state: 'expired' };
				const result = LendCta.computed.ctaButtonText.call(context);
				expect(result).toBe('Find another loan');
			});

			it('should return "Lend now" for default state', () => {
				const context = { showSparkles: false, state: 'lend' };
				const result = LendCta.computed.ctaButtonText.call(context);
				expect(result).toBe('Lend now');
			});
		});

		describe('lgScreenheadline', () => {
			it('should return almost funded message when showSparkles is true', () => {
				const context = { showSparkles: true, name: 'John', state: 'lend' };
				const result = LendCta.computed.lgScreenheadline.call(context);
				expect(result).toBe('John\'s loan is almost funded!');
			});

			it('should return loading message when state is loading', () => {
				const context = { showSparkles: false, state: 'loading' };
				const result = LendCta.computed.lgScreenheadline.call(context);
				expect(result).toBe('Loading...');
			});

			it('should return help more borrowers message when state is funded', () => {
				const context = { showSparkles: false, state: 'funded' };
				const result = LendCta.computed.lgScreenheadline.call(context);
				expect(result).toBe('Help more borrowers like this');
			});

			it('should return help fund this loan for default state', () => {
				const context = { showSparkles: false, state: 'lend' };
				const result = LendCta.computed.lgScreenheadline.call(context);
				expect(result).toBe('Help fund this loan');
			});
		});

		describe('freeCreditWarning', () => {
			it('should return true when has free credit but not promo eligible', () => {
				const context = { hasFreeCredit: true, promoEligible: false };
				const result = LendCta.computed.freeCreditWarning.call(context);
				expect(result).toBe(true);
			});

			it('should return false when has free credit and promo eligible', () => {
				const context = { hasFreeCredit: true, promoEligible: true };
				const result = LendCta.computed.freeCreditWarning.call(context);
				expect(result).toBe(false);
			});

			it('should return false when no free credit', () => {
				const context = { hasFreeCredit: false, promoEligible: false };
				const result = LendCta.computed.freeCreditWarning.call(context);
				expect(result).toBe(false);
			});
		});

		describe('allSharesReserved', () => {
			it('should return true when unreservedAmount is 0', () => {
				const context = { unreservedAmount: '0' };
				const result = LendCta.computed.allSharesReserved.call(context);
				expect(result).toBe(true);
			});

			it('should return false when unreservedAmount is greater than 0', () => {
				const context = { unreservedAmount: '25' };
				const result = LendCta.computed.allSharesReserved.call(context);
				expect(result).toBe(false);
			});
		});

		describe('lendButtonVisibility', () => {
			it('should return true when state is lend', () => {
				const context = { state: 'lend' };
				const result = LendCta.computed.lendButtonVisibility.call(context);
				expect(result).toBe(true);
			});

			it('should return true when state is loading', () => {
				const context = { state: 'loading' };
				const result = LendCta.computed.lendButtonVisibility.call(context);
				expect(result).toBe(true);
			});

			it('should return false for other states', () => {
				const context = { state: 'funded' };
				const result = LendCta.computed.lendButtonVisibility.call(context);
				expect(result).toBe(false);
			});
		});

		describe('showNonActionableLoanButton', () => {
			it('should return true for funded state', () => {
				const context = { state: 'funded' };
				const result = LendCta.computed.showNonActionableLoanButton.call(context);
				expect(result).toBe(true);
			});

			it('should return true for refunded state', () => {
				const context = { state: 'refunded' };
				const result = LendCta.computed.showNonActionableLoanButton.call(context);
				expect(result).toBe(true);
			});

			it('should return true for expired state', () => {
				const context = { state: 'expired' };
				const result = LendCta.computed.showNonActionableLoanButton.call(context);
				expect(result).toBe(true);
			});

			it('should return true for fully-reserved state', () => {
				const context = { state: 'fully-reserved' };
				const result = LendCta.computed.showNonActionableLoanButton.call(context);
				expect(result).toBe(true);
			});

			it('should return false for lend state', () => {
				const context = { state: 'lend' };
				const result = LendCta.computed.showNonActionableLoanButton.call(context);
				expect(result).toBe(false);
			});
		});
	});

	describe('Methods', () => {
		describe('cycleStatsSlot', () => {
			it('should set initial stat when called', () => {
				const context = {
					slotMachineInterval: null,
					status: 'fundraising',
					numLenders: 10,
					matchingText: '',
					currentSlotStat: '',
					isMatchAtRisk: false
				};

				LendCta.methods.cycleStatsSlot.call(context);

				expect(context.currentSlotStat).toBe('lenderCount');
			});

			it('should not set interval if already set', () => {
				const context = {
					slotMachineInterval: 123,
					status: 'fundraising',
					numLenders: 10,
					matchingText: '',
					currentSlotStat: 'lenderCount',
					isMatchAtRisk: false
				};

				const initialInterval = context.slotMachineInterval;
				LendCta.methods.cycleStatsSlot.call(context);

				expect(context.slotMachineInterval).toBe(initialInterval);
			});
		});

		describe('trackLendAmountSelection', () => {
			it('should track lend amount modification', () => {
				const context = {
					$kvTrackEvent: mockKvTrack
				};

				LendCta.methods.trackLendAmountSelection.call(context, 50);

				expect(mockKvTrack).toHaveBeenCalledWith(
					'Lending',
					'Modify lend amount',
					50
				);
			});
		});
	});

	describe('Rendered Content', () => {
		it('should render the component wrapper', () => {
			const { container } = createWrapper();
			expect(container.querySelector('[data-testid="kv-grid"]')).toBeTruthy();
		});

		it('should render jump links', () => {
			const { getByTestId } = createWrapper();
			expect(getByTestId('bp-lend-cta-jump-links')).toBeTruthy();
		});
	});
});
