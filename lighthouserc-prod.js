module.exports = {
	ci: {
		collect: {
			settings: {
				onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo']
			},
			url: [
				'https://www.kiva.org/',
				'https://www.kiva.org/lend/filter',
				'https://www.kiva.org/lend-by-category',
				'https://www.kiva.org/lend-by-category/women'
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
