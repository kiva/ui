import { gql } from 'graphql-tag';
import createApolloClient from '#src/api/apollo';
import hasEverLoggedInQuery from '#src/graphql/query/shared/hasEverLoggedIn.graphql';
import renderCssVariables from '#src/rendering/cssVariables';
import renderDocumentCookies from '#src/rendering/documentCookies';
import { renderOptInExternals } from '#src/rendering/externals';
import renderGlobals from '#src/rendering/globals';
import { renderAppInstallPrompt, shouldShowAppInstallPrompt } from '#src/util/appInstallPrompt';
import { assignAllActiveExperiments } from '#src/util/experiment/experimentUtils';
import { setUserDataCookies } from '#src/util/optimizelyUserMetrics';
import setVisitorIdCookie from '#src/util/visitorCookie';
import { basketCountFragment, basketCountData } from './globalData/basketCount';
import {
	basketPromoAvailableFragment,
	userPromoBalanceFragment,
	globalPromoFragment,
	promoBannerData,
} from './globalData/promoBanners';
import { userAvatarFragment, userAvatarData } from './globalData/userAvatar';

async function fetchUserDataGlobals(apollo, cookieStore) {
	const basketId = cookieStore.get('kvbskt');
	const { data } = await apollo.query({
		query: gql`query esiHead($basketId: String, $hasBasket: Boolean!) {
			contentful {
				...GlobalPromoFragment
			}
			my {
				id
				...UserAvatar
				...UserPromoBalance
			}
			shop(basketId: $basketId) @include(if: $hasBasket) {
				id
				...BasketCount
				...BasketPromoAvailable
			}
		}
		${basketCountFragment}
		${basketPromoAvailableFragment}
		${globalPromoFragment}
		${userAvatarFragment}
		${userPromoBalanceFragment}
		`,
		variables: {
			basketId,
			hasBasket: !!basketId,
		}
	});

	return data;
}

export default async function renderESIHead({
	cookieStore,
	context,
	fetch,
	kvAuth0,
}) {
	const {
		config,
		kivaUserAgent,
		forceHeader,
	} = context;
	const { topUrl } = context.esi;
	const topUrlObj = new URL(topUrl, `${config.transport}://${config.host}`);
	// Parse top URL and extract setuiab query params for experiment forcing
	const setuiabParams = topUrlObj.searchParams.getAll('setuiab');
	const routeQuery = {};
	if (setuiabParams.length === 1) {
		[routeQuery.setuiab] = setuiabParams;
	} else if (setuiabParams.length > 1) {
		routeQuery.setuiab = setuiabParams;
	}
	const route = { query: routeQuery };

	// Initialize Apollo Client
	const apollo = createApolloClient({
		appConfig: config,
		cookieStore,
		kvAuth0,
		fetch,
		userAgent: kivaUserAgent,
		uri: config.graphqlUri,
		types: config.graphqlPossibleTypes,
		route,
		forceHeader,
	});

	// Set the visitor id cookie before other cookies or requests
	setVisitorIdCookie(cookieStore);

	// Start remaining async methods in parallel
	const [showPrompt, userDataGlobals] = await Promise.all([
		shouldShowAppInstallPrompt(topUrlObj, cookieStore, apollo),
		fetchUserDataGlobals(apollo, cookieStore),
		apollo.query({ query: hasEverLoggedInQuery }),
		setUserDataCookies(cookieStore, apollo),
		assignAllActiveExperiments(apollo),
	]);

	// Render the response
	let html = '';
	html += renderDocumentCookies(cookieStore);
	html += renderOptInExternals(config, cookieStore);
	html += renderAppInstallPrompt(showPrompt);
	html += renderGlobals({
		__APOLLO_STATE_ESI__: apollo.cache.extract(),
	});
	html += renderCssVariables({
		...userAvatarData(userDataGlobals),
		...basketCountData(userDataGlobals, cookieStore),
		...promoBannerData(userDataGlobals, topUrlObj),
	}, 'ui-data');

	return {
		html
	};
}
