import Vue from 'vue';

// Mock the analytics Vue plugin
Vue.use({
	// eslint-disable-next-line no-shadow
	install: Vue => {
		// eslint-disable-next-line no-param-reassign
		Vue.prototype.$kvTrackEvent = () => {};
	}
});
