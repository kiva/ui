import receiptData from '../mock-data/receipt-data-mock';

export const mockedReceiptData = receiptData;

export const mockLender = {
	firstName: 'Test',
	lastName: 'User',
	email: 'testuser@kiva.org',
	inviterName: 'testUser123',
};

export const mockLoans = mockedReceiptData.items.values
	.filter(item => item.basketItemType === 'loan_reservation')
	.map(item => item.loan);

export const mockOldBadge = {
	"id": "equity",
	"challengeName": "Equality Badge",
	"description": "",
	"contentfulData": [
		{
			"id": "equity",
			"level": 0,
			"levelName": "",
			"challengeName": "Equality Badge",
			"imageUrl": "https://images.ctfassets.net/j0p9a6ql0rn7/6yl0sXP8fgaRaRwIaEVJO4/23ca0d8da49569f1d318a76d3b7575b1/Equality.png",
			"shareFact": "",
			"shareFactFootnote": "",
			"shareFactUrl": ""
		}
	],
	"achievementData": {
		"__typename": "LendingAchievement",
		"id": "equity",
		"description": "",
		"milestoneProgress": [
			{
				"__typename": "MilestoneProgressForUser",
				"earnedAtDate": "2024-11-06T23:43:53Z",
				"id": "default",
				"milestoneStatus": "COMPLETE",
				"progress": 109,
				"target": 1
			}
		],
		"tiers": []
	},
	"hasStarted": false
};

export const mockTieredBadge = {
	"id": "womens-equality",
	"challengeName": "Women's equality",
	"description": "Removing financial barriers is key to achieving global gender equity. Help women overcome financial barriers, build their economic independence, and pursue their dreams.",
	"contentfulData": [
		{
			"id": "womens-equality",
			"level": 1,
			"levelName": "1",
			"challengeName": "Women's equality",
			"imageUrl": "//images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/70d21f8db5f93b20be1581ef333dc60e/Women_10.svg",
			"shareFact": "92% of women surveyed said their quality of life improved as a result of their loan.",
			"shareFactFootnote": "Borrowers of Kiva Lending Partners surveyed by 60 Decibels.",
			"shareFactUrl": "https://www.kiva.org/impact/gender-equality"
		},
		{
			"id": "womens-equality",
			"level": 2,
			"levelName": "2",
			"challengeName": "Women's equality",
			"imageUrl": "//images.ctfassets.net/j0p9a6ql0rn7/6PcVN0gI5MIwytZm5AFQ32/08e39f77b0ecbeb4dd67f7e4625e3e07/Women_20.svg",
			"shareFact": "9 in 10 women surveyed said they could manage their finances better after receiving their loan.",
			"shareFactFootnote": "Borrowers of Kiva Lending Partners surveyed by 60 Decibels.",
			"shareFactUrl": "https://www.kiva.org/impact/gender-equality"
		},
		{
			"id": "womens-equality",
			"level": 3,
			"levelName": "3",
			"challengeName": "Women's equality",
			"imageUrl": "//images.ctfassets.net/j0p9a6ql0rn7/25FLM7Cyv1kik5nFkdIT2O/654e6fa5affd8d05b17b57291e8a5a73/Women_30.svg",
			"shareFact": "89% of women surveyed earned more business income after their loan.",
			"shareFactFootnote": "Borrowers of Kiva Lending Partners surveyed by 60 Decibels.",
			"shareFactUrl": "https://www.kiva.org/impact/gender-equality"
		},
		{
			"id": "womens-equality",
			"level": 4,
			"levelName": "4",
			"challengeName": "Women's equality",
			"imageUrl": "//images.ctfassets.net/j0p9a6ql0rn7/15RLZ1WiHmGQgtlkkMZTH0/b45086ce91aadae2b74c4adeae294f0d/Women_40.svg",
			"shareFact": "The majority of women said they could spend more on their children’s education after their loan.",
			"shareFactFootnote": "Borrowers of Kiva Lending Partners surveyed by 60 Decibels.",
			"shareFactUrl": "https://www.kiva.org/impact/gender-equality"
		},
		{
			"id": "womens-equality",
			"level": 5,
			"levelName": "5",
			"challengeName": "Women's equality",
			"imageUrl": "//images.ctfassets.net/j0p9a6ql0rn7/6mqr1eJTJHksfTlRmpI7bB/ef75875bffc8c437b2d21725cd87ffae/Women_50.svg",
			"shareFact": "3 in 4 women surveyed said they had more money in savings as a result of their loan.*",
			"shareFactFootnote": "Borrowers of Kiva Lending Partners surveyed by 60 Decibels.",
			"shareFactUrl": "https://www.kiva.org/impact/gender-equality"
		},
		{
			"id": "womens-equality",
			"level": 6,
			"levelName": "✨50✨",
			"challengeName": "Women's equality",
			"imageUrl": "//images.ctfassets.net/j0p9a6ql0rn7/5SpskyxoH08WfjVuzXjq6T/95fdd254220d2dccae8a40552f602846/Women_75.svg",
			"shareFact": "9 in 10 women surveyed were better able to achieve financial goals after their loan.",
			"shareFactFootnote": "Borrowers of Kiva Lending Partners surveyed by 60 Decibels.",
			"shareFactUrl": "https://www.kiva.org/impact/gender-equality"
		},
		{
			"id": "womens-equality",
			"level": 7,
			"levelName": "✨100✨",
			"challengeName": "Women's equality",
			"imageUrl": "//images.ctfassets.net/j0p9a6ql0rn7/2rJH0UWfITf7KPuySP8x9/3de2dff5953335b9bcebc5e875a8ccfa/Women_70.svg",
			"shareFact": "86% of women surveyed felt more confident as a result of their loan.*",
			"shareFactFootnote": "Borrowers of Kiva Lending Partners surveyed by 60 Decibels.",
			"shareFactUrl": "https://www.kiva.org/impact/gender-equality"
		}
	],
	"achievementData": {
		"__typename": "TieredLendingAchievement",
		"id": "womens-equality",
		"description": "Removing financial barriers is key to achieving global gender equity. Help women overcome financial barriers, build their economic independence, and pursue their dreams.",
		"totalProgressToAchievement": 3,
		"matchingLoans": {
			"__typename": "FundraisingLoanSavedSearchPageOutput",
			"id": "80fbdc0d-08ef-3492-a819-db05d0f3b960",
			"filters": [
				{
					"gender": {
						"eq": "female"
					}
				}
			]
		},
		"tiers": [
			{
				"__typename": "Tier",
				"target": 2,
				"tierStatement": "",
				"completedDate": "2024-11-06T23:43:54Z",
				"learnMoreURL": "",
				"level": 1
			},
			{
				"__typename": "Tier",
				"target": 3,
				"tierStatement": "",
				"learnMoreURL": "",
				"level": 2
			},
			{
				"__typename": "Tier",
				"target": 5,
				"tierStatement": "",
				"learnMoreURL": "",
				"level": 3
			},
			{
				"__typename": "Tier",
				"target": 10,
				"tierStatement": "",
				"learnMoreURL": "",
				"level": 4
			},
			{
				"__typename": "Tier",
				"target": 20,
				"tierStatement": "",
				"learnMoreURL": "",
				"level": 5
			},
			{
				"__typename": "Tier",
				"target": 50,
				"tierStatement": "",
				"learnMoreURL": "",
				"level": 6
			},
			{
				"__typename": "Tier",
				"target": 100,
				"tierStatement": "",
				"learnMoreURL": "",
				"level": 7
			}
		]
	},
	"hasStarted": true,
	"level": 1
}
