import {
	lightFooter,
	iwdFooterTheme,
	wrdFooterTheme,
	fifteenYearFooterTheme,
	blueFooter
} from '#src/util/siteThemes';
import TheFooterCorporate from '#src/components/WwwFrame/TheFooterCorporate';

const imageGlob = import.meta.glob('/src/assets/images/logos/*.*', { eager: true });

const args = {
	theme: null,
	corporateLogoUrl: Object.keys(imageGlob)[0],
};

export default {
	title: 'WwwFrame/TheFooterCorporate',
	component: TheFooterCorporate,
	args,
	argTypes: {
		theme: {
			control: {
				type: 'select',
			},
			options: {
				'none': null,
				'lightFooter': lightFooter,
				'iwdFooterTheme': iwdFooterTheme,
				'wrdFooterTheme': wrdFooterTheme,
				'fifteenYearFooterTheme': fifteenYearFooterTheme,
				'blueFooter': blueFooter,
			},
		},
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheFooterCorporate
	},
	setup() { return args; },
	template: `
		<the-footer-corporate
			:theme="theme"
			:corporate-logo-url="corporateLogoUrl"
		/>
	`,
});

export const Themed = Default.bind({});
Themed.args = {
	...args,
	theme: wrdFooterTheme,
};

export const WithoutCorporateLogoUrl = Default.bind({});
WithoutCorporateLogoUrl.args = {
	...args,
	corporateLogoUrl: null,
};
