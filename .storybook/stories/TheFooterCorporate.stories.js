import {
	lightFooter,
	iwdFooterTheme,
	wrdFooterTheme,
	fifteenYearFooterTheme,
	blueFooter
} from '#src/util/siteThemes';
import TheFooterCorporate from '#src/components/WwwFrame/TheFooterCorporate';

const args = {
	theme: null,
	corporateLogoUrl: require('#src/assets/images/logos/visa.svg'),
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
			:corporate="corporate"
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
