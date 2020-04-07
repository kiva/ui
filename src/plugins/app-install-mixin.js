export default {
	metaInfo() {
		return {
			meta: this.isAppInstallPage ? [
				// Apple specific meta tag to show native app install banner
				// eslint-disable-next-line
				// https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html
				{
					name: 'apple-itunes-app',
					content: 'app-id=1453093374',
				}
			] : []
		};
	},
	computed: {
		isAppInstallPage() {
			const route = this.$route;
			const baseUrlsToInclude = [
				'start',
				'portfolio',
				'login',
				'register',
				'lend',
				'lend-by-category',
				'about'
			];
			const queryParamsToExclude = [
				'upc',
				'promo_code',
				'lending_reward',
			];

			let isPromoUrl = false;
			Object.keys(route.query).forEach(key => {
				if (queryParamsToExclude.includes(key)) {
					isPromoUrl = true;
				}
			});
			const isWhitelistedRoute = baseUrlsToInclude.includes(route.path.split('/')[1]) || route.path === '/';

			return isWhitelistedRoute && !isPromoUrl;
		}
	},
	mounted() {
		// Chrome on Android uses related_applications property of our manifest.webmanifest and their own hueristics
		// to determine when to show an install banner.
		// https://developers.google.com/web/fundamentals/app-install-banners/native#prefer_related
		window.addEventListener('beforeinstallprompt', e => {
			if (!this.isAppInstallPage) {
				e.preventDefault();
			}
		});
	}
};
