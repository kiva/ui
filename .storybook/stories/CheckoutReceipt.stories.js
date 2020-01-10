import StoryRouter from 'storybook-vue-router';

import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import SocialShare from '@/components/Checkout/SocialShare';

// Log in as kiva test user 7, then
// http://api-vm.kiva.org/graphql?user_id=1003394&app_id=org.kiva.www&query=%7B%0A%20%20shop%20%7B%0A%20%20%20%20receipt(checkoutId%3A%2038646529)%20%7B%0A%20%20%20%20%20%20credits%20%7B%0A%20%20%20%20%20%20%20%20values%20%7B%0A%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20creditType%0A%20%20%20%20%20%20%20%20%20%20amount%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20totals%20%7B%0A%20%20%20%20%20%20%20%20itemTotal%0A%20%20%20%20%20%20%20%20donationTotal%0A%20%20%20%20%20%20%20%20kivaCardTotal%0A%20%20%20%20%20%20%20%20depositTotals%20%7B%0A%20%20%20%20%20%20%20%20%20%20depositTotal%0A%20%20%20%20%20%20%20%20%20%20kivaCreditAdded%0A%20%20%20%20%20%20%20%20%20%20kivaCreditUsed%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20kivaCreditAppliedTotal%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20hasFreeCredits%0A%20%20%20%20%20%20items%20%7B%0A%20%20%20%20%20%20%20%20totalCount%0A%20%20%20%20%20%20%20%20values%20%7B%0A%20%20%20%20%20%20%20%20%20%20price%0A%20%20%20%20%20%20%20%20%20%20basketItemType%0A%20%20%20%20%20%20%20%20%20%20creditsUsed%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20amount%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20...%20on%20LoanReservation%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20loan%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20image%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20use%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20geocode%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20city%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20country%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%09%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20my%20%7B%0A%20%20%20%20userAccount%20%7B%0A%20%20%20%20%20%20firstName%0A%20%20%20%20%20%20lastName%0A%20%20%20%20%20%20email%0A%20%20%20%20%7D%0A%20%20%7D%20%20%0A%7D%0A%0A
const mockedGraphQLData = {
	"data": {
		"shop": {
		"receipt": {
			"credits": {
			"values": [
				{
					"id": 1003394,
					"creditType": "kiva_credit",
					"amount": null
					}
				]
			},
			"totals": {
				"itemTotal": "891.25",
				"donationTotal": "116.25",
				"kivaCardTotal": "150.00",
				"depositTotals": {
					"depositTotal": "891.25",
					"kivaCreditAdded": "0.00",
					"kivaCreditUsed": "0.00"
				},
				"kivaCreditAppliedTotal": "891.25"
			},
				"hasFreeCredits": false,
				"items": {
				"totalCount": 7,
				"values": [
					{
					"price": "25.00",
					"basketItemType": "loan_reservation",
					"creditsUsed": [
						{
						"amount": "25.00"
						}
					],
					"loan": {
						"name": "Alan",
						"id": 1890376,
						"image": {
						"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/35bbf2ba0ae472c4814b99f301adae10.jpg"
						},
						"use": "to buy cattle feed , and to buy cattle to increase her income from raising cattle.",
						"geocode": {
						"city": "Kara-Suu village, Osh region",
						"country": {
							"name": "Kyrgyzstan"
						}
						}
					}
					},
					{
					"price": "25.00",
					"basketItemType": "loan_reservation",
					"creditsUsed": [
						{
						"amount": "25.00"
						}
					],
					"loan": {
						"name": "Alan's Group",
						"id": 1908787,
						"image": {
						"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/afb2502655fd85ab49aad7c6e93c91f3.jpg"
						},
						"use": "to purchase hybrid seeds and fertilizer to improve harvests of maize.",
						"geocode": {
						"city": "Teso",
						"country": {
							"name": "Kenya"
						}
						}
					}
					},
					{
					"price": "25.00",
					"basketItemType": "loan_reservation",
					"creditsUsed": [
						{
						"amount": "25.00"
						}
					],
					"loan": {
						"name": "Dukoranumwete Tcb Group",
						"id": 1907446,
						"image": {
						"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/4943ca4a6fefd22dafdb12d142826ff9.jpg"
						},
						"use": "to add more fish to her business in order to meet customer demand.",
						"geocode": {
						"city": null,
						"country": {
							"name": "Rwanda"
						}
						}
					}
					},
					{
					"price": "400.00",
					"basketItemType": "loan_reservation",
					"creditsUsed": [
						{
						"amount": "400.00"
						}
					],
					"loan": {
						"name": "Mujeres Del Milagro Group",
						"id": 1908384,
						"image": {
						"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/ff35a3d4c8a68b1750108aece4ac1a4a.jpg"
						},
						"use": "to buy 1 industrial stove, pots, and ingredients to continue preparing her recipes.",
						"geocode": {
						"city": "Patzun, Chimaltenango",
						"country": {
							"name": "Guatemala"
						}
						}
					}
					},
					{
					"price": "150.00",
					"basketItemType": "loan_reservation",
					"creditsUsed": [
						{
						"amount": "150.00"
						}
					],
					"loan": {
						"name": "Alan",
						"id": 1894131,
						"image": {
						"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/fa3f2827dde0a60b883411224c40e62e.jpg"
						},
						"use": "to purchase sandals, jeans, beauty products (shampoo, cologne, talcum powder) and kits for bonuses.",
						"geocode": {
						"city": "Soledad (Atlántico)",
						"country": {
							"name": "Colombia"
						}
						}
					}
					},
					{
					"price": "150.00",
					"basketItemType": "kiva_card",
					"creditsUsed": [
						{
						"amount": "150.00"
						}
					]
					},
					{
					"price": "116.25",
					"basketItemType": "donation",
					"creditsUsed": [
						{
						"amount": "116.25"
						}
					]
					}
				]
				}
			}
		},
		"my": {
			"userAccount": {
				"firstName": "Alan",
				"lastName": "Smithee",
				"email": "user_1003394@braincrave.org"
			}
		}
	}
};


export default {
	title: 'Components|ThanksPage',
	decorators: [StoryRouter()],
};

export const Social_Share = () => ({
	components: {
		SocialShare,
	},
	template: `
		<social-share
			:loans="loans"
		/>
	`,
	props: {
		loans: {
			type: Array,
			default() {
				return mockedGraphQLData.data.shop.receipt.items.values
					.filter(item => item.basketItemType === 'loan_reservation')
					.map(item => item.loan);
			}
		}
	},
});

export const Checkout_Receipt = () => ({
	components: {
		CheckoutReceipt,
	},
	template: `
		<checkout-receipt
			:lender="lender"
			:receipt="receipt"
		/>
	`,
	props: {
		lender: {
			type: Object,
			default() {
				return mockedGraphQLData.data.my.userAccount
			}
		},
		receipt: {
			type: Object,
			default() {
				return mockedGraphQLData.data.shop.receipt
			}
		}
	},
});
