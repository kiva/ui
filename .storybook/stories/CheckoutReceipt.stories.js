import StoryRouter from 'storybook-vue-router';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';

export default {
	title: 'Components/CheckoutReceipt',
	component: CheckoutReceipt,
	decorators: [StoryRouter()],
	excludeStories: ['mockedReceiptData']
};

// https://api-vm.kiva.org/graphqlgraphql?user_id=1003394&app_id=org.kiva.www&query=query%20checkoutReceipt%20%7B%20%0A%09shop%20%7B%0A%09%09receipt(checkoutId%3A%2038663432)%20%7B%0A%09%09%09credits%20%7B%0A%09%09%09%09values%20%7B%0A%09%09%09%09%09creditType%0A%09%09%09%09%09amount%0A%09%09%09%09%7D%0A%09%09%09%7D%0A%09%09%09totals%20%7B%0A%20%20%20%20%20%20%20%20bonusAppliedTotal%0A%09%09%09%09itemTotal%0A%09%09%09%09donationTotal%0A%09%09%09%09kivaCardTotal%0A%09%09%09%09depositTotals%20%7B%0A%09%09%09%09%09depositTotal%0A%09%09%09%09%09kivaCreditAdded%0A%09%09%09%09%09kivaCreditUsed%0A%09%09%09%09%7D%0A%20%20%20%20%20%20%20%20freeTrialAppliedTotal%0A%09%09%09%09kivaCreditAppliedTotal%0A%20%20%20%20%20%20%20%20redemptionCodeAppliedTotal%0A%20%20%20%20%20%20%20%20universalCodeAppliedTotal%0A%09%09%09%7D%0A%09%09%09hasFreeCredits%0A%09%09%09items%20%7B%0A%09%09%09%09totalCount%0A%09%09%09%09values%20%7B%0A%09%09%09%09%09id%0A%09%09%09%09%09price%0A%09%09%09%09%09basketItemType%0A%09%09%09%09%09...%20on%20KivaCard%20%7B%0A%09%09%09%09%09%09individualPrice%0A%09%09%09%09%09%09basketItemType%0A%09%09%09%09%09%09kivaCardObject%20%7B%0A%09%09%09%09%09%09%09deliveryType%0A%09%09%09%09%09%09%09mailingInfo%20%7B%0A%09%09%09%09%09%09%09%09firstName%0A%09%09%09%09%09%09%09%09lastName%0A%09%09%09%09%09%09%09%09address%0A%09%09%09%09%09%09%09%09address2%0A%09%09%09%09%09%09%09%09city%0A%09%09%09%09%09%09%09%09state%0A%09%09%09%09%09%09%09%09zip%0A%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%09recipient%20%7B%0A%09%09%09%09%09%09%09%09name%0A%09%09%09%09%09%09%09%09email%0A%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%7D%0A%09%09%09%09%09%7D%0A%09%09%09%09%09...%20on%20LoanReservation%20%7B%0A%09%09%09%09%09%09loan%20%7B%0A%09%09%09%09%09%09%09name%0A%09%09%09%09%09%09%09id%0A%09%09%09%09%09%09%09image%20%7B%0A%09%09%09%09%09%09%09%09url%0A%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%09use%0A%09%09%09%09%09%09%09geocode%20%7B%0A%09%09%09%09%09%09%09%09city%0A%09%09%09%09%09%09%09%09country%20%7B%0A%09%09%09%09%09%09%09%09%09name%0A%09%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%7D%0A%09%09%09%09%09%7D%0A%09%09%09%09%7D%0A%09%09%09%7D%0A%09%09%7D%0A%09%7D%0A%09my%20%7B%0A%09%09userAccount%20%7B%0A%09%09%09firstName%0A%09%09%09lastName%0A%09%09%09email%0A%09%09%7D%0A%09%7D%0A%7D%0A&operationName=checkoutReceipt
export const mockedReceiptData = {
	"data": {
		"shop": {
			"receipt": {
				"credits": {
					"values": [
						{
							"creditType": "kiva_credit",
							"amount": null
						}
					]
				},
				"totals": {
					"itemTotal": "960.25",
					"donationTotal": "125.25",
					"kivaCardTotal": "710.00",
					"depositTotals": {
						"depositTotal": "960.25",
						"kivaCreditAdded": "0.00",
						"kivaCreditUsed": "0.00"
					},
					"kivaCreditAppliedTotal": "960.25"
				},
				"hasFreeCredits": false,
				"items": {
					"totalCount": 11,
					"values": [
						{
							"id": 1911067,
							"price": "25.00",
							"basketItemType": "loan_reservation",
							"creditsUsed": [
								{
									"amount": "25.00"
								}
							],
							"loan": {
								"name": "Alan",
								"id": 1911067,
								"image": {
									"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/5e041e655faa305c49c13505d1c17cba.jpg"
								},
								"use": "to expand her business by purchasing more stock such as seed and manure for the expansion of her vegetable garden.",
								"geocode": {
									"city": "Chienge",
									"country": {
										"name": "Zambia"
									}
								}
							}
						},
						{
							"id": 1908530,
							"price": "25.00",
							"basketItemType": "loan_reservation",
							"creditsUsed": [
								{
									"amount": "25.00"
								}
							],
							"loan": {
								"name": "Alan",
								"id": 1908530,
								"image": {
									"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/da9ac74228e39e15cc198f8165e68c20.jpg"
								},
								"use": "to buy taro roots (seedlings), banana tubers (seedlings), chemicals, a bag back sprayer, and a chainsaw.",
								"geocode": {
									"city": "Vaiafai Savaii",
									"country": {
										"name": "Samoa"
									}
								}
							}
						},
						{
							"id": 1907517,
							"price": "25.00",
							"basketItemType": "loan_reservation",
							"creditsUsed": [
								{
									"amount": "25.00"
								}
							],
							"loan": {
								"name": "Barrio Concepcion Group",
								"id": 1907517,
								"image": {
									"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/213d4f59069e192a2a4b9ee1fb56b649.jpg"
								},
								"use": "to buy a stove with a grill, kitchen utensils, corn and firewood.",
								"geocode": {
									"city": "Retalhuleu",
									"country": {
										"name": "Guatemala"
									}
								}
							}
						},
						{
							"id": 1909791,
							"price": "25.00",
							"basketItemType": "loan_reservation",
							"creditsUsed": [
								{
									"amount": "25.00"
								}
							],
							"loan": {
								"name": "Alan",
								"id": 1909791,
								"image": {
									"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg"
								},
								"use": "to buy farming inputs and improve her production in 2020 for an increased income.",
								"geocode": {
									"city": "Kitale",
									"country": {
										"name": "Kenya"
									}
								}
							}
						},
						{
							"id": 1906824,
							"price": "25.00",
							"basketItemType": "loan_reservation",
							"creditsUsed": [
								{
									"amount": "25.00"
								}
							],
							"loan": {
								"name": "Las Victoriosas Group",
								"id": 1906824,
								"image": {
									"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/26342071330beb8309d17a5d262da2dd.jpg"
								},
								"use": "to buy used clothing for men, women and children in specific sizes.",
								"geocode": {
									"city": "Chimaltenango",
									"country": {
										"name": "Guatemala"
									}
								}
							}
						},
						{
							"id": 2118024,
							"price": "30.00",
							"basketItemType": "kiva_card",
							"creditsUsed": [
								{
									"amount": "30.00"
								}
							],
							"individualPrice": "30.00",
							"kivaCardObject": {
								"deliveryType": "email",
								"mailingInfo": {
									"firstName": null,
									"lastName": null,
									"address": null,
									"address2": null,
									"city": null,
									"state": null,
									"zip": null
								},
								"recipient": {
									"name": "Jane Doe eMail",
									"email": "test@kiva.org"
								}
							}
						},
						{
							"id": 2118025,
							"price": "30.00",
							"basketItemType": "kiva_card",
							"creditsUsed": [
								{
									"amount": "30.00"
								}
							],
							"individualPrice": "30.00",
							"kivaCardObject": {
								"deliveryType": "email",
								"mailingInfo": {
									"firstName": null,
									"lastName": null,
									"address": null,
									"address2": null,
									"city": null,
									"state": null,
									"zip": null
								},
								"recipient": {
									"name": "Jane Doe eMail",
									"email": "test+123@kiva.org"
								}
							}
						},
						{
							"id": 2118026,
							"price": "150.00",
							"basketItemType": "kiva_card",
							"creditsUsed": [
								{
									"amount": "150.00"
								}
							],
							"individualPrice": "150.00",
							"kivaCardObject": {
								"deliveryType": "print",
								"mailingInfo": {
									"firstName": null,
									"lastName": null,
									"address": null,
									"address2": null,
									"city": null,
									"state": null,
									"zip": null
								},
								"recipient": {
									"name": "Jane Doe Print",
									"email": null
								}
							}
						},
						{
							"id": 2118027,
							"price": "250.00",
							"basketItemType": "kiva_card",
							"creditsUsed": [
								{
									"amount": "250.00"
								}
							],
							"individualPrice": "250.00",
							"kivaCardObject": {
								"deliveryType": "postal",
								"mailingInfo": {
									"firstName": "John",
									"lastName": "Doe",
									"address": "555 Sw 5th St",
									"address2": "Apt. C",
									"city": "Washington",
									"state": "DC",
									"zip": "55555"
								},
								"recipient": {
									"name": "Jane Doe",
									"email": null
								}
							}
						},
						{
							"id": 2118028,
							"price": "250.00",
							"basketItemType": "kiva_card",
							"creditsUsed": [
								{
									"amount": "250.00"
								}
							],
							"individualPrice": "250.00",
							"kivaCardObject": {
								"deliveryType": "postal",
								"mailingInfo": {
									"firstName": "John",
									"lastName": "Doe",
									"address": "555 Sw 5th St",
									"address2": "Apt. C",
									"city": "Washington",
									"state": "DC",
									"zip": "55555"
								},
								"recipient": {
									"name": "Jane Doe",
									"email": null
								}
							}
						},
						{
							"id": 48417665,
							"price": "125.25",
							"basketItemType": "donation",
							"creditsUsed": [
								{
									"amount": "125.25"
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


export const Default = () => ({
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
				return mockedReceiptData.data.my.userAccount
			}
		},
		receipt: {
			type: Object,
			default() {
				return mockedReceiptData.data.shop.receipt
			}
		}
	},
});
