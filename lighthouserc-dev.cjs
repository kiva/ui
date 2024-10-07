module.exports = {
	ci: {
		collect: {
			settings: {
				onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo'],
			},
			startServerCommand: 'npm start -- --config=local',
			startServerReadyPattern: 'server started at',
			url: [
				// 'http://localhost:8888/',
				// 'http://localhost:8888/lend-by-category',
				'http://localhost:8888/lend/filter',
				'http://localhost:8888/lend-by-category/women',
				'http://localhost:8888/ui-site-map',
				// 'http://localhost:8888/cc/kiva-universal',
				'http://localhost:8888/about/how'
			],
			numberOfRuns: 5,
		},
		upload: {
			// target: 'temporary-public-storage',
			target: 'lhci',
			serverBaseUrl: 'https://lighthouse-ci-kiva-dev.herokuapp.com/',
			token: process.env.LHCI_DEV_BUILD_TOKEN,
			ignoreDuplicateBuildFailure: true
		},
	},
};
