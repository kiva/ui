import { setup } from '@storybook/vue3';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { VueHeadMixin, createHead } from '@unhead/vue';
import { createRouter, createWebHistory } from 'vue-router';
import { KvThemeProvider } from '@kiva/kv-components';
import { defaultTheme } from '@kiva/kv-tokens';
import changeCaseFilter from '../src/plugins/change-case-filter';
import numeralFilter from '../src/plugins/numeral-filter';
import apolloMixin from '../src/plugins/apollo-plugin';

// same styles that are in App.vue
import '../src/assets/scss/app.scss';

// Load Tailwinds css
// import 'tailwindcss/tailwind.css';
import './tailwind.css';

// css for storybook overrides like background color
import './storybookStyles.scss';

// import config file for storybook environment
import config from '../config/local';

setup((app) => {
	// Create a new router instance
	const router = createRouter({
		history: createWebHistory(),
		routes: [],
	});
	app.use(router);

	// Mock the analytics Vue plugin
	app.directive('kv-track-event', () => { });
	app.config.globalProperties.$kvTrackEvent = () => { };
	app.config.globalProperties.$kvTrackSelfDescribingEvent = () => { };

	// provide global application config
	app.config.globalProperties.$appConfig = config.app;

	// Provide $filters
	app.config.globalProperties.$filters = {
		changeCase: changeCaseFilter,
		numeral: numeralFilter,
	};

	// install apollo mixin
	app.use(apolloMixin);
	// provide renderConfig for components that need it
	app.config.globalProperties.$renderConfig = ({});

	// initialize unhead
	const head = createHead();
	// head for composition api
	app.use(head);
	// head for options api
	app.mixin(VueHeadMixin);

	// install dovetail font
	head.push({
		link: [
			{
				rel: 'stylesheet',
				href: 'https://use.typekit.net/pmj7shs.css',
			},
		],
	});

	app.provide('$kvTrackEvent', () => { });

	app.provide('$appConfig', { photoPath: 'https://www.kiva.org/img/' });
});

// add custom viewports
const customViewports = {
	mediumBreakpoint: {
		name: 'Medium breakpoint',
		styles: {
			width: '834px',
			height: '720px',
		},
	},
	largeBreakpoint: {
		name: 'Large breakpoint',
		styles: {
			width: '1440px',
			height: '900px',
		},
	},
	oversizeDesktop: {
		name: 'Oversize desktop',
		styles: {
			width: '1540px',
			height: '1000px',
		},
	},
};


export const parameters = {
	options: {
		storySort: (a, b) => { // sort the categories alphabetically.
			return a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true });
		},
		showRoots: true,
		enableShortcuts: false,
	},
	docs: {
		inlineStories: true,
	},
	backgrounds: {
		default: 'white',
		values: [
			{
				name: 'white',
				value: '#ffffff'
			},
			{
				name: 'kiva-bg-lightgray',
				value: '#fafafa'
			},
			{
				name: 'black',
				value: '#000000'
			},
		],
	},
	viewport: {
		viewports: {
			...MINIMAL_VIEWPORTS,
			...customViewports,
		},
	},
};

// Wrap all stories with the kv-theme-provider component
export const decorators = [(story) => ({
	components: { story, KvThemeProvider },
	template: '<kv-theme-provider :theme="theme"><story /></kv-theme-provider>',
	data() { return { theme: defaultTheme } },
	// router: new VueRouter(),
})];

