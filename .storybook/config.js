import { configure, addDecorator, addParameters } from '@storybook/vue';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

// same styles that are in App.vue
import './appstyles.scss';

import kvTheme from './kvtheme';

addParameters({
  options: {
    theme: kvTheme,
  },
});

addDecorator(withA11y);
addDecorator(withKnobs);

// automatically import all files ending in *.stories.js
configure(require.context('../src/', true, /\.stories\.js$/), module);
