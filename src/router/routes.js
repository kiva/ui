export default [
	{
		path: '/',
		name: 'homepage',
		component: () => import('@/pages/Homepage/Homepage'),
		meta: {
			contentfulPage: () => 'home',
		},
	},
	{ path: '/15', component: () => import('@/pages/15Years/15Years') },
	{
		path: '/auto-deposit',
		component: () => import('@/pages/AutoDeposit/AutoDepositLandingPage'),
	},
	{
		path: '/auto-deposit/thanks',
		component: () => import('@/pages/AutoDeposit/AutoDepositThanksPage'),
		meta: {
			activeLoginRequired: true,
		}
	},
	{
		path: '/borrow/pre-application',
		component: () => import('@/pages/Borrow/BorrowIndex'),
		children: [
			{
				path: 'community',
				component: () => import('@/pages/Borrow/BorrowCommunity')
			},
			{
				path: 'how-long',
				component: () => import('@/pages/Borrow/BorrowHowLong')
			},
		]
	},
	{ path: '/build', component: () => import('@/pages/Build/BuildPage') },
	{ path: '/build/code-of-conduct', component: () => import('@/pages/Build/CodeOfConductPage') },
	{ path: '/build/data-snapshots', component: () => import('@/pages/Build/DataPage') },
	{ path: '/build/docs', component: () => import('@/pages/Build/DocsPage') },
	{ path: '/build/getting-started', component: () => import('@/pages/Build/GettingStartedPage') },
	{ path: '/build/research', component: () => import('@/pages/Build/Research') },
	{ path: '/build/terms-of-service', component: () => import('@/pages/Build/TermsOfService') },
	{
		path: '/cc/:dynamicRoute',
		component: () => import('@/pages/LandingPages/CorporateCampaign/CCLandingPage'),
		props: route => ({
			dynamicRoute: route.params.dynamicRoute,
			formComplete: route.query.formComplete,
			upc: route.query.upc,
			promoCode: route.query.promoCode,
			lendingReward: route.query.lendingReward
		})
	},
	{ path: '/checkout', component: () => import('@/pages/Checkout/CheckoutPage') },
	{ path: '/checkout/post-purchase', component: () => import('@/pages/Checkout/PostPurchase') },
	{
		path: '/checkout/thanks',
		component: () => import('@/pages/Thanks/ThanksPage'),
	},
	{ path: '/covid19response', component: () => import('@/pages/LandingPages/MGCovid19/MGCovid19') },
	{ path: '/donate/support-kiva', component: () => import('@/pages/Donate/DonateFromMacro') },
	{ path: '/donate/supportus-ui', component: () => import('@/pages/Donate/DonateSupportUs') },
	{ path: '/error', component: () => import('@/pages/Error') },
	{ path: '/flss', component: () => import('@/pages/FlssPrototypes/SampleLoanDisplay') },
	{ path: '/funded/:id', component: () => import('@/pages/BorrowerProfile/fundedBorrowerProfile') },
	{
		path: '/get-started',
		component: () => import('@/pages/GetStarted/GetStarted'),
		children: [
			{
				path: '',
				component: () => import('@/pages/GetStarted/GetStartedCauses'),
			},
			{
				path: 'places',
				component: () => import('@/pages/GetStarted/GetStartedPlaces')
			},
			{
				path: 'results',
				component: () => import('@/pages/GetStarted/GetStartedResults')
			},
		]
	},
	{ path: '/join-team', component: () => import('@/pages/LoginAndRegister/JoinTeam') },
	{
		path: '/legal',
		component: () => import('@/pages/Legal/Legal'),
		children: [
			{
				path: 'promo-terms',
				component: () => import('@/pages/Legal/PromoTermsOfUse')
			},
			{
				path: 'terms',
				component: () => import('@/pages/Legal/TermsOfUse')
			},
		]
	},
	{ path: '/lend-by-category', component: () => import('@/pages/Lend/LendByCategoryPage') },
	{ path: '/lend-by-category/:category', component: () => import('@/pages/Lend/LoanChannelCategoryPage') },
	{ path: '/lend/filter', component: () => import('@/pages/Lend/Filter/LendFilterPage') },
	{
		path: '/lp/:dynamicRoute',
		component: () => import('@/pages/ContentfulPage'),
		meta: {
			contentfulPage: route => `lp/${route.params.dynamicRoute}`,
		},
	},
	{
		path: '/monthlygood',
		component: () => import('@/pages/MonthlyGood/MonthlyGoodLandingPage'),
		props: route => ({ category: route.query.category })
	},
	{
		path: '/monthlygood/setup',
		component: () => import('@/pages/MonthlyGood/MonthlyGoodSetupPage'),
		props: route => ({
			amount: Number(route.query.amount),
			category: route.query.category,
			onetime: route.query.onetime,
			source: route.query.source,
			nextmonth: route.query.nextmonth === 'true',
			initDonation: Number(route.query.initDonation),
			day: Number(route.query.day)
		}),
	},
	{
		path: '/monthlygood/thanks',
		component: () => import('@/pages/MonthlyGood/MonthlyGoodThanksPage'),
		props: route => ({
			onetime: String(route.query.onetime),
			source: route.query.source,
			paymentType: route.query.paymentType,
		}),
		meta: {
			activeLoginRequired: true,
		}
	},
	{
		path: '/portfolio/lending-stats',
		component: () => import('@/pages/LendingStats/LendingStatsPage'),
		meta: {
			authenticationRequired: true,
		}
	},
	{
		path: '/possibility',
		component: () => import('@/pages/Possibility/Possibility'),
		children: [
			{
				path: 'giving-tuesday',
				component: () => import('@/pages/Possibility/GivingTuesday')
			},
			{
				path: '12-days-of-lending',
				component: () => import('@/pages/Possibility/12DaysOfLending')
			},
			{
				path: 'year-end',
				component: () => import('@/pages/Possibility/YearEnd')
			},
		]
	},
	{ path: '/process-browser-auth', component: () => import('@/pages/ProcessBrowserAuth') },
	{ path: '/protocol', component: () => import('@/pages/Protocol') },
	{ path: '/register/social', component: () => import('@/pages/LoginAndRegister/RegisterSocial') },
	{ path: '/register/guest', component: () => import('@/pages/LoginAndRegister/GuestAccountClaim') },
	{
		path: '/register/guest-redirect',
		component: () => import('@/pages/LoginAndRegister/GuestAccountRedirect'),
	},
	{
		path: '/settings',
		component: () => import('@/pages/Settings/SettingsPage'),
		meta: {
			authenticationRequired: true,
		}
	},
	{
		path: '/settings/autolending',
		component: () => import('@/pages/Autolending/AutolendingPage'),
		children: [
			{
				path: '',
				component: () => import('@/pages/Autolending/AutolendingSettingsPage'),
				meta: {
					activeLoginRequired: true,
				}
			},
			{
				path: ':action',
				component: () => import('@/pages/Autolending/AutolendingMessagingPage'),
				props: route => ({
					success: route.query.success === 'true',
					action: route.params.action,
					days: Number(route.query.days)
				})
			},
		],

	},
	{
		path: '/settings/email-ui', // Temporary route - change to /email when migration is complete
		component: () => import('@/pages/Settings/EmailSettings'),
		meta: {
			authenticationRequired: true,
		},
	},
	{
		path: '/settings/payments',
		component: () => import('@/pages/Settings/PaymentSettings'),
		meta: {
			activeLoginRequired: true,
		},
	},
	{
		path: '/settings/security',
		component: () => import('@/pages/Settings/SecuritySettings'),
		meta: {
			recentLoginRequired: true,
			mfaRequired: true,
			process: 'managing your security settings',
		},
	},
	{
		path: '/settings/security/mfa',
		component: () => import('@/pages/Settings/TwoStepVerificationPage'),
		meta: {
			recentLoginRequired: true,
			mfaRequired: true,
			process: 'managing your 2-step verification settings',
		},
		children: [
			{
				path: 'app',
				props: route => ({
					first: route.query.first === 'true'
				}),
				component: () => import('@/components/Settings/AppAuthentication'),
			},
			{
				path: 'phone',
				props: route => ({
					first: route.query.first === 'true'
				}),
				component: () => import('@/components/Settings/PhoneAuthentication'),
			},
		],
	},
	{
		path: '/settings/subscriptions',
		component: () => import('@/pages/Settings/SubscriptionsSettings'),
		meta: {
			activeLoginRequired: true,
		}
	},
	{ path: '/start', component: () => import('@/pages/Search/SentenceSearch') },
	{
		path: '/start-verification',
		component: () => import('@/pages/StartVerification'),
		meta: {
			activeLoginRequired: true,
		}
	},
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
	// These are Demo Pages
	{
		path: '/algolia-vue',
		component: () => import('@/pages/AlgoliaPOC'),
		children: [
			{ path: '*', component: () => import('@/pages/AlgoliaPOC') },
		]
	},
	{ path: '/lend-vue', component: () => import('@/pages/Lend/LendPage') },
];
