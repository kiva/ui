import { configure, addDecorator, addParameters } from '@storybook/vue';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

// same styles that are in App.vue
import '../src/assets/scss/app.scss';

import kvTheme from './kvtheme';

addParameters({
  options: {
    theme: kvTheme,
  },
});

addDecorator(withA11y);
addDecorator(withKnobs);

const GlobalDecorator = () => ({
	template: `
		<div
			:style="{
				margin: '1rem'
			}
		">
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
