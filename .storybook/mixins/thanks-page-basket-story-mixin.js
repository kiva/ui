import { ref } from 'vue';

/**
 * Provides the `thanksPageBasket` bridge that `ThanksPageSingleVersion` injects
 * from its parent (`ThanksPage`). The host Vue component on the page uses the
 * `borrowerProfileExpMixin` to back this bridge, but Storybook renders Single
 * in isolation, so we hand it a minimal stub.
 */
export default ({
	basketItems = [],
	isAdding = false,
	addToBasket,
	loadInitialBasketItems,
	resetIsAdding,
} = {}) => ({
	provide: {
		thanksPageBasket: {
			basketItems: ref(basketItems),
			isAdding: ref(isAdding),
			addToBasket: addToBasket ?? (() => {}),
			loadInitialBasketItems: loadInitialBasketItems ?? (() => Promise.resolve()),
			resetIsAdding: resetIsAdding ?? (() => {}),
		},
	},
});
