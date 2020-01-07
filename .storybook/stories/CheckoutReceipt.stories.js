import { boolean } from '@storybook/addon-knobs';
import StoryRouter from 'storybook-vue-router';

import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import SocialShare from '@/components/Checkout/SocialShare';

// http://api-vm.kiva.org/graphql?scopes=access&app_id=org.kiva.www&query=%7B%0A%20%20my%20%7B%0A%20%20%20%20userAccount%20%7B%0A%20%20%20%20%20%20firstName%0A%20%20%20%20%20%20lastName%0A%20%20%20%20%20%20email%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D
const mockedUserAccount = {
	"data": {
	  "my": {
		"userAccount": {
		  "firstName": "Captain",
		  "lastName": "Kiva",
		  "email": "user_1003394@braincrave.org"
		}
	  }
	}
  };

// https://api-vm.kiva.org/graphql?scopes=access&app_id=org.kiva.www&query=%7B%0A%20%20shop%20%7B%0A%20%20%20%20receipt(checkoutId%3A%2038618686)%20%7B%0A%20%20%20%20%20%20credits%20%7B%0A%20%20%20%20%20%20%20%20values%20%7B%0A%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20creditType%0A%20%20%20%20%20%20%20%20%20%20amount%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20totals%20%7B%0A%20%20%20%20%20%20%20%20itemTotal%0A%20%20%20%20%20%20%20%20donationTotal%0A%20%20%20%20%20%20%20%20kivaCardTotal%0A%20%20%20%20%20%20%20%20depositTotals%20%7B%0A%20%20%20%20%20%20%20%20%20%20depositTotal%0A%20%20%20%20%20%20%20%20%20%20kivaCreditAdded%0A%20%20%20%20%20%20%20%20%20%20kivaCreditUsed%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20kivaCreditAppliedTotal%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20hasFreeCredits%0A%20%20%20%20%20%20items%20%7B%0A%20%20%20%20%20%20%20%20totalCount%0A%20%20%20%20%20%20%20%20values%20%7B%0A%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20price%0A%20%20%20%20%20%20%20%20%20%20basketItemType%0A%20%20%20%20%20%20%20%20%20%20creditsUsed%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20amount%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D
const mockedShopReceipt = {
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
			"itemTotal": "115.00",
			"donationTotal": "15.00",
			"kivaCardTotal": "0.00",
			"depositTotals": {
			  "depositTotal": "115.00",
			  "kivaCreditAdded": "0.00",
			  "kivaCreditUsed": "0.00"
			},
			"kivaCreditAppliedTotal": "115.00"
		  },
		  "hasFreeCredits": false,
		  "items": {
			"totalCount": 5,
			"values": [
			  {
				"id": 1904859,
				"price": "25.00",
				"basketItemType": "loan_reservation",
				"creditsUsed": [
				  {
					"amount": "25.00"
				  }
				]
			  },
			  {
				"id": 1905552,
				"price": "25.00",
				"basketItemType": "loan_reservation",
				"creditsUsed": [
				  {
					"amount": "25.00"
				  }
				]
			  },
			  {
				"id": 1905543,
				"price": "25.00",
				"basketItemType": "loan_reservation",
				"creditsUsed": [
				  {
					"amount": "25.00"
				  }
				]
			  },
			  {
				"id": 1905412,
				"price": "25.00",
				"basketItemType": "loan_reservation",
				"creditsUsed": [
				  {
					"amount": "25.00"
				  }
				]
			  },
			  {
				"id": 47525367,
				"price": "15.00",
				"basketItemType": "donation",
				"creditsUsed": [
				  {
					"amount": "15.00"
				  }
				]
			  }
			]
		  }
		}
	  }
	}
  };

