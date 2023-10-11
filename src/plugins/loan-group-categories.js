export default {
	data() {
		return {
			lendingCategories: [
				{
					value: 'default',
					label: 'Support all borrowers',
					shortName: 'all borrowers',
					marketingName: 'Everyone',
					marketingOrder: 8,
					expLoansIds: [2019772, 2319405, 2320176]
				},
				{
					value: 'women',
					label: 'Support women',
					shortName: 'women',
					marketingName: 'Women',
					marketingOrder: 3,
					expLoansIds: [2319080, 633677, 2320176]
				},

				{
					value: 'agriculture',
					label: 'Support farmers',
					shortName: 'farmers',
					marketingName: 'Farmers',
					marketingOrder: 5,
					expLoansIds: [2319405, 2319080, 633677]
				},
				{
					value: 'refugees',
					label: 'Support refugees',
					shortName: 'refugees',
					marketingName: 'Refugees',
					marketingOrder: 1,
					expLoansIds: [1084348, 2320176, 1384754]
				},
				{
					value: 'education',
					label: 'Support students',
					shortName: 'students',
					marketingName: 'Students',
					marketingOrder: 4,
					expLoansIds: [1386169, 2019772, 1384754]
				},
				{
					value: 'eco_friendly',
					label: 'Support earth friendly loans',
					shortName: 'earth friendly loans',
					marketingName: 'Earth friendly',
					marketingOrder: 6,
					expLoansIds: [758358, 2319405, 2319613]
				},
				{
					value: 'us_borrowers',
					label: 'Support US borrowers',
					shortName: 'US borrowers',
					marketingName: 'US Borrowers',
					marketingOrder: 2,
					expLoansIds: [1084348, 2319451, 1079005]
				}
			],
		};
	}
};
