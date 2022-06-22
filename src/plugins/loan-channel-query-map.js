/* eslint-disable max-len */

export default {
	data() {
		return {
			loanChannelQueryMap: [

				// Lend Drop Down, Category Grid, + All Categories Page

				{
					id: 5,
					url: 'women',
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5',
					algoliaParams: 'gender=female',
					flssLoanSearchState: { gender: 'female' },
				},
				{
					id: 8,
					url: 'agriculture',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=1',
					algoliaParams: 'sector=Agriculture',
					flssLoanSearchState: { sector: [1] },
				},
				{
					id: 4,
					url: 'education',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=15',
					algoliaParams: 'sector=Education',
					flssLoanSearchState: { sector: [15] },
				},
				{
					id: 32,
					url: 'refugees-and-i-d-ps',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Refugees/Displaced',
					algoliaParams: 'attributes=Refugees%2FDisplaced',
					flssLoanSearchState: { theme: ['REFUGEES/DISPLACED'] },
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
					algoliaParams: 'countries=North%20America%20%3E%20United%20States',
					flssLoanSearchState: { countryIsoCode: ['US'] },
				},
				{
					id: 23,
					url: 'livestock',
					queryParams: 'status=fundRaising&riskRating=0,5&activity=73',
					// algoliaParams: '', // not supported pass exclude link
					fallbackUrl: '/lend?status=fundRaising&riskRating=0,5&activity=73&kexpn=lend_filter.lend_filter_versions&kexpv=c'
				},
				{
					id: 29,
					url: 'arts',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=9',
					algoliaParams: 'sector=Arts',
					flssLoanSearchState: { sector: [9] },
				},
				{
					id: 3,
					url: 'expiring-soon',
					queryParams: 'status=fundRaising&riskRating=0,5&expiringSoon=1',
					algoliaParams: 'sortBy=expiringSoon',
					flssLoanSearchState: { sortBy: 'expiringSoon' },
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
					algoliaParams: 'sector=Health',
					flssLoanSearchState: { sector: [6] },
				},
				{
					id: 12,
					url: 'food',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=12',
					algoliaParams: 'sector=Food',
					flssLoanSearchState: { sector: [12] },
				},
				{
					id: 31,
					url: 'water-and-sanitation',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Water and Sanitation',
					algoliaParams: 'attributes=Water%20and%20Sanitation',
					flssLoanSearchState: { theme: ['WATER AND SANITATION'] },
				},
				{
					id: 7,
					url: 'conflict-zones',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Conflict Zones',
					algoliaParams: 'attributes=Conflict%20Zones',
					flssLoanSearchState: { theme: ['CONFLICT ZONES'] },
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
					algoliaParams: 'sector=Housing',
					flssLoanSearchState: { sector: [10] },
				},
				{
					id: 33,
					url: 'mission-driven-orgs',
					queryParams: 'partner=510,503,131,186,173,249,200,228,350,485,482,498,525,547,523,532,539,540,542,552,565,568,570,575,586,495,530,546,589,497,501,511,516,518,492,587,545,531,566,585,508,513,573,580,581,555,536,486,594,592,345,491,505,500,502,509,512,520,526,529,591,494,524,506,496,517,489,490,515,535,548,556,577,583,315,558,593,514,553,560,569,571,534,543,557,563,258,418,574,538,567,561,408,218,544,281,466,305,397,437,225,390,493,521,356,198,480,369,469,295,311,417,301,379,274,317,285,62,175,40,358,578,361,477,392,528,576,365,211,479,483,330,389,292,415,403,412,263,431,275,376,342,468,446,461,451,445,449,452,465,458,459&riskRating=0,5&status=fundRaising&sortBy=popularity',
					fallbackUrl: '/lend?partner=510,503,131,186,173,249,200,228,350,485,482,498,525,547,523,532,539,540,542,552,565,568,570,575,586,495,530,546,589,497,501,511,516,518,492,587,545,531,566,585,508,513,573,580,581,555,536,486,594,592,345,491,505,500,502,509,512,520,526,529,591,494,524,506,496,517,489,490,515,535,548,556,577,583,315,558,593,514,553,560,569,571,534,543,557,563,258,418,574,538,567,561,408,218,544,281,466,305,397,437,225,390,493,521,356,198,480,369,469,295,311,417,301,379,274,317,285,62,175,40,358,578,361,477,392,528,576,365,211,479,483,330,389,292,415,403,412,263,431,275,376,342,468,446,461,451,445,449,452,465,458,459&riskRating=0,5&status=fundRaising&sortBy=popularity&kexpn=lend_filter.lend_filter_versions&kexpv=c',
				},
				{
					// id: 33,
					// This used to be Loan Channel id 33 but was changed. However, lenders still have this page
					// book marked and get redirected here so we have to map the url.
					// If the attribute/themeFilter is removed we'll need to update this redirect
					url: 'social-enterprises',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Social Enterprise',
					algoliaParams: 'attributes=Social%20Enterprise',
					flssLoanSearchState: { theme: ['SOCIAL ENTERPRISE'] },
				},
				{
					id: 13,
					url: 'retail-businesses',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=7',
					algoliaParams: 'sector=Retail',
					flssLoanSearchState: { sector: [7] },
				},
				{
					id: 17,
					url: 'men',
					queryParams: 'status=fundRaising&gender=male&riskRating=0,5',
					algoliaParams: 'gender=male',
					flssLoanSearchState: { gender: 'male' },
				},
				{
					id: 10,
					url: 'underbanked-areas',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Underfunded Areas',
					algoliaParams: 'attributes=Underfunded%20Areas',
					flssLoanSearchState: { theme: ['UNDERFUNDED AREAS'] },
				},
				{
					id: 16,
					url: 'transport',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=3',
					algoliaParams: 'sector=Transportation',
					flssLoanSearchState: { sector: [3] },
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
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Vulnerable Groups&distributionModel=field_partner',
					algoliaParams: 'attributes=Vulnerable%20Groups',
					flssLoanSearchState: { theme: ['VULNERABLE GROUPS'] },
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
					algoliaParams: 'gender=female',
					flssLoanSearchState: { gender: 'female' },
				},
				{
					id: 53,
					url: 'loans-for-education',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=15',
					algoliaParams: 'sector=Education',
					flssLoanSearchState: { sector: [15] },
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
					algoliaParams: 'sector=Agriculture',
					flssLoanSearchState: { sector: [1] },
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
					algoliaParams: 'attributes=Refugees%2FDisplaced',
					flssLoanSearchState: { theme: ['REFUGEES/DISPLACED'] },
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
					algoliaParams: 'sortBy=expiringSoon',
					flssLoanSearchState: { sortBy: 'expiringSoon' },
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
					algoliaParams: 'attributes=Clean%20Energy',
					flssLoanSearchState: { theme: ['CLEAN ENERGY'] },
				},
				{
					id: 66,
					url: 'lenders-like-you-supported-these-loans',
					queryParams: 'status=fundRaising&riskRating=0,5',
					algoliaParams: ''
				},
				{
					id: 68,
					url: 'loans-to-mission-driven-enterprises',
					queryParams: 'partner=510,503,131,186,173,249,200,228,350,485,482,498,525,547,523,532,539,540,542,552,565,568,570,575,586,495,530,546,589,497,501,511,516,518,492,587,545,531,566,585,508,513,573,580,581,555,536,486,594,592,345,491,505,500,502,509,512,520,526,529,591,494,524,506,496,517,489,490,515,535,548,556,577,583,315,558,593,514,553,560,569,571,534,543,557,563,258,418,574,538,567,561,408,218,544,281,466,305,397,437,225,390,493,521,356,198,480,369,469,295,311,417,301,379,274,317,285,62,175,40,358,578,361,477,392,528,576,365,211,479,483,330,389,292,415,403,412,263,431,275,376,342,468,446,461,451,445,449,452,465,458,459&riskRating=0,5&status=fundRaising&sortBy=popularity',
					fallbackUrl: '/lend?partner=510,503,131,186,173,249,200,228,350,485,482,498,525,547,523,532,539,540,542,552,565,568,570,575,586,495,530,546,589,497,501,511,516,518,492,587,545,531,566,585,508,513,573,580,581,555,536,486,594,592,345,491,505,500,502,509,512,520,526,529,591,494,524,506,496,517,489,490,515,535,548,556,577,583,315,558,593,514,553,560,569,571,534,543,557,563,258,418,574,538,567,561,408,218,544,281,466,305,397,437,225,390,493,521,356,198,480,369,469,295,311,417,301,379,274,317,285,62,175,40,358,578,361,477,392,528,576,365,211,479,483,330,389,292,415,403,412,263,431,275,376,342,468,446,461,451,445,449,452,465,458,459&riskRating=0,5&status=fundRaising&sortBy=popularity&kexpn=lend_filter.lend_filter_versions&kexpv=c'
				},
				{
					id: 69,
					url: 'world-refugee-day',
					queryParams: 'status=fundRaising&riskRating=0,5&theme=Refugees/Displaced',
					algoliaParams: 'attributes=Refugees%2FDisplaced',
					flssLoanSearchState: { theme: ['REFUGEES/DISPLACED'] },
				},

				// IWD 2020 Loan Channels
				// TODO: Complete legacy query param for each set (already added gender filter)
				// TODO: Create algolia filter mappings
				{
					id: 83,
					url: 'africa-loans',
					queryParams: 'country=mz,ug,sn,rw,ke,cd,lr,bf,cm,gh,tg,mg,ml,eg&distributionModel=field_partner&gender=female&riskRating=0,5&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&countries=Africa%20>%20Cameroon~Africa%20>%20Congo%20%28DRC%29~Africa%20>%20Egypt~Africa%20>%20Ghana~Africa%20>%20Kenya~Africa%20>%20Liberia~Africa%20>%20Madagascar~Africa%20>%20Mali~Africa%20>%20Mozambique~Africa%20>%20Nigeria~Africa%20>%20Rwanda~Africa%20>%20Senegal~Africa%20>%20Uganda&sortBy=popularity',
					flssLoanSearchState: { countryIsoCode: ['BF', 'CD', 'CM', 'EG', 'GH', 'KE', 'LR', 'MG', 'ML', 'MZ', 'RW', 'SN', 'TG', 'UG'], gender: 'female' },
				},
				{
					id: 84,
					url: 'asia-loans',
					queryParams: 'country=kh,tj,th,vn,ph,kg,id,pk&distributionModel=field_partner&gender=female&riskRating=0,5&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&countries=Asia%20>%20Cambodia~Asia%20>%20India~Asia%20>%20Kyrgyzstan~Asia%20>%20Nepal~Asia%20>%20Pakistan~Asia%20>%20Philippines~Asia%20>%20Tajikistan~Asia%20>%20Vietnam&sortBy=popularity',
					flssLoanSearchState: { countryIsoCode: ['KH', 'TJ', 'TH', 'VN', 'PH', 'KG', 'ID', 'PK'], gender: 'female' },
				},
				{
					id: 85,
					url: 'latin-america-loans',
					queryParams: 'country=bo,gt,py,ni,hn,pe,cr,pa,ec,co,sv,mx,br&distributionModel=field_partner&gender=female&riskRating=0,5&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&countries=North%20America%20>%20Mexico~South%20America%20>%20Bolivia~South%20America%20>%20Brazil~South%20America%20>%20Colombia~South%20America%20>%20Ecuador~South%20America%20>%20Paraguay~South%20America%20>%20Peru~Central%20America%20>%20Costa%20Rica~Central%20America%20>%20El%20Salvador~Central%20America%20>%20Guatemala~Central%20America%20>%20Honduras~Central%20America%20>%20Nicaragua~North%20America%20>%20Dominican%20Republic&sortBy=popularity',
					flssLoanSearchState: { countryIsoCode: ['BO', 'GT', 'PY', 'NI', 'HN', 'PE', 'CR', 'PA', 'EC', 'CO', 'SV', 'MX', 'BR'], gender: 'female' },
				},
				{
					id: 86,
					url: 'united-states-loans',
					queryParams: 'country=us&distributionModel=field_partner&gender=female&riskRating=0,5&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&countries=North%20America%20>%20United%20States&sortBy=popularity',
					flssLoanSearchState: { countryIsoCode: ['US'], gender: 'female' },
				},
				{
					id: 87,
					url: 'agriculture-loans',
					queryParams: 'distributionModel=field_partner&gender=female&riskRating=0,5&sector=1&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Agriculture&sortBy=popularity',
					flssLoanSearchState: { sector: [1], gender: 'female' },
				},
				{
					id: 88,
					url: 'education-loans',
					queryParams: 'distributionModel=field_partner&gender=female&riskRating=0,5&sector=15&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Education&sortBy=popularity',
					flssLoanSearchState: { sector: [15], gender: 'female' },
				},
				{
					id: 89,
					url: 'arts-loans',
					queryParams: 'distributionModel=field_partner&gender=female&riskRating=0,5&sector=9&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Arts&sortBy=popularity',
					flssLoanSearchState: { sector: [9], gender: 'female' },
				},
				{
					id: 90,
					url: 'eco-friendly-loans',
					queryParams: 'distributionModel=field_partner&gender=female&tag=9&riskRating=0,5&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&tags=%23Eco-friendly&sortBy=popularity'
				},
				{
					id: 92,
					url: 'food-loans',
					queryParams: 'distributionModel=field_partner&gender=female&riskRating=0,5&sector=12&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Food&sortBy=popularity',
					flssLoanSearchState: { sector: [12], gender: 'female' },
				},
				{
					id: 93,
					url: 'shelter-loans',
					queryParams: 'distributionModel=field_partner&gender=female&riskRating=0,5&sector=10&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Housing&sortBy=popularity',
					flssLoanSearchState: { sector: [10], gender: 'female' },
				},
				{
					id: 94,
					url: 'retail-loans',
					queryParams: 'distributionModel=field_partner&gender=female&riskRating=0,5&sector=7&status=fundRaising&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Retail&sortBy=popularity',
					flssLoanSearchState: { sector: [7], gender: 'female' },
				},

				// Misc Promotional or Unsupported URLS

				{
					id: 96,
					url: 'covid-19',
					// queryParams are from initial Loan Channel setup on 4.27.2020 around 3pm
					queryParams: 'distributionModel=both&riskRating=0,5&sector=1,9,5,14,17,12,6,8,7,4,3,13&status=fundRaising&attribute=5,6,7,8,9,10,11,12,13,14,15,17,20,24,28,29&sortBy=popularity',
					// this will cause legacy lend to load up and apply all params for the Loan Channel
					fallbackUrl: '/lend/covid-19?filter=bypass',
					flssLoanSearchState: { sector: [1, 9, 5, 14, 17, 12, 6, 8, 7, 4, 3, 13], theme: ['ISLAMIC FINANCE', 'YOUTH', 'START-UP', 'WATER AND SANITATION', 'VULNERABLE GROUPS', 'FAIR TRADE', 'RURAL EXCLUSION', 'MOBILE TECHNOLOGY', 'UNDERFUNDED AREAS', 'CONFLICT ZONES', 'JOB CREATION', 'GROWING BUSINESSES', 'DISASTER RECOVERY', 'INNOVATIVE LOANS', 'REFUGEES/DISPLACED', 'SOCIAL ENTERPRISE'] },
				},
				{
					id: 97,
					url: 'hitachi-employees-helping-c-o-v-i-d-impacted-businesses',
					// queryParams are from initial Loan Channel setup on 5.3.2020
					queryParams: 'dafEligible=true&loanLimit=25&sector=1,9,5,14,17,12,8,7,4,3,13&distributionModel=field_partner&noTrustee=true&sortBy=popularity',
					// this will cause legacy lend to load up and apply all params for the Loan Channel
					fallbackUrl: '/lend/hitachi-employees-helping-c-o-v-i-d-impacted-businesses?filter=bypass'
				},
				{
					id: 98,
					url: 'crisis-support-loans',
					// queryParams are from initial Loan Channel setup on 5.06.2020
					queryParams: 'status=fundRaising&riskRating=0,5&attribute=36&distributionModel=field_partner',
					// this will cause legacy lend to load up and apply all params for the Loan Channel
					// fallbackUrl: '/lend/crisis-support-loans?filter=bypass'
					algoliaParams: 'attributes=Crisis%20Support%20Loans&sortBy=popularity',
					flssLoanSearchState: { theme: ['CRISIS SUPPORT LOANS'] },
				},
				{
					id: 65,
					url: 'new-countries-for-you',
					queryParams: 'status=fundRaising&riskRating=0,5&distributionModel=field_partner',
					algoliaParams: ''
				},
				{
					id: 34,
					url: 'international-womens-day',
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5&matcherAccountId=983080,1192165,1487001,1547025,1783302,1783306,200109699,1405273,1440573,200274423,200284350,200284401,200284457,200284479,200284527,200284590,200285893,200285953,200356175,200363459,200365421,200406544,200408698,200431116,200443753,200444376,200449836,200449840,200575794,200585420,200588036,200588040,200588046,200595120,200597351,200644733,200647826,200648416,200672970,200677916,200687225,200708242,200748961,200751611,200751613,200751617,200751620,200751622,200751624,200751625,200801939,200810767,200810779,200818085,200852356,200880528,200880531,200880537,200957091,201008230,201024089,201028457'
				},
				{
					id: 48,
					url: 'human-flow-fund-support-refugees-and-i-d-ps',
					queryParams: 'status=fundRaising&riskRating=0,5&sector=1,9,5,14,12,8,7,4,3,13&theme=Conflict Zones,Refugees/Displaced&distributionModel=field_partner',
					flssLoanSearchState: { sector: [1, 9, 5, 14, 12, 8, 7, 4, 3, 13], theme: ['CONFLICT ZONES', 'REFUGEES/DISPLACED'] },
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
					queryParams: 'status=fundRaising&riskRating=0,5&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner'
				},
				{
					id: 37,
					url: 'choose-a-woman-borrower',
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5&lenderTerm=0,18&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner'
				},
				{
					id: 38,
					url: 'choose-a-farmer',
					queryParams: 'status=fundRaising&riskRating=0,5&lenderTerm=0,18&sector=1&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner'
				},
				{
					id: 40,
					url: 'foster-city',
					queryParams: 'status=fundRaising&riskRating=0,5&state=CA&city_state=San Jose,CA&distributionModel=direct',
					algoliaParams: ''
				},
				{
					id: 43,
					url: 'super-power-a-woman-on-kiva',
					queryParams: 'status=fundRaising&gender=female&riskRating=0,5&distributionModel=field_partner',
					algoliaParams: 'gender=female',
					flssLoanSearchState: { gender: 'female' },
				},
				{
					id: 44,
					url: 'hitachi-employees-helping-to-ignite-a-dream',
					queryParams: 'status=fundRaising&riskRating=3,5&sector=1,14,15,6,10,8,3',
					algoliaParams: '',
					flssLoanSearchState: { sector: [1, 9, 5, 14, 17, 12, 6, 8, 7, 4, 3, 13], theme: ['ISLAMIC FINANCE', 'YOUTH', 'START-UP', 'WATER AND SANITATION', 'VULNERABLE GROUPS', 'FAIR TRADE', 'RURAL EXCLUSION', 'MOBILE TECHNOLOGY', 'UNDERFUNDED AREAS', 'CONFLICT ZONES', 'JOB CREATION', 'GROWING BUSINESSES', 'DISASTER RECOVERY', 'INNOVATIVE LOANS', 'REFUGEES/DISPLACED', 'SOCIAL ENTERPRISE', 'CRISIS SUPPORT LOANS'] },
				},
				{
					id: 45,
					url: 's-j-peninsula',
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
