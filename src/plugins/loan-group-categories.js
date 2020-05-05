export default {
	data() {
		return {
			lendingCategories: [
				{
					value: 'default',
					label: 'Support all borrowers',
					shortName: 'all borrowers',
				},
				{
					value: 'women',
					label: 'Support women',
					shortName: 'women',
				},

				{
					value: 'agriculture',
					label: 'Support farmers',
					shortName: 'farmers',
				},
				{
					value: 'refugees',
					label: 'Support refugees',
					shortName: 'refugees'
				},
				{
					value: 'education',
					label: 'Support students',
					shortName: 'students',
				},
				{
					value: 'eco_friendly',
					label: 'Support eco-friendly loans',
					shortName: 'eco-friendly loans',
				},
				{
					value: 'us_borrowers',
					label: 'Support US borrowers',
					shortName: 'US borrowers',
				},
				{
					value: 'disaster_relief_covid',
					label: 'COVID-19 Coronavirus',
					shortName: 'the global COVID—19 response',
				},
			],
		};
	}
};
