module.exports = {
	ci: {
		collect: {
			method: 'psi',
			psiApiKey: process.env.PSI_API_KEY,
			settings: {
				onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo'],
				maxWaitForLoad: 90000,
			},
			url: [
				'https://www.kiva.org/',
				'https://www.kiva.org/pgtmp/home',
				'https://www.kiva.org/hptmp/crowdfund-for-good',
				'https://www.kiva.org/lend/filter',
				'https://www.kiva.org/lend-by-category',
				'https://www.kiva.org/lend-by-category/women',
				'https://www.kiva.org/refugees',
				'https://www.kiva.org/lptmp/support-refugees',
				'https://www.kiva.org/lptmp/how-kiva-works',
				'https://www.kiva.org/about/how',
				'https://www.kiva.org/lptmp/qw',
				'https://www.kiva.org/lp/qw',
				'https://www.kiva.org/design',
				'https://www.kiva.org/ui-site-map',
				// 'https://www.kiva.org/live-loan/f/sort_newest/url/1',
				// 'https://www.kiva.org/cc/kiva-universal',
			],
			numberOfRuns: 5,
		},
		upload: {
			target: 'lhci',
			serverBaseUrl: 'https://lighthouse-ci-kiva-prod.herokuapp.com/',
			token: process.env.LHCI_PROD_BUILD_TOKEN,
			ignoreDuplicateBuildFailure: true
		},
	},
};
