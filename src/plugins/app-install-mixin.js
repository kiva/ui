export default {
	metaInfo() {
		return {
			meta: this.showBanner ? [
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
		showBanner() {
			// Show Android and iOS app install banners if user is on a whitelisted page but not coming from a promo
			const route = this.$route;
			const whitelistedRoutes = [
				'start',
				'portfolio',
				'lend',
				'lend-by-category',
				'about'
			];
			const blacklistedParams = [
				'upc',
				'promo_code',
				'lending_reward',
			];

			let show = false;
			if (whitelistedRoutes.includes(route.path.split('/')[1]) || route.path === '/') {
				show = true;

				Object.keys(route.query).forEach(key => {
					if (blacklistedParams.includes(key)) {
						show = false;
					}
				});
			}

			return show;
		}
	},
	mounted() {
		// Chrome Android uses manifest.webmanifest and their hueristics to display android install banner on all pages
		// Blacklisted pages need to prevent that behavior
		// https://developers.google.com/web/fundamentals/app-install-banners/native#prefer_related
		if (!this.showBanner) {
			window.addEventListener('beforeinstallprompt', e => {
				e.preventDefault();
			});
		}
	}
};
