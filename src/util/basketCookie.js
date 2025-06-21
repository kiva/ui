import basketCount from '#src/graphql/query/basketCount.graphql';
import { createNewBasket, hasBasketExpired } from '#src/util/basketUtils';

export default async function setBasketCookie(cookieStore, apollo) {
	// Create a new basket if the cookie doesn't exist
	const basketId = cookieStore.get('kvbskt');
	if (!basketId) {
		return createNewBasket({ apollo, cookieStore });
	}

	// Create a new basket if the existing one has expired
	const { errors } = await apollo.query({
		query: basketCount,
		variables: { basketId },
	});
	if (errors?.some(e => hasBasketExpired(e.extensions?.code ?? e.code))) {
		return createNewBasket({ apollo, cookieStore });
	}
}
