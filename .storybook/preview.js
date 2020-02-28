import { addDecorator, addParameters } from '@storybook/vue';
import { withA11y } from '@storybook/addon-a11y';
import Vue from 'vue';

//load all the svg icon sprites
import '@/assets/iconLoader';

// same styles that are in App.vue
import '../src/assets/scss/app.scss';

// import config file for storybook environment
import config from '../config/local';

// provide global application config
Vue.prototype.$appConfig = config.app;

addParameters({
	options: {
		storySort: (a, b) => { // sort the categories alphabetically.
			return a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
		},
		showRoots: true,
	},
	docs: {
		inlineStories: true,
	}
});

const GlobalDecorator = () => ({
	template: `
		<div style="padding: 2rem">
			<story />
		</div>
	  `
});

addDecorator(withA11y);
addDecorator(GlobalDecorator);
