import { configure, addDecorator, addParameters } from '@storybook/vue';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

import Vue from 'vue';
import kivaPlugins from '@/plugins';
import Vue2TouchEvents from 'vue2-touch-events';

import kvTheme from './kvtheme';
import '../src/assets/scss/app.scss'; // same styles that are in App.vue

Vue.use(kivaPlugins);
Vue.use(Vue2TouchEvents);

addParameters({
  options: {
    theme: kvTheme,
  },
});

addDecorator(withA11y);
addDecorator(withKnobs);

const GlobalDecorator = () => ({
	template: `
		<div style="padding: 2rem">
			<story />
		</div>
	  `
});
addDecorator(GlobalDecorator);

const loaderFn = () => {
	const stories = [
		require('./stories/Styleguide.stories.js') // load the styleguide first
	];
	const others = require.context('./stories/', true, /\.stories\.js$/);
	others.keys().forEach(fname => stories.push(others(fname)));
	return stories;
  };

configure(loaderFn, module);
