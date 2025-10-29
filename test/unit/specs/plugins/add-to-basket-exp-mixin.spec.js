import addToBasketExpMixin from '../../../../src/plugins/add-to-basket-exp-mixin';

vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn()
}));

vi.mock('#src/util/settingsUtils', () => ({
	readBoolSetting: vi.fn()
}));

vi.mock('#src/graphql/query/uiConfigSetting.graphql', () => ({
	default: 'uiConfigSettingQuery'
}));

describe('add-to-basket-exp-mixin.js', () => {
	let context;
	let mockApollo;
	let mockRoute;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn()
		};

		mockRoute = {
			path: '/lend/filter'
		};

		context = {
			apollo: mockApollo,
			$route: mockRoute,
			$emit: vi.fn(),
			enableAddToBasketExp: false
		};

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('inject', () => {
		it('should inject apollo', () => {
			expect(addToBasketExpMixin.inject).toContain('apollo');
		});
	});

	describe('data', () => {
		it('should initialize enableAddToBasketExp to false', () => {
			const data = addToBasketExpMixin.data();
			expect(data.enableAddToBasketExp).toBe(false);
		});
	});

	describe('emits', () => {
		it('should declare show-cart-modal emit', () => {
			expect(addToBasketExpMixin.emits).toContain('show-cart-modal');
		});
	});

	describe('created', () => {
		it('should query for uiConfigSetting', () => {
			mockApollo.query.mockResolvedValue({ data: {} });

			addToBasketExpMixin.created.call(context);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: 'uiConfigSettingQuery',
				variables: {
					key: 'new_atb_experience_enable'
				}
			});
		});

		it('should set enableAddToBasketExp when query succeeds', async () => {
			const { readBoolSetting } = await import('#src/util/settingsUtils');
			readBoolSetting.mockReturnValue(true);
			mockApollo.query.mockResolvedValue({
				data: { general: { uiConfigSetting: { value: 'true' } } }
			});

			await addToBasketExpMixin.created.call(context);

			expect(readBoolSetting).toHaveBeenCalledWith(
				{ general: { uiConfigSetting: { value: 'true' } } },
				'general.uiConfigSetting.value'
			);
			expect(context.enableAddToBasketExp).toBe(true);
		});

		it('should handle query error gracefully', () => {
			const error = new Error('Query failed');
			mockApollo.query.mockRejectedValue(error);

			// The created method doesn't return a promise, just fires one off
			// It should not throw when called
			expect(() => addToBasketExpMixin.created.call(context)).not.toThrow();
		});
	});

	describe('methods', () => {
		describe('showCartModal', () => {
			it('should emit show-cart-modal event', () => {
				const payload = { loanId: 123 };

				addToBasketExpMixin.methods.showCartModal.call(context, payload);

				expect(context.$emit).toHaveBeenCalledWith('show-cart-modal', payload);
			});

			it('should emit with undefined payload', () => {
				addToBasketExpMixin.methods.showCartModal.call(context);

				expect(context.$emit).toHaveBeenCalledWith('show-cart-modal', undefined);
			});
		});
	});

	describe('computed', () => {
		describe('isInExperimentPages', () => {
			it('should return true when path includes lend', () => {
				context.$route.path = '/lend/filter';

				const result = addToBasketExpMixin.computed.isInExperimentPages.call(context);

				expect(result).toBe(true);
			});

			it('should return true when path includes mykiva', () => {
				context.$route.path = '/mykiva/portfolio';

				const result = addToBasketExpMixin.computed.isInExperimentPages.call(context);

				expect(result).toBe(true);
			});

			it('should return false when path does not include lend or mykiva', () => {
				context.$route.path = '/checkout';

				const result = addToBasketExpMixin.computed.isInExperimentPages.call(context);

				expect(result).toBe(false);
			});

			it('should return false for home page', () => {
				context.$route.path = '/';

				const result = addToBasketExpMixin.computed.isInExperimentPages.call(context);

				expect(result).toBe(false);
			});
		});
	});
});
