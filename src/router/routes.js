module.exports = [
	{ path: '/two', name: 'page-two', component: () => import('@/pages/PageTwo'), status: 'prod' },
	{ path: '/uue-site-map', name: 'uue-site-map', component: () => import('@/pages/UueSiteMap'), status: 'dev' },
	{ path: '/', name: 'uue-root', component: () => import('@/pages/HomePage'), status: 'dev' },
];
