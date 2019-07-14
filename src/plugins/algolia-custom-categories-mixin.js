import _forEach from 'lodash/forEach';

export default {
	data() {
		return {
			customCategoryAttributes: ['sector.name', 'themeData.loanThemeTypeName', 'tags.name'],
			/* eslint-disable max-len */
			// aka. Loan Channel config
			// INFO: These properties provide an analogue to our loan channels
			customCategories: Object.freeze({
				agriculture: {
					name: 'Agriculture',
					//  OR tags.name:#Sustainable Ag (need to fix name to remove spaces)
					filter: 'sector.name:Agriculture OR themeData.loanThemeTypeName:Agriculture OR themeData.loanThemeTypeName:Trees',
					disjunctiveFacets: {
						'sector.name': ['Agriculture'],
						'themeData.loanThemeTypeName': ['Agriculture', 'Trees'],
						'tags.name': ['#Sustainable Ag']
					},
				},
				animals: {
					name: 'Animals',
					filter: 'tags.name:#Animals',
					disjunctiveFacets: {
						'sector.name': [],
						'themeData.loanThemeTypeName': [],
						'tags.name': ['#Animals']
					},
				},
				arts: {
					name: 'Arts',
					filter: 'sector:Arts OR tags.name:#Fabrics',
					disjunctiveFacets: {
						'sector.name': ['Arts'],
						'themeData.loanThemeTypeName': [],
						'tags.name': ['#Fabrics']
					},
				},
				clothing: {
					name: 'Clothing',
					filter: 'sector:Clothing',
					disjunctiveFacets: {
						'sector.name': ['Clothing'],
						'themeData.loanThemeTypeName': [],
						'tags.name': []
					},
				},
				ecoFriendly: {
					name: 'Eco-friendly',
					filter: 'tags.name:#Eco-friendly',
					disjunctiveFacets: {
						'sector.name': [],
						'themeData.loanThemeTypeName': [],
						'tags.name': ['#Eco-friendly']
					},
				},
				education: {
					name: 'Education',
					//  OR tags.name:#Female Education (need to fix name to remove spaces)
					//  OR themeData.loanThemeTypeName:Higher Education (need to fix name to remove spaces)
					filter: 'sector:Education OR tags.name:#Schooling',
					disjunctiveFacets: {
						'sector.name': ['Education'],
						'themeData.loanThemeTypeName': ['Higher Education'],
						'tags.name': ['#Schooling', '#Female Education']
					},
				},
				entertainment: {
					name: 'Entertainment',
					filter: 'sector:Entertainment',
					disjunctiveFacets: {
						'sector.name': ['Entertainment'],
						'themeData.loanThemeTypeName': [],
						'tags.name': []
					},
				},
				food: {
					name: 'Food',
					filter: 'sector:Food',
					disjunctiveFacets: {
						'sector.name': ['Food'],
						'themeData.loanThemeTypeName': [],
						'tags.name': []
					},
				},
				health: {
					name: 'Health',
					//  OR tags.name:#Health and Sanitation (need to fix name to remove spaces)
					filter: 'sector:Health OR themeData.loanThemeTypeName:Health',
					disjunctiveFacets: {
						'sector.name': ['Health'],
						'themeData.loanThemeTypeName': ['Health'],
						'tags.name': ['#Health and Sanitation']
					},
				},
				manufacturing: {
					name: 'Manufacturing',
					filter: 'sector:Manufacturing',
					disjunctiveFacets: {
						'sector.name': ['Manufacturing'],
						'themeData.loanThemeTypeName': [],
						'tags.name': []
					},
				},
				refugeesAndIdps: {
					name: 'Refugees and IDPs',
					// OR themeData.loanThemeTypeName:Vunerable Populations (Refugees) (need to fix name to remove spaces)
					// OR themeData.loanThemeTypeName:Displaced Populations (need to fix name to remove spaces)
					filter: 'tags.name:#Refugee',
					disjunctiveFacets: {
						'sector.name': [],
						'themeData.loanThemeTypeName': ['Displaced Populations', 'Vunerable Populations (Refugees)'],
						'tags.name': ['#Refugee']
					},
				},
				shelter: {
					name: 'Shelter',
					filter: 'sector:Housing',
					disjunctiveFacets: {
						'sector.name': ['Housing'],
						'themeData.loanThemeTypeName': [],
						'tags.name': []
					},
				},
				transportation: {
					name: 'Transportation',
					filter: 'sector:Transportation',
					disjunctiveFacets: {
						'sector.name': ['Transportation'],
						'themeData.loanThemeTypeName': [],
						'tags.name': []
					},
				},
				technology: {
					name: 'Technology',
					// OR themeData.loanThemeTypeName:Mobile Technology (need to fix name to remove spaces)
					filter: 'tags.name:#Technology',
					disjunctiveFacets: {
						'sector.name': [],
						'themeData.loanThemeTypeName': ['Mobile Technology'],
						'tags.name': []
					},
				},
				waterAndSanitation: {
					name: 'Water and sanitation',
					//  OR themeData.loanThemeTypeName:#Water and Sanitation (need to fix name to remove spaces)
					filter: '',
					disjunctiveFacets: {
						'sector.name': [],
						'themeData.loanThemeTypeName': ['Water and Sanitation'],
						'tags.name': []
					},
				},
			}),
			/* eslint-enable max-len */
		};
	},
	computed: {
		customCategoryItems() {
			const items = [];
			_forEach(
				this.selectedCustomCategories,
				(customCategoryEnabled, selectedCustomCategoryId) => {
					if (!customCategoryEnabled) {
						return;
					}
					items.push({
						attribute: selectedCustomCategoryId,
						label: this.getCustomCategoryLabel(selectedCustomCategoryId),
						refine: () => {
							this.removeCustomCategory(selectedCustomCategoryId);
						},
						type: 'CustomCategory',
					});
				},
			);
			return items;
		}
	},
	methods: {
		getCustomCategoryLabel(customCategoryId) {
			return this.customCategories[customCategoryId].name;
		},
	},
};
