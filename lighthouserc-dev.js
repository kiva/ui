module.exports = {
	ci: {
		collect: {
			settings: {
				onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo'],
				maxWaitForFcp: 10000,
				maxWaitForLoad: 10000,
			},
			startServerCommand: 'npm start -- --config=local',
			startServerReadyPattern: 'server started at',
			url: [
				'http://localhost:8888/',
				'http://localhost:8888/lend/filter',
				'http://localhost:8888/lend-by-category/women',
				'http://localhost:8888/lend-by-category/arts',
				'http://localhost:8888/ui-site-map',
				'http://localhost:8888/cc/kiva-universal',
				'http://localhost:8888/lp/support-refugees',
				'http://localhost:8888/lend-by-category'
			],
			numberOfRuns: 5,
		},
		upload: {
			// target: 'temporary-public-storage',
			target: 'lhci',
			serverBaseUrl: 'https://lighthouse-ci-kiva-dev.herokuapp.com/',
			token: process.env.LHCI_DEV_BUILD_TOKEN,
		},
	},
};
