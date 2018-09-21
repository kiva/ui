export default [
	{ path: '/ui-site-map', component: () => import('@/pages/UiSiteMap/UiSiteMapPage') },
	{ path: '/component-demo', component: () => import('@/pages/ComponentDemo/ComponentDemo') },
	{ path: '/kiva-app-components', component: () => import('@/pages/ComponentDemo/ComponentDemoKivaApp') },
	{ path: '/lend-vue', component: () => import('@/pages/Lend/LendPage') },
	{ path: '/lend-by-category', component: () => import('@/pages/Lend/LendByCategoryPage') },
	{ path: '/portfolio/lending-stats', component: () => import('@/pages/LendingStats/LendingStatsPage') },
	{ path: '/style-guide', component: () => import('@/pages/StyleGuide') },
	{ path: '/page-two', component: () => import('@/pages/PageTwo') },
	{ path: '/UI_REVISION', component: () => import('@/pages/UiRevision') },
	{ path: '/login-vue', component: () => import('@/pages/LoginAndRegister/LoginAndRegister') },
	{ path: '/checkout-vue', component: () => import('@/pages/Checkout/CheckoutPage') },
	{ path: '/checkout-beta', component: () => import('@/pages/Checkout/CheckoutBetaPage') },
];
