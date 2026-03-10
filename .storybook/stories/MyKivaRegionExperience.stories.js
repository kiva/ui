import { provide, ref } from 'vue';
import MyKivaRegionExperience from '#src/components/MyKiva/MyKivaRegionExperience.vue';

const mockRegionsData = [
	{ name: 'Africa', hasLoans: true, count: 120, countries: ['KE', 'UG', 'RW'] },
	{ name: 'Asia', hasLoans: true, count: 300, countries: ['KH', 'PH', 'VN'] },
	{ name: 'Central America', hasLoans: true, count: 80, countries: ['GT', 'NI', 'SV'] },
	{ name: 'Eastern Europe', hasLoans: false, count: 40, countries: ['AM', 'GE', 'AL'] },
	{ name: 'Middle East', hasLoans: false, count: 50, countries: ['JO', 'LB', 'PS'] },
	{ name: 'North America', hasLoans: true, count: 60, countries: ['US', 'MX', 'DO'] },
	{ name: 'Oceania', hasLoans: false, count: 30, countries: ['WS', 'FJ', 'TO'] },
	{ name: 'South America', hasLoans: true, count: 90, countries: ['BO', 'PE', 'EC'] },
];

const mockLoans = [
	{ id: 1, name: 'Sample Loan 1' },
	{ id: 2, name: 'Sample Loan 2' },
];

export default {
	title: 'MyKiva/MyKivaRegionExperience',
	component: MyKivaRegionExperience,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MyKivaRegionExperience },
		setup() {
			provide('$kvTrackEvent', () => {});
			return { args };
		},
		template: `
			<div style="max-width: 600px;">
				<MyKivaRegionExperience v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	regionsData: mockRegionsData,
	loans: mockLoans,
});

// Same as empty state
export const AllRegionsLent = story({
	regionsData: mockRegionsData.map(r => ({ ...r, hasLoans: true })),
	loans: mockLoans,
});

export const NoRegionsLent = story({
	regionsData: mockRegionsData.map(r => ({ ...r, hasLoans: false })),
	loans: [],
});

export const FewRegionsLent = story({
	regionsData: [
		{ name: 'Africa', hasLoans: true, count: 120, countries: ['KE', 'UG'] },
		{ name: 'Asia', hasLoans: false, count: 300, countries: ['KH', 'PH'] },
		{ name: 'Central America', hasLoans: false, count: 80, countries: ['GT', 'NI'] },
		{ name: 'South America', hasLoans: false, count: 90, countries: ['BO', 'PE'] },
	],
	loans: mockLoans,
});
