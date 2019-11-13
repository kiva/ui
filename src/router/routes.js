export default [
	{ path: '/', component: () => import('@/pages/Homepage/Homepage') },
	{
		path: '/algolia-vue',
		component: () => import('@/pages/AlgoliaPOC'),
		children: [
			{ path: '*', component: () => import('@/pages/AlgoliaPOC') },
		]
	},
	{ path: '/build', component: () => import('@/pages/Build/BuildPage') },
	{ path: '/build/code-of-conduct', component: () => import('@/pages/Build/CodeOfConductPage') },
	{ path: '/build/data-snapshots', component: () => import('@/pages/Build/DataPage') },
	{ path: '/build/docs', component: () => import('@/pages/Build/DocsPage') },
	{ path: '/build/getting-started', component: () => import('@/pages/Build/GettingStartedPage') },
	{ path: '/build/research', component: () => import('@/pages/Build/Research') },
	{ path: '/build/terms-of-service', component: () => import('@/pages/Build/TermsOfService') },
	{ path: '/checkout', component: () => import('@/pages/Checkout/CheckoutPage') },
	{ path: '/component-demo', component: () => import('@/pages/ComponentDemo/ComponentDemo') },
	{ path: '/error', component: () => import('@/pages/Error') },
	{ path: '/funded/:id', component: () => import('@/pages/BorrowerProfile/fundedBorrowerProfile') },
	{ path: '/join-team', component: () => import('@/pages/LoginAndRegister/JoinTeam') },
	{ path: '/kiva-app-components', component: () => import('@/pages/ComponentDemo/ComponentDemoKivaApp') },
	{ path: '/legal/promo-terms-of-use-february-2020', component: () => import('@/pages/Legal/PromoTermsOfUse') },
	{ path: '/legal/terms-of-use-february-2020', component: () => import('@/pages/Legal/TermsOfUse') },
	{ path: '/lend-by-category', component: () => import('@/pages/Lend/LendByCategoryPage') },
	{ path: '/lend-by-category/:category', component: () => import('@/pages/Lend/LoanChannelCategoryPage') },
	{ path: '/lend-vue', component: () => import('@/pages/Lend/LendPage') },
	{ path: '/lend/filter', component: () => import('@/pages/Lend/Filter/LendFilterPage') },
	{ path: '/page-two', component: () => import('@/pages/PageTwo') },
	{ path: '/portfolio/lending-stats', component: () => import('@/pages/LendingStats/LendingStatsPage') },
	{
		path: '/possibility',
		component: () => import('@/pages/Possibility/Possibility'),
		children: [
			{
				path: 'giving-tuesday',
				component: () => import('@/pages/Possibility/GivingTuesday')
			},
			// {
			// 	path: '12-days-of-lending',
			// 	component: () => import('@/pages/Possibility/12DaysOfLending')
			// },
			// {
			// 	path: 'year-end',
			// 	component: () => import('@/pages/Possibility/YearEnd')
			// },
		]
	},
	{ path: '/process-browser-auth', component: () => import('@/pages/ProcessBrowserAuth') },
	{ path: '/protocol', component: () => import('@/pages/Protocol') },
	{ path: '/register/social', component: () => import('@/pages/LoginAndRegister/RegisterSocial') },
	{ path: '/settings/autolending', component: () => import('@/pages/Autolending/AutolendingPage')	},
	{
		path: '/settings/autolending/opt-out',
		component: () => import('@/pages/Autolending/AutolendingOptOutPage'),
		props: route => ({ success: (route.query.success === 'true') })
	},
	{ path: '/start', component: () => import('@/pages/Search/SentenceSearch') },
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
			{
				path: 'icons',
				name: 'icons',
				component: () => import('@/components/Styleguide/StyleguideIcons')
			},
		]
	},
	{ path: '/ui-site-map', component: () => import('@/pages/UiSiteMap/UiSiteMapPage') },
	{ path: '/UI_REVISION', component: () => import('@/pages/UiRevision') },
];
