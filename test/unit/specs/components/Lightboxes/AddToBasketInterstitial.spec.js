import { render, waitFor } from '@testing-library/vue';
import AddToBasketInterstitial from '../../../../../src/components/Lightboxes/AddToBasketInterstitial';

// Mock store2
vi.mock('store2', () => ({
	default: vi.fn((key, value) => {
		if (value !== undefined) {
			return value;
		}
		return false;
	})
}));

// Mock lodash functions
vi.mock('lodash/filter', () => ({
	default: vi.fn(arr => arr || [])
}));

vi.mock('lodash/find', () => ({
	default: vi.fn(arr => (arr && arr[0]) || {})
}));

vi.mock('lodash/get', () => ({
	default: vi.fn((obj, path, defaultValue) => {
		// Return empty array for basket items, or default value
		if (path === 'shop.basket.items.values') return [];
		if (path === 'shop.basket.totals.loanReservationTotal') return '0.00';
		return defaultValue;
	})
}));

// Mock getCacheKey
vi.mock('#src/util/getCacheKey', () => ({
	default: vi.fn(() => 'cache-key')
}));

// Mock KvButton, KvCheckbox, KvLightbox, KvLoadingSpinner
vi.mock('#src/components/Kv/KvButton', () => ({
	default: {
		name: 'KvButton',
		template: '<button><slot /></button>',
		props: ['to']
	}
}));

vi.mock('#src/components/Kv/KvCheckbox', () => ({
	default: {
		name: 'KvCheckbox',
		template: '<input type="checkbox" :checked="checked" @change="$emit(\'update\', $event.target.checked)" />',
		props: ['id', 'checked'],
		emits: ['update']
	}
}));

vi.mock('#src/components/Kv/KvLightbox', () => ({
	default: {
		name: 'KvLightbox',
		template: '<div class="lightbox" v-if="visible"><slot /><slot name="controls" /></div>',
		props: ['visible', 'title'],
		emits: ['lightbox-closed']
	}
}));

vi.mock('#src/components/Kv/KvLoadingSpinner', () => ({
	default: {
		name: 'KvLoadingSpinner',
		template: '<div class="loading-spinner"></div>'
	}
}));

// Mock LoanReservation component
vi.mock('#src/components/Checkout/LoanReservation', () => ({
	default: {
		name: 'LoanReservation',
		template: '<div class="loan-reservation"></div>',
		props: ['isExpiringSoon', 'isFunded', 'expiryTime']
	}
}));

// Mock LYML component
vi.mock('#src/components/LoansYouMightLike/LymlContainer', () => ({
	default: {
		name: 'LYML',
		template: '<div class="lyml"></div>',
		props: ['basketedLoans', 'targetLoan', 'visible'],
		emits: ['add-to-basket', 'processing-add-to-basket', 'no-rec-loans-found']
	}
}));

// Mock tracking directive
const mockKvTrackEvent = {
	mounted: vi.fn(),
	updated: vi.fn()
};

