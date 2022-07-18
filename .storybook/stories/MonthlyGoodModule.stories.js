import MonthlyGoodModule from '@/components/Categories/MonthlyGoodModule';

export default {
    title: 'Components/Monthly Good Module',
    component: MonthlyGoodModule,
};

export const MonthlyGood = () => ({
	components: { MonthlyGoodModule },
	template: `
		<monthly-good-module/>
		`,
});
