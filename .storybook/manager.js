import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
	base: 'light',

//   colorPrimary: 'hotpink',
//   colorSecondary: 'deepskyblue',

//   // UI
	appBg: '#fafafa',
//   appContentBg: 'silver',
//   appBorderColor: 'grey',
//   appBorderRadius: 4,

//   // Typography
//   fontBase: '"Open Sans", sans-serif',
//   fontCode: 'monospace',

//   // Text colors
//   textColor: 'black',
//   textInverseColor: 'rgba(255,255,255,0.9)',

//   // Toolbar default and active colors
//   barTextColor: 'silver',
//   barSelectedColor: 'black',
//   barBg: 'hotpink',

//   // Form colors
//   inputBg: 'white',
//   inputBorder: 'silver',
//   inputTextColor: 'black',
//   inputBorderRadius: 4,

	brandTitle: 'Kiva.org',
	brandUrl: '/',
	brandImage: '//www.kiva.org/cms/kiva_logo_2.png',
});

addons.setConfig({
	theme,
});
