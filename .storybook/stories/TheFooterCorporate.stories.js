import {
	lightFooter,
	iwdFooterTheme,
	wrdFooterTheme,
	fifteenYearFooterTheme,
	blueFooter
} from '@/util/siteThemes';
import TheFooterCorporate from '@/components/WwwFrame/TheFooterCorporate';

export default {
	title: 'WwwFrame/TheFooterCorporate',
	component: TheFooterCorporate,
	args: {
		theme: null,
		corporateLogoUrl: require('@/assets/images/logos/visa.svg'),
	},
	argTypes: {
		theme: {
			control: {
				type: 'select',
				options: {
					'none': null,
					'lightFooter':lightFooter,
					'iwdFooterTheme': iwdFooterTheme,
					'wrdFooterTheme': wrdFooterTheme,
					'fifteenYearFooterTheme': fifteenYearFooterTheme,
					'blueFooter': blueFooter,
				},
			}
		},
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheFooterCorporate
	},
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
	theme: wrdFooterTheme,
};

export const WithoutCorporateLogoUrl = Default.bind({});
WithoutCorporateLogoUrl.args = {
	corporateLogoUrl: null,
};
