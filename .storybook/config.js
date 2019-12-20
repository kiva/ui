import { configure, addDecorator, addParameters } from '@storybook/vue';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
//load all the svg icon sprites
import '@/assets/iconLoader';

// same styles that are in App.vue
import '../src/assets/scss/app.scss';
// storybook theme
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
