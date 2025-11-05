import addToBasketShowInterstitialMixin from '#src/plugins/add-to-basket-show-interstitial';

vi.mock('#src/util/injectionCheck', () => ({
	default: vi.fn()
}));

vi.mock('#src/graphql/query/basketAddInterstitialClient.graphql', () => ({
	default: 'basketAddInterstitialQuery'
}));

vi.mock('#src/graphql/mutation/updateAddToBasketInterstitial.graphql', () => ({
	default: 'updateAddToBasketInterstitialMutation'
}));

describe('add-to-basket-show-interstitial.js', () => {
	let context;
	let mockApollo;
	let mockSubscription;
	let subscribeCallback;

	beforeEach(() => {
		mockSubscription = {
			next: null
		};

		mockApollo = {
			mutate: vi.fn(),
			watchQuery: vi.fn(() => ({
				subscribe: vi.fn(callbacks => {
					subscribeCallback = callbacks.next;
					return mockSubscription;
				})
			}))
		};

		context = {
			apollo: mockApollo,
			basketInterstitialState: {}
		};
	});

	describe('data', () => {
		it('should initialize basketInterstitialState to empty object', () => {
			const data = addToBasketShowInterstitialMixin.data();
			expect(data.basketInterstitialState).toEqual({});
		});
	});

	describe('computed', () => {
		describe('basketInterstitialActive', () => {
			it('should return false when basketInterstitialState is empty', () => {
				context.basketInterstitialState = {};

				const result = addToBasketShowInterstitialMixin.computed.basketInterstitialActive.call(context);

				expect(result).toBe(false);
			});

			it('should return true when active is true', () => {
				context.basketInterstitialState = { active: true };

				const result = addToBasketShowInterstitialMixin.computed.basketInterstitialActive.call(context);

				expect(result).toBe(true);
			});

			it('should return false when active is false', () => {
				context.basketInterstitialState = { active: false };

				const result = addToBasketShowInterstitialMixin.computed.basketInterstitialActive.call(context);

				expect(result).toBe(false);
			});
		});
	});

	describe('methods', () => {
		describe('triggerAddToBasketInterstitial', () => {
			it('should not trigger mutation when interstitial is not active', () => {
				context.basketInterstitialState = { active: false };
				Object.defineProperty(context, 'basketInterstitialActive', {
					get: addToBasketShowInterstitialMixin.computed.basketInterstitialActive
				});

				addToBasketShowInterstitialMixin.methods.triggerAddToBasketInterstitial.call(context, 12345);

				expect(mockApollo.mutate).not.toHaveBeenCalled();
			});

			it('should trigger mutation when interstitial is active', () => {
				context.basketInterstitialState = { active: true };
				Object.defineProperty(context, 'basketInterstitialActive', {
					get: addToBasketShowInterstitialMixin.computed.basketInterstitialActive
				});

				addToBasketShowInterstitialMixin.methods.triggerAddToBasketInterstitial.call(context, 12345);

				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: 'updateAddToBasketInterstitialMutation',
					variables: {
						active: true,
						visible: true,
						loanId: 12345
					}
				});
			});

			it('should use 0 as default loanId when not provided', () => {
				context.basketInterstitialState = { active: true };
				Object.defineProperty(context, 'basketInterstitialActive', {
					get: addToBasketShowInterstitialMixin.computed.basketInterstitialActive
				});

				addToBasketShowInterstitialMixin.methods.triggerAddToBasketInterstitial.call(context);

				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: 'updateAddToBasketInterstitialMutation',
					variables: {
						active: true,
						visible: true,
						loanId: 0
					}
				});
			});

			it('should handle loanId of 0', () => {
				context.basketInterstitialState = { active: true };
				Object.defineProperty(context, 'basketInterstitialActive', {
					get: addToBasketShowInterstitialMixin.computed.basketInterstitialActive
				});

				addToBasketShowInterstitialMixin.methods.triggerAddToBasketInterstitial.call(context, 0);

				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: 'updateAddToBasketInterstitialMutation',
					variables: {
						active: true,
						visible: true,
						loanId: 0
					}
				});
			});
		});
	});

	describe('mounted', () => {
		it('should setup watchQuery subscription', () => {
			addToBasketShowInterstitialMixin.mounted.call(context);

			expect(mockApollo.watchQuery).toHaveBeenCalledWith({
				query: 'basketAddInterstitialQuery'
			});
		});

		it('should update basketInterstitialState when subscription receives data', () => {
			addToBasketShowInterstitialMixin.mounted.call(context);

			const data = {
				basketAddInterstitial: {
					active: true,
					visible: false,
					loanId: 54321
				}
			};

			subscribeCallback({ data });

			expect(context.basketInterstitialState).toEqual({
				active: true,
				visible: false,
				loanId: 54321
			});
		});

		it('should preserve existing state properties when updating', () => {
			context.basketInterstitialState = { customProp: 'test' };

			addToBasketShowInterstitialMixin.mounted.call(context);

			const data = {
				basketAddInterstitial: {
					active: true,
					visible: true,
					loanId: 99999
				}
			};

			subscribeCallback({ data });

			expect(context.basketInterstitialState).toEqual({
				customProp: 'test',
				active: true,
				visible: true,
				loanId: 99999
			});
		});
	});
});
