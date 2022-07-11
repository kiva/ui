import { addParameters } from '@storybook/vue';
import { MINIMAL_VIEWPORTS} from '@storybook/addon-viewport';
import Vue from 'vue';
import Meta from 'vue-meta';
import VueRouter from 'vue-router'
import KvThemeProvider from '~/@kiva/kv-components/vue/KvThemeProvider';
import { defaultTheme } from '@kiva/kv-tokens/configs/kivaColors';

//load all the svg icon sprites
import '@/assets/iconLoader';

// same styles that are in App.vue
import '../src/assets/scss/app.scss';

// Load Tailwinds css
// import 'tailwindcss/tailwind.css';
import './tailwind.css';

// css for storybook overrides like background color
import './storybookStyles.scss';

// import config file for storybook environment
import config from '../config/local';

// initialize vue-meta
Vue.use(Meta);

// Mock the analytics Vue plugin
Vue.use({ install: Vue => {
	Vue.directive('kv-track-event', () => {});
	Vue.prototype.$kvTrackEvent = () => {};
}});

Vue.use(VueRouter)

// provide global application config
Vue.prototype.$appConfig = config.app;

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


addParameters({
	options: {
		storySort: (a, b) => { // sort the categories alphabetically.
			return a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
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
});

// Wrap all stories with the kv-theme-provider component
export const decorators = [(story) => ({
	components: { story, KvThemeProvider },
	template: '<kv-theme-provider :theme="theme"><story /></kv-theme-provider>',
	data() { return { theme: defaultTheme } },
	router: new VueRouter(),
})];

