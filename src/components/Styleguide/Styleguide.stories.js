import StyleguideColors from './StyleguideColors';
import StyleguideTypography from './StyleguideTypography';
import StyleguideForms from './StyleguideForms';

export default { title: 'Styleguide', component: StyleguideColors };

export const Colors = () => ({
	components: { StyleguideColors },
	template: '<styleguide-colors />'
});

export const Forms = () => ({
	components: { StyleguideForms },
	template: '<styleguide-forms />'
});

export const Typography = () => ({
	components: { StyleguideTypography },
	template: '<styleguide-typography />'
});
