console.log(`fake secret: ${process.env.FAKE_SECRET}`);

module.exports = {
	ci: {
		collect: {
			settings: {
				onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo']
			},
			startServerCommand: 'npm start -- --config=local',
			startServerReadyPattern: 'server started at',
			url: [
				'http://localhost:8888/',
				'http://localhost:8888/lend/filter',
				'http://localhost:8888/lend-by-category',
				'http://localhost:8888/lend-by-category/women'
			]
		},
		upload: {
			target: 'lhci',
			serverBaseUrl: 'https://lighthouse-ci-kiva-dev.herokuapp.com/',
			token: process.env.DEV_LHCI_BUILD_TOKEN,
		},
	},
};
