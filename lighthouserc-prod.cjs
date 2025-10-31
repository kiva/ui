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
				'https://www.kiva.org/lend?x',
				'https://www.kiva.org/lend/filter',
				'https://www.kiva.org/lend-by-category',
				'https://www.kiva.org/lend-by-category/women',
				'https://www.kiva.org/lend-category-beta',
				'https://www.kiva.org/lend-category-beta/agriculture',
				'https://www.kiva.org/impact/refugees',
				'https://www.kiva.org/about',
				'https://www.kiva.org/about/how',
				'https://www.kiva.org/design',
				'https://www.kiva.org/ui-site-map',
				'https://www.kiva.org/cc/kiva-partner',
				'https://www.kiva.org/borrow',
			],
			numberOfRuns: 5,
		},
		assert: {
			assertions: {
				'categories:accessibility': 'warn',
				'categories:best-practices': 'warn',
				'categories:performance': 'warn',
				'categories:seo': 'warn',
			}
		},
	},
};
