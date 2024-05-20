import { defineAsyncComponent } from 'vue';

export default [
	{
		path: '/homepage-classic',
		redirect: '/',
	},
	{ path: '/15', component: defineAsyncComponent(() => import('#src/pages/15Years/15Years')) },
	{
		path: '/auto-deposit',
		component: defineAsyncComponent(() => import('#src/pages/AutoDeposit/AutoDepositLandingPage')),
	},
	{
		path: '/auto-deposit/thanks',
		component: defineAsyncComponent(() => import('#src/pages/AutoDeposit/AutoDepositThanksPage')),
		meta: {
			activeLoginRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/borrow/pre-application',
		component: defineAsyncComponent(() => import('#src/pages/Borrow/BorrowIndex')),
		children: [
			{
				path: 'community',
				component: defineAsyncComponent(() => import('#src/pages/Borrow/BorrowCommunity')),
			},
			{
				path: 'how-long',
				component: defineAsyncComponent(() => import('#src/pages/Borrow/BorrowHowLong')),
			},
		]
	},
	{
		path: '/build',
		component: defineAsyncComponent(() => import('#src/pages/Build/BuildPage')),
		children: [
			{
				path: 'code-of-conduct',
				component: defineAsyncComponent(() => import('#src/pages/Build/CodeOfConductPage')),
			},
			{
				path: 'data-snapshots',
				component: defineAsyncComponent(() => import('#src/pages/Build/DataPage'))
			},
			{
				path: 'docs',
				component: defineAsyncComponent(() => import('#src/pages/Build/DocsPage'))
			},
			{
				path: 'getting-started',
				component: defineAsyncComponent(() => import('#src/pages/Build/GettingStartedPage')),
			},
			{
				path: 'research',
				component: defineAsyncComponent(() => import('#src/pages/Build/Research'))
			},
			{
				path: 'terms-of-service',
				component: defineAsyncComponent(() => import('#src/pages/Build/TermsOfService')),
			},
		],
	},
	{
		path: '/categories',
		component: defineAsyncComponent(() => import('#src/pages/Categories/CategoriesPage'))
	},
	{
		path: '/categories-beta',
		redirect: '/categories'
	},
	{
		path: '/cc/:dynamicRoute',
		component: defineAsyncComponent(() => import('#src/pages/LandingPages/CorporateCampaign/CCLandingPage')),
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
		component: defineAsyncComponent(() => import('#src/pages/Checkout/CheckoutPage')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/checkout/post-purchase',
		component: defineAsyncComponent(() => import('#src/pages/Checkout/PostPurchase')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/checkout/thanks/:challengeId',
		component: defineAsyncComponent(() => import('#src/pages/Thanks/ThanksPageChallenge')),
		meta: {
			excludeFromStaticSitemap: true,
		},
		props: route => ({
			challengeId: route.params.challengeId,
		})
	},
	{
		path: '/checkout/thanks',
		component: defineAsyncComponent(() => import('#src/pages/Thanks/ThanksPage')),
		meta: {
			excludeFromStaticSitemap: true,
			unbouncePopUp: true,
		}
	},
	{
		path: '/confirm-instant-donation/:token/:amount',
		component: defineAsyncComponent(() => import('#src/pages/InstantActions/ConfirmInstantDonation')),
		meta: {
			excludeFromStaticSitemap: true,
		},
		props: route => ({
			token: route.params.token,
			amount: route.params.amount
		})
	},
	{
		path: '/covid19response',
		redirect: '/monthlygood'
	},
	{
		path: '/error',
		component: defineAsyncComponent(() => import('#src/pages/Error')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/funded/:id',
		redirect: '/lend/:id'
	},
	{
		path: '/get-started',
		component: defineAsyncComponent(() => import('#src/pages/GetStarted/GetStarted')),
		children: [
			{
				path: '',
				component: defineAsyncComponent(() => import('#src/pages/GetStarted/GetStartedCauses')),
				meta: {
					excludeFromStaticSitemap: true,
				}
			},
			{
				path: 'places',
				component: defineAsyncComponent(() => import('#src/pages/GetStarted/GetStartedPlaces')),
				meta: {
					excludeFromStaticSitemap: true,
				}
			},
			{
				path: 'results',
				component: defineAsyncComponent(() => import('#src/pages/GetStarted/GetStartedResults')),
				meta: {
					excludeFromStaticSitemap: true,
				}
			},
		]
	},
	{

		path: '/instant-donation-thanks/:result',
		component: defineAsyncComponent(() => import('#src/pages/InstantActions/InstantDonationThanks')),
		meta: {
			excludeFromStaticSitemap: true,
		},
		props: route => ({
			result: route.params.result,
		})
	},
	{
		path: '/instant-lending-error',
		component: defineAsyncComponent(() => import('#src/pages/InstantActions/InstantLendingError')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/join-team',
		component: defineAsyncComponent(() => import('#src/pages/LoginAndRegister/JoinTeam')),
		meta: {
			excludeFromStaticSitemap: true,
		},
	},
	{
		path: '/legal',
		component: defineAsyncComponent(() => import('#src/pages/Legal/Legal')),
		children: [
			{
				path: 'promo-terms',
				component: defineAsyncComponent(() => import('#src/pages/Legal/PromoTermsOfUse'))
			},
			{
				path: 'terms',
				component: defineAsyncComponent(() => import('#src/pages/Legal/TermsOfUse'))
			},
		]
	},
	{
		path: '/teams',
		component: defineAsyncComponent(() => import('#src/pages/LendingTeams/LendingTeams'))
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
		path: '/lend-by-category/1-billion-in-change',
		redirect: '/lend-by-category'
	},
	{
		path: '/lend-by-category/arts-loans',
		redirect: '/lend-by-category/arts',
	},
	{
		path: '/lend-by-category/choose-a-woman-borrower',
		redirect: '/lend-by-category/women',
	},
	{
		path: '/lend-by-category/eco-friendly-loans',
		redirect: '/lend-by-category/eco-friendly',
	},
	{
		path: '/lend-by-category/ecofriendly-loans',
		redirect: '/lend-by-category/eco-friendly',
	},
	{
		path: '/lend-by-category/flash-match',
		redirect: '/lend-by-category',
	},
	{
		path: '/lend-by-category/food-loans',
		redirect: '/lend-by-category/food',
	},
	{
		path: '/lend-by-category/group-loans',
		redirect: '/lend-by-category/groups',
	},
	{
		path: '/lend-by-category/hitachi-employees-helping-c-o-v-i-d-impacted-businesses',
		redirect: '/cc/hitachi',
	},
	{
		path: '/lend-by-category/hitachi-employees-helping-to-ignite-a-dream',
		redirect: '/cc/hitachi',
	},
	{
		path: '/lend-by-category/hitachis-c-o-v-i-d-19-response',
		redirect: '/cc/hitachi',
	},
	{
		path: '/lend-by-category/human-flow-fund-support-refugees-and-i-d-ps',
		redirect: '/lend-by-category/refugees-and-i-d-ps',
	},
	{
		path: '/lend-by-category/i-t-cosmetics-confidence',
		redirect: '/itcosmetics',
	},
	{
		path: '/lend-by-category/international-womens-day',
		redirect: '/lend-by-category/women',
	},
	{
		path: '/lend-by-category/loans-for-healthcare',
		redirect: '/lend-by-category/health',
	},
	{
		path: '/lend-by-category/loans-for-livestock',
		redirect: '/lend-by-category/livestock',
	},
	{
		path: '/lend-by-category/loans-for-retail-businesses',
		redirect: '/lend-by-category/retail-businesses',
	},
	{
		path: '/lend-by-category/loans-for-shelter',
		redirect: '/lend-by-category/shelter',
	},
	{
		path: '/lend-by-category/loans-that-are-ending-soon',
		redirect: '/lend-by-category/ending-soon',
	},
	{
		path: '/lend-by-category/loans-to-artisans',
		redirect: '/lend-by-category/arts',
	},
	{
		path: '/lend-by-category/loans-to-single-parents',
		redirect: '/lend-by-category/single-parents',
	},
	{
		path: '/lend-by-category/recommended-by-lend-by-categoryers',
		redirect: '/lend-by-category/recommended-by-lenders',
	},
	{
		path: '/lend-by-category/retail-loans',
		redirect: '/lend-by-category/retail-businesses',
	},
	{
		path: '/lend-by-category/super-power-a-woman-on-kiva',
		redirect: '/lend-by-category/women',
	},
	{
		path: '/lend-by-category/world-refugee-day',
		redirect: '/lend-by-category/refugees-and-i-d-ps',
	},
	{
		path: '/lend-by-category/blackrock',
		redirect: '/lend-by-category',
	},
	{
		path: '/lend-by-category',
		component: defineAsyncComponent(() => import('#src/pages/LoanFinding/LoanFinding')),
		meta: {
			unbounceEmailCapture: true,
		},
	},
	{
		path: '/lend-by-category/recommended-by-lenders',
		component: defineAsyncComponent(() => import('#src/pages/Lend/LoanChannelCategoryPageRecommendedByLenders')),
		meta: {
			excludeFromStaticSitemap: true,
			unbounceEmailCapture: true,
			unbouncePopUp: true,
		},
	},
	{
		path: '/lend-by-category/:category',
		component: defineAsyncComponent(() => import('#src/pages/Lend/LoanChannelCategoryPage')),
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
		component: defineAsyncComponent(() => import('#src/pages/Settings/SavedSearch')),
		meta: {
			authenticationRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/lending-home',
		redirect: '/lend-by-category',
	},
	{
		name: 'borrowerProfile',
		path: '/lend/:id(\\d+)',
		component: defineAsyncComponent(() => import('#src/pages/BorrowerProfile/BorrowerProfile')),
		meta: {
			excludeFromStaticSitemap: true,
			unbounceEmailCapture: true,
			unbouncePopUp: true,
		}
	},
	{
		name: 'lend-filter',
		path: '/lend/filter',
		component: defineAsyncComponent(() => import('#src/pages/Lend/LoanSearchPage')),
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
		path: '/lp/support-refugees',
		redirect: '/refugees'
	},
	// Preserved for cms-page-server rollout, will remove after validation
	/*
	{
		path: '/lp/:dynamicRoute',
		component: defineAsyncComponent(() => import('#src/pages/ContentfulPage')),
		meta: {
			contentfulPage: route => `lp/${route.params.dynamicRoute}`,
			excludeFromStaticSitemap: true,
			unbouncePopUp: true,
		},
	},
	*/
	{
		path: '/hp/:dynamicRoute',
		component: defineAsyncComponent(() => import('#src/pages/ContentfulPage')),
		meta: {
			contentfulPage: route => `hp/${route.params.dynamicRoute}`,
			excludeFromStaticSitemap: true,
			unbouncePopUp: true,
		},
	},
	{
		path: '/monthlygood',
		component: defineAsyncComponent(() => import('#src/pages/MonthlyGood/MonthlyGoodLandingPage')),
		props: route => ({ category: route.query.category }),
		meta: {
			unbounceEmailCapture: true,
		},
	},
	{
		path: '/monthlygood/setup',
		component: defineAsyncComponent(() => import('#src/pages/MonthlyGood/MonthlyGoodSetupPage')),
		meta: {
			excludeFromStaticSitemap: true,
		},
		props: route => ({
			amount: Number(route.query.amount),
			category: route.query.category,
			source: route.query.source,
			nextmonth: route.query.nextmonth === 'true',
			initDonation: Number(route.query.initDonation),
			day: Number(route.query.day)
		}),
	},
	{
		path: '/monthlygood/thanks',
		component: defineAsyncComponent(() => import('#src/pages/MonthlyGood/MonthlyGoodThanksPage')),
		props: route => ({
			source: route.query.source,
			paymentType: route.query.paymentType,
		}),
		meta: {
			activeLoginRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/portfolio',
		component: defineAsyncComponent(() => import('#src/pages/Portfolio/ImpactDashboard/ImpactDashboardPage')),
		meta: {
			authenticationRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/portfolio/lending-stats',
		component: defineAsyncComponent(() => import('#src/pages/Portfolio/LendingStats/LendingStatsPage')),
		meta: {
			authenticationRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/possibility',
		component: defineAsyncComponent(() => import('#src/pages/Possibility/Possibility')),
		children: [
			{
				path: 'giving-tuesday',
				component: defineAsyncComponent(() => import('#src/pages/Possibility/GivingTuesday'))
			},
			{
				path: '12-days-of-lending',
				component: defineAsyncComponent(() => import('#src/pages/Possibility/12DaysOfLending'))
			},
			{
				path: 'year-end',
				component: defineAsyncComponent(() => import('#src/pages/Possibility/YearEnd'))
			},
		]
	},
	{
		path: '/process-browser-auth',
		component: defineAsyncComponent(() => import('#src/pages/ProcessBrowserAuth')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/process-instant-lending/:loanId/:lendAmount',
		component: defineAsyncComponent(() => import('#src/pages/InstantActions/ProcessInstantLending')),
		meta: {
			excludeFromStaticSitemap: true,
		},
		props: route => ({
			loanId: Number(route.params.loanId),
			lendAmount: Number(route.params.lendAmount)
		}),
	},
	{
		path: '/process-join-team',
		component: defineAsyncComponent(() => import('#src/pages/ProcessJoinTeam')),
		meta: {
			excludeFromStaticSitemap: true,
			authenticationRequired: true,
		},
		props: route => ({
			doneUrl: route.query.doneUrl,
			teamRecruitmentId: Number(route.query.teamRecruitmentId),
			teamPublicId: route.query.teamPublicId,
			promoId: Number(route.query.promoId),
			inviter: route.query.inviter
		})
	},
	{
		path: '/register/social',
		component: defineAsyncComponent(() => import('#src/pages/LoginAndRegister/RegisterSocial')),
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
		component: defineAsyncComponent(() => import('#src/pages/LoginAndRegister/GuestAccountClaim')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/register/guest-redirect',
		component: defineAsyncComponent(() => import('#src/pages/LoginAndRegister/GuestAccountRedirect')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/settings',
		component: defineAsyncComponent(() => import('#src/pages/Settings/SettingsPage')),
		meta: {
			excludeFromStaticSitemap: true,
			authenticationRequired: true,
		}
	},
	{
		path: '/settings/autolending',
		component: defineAsyncComponent(() => import('#src/pages/Autolending/AutolendingPage')),
		meta: {
			excludeFromStaticSitemap: true,
		},
		children: [
			{
				path: '',
				component: defineAsyncComponent(() => import('#src/pages/Autolending/AutolendingSettingsPage')),
				meta: {
					activeLoginRequired: true,
				}
			},
			{
				path: ':action',
				component: defineAsyncComponent(() => import('#src/pages/Autolending/AutolendingMessagingPage')),
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
		component: defineAsyncComponent(() => import('#src/pages/Settings/EmailSettings')),
		meta: {
			authenticationRequired: true,
			excludeFromStaticSitemap: true,
		},
	},
	{
		path: '/settings/payments',
		component: defineAsyncComponent(() => import('#src/pages/Settings/PaymentSettings')),
		meta: {
			activeLoginRequired: true,
			excludeFromStaticSitemap: true,
			mfaRequired: true,
			recentLoginRequired: true,
		},
	},
	{
		path: '/settings/security',
		component: defineAsyncComponent(() => import('#src/pages/Settings/SecuritySettings')),
		meta: {
			excludeFromStaticSitemap: true,
			recentLoginRequired: true,
			mfaRequired: true,
			process: 'managing your security settings',
		},
	},
	{
		path: '/settings/security/mfa',
		component: defineAsyncComponent(() => import('#src/pages/Settings/TwoStepVerificationPage')),
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
				component: defineAsyncComponent(() => import('#src/components/Settings/AppAuthentication')),
			},
			{
				path: 'phone',
				props: route => ({
					first: route.query.first === 'true'
				}),
				component: defineAsyncComponent(() => import('#src/components/Settings/PhoneAuthentication')),
			},
		],
	},
	{
		path: '/settings/subscriptions',
		component: defineAsyncComponent(() => import('#src/pages/Settings/SubscriptionsSettings')),
		meta: {
			activeLoginRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/start-verification',
		component: defineAsyncComponent(() => import('#src/pages/StartVerification')),
		meta: {
			activeLoginRequired: true,
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/styleguide',
		component: defineAsyncComponent(() => import('#src/pages/StyleGuide')),
	},
	{
		path: '/styleguide/*',
		redirect: '/styleguide',
	},
	{
		path: '/ui-site-map',
		component: defineAsyncComponent(() => import('#src/pages/UiSiteMap/UiSiteMapPage')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/UI_REVISION',
		component: defineAsyncComponent(() => import('#src/pages/UiRevision')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	{
		path: '/ub/:unbouncePath',
		component: defineAsyncComponent(() => import('#src/pages/LandingPages/Unbounce/IFrameEmbed')),
		props: route => ({
			unbouncePath: route.params.unbouncePath,
		}),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
	// These are Demo Pages
	{
		path: '/lend-vue',
		component: defineAsyncComponent(() => import('#src/pages/Lend/LendPage')),
		meta: {
			excludeFromStaticSitemap: true,
		}
	},
];
