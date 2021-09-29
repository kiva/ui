import MonthlyGoodSelectorDesktop from '@/components/MonthlyGood/MonthlyGoodSelectorDesktop';
import MonthlyGoodSelectorMobile from '@/components/MonthlyGood/MonthlyGoodSelectorMobile';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

const lendingCategories = loanGroupCategoriesMixin.data().lendingCategories;

export default {
	title: 'components/MonthlyGoodSelector',
	args: {
		preSelectedCategory: null,
	},
	argTypes: {
		preSelectedCategory: {
			control: {
				type: 'select',
				options: {
					'none': null,
					'default': lendingCategories.find(({value}) => value ==='default' ),
					'women': lendingCategories.find(({value}) => value ==='women' ),
					'agriculture': lendingCategories.find(({value}) => value ==='agriculture' ),
					'refugees': lendingCategories.find(({value}) => value ==='refugees' ),
					'education': lendingCategories.find(({value}) => value ==='education' ),
					'eco_friendly':lendingCategories.find(({value}) => value ==='eco_friendly' ),
					'us_borrowers': lendingCategories.find(({value}) => value ==='us_borrowers' ),
					'disaster_relief_covid': lendingCategories.find(({value}) => value ==='disaster_relief_covid' ),
				},
			}
		},
	}
};

export const Desktop = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		MonthlyGoodSelectorDesktop,
	},
	template: `
		<div style="margin-top: 25rem;">
			<monthly-good-selector-desktop/>
		</div>
	`,
});

export const DesktopWithPreSelected = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		MonthlyGoodSelectorDesktop,
	},
	template: `
		<div style="margin-top: 25rem;">
			<!-- Key prop is not needed, just a hack for storybook to update component when prop changes -->
			<monthly-good-selector-desktop :pre-selected-category="preSelectedCategory" :key="preSelectedCategory?.value ?? null" />
		</div>
	`,
});
DesktopWithPreSelected.args = {
	preSelectedCategory: lendingCategories.find(({value}) => value ==='refugees' )
};

export const Mobile = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		MonthlyGoodSelectorMobile,
	},
	template: `
		<div>
			<monthly-good-selector-mobile/>
		</div>
	`,
});

export const MobileWithPreSelected = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		MonthlyGoodSelectorMobile,
	},
	template: `
		<div>
			<!-- Key prop is not needed, just a hack for storybook to update component when prop changes -->
			<monthly-good-selector-mobile :pre-selected-category="preSelectedCategory" :key="preSelectedCategory?.value ?? null" />
		</div>
	`,
});
MobileWithPreSelected.args = {
	preSelectedCategory: lendingCategories.find(({value}) => value ==='climate' )
};