// https://api-vm.kiva.org/graphql?scopes=access&app_id=org.kiva.www&query=%23%20Welcome%20to%20Kiva%27s%20GraphQL%20API!%0A%23%20Here%27s%20an%20example%20query%20to%20get%20you%20started%0A%7B%0A%20%20lend%20%7B%0A%20%20%20%20loans%20(filters%3A%20%7BloanIds%3A%5B1904859%2C%201905552%2C%201905543%2C%201905412%2C%2047525367%5D%7D%2C%20limit%3A%205)%20%7B%0A%20%20%20%20%20%20values%20%7B%0A%20%20%20%20%20%20%20%20name%0A%09%09%09%09id%0A%20%20%20%20%20%20%20%20use%0A%20%20%20%20%20%20%20%20geocode%20%7B%0A%20%20%20%20%20%20%20%20%20%20city%0A%20%20%20%20%20%20%20%20%20%20country%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A
const mockedLoans = {
	"data": {
	  "lend": {
		"loans": {
		  "values": [
			{
			  "name": "Alan",
			  "id": 1904859,
			  "image": {
				"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/190d121868fdbafd6a3a54f13af690c3.jpg"
			  },
			  "use": "to purchase farming inputs, such as certified seed and nutrient-rich fertilizer, to boost the quality of her produce and elevate her living standards.",
			  "geocode": {
				"city": "Maua",
				"country": {
				  "name": "Kenya"
				}
			  }
			},
			{
			  "name": "Abishyizehamwe B Cb Group",
			  "id": 1905552,
			  "image": {
				"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/9de52c03fa24bb3ff934580b90f6d4c5.jpg"
			  },
			  "use": "to buy more beans, cassava and sorghum to add in her business.",
			  "geocode": {
				"city": null,
				"country": {
				  "name": "Rwanda"
				}
			  }
			},
			{
			  "name": "Alan's Group",
			  "id": 1905543,
			  "image": {
				"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/fef5baeb4f1a26394dfc65ba8c2ece57.jpg"
			  },
			  "use": "to purchase hybrid seeds and fertilizer for the cultivation of maize, as well as a solar light.",
			  "geocode": {
				"city": "Alego",
				"country": {
				  "name": "Kenya"
				}
			  }
			},
			{
			  "name": "Alan",
			  "id": 1905412,
			  "image": {
				"url": "https://www-dev-kiva-org.global.ssl.fastly.net/img/s100/eee1751f770985f71d27d9d022300602.jpg"
			  },
			  "use": "To pay for his son’s tuition at the Medical University in order to help him have a bright future.",
			  "geocode": {
				"city": "Bokhtar",
				"country": {
				  "name": "Tajikistan"
				}
			  }
			}
		  ]
		}
	  }
	}
  };

// Merge loan data into receipt. TODO: clean this up
const receiptData = { ...mockedShopReceipt }
const receiptPlusLoans = receiptData.data.shop.receipt.items.values.map((value) => {
	const loan = mockedLoans.data.lend.loans.values.find(loan=> loan.id === value.id);
	return { ...value, ...loan };
});
receiptData.data.shop.receipt.items.values = receiptPlusLoans;
// console.log(receiptData);



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
				return mockedLoans.data.lend.loans.values
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
			:receipt-data="receiptData"
		/>
	`,
	props: {
		lender: {
			type: Object,
			default() {
				return mockedUserAccount.data.my.userAccount
			}
		},
		receiptData: {
			type: Object,
			default() {
				return receiptData.data.shop.receipt
			}
		}
	},
});


// TODO: This code below will likely live in /pages/Checkout/Thanks.vue and will make the graphQL calls.
// Using storybook and mocks for faster dev right now.
import IconReceipt from '@/assets/inline-svgs/icons/receipt.svg';
import confetti from 'canvas-confetti';
export const ThanksPage = () => ({
	components: {
		CheckoutReceipt,
		SocialShare,
		IconReceipt
	},
	template: `
		<div>
			<div style="text-align: center; margin-bottom: 2rem;">
				<h1>
					{{ lender.firstName }}, thanks to you, {{ loans.length }}
					{{ loans.length > 1 ? 'borrowers are' : 'borrower is' }} closer to their dreams!
				</h1>
				<p>
					But the journey isn't over for them and many other borrowers.<br>
					Please tell your friends and multiply your impact
				</p>
			</div>

			<social-share
				:loans="loans"
			/>

			<div style="text-align: center; margin: 2rem 0;">
				<p>Confirmation sent to: {{ lender.email }}.</p>
				<button @click="toggleReceipt">
					<icon-receipt style="width: 16px" />
					<span>{{ isReceiptVisible ? 'Hide' : 'Show' }} Receipt</span>
				</button>
			</div>

			<checkout-receipt
				v-if="isReceiptVisible"
				:lender="lender"
				:receipt-data="receiptData"
			/>
		</div>
	`,
	props: {
		lender: {
			type: Object,
			default() {
				return mockedUserAccount.data.my.userAccount
			}
		},
		receiptData: {
			type: Object,
			default() {
				return receiptData.data.shop.receipt
			}
		},
		loans: {
			type: Array,
			default() {
				return mockedLoans.data.lend.loans.values
			}
		},
	},
	data() {
		return {
			isReceiptVisible: {
				type: Boolean,
				default: boolean('isReceiptVisible', true)
			}
		}
	},
	methods: {
		toggleReceipt() {
			this.isReceiptVisible = !this.isReceiptVisible;
		}
	},
	mounted() {
		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150	,
			spread: 200,
			colors: ['#d74937','#6859c0','#fee259','#118aec','#DDFFF4','#4faf4e','#aee15c'] // misc. kiva colors
		});
	},
});
