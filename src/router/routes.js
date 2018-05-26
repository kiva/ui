export default [
	{ path: '/portfolio/lending-stats', component: () => import('@/pages/LendingStats/LendingStatsPage') },
	{ path: '/ui-site-map', component: () => import('@/pages/UueSiteMap/UueSiteMapPage') },
	{ path: '/style-guide', component: () => import('@/pages/StyleGuide') },
	{ path: '/page-two', component: () => import('@/pages/PageTwo') },
	{ path: '/UI_REVISION', component: () => import('@/pages/UiRevision') },
];
