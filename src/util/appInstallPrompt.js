import appInstallQuery from '#src/graphql/query/appInstall.graphql';

export async function shouldShowAppInstallPrompt(url, cookieStore, apollo) {
	const {
		pathname,
		searchParams,
	} = url;

	// Show Android and iOS app install banners if user is on an approved page but not coming from a promo
	const allowedRoutes = [
		'start',
		'portfolio',
		'lend',
		'lend-by-category',
		'about'
	];
	const deniedParams = [
		'upc',
		'promo_code',
		'lending_reward',
	];

	// Check if any of the denied params are present in the URL
	if (deniedParams.some(param => searchParams.has(param))) {
		return false;
	}

	// Check if the pathname starts with any of the allowed routes or is the root path
	if (!allowedRoutes.some(route => pathname.startsWith(`/${route}`)) && pathname !== '/') {
		return false;
	}

	// Check if the user has promotional credits in their basket
	const basketId = cookieStore.get('kvbskt');
	if (!basketId) {
		// No basket ID found, so they can't have promotional credits
		return true;
	}
	const { data } = await apollo.query({
		query: appInstallQuery,
		variables: {
			basketId,
		},
	});
	if (data?.shop?.basket?.hasFreeCredits || data?.shop?.lendingRewardOffered) {
		// User has promotional credits in their basket
		return false;
	}

	// User is not part of a promo and is on an allowed route, so show the app install prompt
	return true;
}

export function renderAppInstallPrompt(showPrompt = false) {
	if (showPrompt) {
		// Apple specific meta tag to show native app install banner
		// eslint-disable-next-line max-len
		// https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html
		return '<meta name="apple-itunes-app" content="app-id=1453093374">';
	}
	// Chrome Android uses manifest.webmanifest and their hueristics to display android install banner on all pages
	// Denied pages need to prevent that behavior
	// https://developers.google.com/web/fundamentals/app-install-banners/native#prefer_related
	return '<script>window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); });</script>';
}
