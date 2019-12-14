import StyleguideIntro from '@/components/Styleguide/StyleguideIntro';
import StyleguideCopy from '@/components/Styleguide/StyleguideCopy';
import StyleguideColors from '@/components/Styleguide/StyleguideColors';
import StyleguideTypography from '@/components/Styleguide/StyleguideTypography';
import StyleguideForms from '@/components/Styleguide/StyleguideForms';
import StyleguideImages from '@/components/Styleguide/StyleguideImages';
// import StyleguideIcons from '@/components/Styleguide/StyleguideIcons';

export default { title: 'Styleguide' };

export const Intro = () => ({
	components: { StyleguideIntro },
	template: '<styleguide-intro />'
});

export const Typography = () => ({
	components: { StyleguideTypography },
	template: '<styleguide-typography />'
});

export const Copy = () => ({
	components: { StyleguideCopy },
	template: '<styleguide-copy />'
});

export const Colors = () => ({
	components: { StyleguideColors },
	template: '<styleguide-colors />'
});

export const Forms = () => ({
	components: { StyleguideForms },
	template: '<styleguide-forms />'
});

export const Images = () => ({
	components: { StyleguideImages },
	template: '<styleguide-images />'
});

// export const Icons = () => ({
// 	components: { StyleguideIcons },
// 	template: '<styleguide-icons />'
// });
