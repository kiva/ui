export default [
	{ path: '/portfolio/lending-stats', component: () => import('@/pages/LendingStats/LendingStatsPage') },
	{ path: '/ui-site-map', component: () => import('@/pages/UiSiteMap/UiSiteMapPage') },
	{ path: '/style-guide', component: () => import('@/pages/StyleGuide') },
	{ path: '/page-two', component: () => import('@/pages/PageTwo') },
	{ path: '/UI_REVISION', component: () => import('@/pages/UiRevision') },
	{ path: '/lend-vue', component: () => import('@/pages/Lend/LendPage') },
	{ path: '/login-vue', component: () => import('@/pages/LoginAndRegister/LoginAndRegister') },
	{ path: '/checkout-vue', component: () => import('@/pages/Checkout/CheckoutPage') },
	{ path: '/checkout-beta', component: () => import('@/pages/Checkout/CheckoutBetaPage') },
];
