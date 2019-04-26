export default {
	data() {
		return {
			loanChannelQueryMap: [

				// Lend Drop Down, Category Grid, + All Categories Page

				{
					id: 5,
					url: 'women',
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5',
					algoliaParams: 'gender=female'
				},
				{
					id: 8,
					url: 'agriculture',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=1',
					algoliaParams: 'sector=Agriculture'
				},
				{
					id: 4,
					url: 'education',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=15',
					algoliaParams: 'sector=Education'
				},
				{
					id: 32,
					url: 'refugees-and-i-d-ps',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Refugees/Displaced',
					algoliaParams: 'attributes=Refugees%2FDisplaced'
				},
				{
					id: 18,
					url: 'eco-friendly',
					queryParams: 'status=fundRaising&riskRating=0,5&loanTags=9,8',
					algoliaParams: 'tags=%23Eco-friendly~%23Sustainable%20Ag'
				},
				{
					id: 28,
					url: 'kiva-u-s',
					queryParams: 'status=fundRaising&riskRating=0,5&country=US&distributionModel=direct',
					algoliaParams: 'location=North%20America~United%20States'
				},
				{
					id: 23,
					url: 'livestock',
					queryParams: 'status=fundRaising&riskRating=0,5&activity=73',
					// algoliaParams: '', // not supported pass exclude link
					// eslint-disable-next-line
					fallbackUrl: '/lend?status=fundRaising&riskRating=0,5&activity=73&kexpn=lend_filter.lend_filter_versions&kexpv=c'
				},
				{
					id: 29,
					url: 'arts',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=9',
					algoliaParams: 'sector=Arts'
				},
				{
					id: 3,
					url: 'expiring-soon',
					queryParams: 'status=fundRaising&riskRating=0,5&expiringSoon=1',
					algoliaParams: 'sortBy=expiringSoon'
				},
				{
					id: 26,
					url: 'single-parents',
					queryParams: 'status=fundRaising&riskRating=0,5&loanTags=17',
					algoliaParams: 'tags=%23Single%20Parent'
				},
				{
					id: 25,
					url: 'health',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=6',
					algoliaParams: 'sector=Health'
				},
				{
					id: 12,
					url: 'food',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=12',
					algoliaParams: 'sector=Food'
				},
				{
					id: 31,
					url: 'water-and-sanitation',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Water and Sanitation',
					algoliaParams: 'attributes=Water%20and%20Sanitation'
				},
				{
					id: 7,
					url: 'conflict-zones',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Conflict Zones',
					algoliaParams: 'attributes=Conflict%20Zones'
				},
				{
					id: 11,
					url: 'short-term-loans',
					queryParams: 'status=fundRaising&riskRating=0,5&lenderTerm=0,16',
					algoliaParams: 'repayment=%3A16'
				},
				{
					id: 6,
					url: 'shelter',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=10',
					algoliaParams: 'sector=Housing'
				},
				{
					id: 33,
					url: 'social-enterprises',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Social Enterprise',
					algoliaParams: 'attributes=Social%20Enterprise'
				},
				{
					id: 13,
					url: 'retail-businesses',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=7',
					algoliaParams: 'sector=Retail'
				},
				{
					id: 17,
					url: 'men',
					queryParams: 'status=fundRaising&gender=male&riskRating=0,5',
					algoliaParams: 'gender=male'
				},
				{
					id: 10,
					url: 'underbanked-areas',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Underfunded Areas',
					algoliaParams: 'attributes=Underfunded%20Areas'
				},
				{
					id: 16,
					url: 'transport',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=3',
					algoliaParams: 'sector=Transportation'
				},
				{
					id: 14,
					url: 'groups',
					queryParams: 'status=fundRaising&riskRating=0,5&isGroup=1',
					algoliaParams: '' // not support show exit link
				},
				{
					id: 1,
					url: 'vulnerable-populations',
					// eslint-disable-next-line
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Vulnerable Groups&distributionModel=field_partner',
					algoliaParams: 'attributes=Vulnerable%20Groups'
				},

				// Lend By Category Channels

				{
					id: 67,
					url: 'loans-to-single-parents',
					queryParams: 'status=fundRaising&riskRating=0,5&loanTags=17',
					algoliaParams: 'tags=%23Single%20Parent'
				},
				{
					id: 52,
					url: 'loans-to-women',
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5',
					algoliaParams: 'gender=female'
				},
				{
					id: 53,
					url: 'loans-for-education',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=15',
					algoliaParams: 'sector=Education'
				},
				{
					id: 54,
					url: 'trending-now',
					queryParams: 'status=fundRaising&riskRating=0,5',
					algoliaParams: ''
				},
				{
					id: 55,
					url: 'loans-to-farmers',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=1',
					algoliaParams: 'sector=Agriculture'
				},
				{
					id: 56,
					url: 'loans-with-research-backed-impact',
					queryParams: 'status=fundRaising&riskRating=0,5',
					algoliaParams: ''
				},
				{
					id: 57,
					url: 'loans-to-refugees-and-i-d-ps',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Refugees/Displaced',
					algoliaParams: 'attributes=Refugees%2FDisplaced'
				},
				{
					id: 58,
					url: 'eco-friendly-loans',
					queryParams: 'status=fundRaising&riskRating=0,5&loanTags=9',
					algoliaParams: 'tags=%23Eco-friendly~%23Sustainable%20Ag'
				},
				{
					id: 59,
					url: 'loans-that-expire-soon',
					queryParams: 'status=fundRaising&riskRating=0,5',
					algoliaParams: 'sortBy=expiringSoon'
				},
				{
					id: 60,
					url: 'loans-that-are-almost-funded',
					queryParams: 'status=fundRaising&riskRating=0,5',
					algoliaParams: 'sortBy=amountLeft'
				},
				{
					id: 63,
					url: 'loans-for-clean-energy',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Clean Energy',
					algoliaParams: 'attributes=Clean%20Energy'
				},
				{
					id: 66,
					url: 'lenders-like-you-supported-these-loans',
					queryParams: 'status=fundRaising&riskRating=0,5',
					algoliaParams: ''
				},

				// Misc Promotional or Unsupported URLS

				{
					id: 65,
					url: 'new-countries-for-you',
					queryParams: 'status=fundRaising&riskRating=0,5&distributionModel=field_partner',
					algoliaParams: ''
				},
				{
					id: 34,
					url: 'international-womens-day',
					// eslint-disable-next-line
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5&matcherAccountId=983080,1192165,1487001,1547025,1783302,1783306,200109699,1405273,1440573,200274423,200284350,200284401,200284457,200284479,200284527,200284590,200285893,200285953,200356175,200363459,200365421,200406544,200408698,200431116,200443753,200444376,200449836,200449840,200575794,200585420,200588036,200588040,200588046,200595120,200597351,200644733,200647826,200648416,200672970,200677916,200687225,200708242,200748961,200751611,200751613,200751617,200751620,200751622,200751624,200751625,200801939,200810767,200810779,200818085,200852356,200880528,200880531,200880537,200957091,201008230,201024089,201028457'
				},
				{
					id: 48,
					url: 'human-flow-fund-support-refugees-and-i-d-ps',
					// eslint-disable-next-line
					queryParams: 'status=fundRaising&riskRating=0,5&sector=1,9,5,14,12,8,7,4,3,13&theme=Conflict Zones,Refugees/Displaced&distributionModel=field_partner'
				},
				{
					id: 51,
					url: 'blackrock',
					queryParams: 'status=fundRaising&riskRating=0,5&excludeNonRated=1&distributionModel=field_partner',
					algoliaParams: ''
				},
				{
					id: 61,
					url: 'flash-match',
					queryParams: 'status=fundRaising&riskRating=0,5',
					algoliaParams: ''
				},
				{
					id: 42,
					url: '1-billion-in-change',
					queryParams: 'status=fundRaising&riskRating=0,5',
					algoliaParams: ''
				},
				{
					id: 35,
					url: 'choose-a-borrower',
					// eslint-disable-next-line
					queryParams: 'status=fundRaising&riskRating=0,5&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner'
				},
				{
					id: 37,
					url: 'choose-a-woman-borrower',
					// eslint-disable-next-line
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5&lenderTerm=0,18&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner'
				},
				{
					id: 38,
					url: 'choose-a-farmer',
					// eslint-disable-next-line
					queryParams: 'status=fundRaising&riskRating=0,5&lenderTerm=0,18&sector=1&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner'
				},
				{
					id: 40,
					url: 'foster-city',
					// eslint-disable-next-line
					queryParams: 'status=fundRaising&riskRating=0,5&state=CA&city_state=San Jose,CA&distributionModel=direct',
					algoliaParams: ''
				},
				{
					id: 43,
					url: 'super-power-a-woman-on-kiva',
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5&distributionModel=field_partner',
					algoliaParams: 'gender=female'
				},
				{
					id: 44,
					url: 'hitachi-employees-helping-to-ignite-a-dream',
					queryParams: 'status=fundRaising&riskRating=3,5&sector=1,14,15,6,10,8,3',
					algoliaParams: ''
				},
				{
					id: 45,
					url: 's-j-peninsula',
					// eslint-disable-next-line
					queryParams: 'status=fundRaising&riskRating=0,5&country=US&state=CA&city_state=San Jose,CA,Belmont,CA,Atherton,CA,Brisbane,CA,Burlingame,CA,Campbell,CA,Castro Valley,CA,Colma,CA,Cupertino,CA,Daly City,CA,East Palo Alto,CA,Foster City,CA,Fremont,CA,Gilroy,CA,Half Moon Bay,CA,Hayward,CA,Hillsborough,CA,La Honda,CA,Ladera,CA,Loma Mar,CA,Los Altos,CA,Los Altos Hills,CA,Los Gatos,CA,Menlo Park,CA,Millbrae,CA,Milpitas,CA,Monte Sereno,CA,Morgan Hill,CA,Mountain View,CA,Pacifica,CA,Palo Alto,CA,Pescadero,CA,Portola Valley,CA,Redwood City,CA,San Bruno,CA,San Carlos,CA,San Gregorio,CA,San Mateo,CA,Santa Clara,CA,Saratoga,CA,South San Francisco,CA,Sunnyvale,CA,Woodside,CA&distributionModel=direct'
				},
				{
					id: 49,
					url: 'choose-for-me',
					queryParams: 'status=fundRaising&riskRating=1,5&distributionModel=field_partner',
					algoliaParams: ''
				},
			]

		};
	}
};
