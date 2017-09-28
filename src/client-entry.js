import createApp from '@/main';

const { app, router } = createApp();

// mount app in dom once route component is resolved
router.onReady(() => app.$mount('#app'));
