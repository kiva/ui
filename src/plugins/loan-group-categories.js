export default {
	data() {
		return {
			lendingCategories: [
				{
					value: 'default',
					label: 'Support all borrowers',
					shortName: 'all borrowers',
					marketingName: 'Everyone'
				},
				{
					value: 'women',
					label: 'Support women',
					shortName: 'women',
					marketingName: 'Women'
				},

				{
					value: 'agriculture',
					label: 'Support farmers',
					shortName: 'farmers',
					marketingName: 'Farmers'
				},
				{
					value: 'refugees',
					label: 'Support refugees',
					shortName: 'refugees',
					marketingName: 'Refugees'
				},
				{
					value: 'education',
					label: 'Support students',
					shortName: 'students',
					marketingName: 'Students'
				},
				{
					value: 'eco_friendly',
					label: 'Support eco-friendly loans',
					shortName: 'eco-friendly loans',
					marketingName: 'Climate'
				},
				{
					value: 'us_borrowers',
					label: 'Support US borrowers',
					shortName: 'US borrowers',
					marketingName: 'US Borrowers'
				},
				{
					value: 'disaster_relief_covid',
					label: 'COVID-19 Coronavirus',
					shortName: 'the global COVID—19 response',
					marketingName: 'COVID-19'
				},
			],
		};
	}
};
