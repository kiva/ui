export default {
	data() {
		return {
			lendingCategories: [
				{
					value: 'default',
					label: 'Support all borrowers',
					shortName: 'all borrowers',
					marketingName: 'Everyone',
					marketingOrder: 8
				},
				{
					value: 'women',
					label: 'Support women',
					shortName: 'women',
					marketingName: 'Women',
					marketingOrder: 3
				},

				{
					value: 'agriculture',
					label: 'Support farmers',
					shortName: 'farmers',
					marketingName: 'Farmers',
					marketingOrder: 5
				},
				{
					value: 'refugees',
					label: 'Support refugees',
					shortName: 'refugees',
					marketingName: 'Refugees',
					marketingOrder: 1
				},
				{
					value: 'education',
					label: 'Support students',
					shortName: 'students',
					marketingName: 'Students',
					marketingOrder: 4
				},
				{
					value: 'eco_friendly',
					label: 'Support climate change loans',
					shortName: 'climate change loans',
					marketingName: 'Climate',
					marketingOrder: 6
				},
				{
					value: 'us_borrowers',
					label: 'Support US borrowers',
					shortName: 'US borrowers',
					marketingName: 'US Borrowers',
					marketingOrder: 2
				},
				{
					value: 'disaster_relief_covid',
					label: 'COVID-19 Coronavirus',
					shortName: 'the global COVID—19 response',
					marketingName: 'COVID-19',
					marketingOrder: 7
				},
			],
		};
	}
};
