/* eslint-disable max-len */
import { createMinMaxRange } from '@/util/loanSearch/minMaxRange';

export default {
	data() {
		return {
			loanChannelQueryMap: [

				// Lend Drop Down, Category Grid, + All Categories Page

				{
					id: 5,
					url: 'women',
					queryParams: 'status=fundRaising&gender=female',
					algoliaParams: 'gender=female',
					flssLoanSearch: {
						gender: 'female'
					},
				},
				{
					id: 8,
					url: 'agriculture',
					queryParams: 'status=fundRaising&sector=1',
					algoliaParams: 'sector=Agriculture',
					flssLoanSearch: {
						sectorId: [1]
					},
				},
				{
					id: 4,
					url: 'education',
					queryParams: 'status=fundRaising&sector=15',
					algoliaParams: 'sector=Education',
					flssLoanSearch: {
						sectorId: [15]
					},
				},
				{
					id: 32,
					url: 'refugees-and-i-d-ps',
					queryParams: 'status=fundRaising&theme=Refugees/Displaced',
					algoliaParams: 'attributes=Refugees%2FDisplaced',
					flssLoanSearch: {
						themeId: [28]
					},
				},
				{
					id: 18,
					url: 'eco-friendly',
					queryParams: 'status=fundRaising&loanTags=9,8',
					algoliaParams: 'tags=%23Eco-friendly~%23Sustainable%20Ag',
					flssLoanSearch: {
						tagId: [9, 8]
					}
				},
				{
					id: 28,
					url: 'kiva-u-s',
					queryParams: 'status=fundRaising&country=US,GU,VI,PR&distributionModel=direct',
					algoliaParams: 'countries=North%20America%20%3E%20United%20States',
					flssLoanSearch: {
						countryIsoCode: ['US', 'GU', 'VI', 'PR'],
						distributionModel: 'DIRECT'
					},
				},
				{
					id: 23,
					url: 'livestock',
					queryParams: 'status=fundRaising&activity=73',
					// algoliaParams: '', // not supported pass exclude link
					fallbackUrl: '/lend?status=fundRaising&activity=73',
					flssLoanSearch: {
						activityId: [73]
					}
				},
				{
					id: 29,
					url: 'arts',
					queryParams: 'status=fundRaising&sector=9',
					algoliaParams: 'sector=Arts',
					flssLoanSearch: {
						sectorId: [9]
					},
				},
				{
					id: 3,
					url: 'ending-soon',
					queryParams: 'status=fundRaising&expiringSoon=1&sortBy=expiringSoon',
					algoliaParams: 'sortBy=expiringSoon',
					flssLoanSearch: {
						sortBy: 'expiringSoon'
					},
				},
				{
					id: 26,
					url: 'single-parents',
					queryParams: 'status=fundRaising&loanTags=17',
					algoliaParams: 'tags=%23Single%20Parent',
					flssLoanSearch: {
						tagId: [17]
					}
				},
				{
					id: 25,
					url: 'health',
					queryParams: 'status=fundRaising&sector=6',
					algoliaParams: 'sector=Health',
					flssLoanSearch: {
						sectorId: [6]
					},
				},
				{
					id: 12,
					url: 'food',
					queryParams: 'status=fundRaising&sector=12',
					algoliaParams: 'sector=Food',
					flssLoanSearch: {
						sectorId: [12]
					},
				},
				{
					id: 31,
					url: 'water-and-sanitation',
					queryParams: 'status=fundRaising&theme=Water and Sanitation',
					algoliaParams: 'attributes=Water%20and%20Sanitation',
					flssLoanSearch: {
						themeId: [8]
					},
				},
				{
					id: 7,
					url: 'conflict-zones',
					queryParams: 'status=fundRaising&theme=Conflict Zones',
					algoliaParams: 'attributes=Conflict%20Zones',
					flssLoanSearch: {
						themeId: [14]
					},
				},
				{
					id: 11,
					url: 'short-term-loans',
					queryParams: 'status=fundRaising&lenderTerm=0,16',
					algoliaParams: 'repayment=%3A16',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 16)
					},
				},
				{
					id: 6,
					url: 'shelter',
					queryParams: 'status=fundRaising&sector=10',
					algoliaParams: 'sector=Housing',
					flssLoanSearch: {
						sectorId: [10]
					},
				},
				{
					id: 33,
					url: 'mission-driven-orgs',
					queryParams: 'partner=62,630,198,225,229,229,263,274,275,285,292,295,301,311,317,342,358,361,369,376,389,390,412,415,417,431,441,446,449,451,452,458,459,461,466,468,472,482,483,486,489,490,491,492,493,494,496,497,498,500,501,502,503,505,506,508,509,510,511,512,513,514,515,516,517,520,521,523,524,525,529,530,531,532,534,535,536,538,539,540,542,543,544,545,546,548,552,553,555,556,557,558,560,561,563,565,566,567,568,569,570,571,573,575,577,578,579,580,581,583,584,585,586,587,591,592,593,595,597,598,599,600,601,602,603,604,608,610,612,613,614,656,617,618&status=fundRaising&sortBy=popularity',
					fallbackUrl: '/lend?partner=62,630,198,225,229,229,263,274,275,285,292,295,301,311,317,342,358,361,369,376,389,390,412,415,417,431,441,446,449,451,452,458,459,461,466,468,472,482,483,486,489,490,491,492,493,494,496,497,498,500,501,502,503,505,506,508,509,510,511,512,513,514,515,516,517,520,521,523,524,525,529,530,531,532,534,535,536,538,539,540,542,543,544,545,546,548,552,553,555,556,557,558,560,561,563,565,566,567,568,569,570,571,573,575,577,578,579,580,581,583,584,585,586,587,591,592,593,595,597,598,599,600,601,602,603,604,608,610,612,613,614,656,617,618&status=fundRaising&sortBy=popularity',
					flssLoanSearch: {
						partnerId: [62, 630, 198, 225, 229, 263, 274, 275, 285, 292, 295, 301, 311, 317, 342, 358, 361, 369, 376, 389, 390, 412, 415, 417, 431, 441, 446, 449, 451, 452, 458, 459, 461, 466, 468, 472, 482, 483, 486, 489, 490, 491, 492, 493, 494, 496, 497, 498, 500, 501, 502, 503, 505, 506, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 520, 521, 523, 524, 525, 529, 530, 531, 532, 534, 535, 536, 538, 539, 540, 542, 543, 544, 545, 546, 548, 552, 553, 555, 556, 557, 558, 560, 561, 563, 565, 566, 567, 568, 569, 570, 571, 573, 575, 577, 578, 579, 580, 581, 583, 584, 585, 586, 587, 591, 592, 593, 595, 597, 598, 599, 600, 601, 602, 603, 604, 608, 610, 612, 613, 614, 656, 617, 618],
						sortBy: 'popularityScore',
					},
				},
				{
					// id: 33,
					// This used to be Loan Channel id 33 but was changed. However, lenders still have this page
					// book marked and get redirected here so we have to map the url.
					// If the attribute/themeFilter is removed we'll need to update this redirect
					id: 158,
					url: 'social-enterprises',
					queryParams: 'status=fundRaising&theme=Social Enterprise',
					algoliaParams: 'attributes=Social%20Enterprise',
					flssLoanSearch: {
						themeId: [29]
					},
				},
				{
					id: 13,
					url: 'retail-businesses',
					queryParams: 'status=fundRaising&sector=7',
					algoliaParams: 'sector=Retail',
					flssLoanSearch: {
						sectorId: [7]
					},
				},
				{
					id: 17,
					url: 'men',
					queryParams: 'status=fundRaising&gender=male',
					algoliaParams: 'gender=male',
					flssLoanSearch: {
						gender: 'male'
					},
				},
				{
					id: 10,
					url: 'underbanked-areas',
					queryParams: 'status=fundRaising&theme=Underfunded Areas',
					algoliaParams: 'attributes=Underfunded%20Areas',
					flssLoanSearch: {
						themeId: [13]
					},
				},
				{
					id: 16,
					url: 'transport',
					queryParams: 'status=fundRaising&sector=3',
					algoliaParams: 'sector=Transportation',
					flssLoanSearch: {
						sectorId: [3]
					},
				},
				{
					id: 14,
					url: 'groups',
					queryParams: 'status=fundRaising&isGroup=1',
					algoliaParams: '', // not support show exit link
					flssLoanSearch: {
						isIndividual: false
					},
				},
				{
					id: 1,
					url: 'vulnerable-populations',
					queryParams: 'status=fundRaising&theme=Vulnerable Groups&distributionModel=field_partner',
					algoliaParams: 'attributes=Vulnerable%20Groups',
					flssLoanSearch: {
						themeId: [9],
						distributionModel: 'FIELDPARTNER'
					},
				},

				// Lend By Category Channels

				{
					id: 67,
					url: 'loans-to-single-parents',
					queryParams: 'status=fundRaising&loanTags=17',
					algoliaParams: 'tags=%23Single%20Parent',
					flssLoanSearch: {
						tagId: [17]
					}
				},
				{
					id: 52,
					url: 'loans-to-women',
					queryParams: 'status=fundRaising&gender=female',
					algoliaParams: 'gender=female',
					flssLoanSearch: {
						gender: 'female'
					},
				},
				{
					id: 53,
					url: 'loans-for-education',
					queryParams: 'status=fundRaising&sector=15',
					algoliaParams: 'sector=Education',
					flssLoanSearch: {
						sectorId: [15]
					},
				},
				{
					id: 54,
					url: 'trending-now',
					queryParams: 'status=fundRaising',
					algoliaParams: '',
				},
				{
					id: 55,
					url: 'loans-to-farmers',
					queryParams: 'status=fundRaising&sector=1',
					algoliaParams: 'sector=Agriculture',
					flssLoanSearch: {
						sectorId: [1]
					},
				},
				{
					id: 56,
					url: 'loans-with-research-backed-impact',
					queryParams: 'status=fundRaising',
					algoliaParams: '',
				},
				{
					id: 57,
					url: 'loans-to-refugees-and-i-d-ps',
					queryParams: 'status=fundRaising&theme=Refugees/Displaced',
					algoliaParams: 'attributes=Refugees%2FDisplaced',
					flssLoanSearch: {
						themeId: [28]
					},
				},
				{
					id: 58,
					url: 'eco-friendly-loans',
					queryParams: 'status=fundRaising&loanTags=9',
					algoliaParams: 'tags=%23Eco-friendly~%23Sustainable%20Ag',
					flssLoanSearch: {
						tagId: [9]
					}
				},
				{
					id: 59,
					url: 'loans-that-are-ending-soon',
					queryParams: 'status=fundRaising&sortBy=expiringSoon',
					algoliaParams: 'sortBy=expiringSoon',
					flssLoanSearch: {
						sortBy: 'expiringSoon'
					},
				},
				{
					id: 60,
					url: 'loans-that-are-almost-funded',
					queryParams: 'status=fundRaising&sortBy=amountLeft',
					algoliaParams: 'sortBy=amountLeft',
					flssLoanSearch: {
						sortBy: 'amountLeft'
					}
				},
				{
					id: 63,
					url: 'loans-for-clean-energy',
					queryParams: 'status=fundRaising&theme=Clean Energy',
					algoliaParams: 'attributes=Clean%20Energy',
					flssLoanSearch: {
						themeId: [32]
					},
				},
				{
					id: 66,
					url: 'lenders-like-you-supported-these-loans',
					queryParams: 'status=fundRaising',
					algoliaParams: '',
				},
				{
					id: 68,
					url: 'loans-to-mission-driven-enterprises',
					queryParams: 'status=fundRaising&partner=62,630,198,225,229,263,274,275,285,292,295,301,311,317,342,358,361,369,376,389,390,412,415,417,431,441,446,449,451,452,458,459,461,466,468,472,482,483,486,489,490,491,492,493,494,496,497,498,500,501,502,503,505,506,508,509,510,511,512,513,514,515,516,517,520,521,523,524,525,529,530,531,532,534,535,536,538,539,540,542,543,544,545,546,548,552,553,555,556,557,558,560,561,563,565,566,567,568,569,570,571,573,575,577,578,579,580,581,583,584,585,586,587,591,592,593,595,597,598,599,600,601,602,603,604,608,610,612,613,614,656,617,618&sortBy=popularity',
					fallbackUrl: '/lend?partner=62,630,198,225,229,263,274,275,285,292,295,301,311,317,342,358,361,369,376,389,390,412,415,417,431,441,446,449,451,452,458,459,461,466,468,472,482,483,486,489,490,491,492,493,494,496,497,498,500,501,502,503,505,506,508,509,510,511,512,513,514,515,516,517,520,521,523,524,525,529,530,531,532,534,535,536,538,539,540,542,543,544,545,546,548,552,553,555,556,557,558,560,561,563,565,566,567,568,569,570,571,573,575,577,578,579,580,581,583,584,585,586,587,591,592,593,595,597,598,599,600,601,602,603,604,608,610,612,613,614,656,617,618&status=fundRaising&sortBy=popularity',
					flssLoanSearch: {
						partnerId: [62, 630, 198, 225, 229, 263, 274, 275, 285, 292, 295, 301, 311, 317, 342, 358, 361, 369, 376, 389, 390, 412, 415, 417, 431, 441, 446, 449, 451, 452, 458, 459, 461, 466, 468, 472, 482, 483, 486, 489, 490, 491, 492, 493, 494, 496, 497, 498, 500, 501, 502, 503, 505, 506, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 520, 521, 523, 524, 525, 529, 530, 531, 532, 534, 535, 536, 538, 539, 540, 542, 543, 544, 545, 546, 548, 552, 553, 555, 556, 557, 558, 560, 561, 563, 565, 566, 567, 568, 569, 570, 571, 573, 575, 577, 578, 579, 580, 581, 583, 584, 585, 586, 587, 591, 592, 593, 595, 597, 598, 599, 600, 601, 602, 603, 604, 608, 610, 612, 613, 614, 656, 617, 618],
						sortBy: 'popularityScore',
					},
				},
				{
					id: 69,
					url: 'world-refugee-day',
					queryParams: 'status=fundRaising&theme=Refugees/Displaced&distributionModel=field_partner',
					algoliaParams: 'attributes=Refugees%2FDisplaced',
					flssLoanSearch: {
						themeId: [28],
						distributionModel: 'FIELDPARTNER'
					},
				},
				{
					id: 70,
					url: 'loans-to-u-s-small-businesses',
					queryParams: 'status=fundRaising&country=US,GU,VI,PR',
					flssLoanSearch: {
						countryIsoCode: ['US', 'GU', 'VI', 'PR']
					},
				},
				{
					id: 71,
					url: 'loans-for-livestock',
					queryParams: 'status=fundRaising&activity=73',
					flssLoanSearch: {
						activityId: [73],
					},
				},
				{
					id: 72,
					url: 'loans-to-artisans',
					queryParams: 'status=fundRaising&sector=9',
					flssLoanSearch: {
						sectorId: [9]
					},
				},
				{
					id: 73,
					url: 'loans-for-shelter',
					queryParams: 'status=fundRaising&sector=10',
					flssLoanSearch: {
						sectorId: [10]
					},
				},
				{
					id: 74,
					url: 'loans-for-food-producers',
					queryParams: 'status=fundRaising&sector=12',
					flssLoanSearch: {
						sectorId: [12]
					},
				},
				{
					id: 75,
					url: 'loans-to-underbanked-areas',
					queryParams: 'status=fundRaising&theme=Underfunded Areas',
					flssLoanSearch: {
						themeId: [13]
					},
				},
				{
					id: 76,
					url: 'loans-for-healthcare',
					queryParams: 'status=fundRaising&sector=6',
					flssLoanSearch: {
						sectorId: [6]
					},
				},
				{
					id: 77,
					url: 'loans-for-retail-businesses',
					queryParams: 'status=fundRaising&sector=7',
					flssLoanSearch: {
						sectorId: [7]
					},
				},
				{
					id: 78,
					url: 'loans-for-water-and-sanitation',
					queryParams: 'status=fundRaising&theme=Water and Sanitation',
					flssLoanSearch: {
						themeId: [8]
					},
				},
				{
					id: 79,
					url: 'group-loans',
					queryParams: 'status=fundRaising&isGroup=1',
					flssLoanSearch: {
						isIndividual: false
					},
				},

				// Lend By Category Carousel Layout Sub Channels
				// 	ACK-357 Experiment
				{
					id: 116,
					url: 'solar-energy',
					queryParams: 'status=fundRaising&loanTags=9',
					flssLoanSearch: {
						tagId: [9]
					},
				},
				{
					id: 117,
					url: 'sustainable-agriculture',
					queryParams: 'status=fundRaising&sector=1&loanTags=8&sortBy=amountLeft',
					flssLoanSearch: {
						sectorId: [1],
						tagId: [8]
					},
				},
				{
					id: 118,
					url: 'recycle-and-re-use',
					queryParams: 'status=fundRaising&loanTags=9',
					flssLoanSearch: {
						tagId: [9],
					},
				},
				{
					id: 119,
					url: 'other-eco-friendly-loans',
					queryParams: 'status=fundRaising&loanTags=9,8',
					flssLoanSearch: {
						tagId: [8, 9]
					},
				},

				// IWD 2020 Loan Channels
				// TODO: Complete legacy query param for each set (already added gender filter)
				{
					id: 80,
					url: '1-billion-to-women',
					queryParams: 'status=fundRaising&gender=female&distributionModel=field_partner',
					flssLoanSearch: {
						gender: 'female',
						distributionModel: 'FIELDPARTNER'
					},
				},
				{
					id: 83,
					url: 'africa-loans',
					queryParams: 'status=fundRaising&gender=female&country=MZ,UG,SN,RW,KE,CD,LR,BF,CM,GH,TG,MG,ML,EG&distributionModel=field_partner',
					algoliaParams: 'gender=female&countries=Africa%20>%20Cameroon~Africa%20>%20Congo%20%28DRC%29~Africa%20>%20Egypt~Africa%20>%20Ghana~Africa%20>%20Kenya~Africa%20>%20Liberia~Africa%20>%20Madagascar~Africa%20>%20Mali~Africa%20>%20Mozambique~Africa%20>%20Nigeria~Africa%20>%20Rwanda~Africa%20>%20Senegal~Africa%20>%20Uganda&sortBy=popularity',
					flssLoanSearch: {
						countryIsoCode: ['BF', 'CD', 'CM', 'EG', 'GH', 'KE', 'LR', 'MG', 'ML', 'MZ', 'RW', 'SN', 'TG', 'UG'],
						gender: 'female',
						distributionModel: 'FIELDPARTNER'
					},
				},
				{
					id: 84,
					url: 'asia-loans',
					queryParams: 'status=fundRaising&gender=female&country=KH,TJ,TH,VN,PH,KG,IN,ID,PK&distributionModel=field_partner',
					algoliaParams: 'gender=female&countries=Asia%20>%20Cambodia~Asia%20>%20India~Asia%20>%20Kyrgyzstan~Asia%20>%20Nepal~Asia%20>%20Pakistan~Asia%20>%20Philippines~Asia%20>%20Tajikistan~Asia%20>%20Vietnam&sortBy=popularity',
					flssLoanSearch: {
						countryIsoCode: ['KH', 'TJ', 'TH', 'VN', 'PH', 'KG', 'ID', 'PK'],
						gender: 'female',
						distributionModel: 'FIELDPARTNER',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 85,
					url: 'latin-america-loans',
					queryParams: 'status=fundRaising&gender=female&country=BO,GT,PY,NI,HN,PE,CR,PA,EC,CO,SV,MX,BR&distributionModel=field_partner',
					algoliaParams: 'gender=female&countries=North%20America%20>%20Mexico~South%20America%20>%20Bolivia~South%20America%20>%20Brazil~South%20America%20>%20Colombia~South%20America%20>%20Ecuador~South%20America%20>%20Paraguay~South%20America%20>%20Peru~Central%20America%20>%20Costa%20Rica~Central%20America%20>%20El%20Salvador~Central%20America%20>%20Guatemala~Central%20America%20>%20Honduras~Central%20America%20>%20Nicaragua~North%20America%20>%20Dominican%20Republic&sortBy=popularity',
					flssLoanSearch: {
						countryIsoCode: ['BO', 'GT', 'PY', 'NI', 'HN', 'PE', 'CR', 'PA', 'EC', 'CO', 'SV', 'MX', 'BR'],
						gender: 'female',
						distributionModel: 'FIELDPARTNER',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 86,
					url: 'united-states-loans',
					queryParams: 'status=fundRaising&gender=female&country=US,GU,VI,PR&distributionModel=direct',
					algoliaParams: 'gender=female&countries=North%20America%20>%20United%20States&sortBy=popularity',
					flssLoanSearch: {
						countryIsoCode: ['US', 'GU', 'VI', 'PR'],
						gender: 'female',
						distributionModel: 'DIRECT',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 87,
					url: 'agriculture-loans-for-women',
					queryParams: 'status=fundRaising&gender=female&sector=1',
					algoliaParams: 'gender=female&sector=Agriculture&sortBy=popularity',
					flssLoanSearch: {
						sectorId: [1],
						gender: 'female',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 88,
					url: 'education-loans-for-women',
					queryParams: 'status=fundRaising&gender=female&sector=15',
					algoliaParams: 'gender=female&sector=Education&sortBy=popularity',
					flssLoanSearch: {
						sectorId: [15],
						gender: 'female',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 89,
					url: 'arts-loans-for-women',
					queryParams: 'status=fundRaising&gender=female&sector=9',
					algoliaParams: 'gender=female&sector=Arts&sortBy=popularity',
					flssLoanSearch: {
						sectorId: [9],
						gender: 'female',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 90,
					url: 'ecofriendly-loans',
					queryParams: 'status=fundRaising&gender=female&loanTags=9',
					algoliaParams: 'gender=female&tags=%23Eco-friendly&sortBy=popularity',
					flssLoanSearch: {
						gender: 'female',
						tagId: [9],
						sortBy: 'popularityScore',
					}
				},
				{
					id: 91,
					url: 'ecofriendlyloans',
					queryParams: 'status=fundRaising&gender=female&loanTags=9',
					algoliaParams: 'gender=female&tags=%23Eco-friendly&sortBy=popularity',
					flssLoanSearch: {
						gender: 'female',
						tagId: [9],
						sortBy: 'popularityScore',
					}
				},
				{
					id: 92,
					url: 'food-loans',
					queryParams: 'status=fundRaising&gender=female&sector=12&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Food&sortBy=popularity',
					flssLoanSearch: {
						sectorId: [12],
						gender: 'female',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 93,
					url: 'shelter-loans',
					queryParams: 'status=fundRaising&gender=female&sector=10&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Housing&sortBy=popularity',
					flssLoanSearch: {
						sectorId: [10],
						gender: 'female',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 94,
					url: 'retail-loans',
					queryParams: 'status=fundRaising&gender=female&sector=7&sortBy=popularity',
					algoliaParams: 'gender=female&sector=Retail&sortBy=popularity',
					flssLoanSearch: {
						sectorId: [7],
						gender: 'female',
						sortBy: 'popularityScore',
					},
				},

				// Location specific categories
				{
					id: 130,
					url: 'agriculture-loans-in-the-middle-east',
					queryParams: 'status=fundRaising&country=JO,PS,IL,TR&sector=1',
					flssLoanSearch: {
						sectorId: [1],
						countryIsoCode: ['JO', 'PS', 'IL', 'TR'],
					},
				},
				{
					id: 131,
					url: 'agriculture-loans-in-oceania',
					queryParams: 'status=fundRaising&country=WS,TL,SB,TO,FJ,PG,VU,GU&sector=1',
					flssLoanSearch: {
						sectorId: [1],
						countryIsoCode: ['WS', 'TL', 'SB', 'TO', 'FJ', 'PG', 'VU', 'GU'],
					},
				},
				{
					id: 132,
					url: 'conflict-zone-loans-ending-soon',
					queryParams: 'status=fundRaising&expiringSoon=1&theme=Conflict Zones&sortBy=expiringSoon',
					flssLoanSearch: {
						themeId: [14],
						sortBy: 'expiringSoon'
					},
				},
				{
					id: 133,
					url: 'conflict-zone-loans-that-are-almost-funded',
					queryParams: 'status=fundRaising&theme=Conflict Zones&sortBy=amountLeft',
					flssLoanSearch: {
						themeId: [14],
						sortBy: 'amountLeft'
					},
				},
				{
					id: 134,
					url: 'african-conflict-zones',
					queryParams: 'status=fundRaising&country=MZ,UG,TZ,SN,RW,KE,CD,LR,SL,BF,CM,GH,TG,MG,MW,ZM,ML,EG,LS,ZA,BI,SS,ZW,NA&theme=Conflict Zones',
					flssLoanSearch: {
						themeId: [14],
						countryIsoCode: ['MZ', 'UG', 'TZ', 'SN', 'RW', 'KE', 'CD', 'LR', 'SL', 'BF', 'CM', 'GH', 'TG', 'MG', 'MW', 'ZM', 'ML', 'EG', 'LS', 'ZA', 'BI', 'SS', 'ZW', 'NA'],
					},
				},
				{
					id: 135,
					url: 'latin-american-conflict-zones',
					queryParams: 'status=fundRaising&country=DO,BO,GT,PY,HN,PE,CR,PA,EC,CO,SV,NI,MX,BR,CL,HT,BZ,PR,VI&theme=Conflict Zones',
					flssLoanSearch: {
						themeId: [14],
						countryIsoCode: ['DO', 'BO', 'GT', 'PY', 'HN', 'PE', 'CR', 'PA', 'EC', 'CO', 'SV', 'NI', 'MX', 'BR', 'CL', 'HT', 'BZ', 'PR', 'VI'],
					},
				},
				{
					id: 136,
					url: 'middle-eastern-conflict-zones',
					queryParams: 'status=fundRaising&country=JO,PS,IL,TR&theme=Conflict Zones',
					flssLoanSearch: {
						themeId: [14],
						countryIsoCode: ['JO', 'PS', 'IL', 'TR'],
					},
				},
				{
					id: 137,
					url: 'refugee-and-i-d-p-loans-ending-soon',
					queryParams: 'status=fundRaising&expiringSoon=1&theme=Refugees/Displaced&sortBy=expiringSoon',
					flssLoanSearch: {
						themeId: [28],
						sortBy: 'expiringSoon'
					},
				},
				{
					id: 138,
					url: 'refugee-and-i-d-p-loans-that-are-almost-funded',
					queryParams: 'status=fundRaising&theme=Refugees/Displaced&sortBy=amountLeft',
					flssLoanSearch: {
						themeId: [28],
						sortBy: 'amountLeft'
					},
				},
				{
					id: 139,
					url: 'refugee-and-i-d-ps-in-latin-america',
					queryParams: 'status=fundRaising&country=DO,BO,GT,PY,HN,PE,CR,PA,EC,CO,SV,NI,MX,BR,CL,HT,BZ,PR,VI&theme=Refugees/Displaced',
					flssLoanSearch: {
						themeId: [28],
						countryIsoCode: ['DO', 'BO', 'GT', 'PY', 'HN', 'PE', 'CR', 'PA', 'EC', 'CO', 'SV', 'NI', 'MX', 'BR', 'CL', 'HT', 'BZ', 'PR', 'VI'],
					},
				},
				{
					id: 140,
					url: 'refugee-and-i-d-ps-in-the-middle-east',
					queryParams: 'status=fundRaising&country=JO,PS,IL,TR&theme=Refugees/Displaced',
					flssLoanSearch: {
						themeId: [28],
						countryIsoCode: ['JO', 'PS', 'IL', 'TR'],
					},
				},
				{
					id: 141,
					url: 'responsible-water-collection-and-storage',
					queryParams: 'status=fundRaising&distributionModel=field_partner',
					flssLoanSearch: {
						distributionModel: 'FIELDPARTNER'
					}
				},
				{
					id: 142,
					url: '6-month-loans',
					queryParams: 'status=fundRaising&lenderTerm=0,6&defaultRate=,0.01&distributionModel=field_partner',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 6)
					}
				},
				{
					id: 143,
					url: 'short-term-loans-ending-soon',
					queryParams: 'status=fundRaising&lenderTerm=0,16&expiringSoon=1',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 6)
					}
				},
				{
					id: 144,
					url: 'short-term-loans-almost-funded',
					queryParams: 'status=fundRaising&lenderTerm=0,16&distributionModel=field_partner&sortBy=amountLeft',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 16),
						sortBy: 'amountLeft',
						distributionModel: 'FIELDPARTNER'
					},
				},
				{
					id: 145,
					url: 'africa-short-term-loans',
					queryParams: 'status=fundRaising&lenderTerm=0,16&country=MZ,UG,TZ,SN,RW,KE,CD,LR,SL,BF,CM,GH,NG,TG,MG,MW,ZM,ML,EG,LS,ZA,BI,SS,ZW,NA',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 16),
						countryIsoCode: ['MZ', 'UG', 'TZ', 'SN', 'RW', 'KE', 'CD', 'LR', 'SL', 'BF', 'CM', 'GH', 'NG', 'TG', 'MG', 'MW', 'ZM', 'ML', 'EG', 'LS', 'ZA', 'BI', 'SS', 'ZW', 'NA'],
					},
				},
				{
					id: 146,
					url: 'asia-short-term-loans',
					queryParams: 'status=fundRaising&lenderTerm=0,16&country=KH,NP,TJ,TH,VN,PH,KG,IN,ID,PK,MM,LA,BT,BD',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 16),
						countryIsoCode: ['KH', 'NP', 'TJ', 'TH', 'VN', 'PH', 'KG', 'IN', 'ID', 'PK', 'MM', 'LA', 'BT', 'BD'],
					},
				},
				{
					id: 148,
					url: 'eastern-europe-short-term-loans',
					queryParams: 'status=fundRaising&lenderTerm=0,16&country=GE,AL,XK,MD',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 16),
						countryIsoCode: ['GE', 'AL', 'XK', 'MD'],
					},
				},
				{
					id: 149,
					url: 'middle-east-short-term-loans',
					queryParams: 'status=fundRaising&lenderTerm=0,16&country=JO,PS,IL,TR',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 16),
						countryIsoCode: ['JO', 'PS', 'IL', 'TR'],
					},
				},
				{
					id: 150,
					url: 'oceania-short-term-loans',
					queryParams: 'status=fundRaising&lenderTerm=0,16&country=WS,TL,SB,TO,FJ,PG,VU,GU',
					flssLoanSearch: {
						lenderRepaymentTerm: createMinMaxRange(0, 16),
						countryIsoCode: ['WS', 'TL', 'SB', 'TO', 'FJ', 'PG', 'VU', 'GU'],
					},
				},
				{
					id: 151,
					url: 'b-i-p-o-c-business',
					queryParams: 'status=fundRaising&country=US&loanTags=51&distributionModel=direct',
					flssLoanSearch: {
						countryIsoCode: ['US'],
						tagId: [51],
						distributionModel: 'DIRECT'
					}
				},
				{
					id: 152,
					url: 'adapt-to-climate-change-already-here',
					queryParams: 'status=fundRaising&sector=1',
					flssLoanSearch: {
						sectorId: [1],
					}
				},
				{
					id: 153,
					url: 'protect-against-loss',
					queryParams: 'status=fundRaising&theme=Crop Insurance',
					flssLoanSearch: {
						themeId: [37],
					}
				},

				// Misc Promotional or Unsupported URLS

				{
					id: 96,
					url: 'covid-19',
					// queryParams are from initial Loan Channel setup on 4.27.2020 around 3pm
					queryParams: 'status=fundRaising&sector=1,9,5,14,17,12,6,8,7,4,3,13&sortBy=popularity',
					// this will cause legacy lend to load up and apply all params for the Loan Channel
					fallbackUrl: '/lend/covid-19?filter=bypass',
					flssLoanSearch: {
						sectorId: [1, 9, 5, 14, 17, 12, 6, 8, 7, 4, 3, 13],
						sortBy: 'popularityScore',
					},
				},
				{
					id: 97,
					url: 'hitachi-employees-helping-c-o-v-i-d-impacted-businesses',
					// queryParams are from initial Loan Channel setup on 5.3.2020
					queryParams: 'status=fundRaising&riskRating=3,5&sector=1,9,5,14,17,12,8,7,4,3,13&theme=Islamic Finance,Youth,Start-Up,Water and Sanitation,Vulnerable Groups,Fair Trade,Rural Exclusion,Mobile Technology,Underfunded Areas,Conflict Zones,Job Creation,Growing Businesses,Disaster recovery,Innovative Loans,Refugees/Displaced,Social Enterprise,Crisis Support Loans&distributionModel=field_partner',
					// this will cause legacy lend to load up and apply all params for the Loan Channel
					fallbackUrl: '/lend/hitachi-employees-helping-c-o-v-i-d-impacted-businesses?filter=bypass',
					flssLoanSearch: {
						partnerRiskRating: createMinMaxRange(3, 5),
						distributionModel: 'FIELDPARTNER',
						sectorId: [1, 9, 5, 14, 17, 12, 8, 7, 4, 3, 13],
						themeId: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20, 24, 28, 29, 36]
					}
				},
				{
					id: 98,
					url: 'crisis-support-loans',
					// queryParams are from initial Loan Channel setup on 5.06.2020
					queryParams: 'status=fundRaising&theme=Crisis Support Loans&distributionModel=field_partner',
					// this will cause legacy lend to load up and apply all params for the Loan Channel
					// fallbackUrl: '/lend/crisis-support-loans?filter=bypass'
					algoliaParams: 'attributes=Crisis%20Support%20Loans&sortBy=popularity',
					flssLoanSearch: {
						themeId: [36],
						distributionModel: 'FIELDPARTNER',
						sortBy: 'popularityScore',
					},
				},
				{
					id: 108,
					url: 'recommended-by-lenders',
					queryParams: 'status=fundRaising&riskRating=1,5&lenderTerm=0,10&partner=33,465,265,269,116,271,409,438,34,282,444,310,159,210,268,104,445,32,155,108,158,127,43,106,2,3,4,5,128,36,40,109,355,46,105,37,270,287,356,421,346,107,281,286,153,607,41,47,605,111,110,354,280,288,424,447,347,6,472,112,186,437,162,360,164,184,278,313,267,45,365,478,433,96,290,42,1,8,49,353,7,10,219,53,224,188,427,350,227,9,54,50,55,56,370,11,152,52,212,307,136,51,57,364,291,189,369,481,61,168,220,293,113,165,63,299,384,225,533,131,132,476,480,380,135,304,528,172,170,397,521,66,130,295,306,468,67,144,385,141,228,388,393,137,279,396,559,171,344,377,454,289,245,302,341,455,382,403,477,316,395,441,450,300,71,138,142,392,296,70,13,574,262,567,416,229,214,60,64,247,230,248,244,484,312,321,401,143,198,391,238,241,242,305,213,323,72,200,73,16,82,237,485,249,84,324,487,572,415,254,258,462,407,202,327,332,79,204&defaultRate=,0.01&distributionModel=field_partner',
					flssLoanSearch: {
						partnerRiskRating: createMinMaxRange(1, 5),
						lenderRepaymentTerm: createMinMaxRange(0, 10),
						partnerId: [33, 465, 265, 269, 116, 271, 409, 438, 34, 282, 444, 310, 159, 210, 268, 104, 445, 32, 155, 108, 158, 127, 43, 106, 2, 3, 4, 5, 128, 36, 40, 109, 355, 46, 105, 37, 270, 287, 356, 421, 346, 107, 281, 286, 153, 607, 41, 47, 605, 111, 110, 354, 280, 288, 424, 447, 347, 6, 472, 112, 186, 437, 162, 360, 164, 184, 278, 313, 267, 45, 365, 478, 433, 96, 290, 42, 1, 8, 49, 353, 7, 10, 219, 53, 224, 188, 427, 350, 227, 9, 54, 50, 55, 56, 370, 11, 152, 52, 212, 307, 136, 51, 57, 364, 291, 189, 369, 481, 61, 168, 220, 293, 113, 165, 63, 299, 384, 225, 533, 131, 132, 476, 480, 380, 135, 304, 528, 172, 170, 397, 521, 66, 130, 295, 306, 468, 67, 144, 385, 141, 228, 388, 393, 137, 279, 396, 559, 171, 344, 377, 454, 289, 245, 302, 341, 455, 382, 403, 477, 316, 395, 441, 450, 300, 71, 138, 142, 392, 296, 70, 13, 574, 262, 567, 416, 229, 214, 60, 64, 247, 230, 248, 244, 484, 312, 321, 401, 143, 198, 391, 238, 241, 242, 305, 213, 323, 72, 200, 73, 16, 82, 237, 485, 249, 84, 324, 487, 572, 415, 254, 258, 462, 407, 202, 327, 332, 79, 204],
						distributionModel: 'FIELDPARTNER',
					}
				},
				{
					id: 65,
					url: 'new-countries-for-you',
					queryParams: 'status=fundRaising&distributionModel=field_partner',
					algoliaParams: '',
					flssLoanSearch: {
						distributionModel: 'FIELDPARTNER',
					}
				},
				{
					id: 34,
					url: 'international-womens-day',
					queryParams: 'status=fundRaising&gender=female',
					flssLoanSearch: {
						gender: 'female'
					},
				},
				{
					id: 48,
					url: 'human-flow-fund-support-refugees-and-i-d-ps',
					queryParams: 'status=fundRaising&sector=1,9,5,14,12,8,7,4,3,13&theme=Conflict Zones,Refugees/Displaced&distributionModel=field_partner',
					flssLoanSearch: {
						sectorId: [1, 9, 5, 14, 12, 8, 7, 4, 3, 13],
						themeId: [14, 28],
						distributionModel: 'FIELDPARTNER'
					},
				},
				{
					id: 51,
					url: 'blackrock',
					queryParams: 'status=fundRaising&excludeNonRated=1&distributionModel=field_partner',
					algoliaParams: '',
					flssLoanSearch: {
						distributionModel: 'FIELDPARTNER'
					}
				},
				{
					id: 61,
					url: 'flash-match',
					queryParams: 'status=fundRaising',
					algoliaParams: '',
					flssLoanSearch: {},
				},
				{
					id: 42,
					url: '1-billion-in-change',
					queryParams: 'status=fundRaising',
					algoliaParams: '',
					flssLoanSearch: {},
				},
				{
					id: 35,
					url: 'choose-a-borrower',
					queryParams: 'status=fundRaising&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner',
					flssLoanSearch: {
						partnerId: [246, 77, 123, 120, 171, 65, 458, 379, 105, 144, 125, 301, 93, 127, 143, 55, 137, 154, 136, 163, 63, 404, 231, 100, 243, 245, 9, 406, 294, 363, 176, 428, 201, 167, 126, 118, 138, 15, 121, 87, 222, 247, 199, 188, 159, 181, 106, 185, 146, 169, 204, 115, 58, 145],
						distributionModel: 'FIELDPARTNER',
					},
				},
				{
					id: 37,
					url: 'choose-a-woman-borrower',
					queryParams: 'status=fundRaising&gender=female&lenderTerm=0,18&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner',
					flssLoanSearch: {
						gender: 'female',
						lenderRepaymentTerm: createMinMaxRange(0, 18),
						partnerId: [246, 77, 123, 120, 171, 65, 458, 379, 105, 144, 125, 301, 93, 127, 143, 55, 137, 154, 136, 163, 63, 404, 231, 100, 243, 245, 9, 406, 294, 363, 176, 428, 201, 167, 126, 118, 138, 15, 121, 87, 222, 247, 199, 188, 159, 181, 106, 185, 146, 169, 204, 115, 58, 145],
						distributionModel: 'FIELDPARTNER',
					},
				},
				{
					id: 38,
					url: 'choose-a-farmer',
					queryParams: 'status=fundRaising&lenderTerm=0,18&sector=1&partner=246,77,123,120,171,65,458,379,105,144,125,301,93,127,143,55,137,154,136,163,63,404,231,100,243,245,9,406,294,363,176,428,201,167,126,118,138,15,121,87,222,247,199,188,159,181,106,185,146,169,204,115,58,145&distributionModel=field_partner',
					flssLoanSearch: {
						sectorId: [1],
						lenderRepaymentTerm: createMinMaxRange(0, 18),
						partnerId: [246, 77, 123, 120, 171, 65, 458, 379, 105, 144, 125, 301, 93, 127, 143, 55, 137, 154, 136, 163, 63, 404, 231, 100, 243, 245, 9, 406, 294, 363, 176, 428, 201, 167, 126, 118, 138, 15, 121, 87, 222, 247, 199, 188, 159, 181, 106, 185, 146, 169, 204, 115, 58, 145],
						distributionModel: 'FIELDPARTNER',
					},
				},
				{
					id: 40,
					url: 'foster-city',
					queryParams: 'status=fundRaising&state=CA&city_state=San Jose,CA&distributionModel=direct',
					algoliaParams: '',
					flssLoanSearch: {
						distributionModel: 'DIRECT',
					},
				},
				{
					id: 43,
					url: 'super-power-a-woman-on-kiva',
					queryParams: 'status=fundRaising&gender=female&distributionModel=field_partner',
					algoliaParams: 'gender=female',
					flssLoanSearch: {
						gender: 'female',
						distributionModel: 'FIELDPARTNER',
					},
				},
				{
					id: 44,
					url: 'hitachi-employees-helping-to-ignite-a-dream',
					queryParams: 'status=fundRaising&riskRating=3,5&sector=1,9,5,14,17,12,6,8,7,4,3,13&theme=Islamic Finance,Youth,Start-Up,Water and Sanitation,Vulnerable Groups,Fair Trade,Rural Exclusion,Mobile Technology,Underfunded Areas,Conflict Zones,Job Creation,Growing Businesses,Disaster recovery,Innovative Loans,Refugees/Displaced,Social Enterprise,Crisis Support Loans&distributionModel=field_partner',
					algoliaParams: '',
					flssLoanSearch: {
						partnerRiskRating: createMinMaxRange(3, 5),
						sectorId: [1, 9, 5, 14, 17, 12, 6, 8, 7, 4, 3, 13],
						themeId: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20, 24, 28, 29, 36],
						distributionModel: 'FIELDPARTNER',
					},
				},
				{
					id: 45,
					url: 's-j-peninsula',
					queryParams: 'status=fundRaising&country=US&state=CA&city_state=San Jose,CA,Belmont,CA,Atherton,CA,Brisbane,CA,Burlingame,CA,Campbell,CA,Castro Valley,CA,Colma,CA,Cupertino,CA,Daly City,CA,East Palo Alto,CA,Foster City,CA,Fremont,CA,Gilroy,CA,Half Moon Bay,CA,Hayward,CA,Hillsborough,CA,La Honda,CA,Ladera,CA,Loma Mar,CA,Los Altos,CA,Los Altos Hills,CA,Los Gatos,CA,Menlo Park,CA,Millbrae,CA,Milpitas,CA,Monte Sereno,CA,Morgan Hill,CA,Mountain View,CA,Pacifica,CA,Palo Alto,CA,Pescadero,CA,Portola Valley,CA,Redwood City,CA,San Bruno,CA,San Carlos,CA,San Gregorio,CA,San Mateo,CA,Santa Clara,CA,Saratoga,CA,South San Francisco,CA,Sunnyvale,CA,Woodside,CA&distributionModel=direct',
					flssLoanSearch: {
						countryIsoCode: ['US'],
						distributionModel: 'DIRECT',
					},
				},
				{
					id: 49,
					url: 'choose-for-me',
					queryParams: 'status=fundRaising&riskRating=1,5&distributionModel=field_partner',
					algoliaParams: '',
					flssLoanSearch: {
						partnerRiskRating: createMinMaxRange(1, 5),
						distributionModel: 'FIELDPARTNER',
					},
				},
				{
					id: 99,
					url: 'i-t-cosmetics-confidence',
					queryParams: 'status=fundRaising&gender=female&riskRating=3,5&sector=1,9,5,14,15,17,12,6,10,8,16,7,4,3,13&distributionModel=field_partner',
					algoliaParams: '',
					flssLoanSearch: {
						gender: 'female',
						partnerRiskRating: createMinMaxRange(3, 5),
						sectorId: [1, 9, 5, 14, 15, 17, 12, 6, 10, 8, 16, 7, 4, 3, 13],
						distributionModel: 'FIELDPARTNER',
					},
				},
				{
					id: 100,
					url: 'hitachis-c-o-v-i-d-19-response',
					queryParams: 'status=fundRaising&riskRating=3,5&sector=1,9,5,14,17,12,8,7,4,3,13&theme=Islamic Finance,Youth,Start-Up,Water and Sanitation,Vulnerable Groups,Fair Trade,Rural Exclusion,Mobile Technology,Underfunded Areas,Conflict Zones,Job Creation,Growing Businesses,Disaster recovery,Innovative Loans,Refugees/Displaced,Social Enterprise,Crisis Support Loans&distributionModel=field_partner',
					algoliaParams: '',
					flssLoanSearch: {
						partnerRiskRating: createMinMaxRange(3, 5),
						themeId: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20, 24, 28, 29, 36],
						sectorId: [1, 9, 5, 14, 17, 12, 8, 7, 4, 3, 13],
						distributionModel: 'FIELDPARTNER',
					},
				},
				{
					id: 157,
					url: 'l-g-b-t-q',
					queryParams: 'status=fundRaising&loanTags=73',
					flssLoanSearch: {
						tagId: [73]
					},
				},
				{
					id: 155,
					url: 'matched-loans',
					flssLoanSearch: {
						isMatchable: true
					},
				},
			]

		};
	}
};
