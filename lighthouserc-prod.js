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
				'https://www.kiva.org/lend/filter',
				'https://www.kiva.org/lend-by-category',
				'https://www.kiva.org/lend-by-category/women',
				// 'https://www.kiva.org/live-loan/f/sort_newest/url/1',
				'https://www.kiva.org/ui-site-map',
				'https://www.kiva.org/cc/kiva-universal',
				'https://www.kiva.org/lp/support-refugees',
				'https://www.kiva.org/design'
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
