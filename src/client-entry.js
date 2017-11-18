import createApp from '@/main';

const { app, router, store } = createApp();

// Apply Server state to Client Store
if (window.__INITIAL_STATE__) { // eslint-disable-line
	store.replaceState(window.__INITIAL_STATE__); // eslint-disable-line
}

// mount app in dom once route component is resolved
router.onReady(() => app.$mount('#app'));