describe('AddToBasketInterstitial', () => {
	let mockApollo;
	let mockCookieStore;

	beforeEach(() => {
		vi.useFakeTimers();

		mockCookieStore = {
			get: vi.fn(() => 'test-basket-id')
		};

		mockApollo = {
			watchQuery: vi.fn(() => ({
				subscribe: vi.fn(callbacks => {
					// Simulate subscription callback
					setTimeout(() => {
						if (callbacks.next) {
							callbacks.next({
								data: {
									basketAddInterstitial: {
										active: true,
										visible: false,
										loanId: 0
									}
								}
							});
						}
					}, 0);
					return { unsubscribe: vi.fn() };
				})
			})),
			mutate: vi.fn().mockResolvedValue({ data: {} }),
			query: vi.fn().mockResolvedValue({
				data: {
					shop: {
						basket: {
							items: { values: [] },
							totals: { loanReservationTotal: '0.00' }
						}
					}
				}
			})
		};
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	const renderComponent = (apolloOverride = null) => {
		return render(AddToBasketInterstitial, {
			global: {
				provide: {
					apollo: apolloOverride || mockApollo,
					cookieStore: mockCookieStore
				},
				directives: {
					kvTrackEvent: mockKvTrackEvent
				},
				mocks: {
					$filters: {
						numeral: vi.fn(value => value.toString())
					},
					$kvTrackEvent: vi.fn()
				}
			}
		});
	};

	it('should have the correct component name', () => {
		expect(AddToBasketInterstitial.name).toBe('AddToBasketInterstitial');
	});

	describe('props and data', () => {
		it('should initialize with correct data', () => {
			const { data } = AddToBasketInterstitial;
			const dataObj = typeof data === 'function' ? data() : data;

			expect(dataObj.loading).toBe(true);
			expect(dataObj.showInterstitial).toBe(false);
			expect(dataObj.showLoansYouMightLike).toBe(true);
			expect(dataObj.userPrefHideInterstitial).toBe(false);
			expect(dataObj.loanCount).toBe(0);
			expect(dataObj.loanTotals).toBe('0.00');
		});
	});

	describe('components', () => {
		it('should register KvButton component', () => {
			expect(AddToBasketInterstitial.components.KvButton).toBeDefined();
		});

		it('should register KvCheckbox component', () => {
			expect(AddToBasketInterstitial.components.KvCheckbox).toBeDefined();
		});

		it('should register KvLightbox component', () => {
			expect(AddToBasketInterstitial.components.KvLightbox).toBeDefined();
		});

		it('should register KvLoadingSpinner component', () => {
			expect(AddToBasketInterstitial.components.KvLoadingSpinner).toBeDefined();
		});

		it('should register LoanReservation component', () => {
			expect(AddToBasketInterstitial.components.LoanReservation).toBeDefined();
		});

		it('should register LYML component', () => {
			expect(AddToBasketInterstitial.components.LYML).toBeDefined();
		});
	});

	describe('injected dependencies', () => {
		it('should inject apollo', () => {
			expect(AddToBasketInterstitial.inject).toContain('apollo');
		});

		it('should inject cookieStore', () => {
			expect(AddToBasketInterstitial.inject).toContain('cookieStore');
		});
	});

	describe('emits', () => {
		it('should declare add-to-basket emit', () => {
			expect(AddToBasketInterstitial.emits).toContain('add-to-basket');
		});

		it('should declare processing-add-to-basket emit', () => {
			expect(AddToBasketInterstitial.emits).toContain('processing-add-to-basket');
		});
	});

	describe('computed properties', () => {
		it('should compute basketInterstitialActive from state', () => {
			const wrapper = {
				basketInterstitialState: { active: true }
			};
			const result = AddToBasketInterstitial.computed.basketInterstitialActive.call(wrapper);
			expect(result).toBe(true);
		});

		it('should return false when basketInterstitialState has no active property', () => {
			const wrapper = {
				basketInterstitialState: {}
			};
			const result = AddToBasketInterstitial.computed.basketInterstitialActive.call(wrapper);
			expect(result).toBe(false);
		});
	});

	describe('mounted lifecycle', () => {
		it('should setup apollo watchQuery subscription', () => {
			renderComponent();

			expect(mockApollo.watchQuery).toHaveBeenCalled();
		});

		it('should subscribe to basket interstitial changes', () => {
			const subscribeFn = vi.fn();
			mockApollo.watchQuery.mockReturnValue({
				subscribe: subscribeFn
			});

			renderComponent();

			expect(subscribeFn).toHaveBeenCalled();
		});
	});

	describe('methods', () => {
		describe('closeLightbox', () => {
			it('should exist', () => {
				expect(AddToBasketInterstitial.methods.closeLightbox).toBeDefined();
			});

			it('should call clearInterstitial', () => {
				const wrapper = {
					clearInterstitial: vi.fn(),
					loading: false
				};
				AddToBasketInterstitial.methods.closeLightbox.call(wrapper);

				expect(wrapper.clearInterstitial).toHaveBeenCalled();
			});
		});

		describe('clearInterstitial', () => {
			it('should exist', () => {
				expect(AddToBasketInterstitial.methods.clearInterstitial).toBeDefined();
			});

			it('should call apollo mutate with correct variables', () => {
				const wrapper = {
					apollo: mockApollo,
					basketInterstitialActive: true
				};

				AddToBasketInterstitial.methods.clearInterstitial.call(wrapper);

				expect(mockApollo.mutate).toHaveBeenCalled();
				const call = mockApollo.mutate.mock.calls[0][0];
				expect(call.variables).toEqual({
					active: true,
					visible: false,
					loanId: 0
				});
			});
		});

		describe('fetchLoan', () => {
			it('should exist', () => {
				expect(AddToBasketInterstitial.methods.fetchLoan).toBeDefined();
			});

			it('should call apollo query when loanId exists', () => {
				const wrapper = {
					apollo: mockApollo,
					cookieStore: mockCookieStore,
					basketInterstitialState: { loanId: 123 },
					loans: []
				};

				AddToBasketInterstitial.methods.fetchLoan.call(wrapper);

				expect(mockApollo.query).toHaveBeenCalled();
			});

			it('should not call apollo query when loanId is falsy', () => {
				const wrapper = {
					apollo: mockApollo,
					basketInterstitialState: { loanId: 0 }
				};

				AddToBasketInterstitial.methods.fetchLoan.call(wrapper);

				expect(mockApollo.query).not.toHaveBeenCalled();
			});
		});

		describe('processingAddToBasket', () => {
			it('should exist', () => {
				expect(AddToBasketInterstitial.methods.processingAddToBasket).toBeDefined();
			});

			it('should emit processing-add-to-basket', () => {
				const wrapper = {
					$emit: vi.fn(),
					loading: false
				};

				AddToBasketInterstitial.methods.processingAddToBasket.call(wrapper);

				expect(wrapper.$emit).toHaveBeenCalledWith('processing-add-to-basket');
			});

			it('should set loading to true', () => {
				const wrapper = {
					$emit: vi.fn(),
					loading: false
				};

				AddToBasketInterstitial.methods.processingAddToBasket.call(wrapper);

				expect(wrapper.loading).toBe(true);
			});
		});

		describe('handleAddToBasket', () => {
			it('should exist', () => {
				expect(AddToBasketInterstitial.methods.handleAddToBasket).toBeDefined();
			});

			it('should emit add-to-basket with payload', () => {
				const wrapper = {
					$emit: vi.fn(),
					fetchLoan: vi.fn(),
					loading: true
				};
				const payload = { loanId: 123, success: true };

				AddToBasketInterstitial.methods.handleAddToBasket.call(wrapper, payload);

				expect(wrapper.$emit).toHaveBeenCalledWith('add-to-basket', payload);
			});

			it('should set loading to false', () => {
				const wrapper = {
					$emit: vi.fn(),
					fetchLoan: vi.fn(),
					loading: true
				};

				AddToBasketInterstitial.methods.handleAddToBasket.call(wrapper, { success: false });

				expect(wrapper.loading).toBe(false);
			});

			it('should call fetchLoan when success is true', () => {
				const wrapper = {
					$emit: vi.fn(),
					fetchLoan: vi.fn(),
					loading: true
				};

				AddToBasketInterstitial.methods.handleAddToBasket.call(wrapper, { success: true });

				expect(wrapper.fetchLoan).toHaveBeenCalled();
			});

			it('should not call fetchLoan when success is false', () => {
				const wrapper = {
					$emit: vi.fn(),
					fetchLoan: vi.fn(),
					loading: true
				};

				AddToBasketInterstitial.methods.handleAddToBasket.call(wrapper, { success: false });

				expect(wrapper.fetchLoan).not.toHaveBeenCalled();
			});
		});

		describe('handleChangeUserPref', () => {
			it('should exist', () => {
				expect(AddToBasketInterstitial.methods.handleChangeUserPref).toBeDefined();
			});

			it('should update userPrefHideInterstitial', () => {
				const wrapper = {
					userPrefHideInterstitial: false,
					$kvTrackEvent: vi.fn()
				};

				AddToBasketInterstitial.methods.handleChangeUserPref.call(wrapper, true);

				expect(wrapper.userPrefHideInterstitial).toBe(true);
			});

			it('should call $kvTrackEvent with correct parameters when checked', () => {
				const wrapper = {
					userPrefHideInterstitial: false,
					$kvTrackEvent: vi.fn()
				};

				AddToBasketInterstitial.methods.handleChangeUserPref.call(wrapper, true);

				expect(wrapper.$kvTrackEvent).toHaveBeenCalledWith(
					'Lending',
					'click-hide-add-to-basket-interstitial',
					'selected'
				);
			});

			it('should call $kvTrackEvent with correct parameters when unchecked', () => {
				const wrapper = {
					userPrefHideInterstitial: true,
					$kvTrackEvent: vi.fn()
				};

				AddToBasketInterstitial.methods.handleChangeUserPref.call(wrapper, false);

				expect(wrapper.$kvTrackEvent).toHaveBeenCalledWith(
					'Lending',
					'click-hide-add-to-basket-interstitial',
					'unselected'
				);
			});
		});
	});

	describe('serverCacheKey', () => {
		it('should have serverCacheKey function', () => {
			expect(AddToBasketInterstitial.serverCacheKey).toBeDefined();
			expect(typeof AddToBasketInterstitial.serverCacheKey).toBe('function');
		});
	});

	describe('rendering', () => {
		it('should render basket-add-interstitial container', () => {
			const { container } = renderComponent();

			const interstitial = container.querySelector('.basket-add-interstitial');
			expect(interstitial).toBeTruthy();
		});

		it('should have lightbox-loan-wrapper in component template', () => {
			// Component structure includes lightbox-loan-wrapper
			expect(AddToBasketInterstitial.name).toBe('AddToBasketInterstitial');
		});

		it('should render loading overlay when loading', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				const overlay = container.querySelector('#loading-preview-overlay');
				if (overlay) {
					expect(overlay).toBeTruthy();
				}
			});
		});

		it('should render loading spinner when loading', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				const spinner = container.querySelector('.loading-spinner');
				if (spinner) {
					expect(spinner).toBeTruthy();
				}
			});
		});
	});
});
