import TreeMapFigure from '#src/components/Charts/TreeMapFigure';

const genderValues = [{ label: 'Female', value: 1243, percent: 0.6467221644120708 }, { label: 'Male', value: 676, percent: 0.3517169614984391 }, { label: 'Unspecified', value: 2, percent: 0.001040582726326743 }, { label: 'Nonbinary', value: 1, percent: 0.0005202913631633715 }];
const sectorValues = [{ label: 'Food', value: 575, percent: 0.2991675338189386 }, { label: 'Retail', value: 377, percent: 0.19614984391259105 }, { label: 'Agriculture', value: 285, percent: 0.14828303850156088 }, { label: 'Services', value: 211, percent: 0.10978147762747138 }, { label: 'Clothing', value: 183, percent: 0.09521331945889698 }, { label: 'Arts', value: 65, percent: 0.033818938605619145 }, { label: 'Housing', value: 65, percent: 0.033818938605619145 }, { label: 'Education', value: 36, percent: 0.018730489073881373 }, { label: 'Construction', value: 28, percent: 0.014568158168574402 }, { label: 'Health', value: 27, percent: 0.01404786680541103 }, { label: 'Transportation', value: 23, percent: 0.011966701352757543 }, { label: 'Personal Use', value: 19, percent: 0.009885535900104058 }, { label: 'Manufacturing', value: 13, percent: 0.006763787721123829 }, { label: 'Entertainment', value: 10, percent: 0.005202913631633715 }, { label: 'Wholesale', value: 5, percent: 0.0026014568158168575 }];

export default {
	title: 'Charts/TreeMapFigure',
	component: TreeMapFigure,
	args: {
		loading: false,
		values: genderValues,
	},
};

const template = `
	<tree-map-figure
		:values="values"
		:loading="loading"
	/>
`;

export const Default = (args, { argTypes }) => ({
	components: {
		TreeMapFigure,
	},
	props: Object.keys(argTypes),
	template,
});

export const Loading = (args, { argTypes }) => ({
	components: {
		TreeMapFigure,
	},
	props: Object.keys(argTypes),
	template,
});
Loading.args = {
	loading: true,
	values: [],
};

export const ManyValues = (args, { argTypes }) => ({
	components: {
		TreeMapFigure,
	},
	props: Object.keys(argTypes),
	template,
});
ManyValues.args = {
	values: sectorValues,
};
