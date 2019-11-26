import StyleguideColors from '@/components/Styleguide/StyleguideColors';
import StyleguideTypography from '@/components/Styleguide/StyleguideTypography';
import StyleguideForms from '@/components/Styleguide/StyleguideForms';

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
