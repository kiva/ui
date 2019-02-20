export default [
	{ path: '/ui-site-map', component: () => import('@/pages/UiSiteMap/UiSiteMapPage') },
	{ path: '/component-demo', component: () => import('@/pages/ComponentDemo/ComponentDemo') },
	{ path: '/kiva-app-components', component: () => import('@/pages/ComponentDemo/ComponentDemoKivaApp') },
	{ path: '/lend-vue', component: () => import('@/pages/Lend/LendPage') },
	{ path: '/lend-by-category', component: () => import('@/pages/Lend/LendByCategoryPage') },
	{ path: '/lend-by-category/:category', component: () => import('@/pages/Lend/LoanChannelCategoryPage') },
	{ path: '/lend/filter', component: () => import('@/pages/Lend/Filter/LendFilterPage') },
	{ path: '/portfolio/lending-stats', component: () => import('@/pages/LendingStats/LendingStatsPage') },
	{ path: '/page-two', component: () => import('@/pages/PageTwo') },
	{ path: '/UI_REVISION', component: () => import('@/pages/UiRevision') },
	{ path: '/login-vue', component: () => import('@/pages/LoginAndRegister/LoginAndRegister') },
	{ path: '/checkout', component: () => import('@/pages/Checkout/CheckoutPage') },
	{ path: '/protocol', component: () => import('@/pages/Protocol') },
	{ path: '/build', component: () => import('@/pages/Build/BuildPage') },
	{ path: '/build/docs', component: () => import('@/pages/Build/DocsPage') },
	{ path: '/build/getting-started', component: () => import('@/pages/Build/GettingStartedPage') },
	{ path: '/build/code-of-conduct', component: () => import('@/pages/Build/CodeOfConductPage') },
	{ path: '/build/data-snapshots', component: () => import('@/pages/Build/DataPage') },
	{ path: '/algolia-vue', component: () => import('@/pages/AlgoliaPOC') },
	{ path: '/build/terms-of-service', component: () => import('@/pages/Build/TermsOfService') },
	{ path: '/build/research', component: () => import('@/pages/Build/Research') },
	{
		path: '/styleguide',
		component: () => import('@/pages/StyleGuide'),
		children: [
			{
				path: '',
				name: 'foundation',
				component: () => import('@/components/Styleguide/StyleguideIntro')
			},
			{
				path: 'typography',
				name: 'typography',
				component: () => import('@/components/Styleguide/StyleguideTypography')
			},
			{
				path: 'copy',
				name: 'copy',
				component: () => import('@/components/Styleguide/StyleguideCopy')
			},
			{
				path: 'buttons',
				name: 'buttons',
				component: () => import('@/components/Styleguide/StyleguideButtons')
			},
			{
				path: 'colors',
				name: 'colors',
				component: () => import('@/components/Styleguide/StyleguideColors')
			},
			{
				path: 'forms',
				name: 'forms',
				component: () => import('@/components/Styleguide/StyleguideForms')
			},
			{
				path: 'images',
				name: 'images',
				component: () => import('@/components/Styleguide/StyleguideImages')
			},
		]
	},
	{ path: '/process-browser-auth', component: () => import('@/pages/ProcessBrowserAuth') },
];
