module.exports = [
	{
		path: '/',
		name: 'homepage',
		component: () => import('@/pages/Homepage/Homepage'),
		meta: {
			contentfulPage: (route, apollo, experimentVersionFragment) => {
				const exp = apollo?.readFragment({
					id: 'Experiment:new_home_layout',
					fragment: experimentVersionFragment,
				}) || {};

				return exp?.version === 'b' ? 'hp/crowdfund-for-good' : 'home';
			},
			unbounceEmailCapture: true,
			unbouncePopUp: true,
		},
	},
	{
		path: '/homepage-classic',
		redirect: '/',
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{ path: '/15', component: () => import('@/pages/15Years/15Years') },
	{
		path: '/about/how',
		component: () => import('@/pages/ContentfulPage'),
		meta: {
			contentfulPage: () => 'lp/how-kiva-works',
		},
	},
	{
		path: '/lp/how-kiva-works',
		redirect: '/about/how'
	},
	{
		path: '/about/press-center',
		component: () => import('@/pages/ContentfulPage'),
		meta: {
			contentfulPage: () => 'lp/press',
		},
	},
	{
		path: '/auto-deposit',
		component: () => import('@/pages/AutoDeposit/AutoDepositLandingPage'),
	},
	{
		path: '/auto-deposit/thanks',
		component: () => import('@/pages/AutoDeposit/AutoDepositThanksPage'),
		meta: {
			activeLoginRequired: true,
			excludeFromStaticSitemap: true,
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
		path: '/categories',
		component: () => import('@/pages/Categories/CategoriesPage')
	},
	{
		path: '/categories-beta',
		redirect: '/categories'
	},
	{
		path: '/cc/:dynamicRoute',
		component: () => import('@/pages/LandingPages/CorporateCampaign/CCLandingPage'),
		meta: {
			excludeFromStaticSitemap: true,
			unbouncePopUp: true,
		},
		props: route => ({
			dynamicRoute: route.params.dynamicRoute,
			formComplete: route.query.formComplete,
			upc: route.query.upc,
			promoCode: route.query.promoCode,
			lendingReward: route.query.lendingReward
		})
	},
	{
		path: '/checkout',
		component: () => import('@/pages/Checkout/CheckoutPage'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/checkout/post-purchase',
		component: () => import('@/pages/Checkout/PostPurchase'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/checkout/thanks',
		component: () => import('@/pages/Thanks/ThanksPage'),
		meta: {
			excludeFromStaticSitemap: true,
			unbouncePopUp: true,
		}
	},
	{
		path: '/checkout/eco-challenge/thanks',
		component: () => import('@/pages/Thanks/ThanksPageEcoChallenge'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/confirm-instant-donation/:token/:amount',
		component: () => import('@/pages/InstantActions/ConfirmInstantDonation'),
		meta: {
			excludeFromStaticSitemap: true,
		},
		props: route => ({
			token: route.params.token,
			amount: route.params.amount
		})
	},
	{ path: '/covid19response', component: () => import('@/pages/LandingPages/MGCovid19/MGCovid19') },
	{
		path: '/design',
		component: () => import('@/pages/ContentfulPage'),
		meta: {
			contentfulPage: () => 'design',
		},
	},
	{ path: '/donate/support-kiva', component: () => import('@/pages/Donate/DonateFromMacro') },
	{
		path: '/donate/supportus',
		component: () => import('@/pages/Donate/DonateSupportUs'),
		meta: {
			contentfulPage: () => 'donate/supportus',
			unbounceEmailCapture: true,
		},
	},
	{
		path: '/donate/supportkiva',
		component: () => import('@/pages/Donate/DonateSupportUs'),
		meta: {
			contentfulPage: () => 'donate/supportkiva',
			unbounceEmailCapture: true,
		},
	},
	{
		path: '/error',
		component: () => import('@/pages/Error'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/flss',
		component: () => import('@/pages/FlssPrototypes/SampleLoanDisplay'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/funded/:id',
		redirect: '/lend/:id'
	},
	{
		path: '/gender-equality',
		component: () => import('@/pages/ContentfulPage'),
		meta: {
			contentfulPage: () => 'gender-equality',
		},
	},
	{
		path: '/get-started',
		component: () => import('@/pages/GetStarted/GetStarted'),
		children: [
			{
				path: '',
				component: () => import('@/pages/GetStarted/GetStartedCauses'),
				meta: {
					excludeFromStaticSitemap: true,
				}
			},
			{
				path: 'places',
				component: () => import('@/pages/GetStarted/GetStartedPlaces'),
				meta: {
					excludeFromStaticSitemap: true,
				}
			},
			{
				path: 'results',
				component: () => import('@/pages/GetStarted/GetStartedResults'),
				meta: {
					excludeFromStaticSitemap: true,
				}
			},
		]
	},
	{

		path: '/instant-donation-thanks/:result',
		component: () => import('@/pages/InstantActions/InstantDonationThanks'),
		meta: {
			excludeFromStaticSitemap: true,
		},
		props: route => ({
			result: route.params.result,
		})
	},
	{
		path: '/instant-lending-error',
		component: () => import('@/pages/InstantActions/InstantLendingError'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/join-team',
		component: () => import('@/pages/LoginAndRegister/JoinTeam'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
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
	{
		path: '/lend-by-category/loans-to-women',
		redirect: '/lend-by-category/women'
	},
	{
		path: '/lend-by-category/loans-for-education',
		redirect: '/lend-by-category/education'
	},
	{
		path: '/lend-by-category',
		component: () => import('@/pages/Lend/LendByCategoryPage'),
		meta: {
			unbounceEmailCapture: true,
		},
	},
	{
		path: '/lend-by-category/recommended-by-lenders',
		component: () => import('@/pages/Lend/LoanChannelCategoryPageRecommendedByLenders'),
		meta: {
			excludeFromStaticSitemap: true,
			unbounceEmailCapture: true,
			unbouncePopUp: true,
		},
	},
	{
		path: '/lend-by-category/:category',
		component: () => import('@/pages/Lend/LoanChannelCategoryPage'),
		meta: {
			excludeFromStaticSitemap: true,
			unbounceEmailCapture: true,
			unbouncePopUp: true,
		},
	},
	{
		path: '/lend-beta/:id',
		redirect: '/lend/:id'
	},
	{
		path: '/lend/saved-search',
		component: () => import('@/pages/Settings/SavedSearch'),
		meta: {
			authenticationRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/lending-home',
		component: () => import('@/pages/LoanFinding/LoanFinding'),
		meta: {
			excludeFromStaticSitemap: true,
			authenticationRequired: true,
		}
	},
	{
		name: 'borrowerProfile',
		path: '/lend/:id(\\d+)',
		component: () => import('@/pages/BorrowerProfile/BorrowerProfile'),
		meta: {
			excludeFromStaticSitemap: true,
			unbounceEmailCapture: true,
			unbouncePopUp: true,
		}
	},
	{
		name: 'lend-filter',
		path: '/lend/filter',
		component: () => import('@/pages/Lend/LoanSearchPage'),
		meta: {
			unbounceEmailCapture: true,
		},
	},
	{
		name: 'filter-alpha',
		path: '/lend/filter-alpha',
		redirect: '/lend/filter'
	},
	{
		path: '/lend/:category',
		redirect: '/lend-by-category/:category'
	},
	{
		path: '/lp/own-the-change-gender-equality',
		redirect: '/gender-equality'
	},
	{
		path: '/lp/:dynamicRoute',
		component: () => import('@/pages/ContentfulPage'),
		meta: {
			contentfulPage: route => `lp/${route.params.dynamicRoute}`,
			excludeFromStaticSitemap: true,
			unbouncePopUp: true,
		},
	},
	{
		path: '/hp/:dynamicRoute',
		component: () => import('@/pages/ContentfulPage'),
		meta: {
			contentfulPage: route => `hp/${route.params.dynamicRoute}`,
			excludeFromStaticSitemap: true,
			unbouncePopUp: true,
		},
	},
	{
		path: '/monthlygood',
		component: () => import('@/pages/MonthlyGood/MonthlyGoodLandingPage'),
		props: route => ({ category: route.query.category }),
		meta: {
			unbounceEmailCapture: true,
		},
	},
	{
		path: '/monthlygood/setup',
		component: () => import('@/pages/MonthlyGood/MonthlyGoodSetupPage'),
		meta: {
			excludeFromStaticSitemap: true,
		},
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
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/portfolio/lending-stats',
		component: () => import('@/pages/LendingStats/LendingStatsPage'),
		meta: {
			authenticationRequired: true,
			excludeFromStaticSitemap: true,
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
	{
		path: '/process-browser-auth',
		component: () => import('@/pages/ProcessBrowserAuth'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/process-instant-lending/:loanId/:lendAmount',
		component: () => import('@/pages/InstantActions/ProcessInstantLending'),
		meta: {
			excludeFromStaticSitemap: true,
		},
		props: route => ({
			loanId: Number(route.params.loanId),
			lendAmount: Number(route.params.lendAmount)
		}),
	},
	{
		path: '/register/social',
		component: () => import('@/pages/LoginAndRegister/RegisterSocial'),
		meta: {
			excludeFromStaticSitemap: true,
		},
		beforeEnter(to, from, next) {
			// Redirect to error page if state parameter is missing
			const { state } = to.query ?? {};
			if (!state) {
				next('/error');
			} else {
				next();
			}
		},
	},
	{
		path: '/register/guest',
		component: () => import('@/pages/LoginAndRegister/GuestAccountClaim'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/register/guest-redirect',
		component: () => import('@/pages/LoginAndRegister/GuestAccountRedirect'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/settings',
		component: () => import('@/pages/Settings/SettingsPage'),
		meta: {
			excludeFromStaticSitemap: true,
			authenticationRequired: true,
		}
	},
	{
		path: '/settings/autolending',
		component: () => import('@/pages/Autolending/AutolendingPage'),
		meta: {
			excludeFromStaticSitemap: true,
		},
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
		path: '/settings/email',
		component: () => import('@/pages/Settings/EmailSettings'),
		meta: {
			authenticationRequired: true,
			excludeFromStaticSitemap: true,
		},
	},
	{
		path: '/settings/payments',
		component: () => import('@/pages/Settings/PaymentSettings'),
		meta: {
			activeLoginRequired: true,
			excludeFromStaticSitemap: true,
			mfaRequired: true,
			recentLoginRequired: true,
		},
	},
	{
		path: '/settings/security',
		component: () => import('@/pages/Settings/SecuritySettings'),
		meta: {
			excludeFromStaticSitemap: true,
			recentLoginRequired: true,
			mfaRequired: true,
			process: 'managing your security settings',
		},
	},
	{
		path: '/settings/security/mfa',
		component: () => import('@/pages/Settings/TwoStepVerificationPage'),
		meta: {
			excludeFromStaticSitemap: true,
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
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/start-verification',
		component: () => import('@/pages/StartVerification'),
		meta: {
			activeLoginRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/styleguide',
		component: () => import('@/pages/StyleGuide'),
	},
	{
		path: '/styleguide/*',
		redirect: '/styleguide',
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/ui-site-map',
		component: () => import('@/pages/UiSiteMap/UiSiteMapPage'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/UI_REVISION',
		component: () => import('@/pages/UiRevision'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/ub/:unbouncePath',
		component: () => import('@/pages/LandingPages/Unbounce/IFrameEmbed'),
		props: route => ({
			unbouncePath: route.params.unbouncePath,
		}),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	// These are Demo Pages
	{
		path: '/algolia-vue',
		component: () => import('@/pages/AlgoliaPOC'),
		meta: {
			excludeFromStaticSitemap: true,
		},
		children: [
			{ path: '*', component: () => import('@/pages/AlgoliaPOC') },
		]
	},
	{
		path: '/lend-vue',
		component: () => import('@/pages/Lend/LendPage'),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
];
