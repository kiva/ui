import createApp from '@/main';

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__);
}

// mount app in dom once route component is resolved
router.onReady(() => app.$mount('#app'));
