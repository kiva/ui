import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import mockedReceiptData from '../mock-data/receipt-data-mock';

// https://api-vm.kiva.org/graphqlgraphql?user_id=1003394&app_id=org.kiva.www&query=query%20checkoutReceipt%20%7B%20%0A%09shop%20%7B%0A%09%09receipt(checkoutId%3A%2038663432)%20%7B%0A%09%09%09credits%20%7B%0A%09%09%09%09values%20%7B%0A%09%09%09%09%09creditType%0A%09%09%09%09%09amount%0A%09%09%09%09%7D%0A%09%09%09%7D%0A%09%09%09totals%20%7B%0A%20%20%20%20%20%20%20%20bonusAppliedTotal%0A%09%09%09%09itemTotal%0A%09%09%09%09donationTotal%0A%09%09%09%09kivaCardTotal%0A%09%09%09%09depositTotals%20%7B%0A%09%09%09%09%09depositTotal%0A%09%09%09%09%09kivaCreditAdded%0A%09%09%09%09%09kivaCreditUsed%0A%09%09%09%09%7D%0A%20%20%20%20%20%20%20%20freeTrialAppliedTotal%0A%09%09%09%09kivaCreditAppliedTotal%0A%20%20%20%20%20%20%20%20redemptionCodeAppliedTotal%0A%20%20%20%20%20%20%20%20universalCodeAppliedTotal%0A%09%09%09%7D%0A%09%09%09hasFreeCredits%0A%09%09%09items%20%7B%0A%09%09%09%09totalCount%0A%09%09%09%09values%20%7B%0A%09%09%09%09%09id%0A%09%09%09%09%09price%0A%09%09%09%09%09basketItemType%0A%09%09%09%09%09...%20on%20KivaCard%20%7B%0A%09%09%09%09%09%09individualPrice%0A%09%09%09%09%09%09basketItemType%0A%09%09%09%09%09%09kivaCardObject%20%7B%0A%09%09%09%09%09%09%09deliveryType%0A%09%09%09%09%09%09%09mailingInfo%20%7B%0A%09%09%09%09%09%09%09%09firstName%0A%09%09%09%09%09%09%09%09lastName%0A%09%09%09%09%09%09%09%09address%0A%09%09%09%09%09%09%09%09address2%0A%09%09%09%09%09%09%09%09city%0A%09%09%09%09%09%09%09%09state%0A%09%09%09%09%09%09%09%09zip%0A%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%09recipient%20%7B%0A%09%09%09%09%09%09%09%09name%0A%09%09%09%09%09%09%09%09email%0A%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%7D%0A%09%09%09%09%09%7D%0A%09%09%09%09%09...%20on%20LoanReservation%20%7B%0A%09%09%09%09%09%09loan%20%7B%0A%09%09%09%09%09%09%09name%0A%09%09%09%09%09%09%09id%0A%09%09%09%09%09%09%09image%20%7B%0A%09%09%09%09%09%09%09%09url%0A%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%09use%0A%09%09%09%09%09%09%09geocode%20%7B%0A%09%09%09%09%09%09%09%09city%0A%09%09%09%09%09%09%09%09country%20%7B%0A%09%09%09%09%09%09%09%09%09name%0A%09%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%09%7D%0A%09%09%09%09%09%09%7D%0A%09%09%09%09%09%7D%0A%09%09%09%09%7D%0A%09%09%09%7D%0A%09%09%7D%0A%09%7D%0A%09my%20%7B%0A%09%09userAccount%20%7B%0A%09%09%09firstName%0A%09%09%09lastName%0A%09%09%09email%0A%09%09%7D%0A%09%7D%0A%7D%0A&operationName=checkoutReceipt
const mockedAPIResponse = {
	"data": {
		"my": {
			"userAccount": {
				"firstName": "Alan",
				"lastName": "Smithee",
				"email": "user_1003394@braincrave.org",
				"inviterName": "alans"
			}
		}
	}
}
export default {
	title: 'Components/CheckoutReceipt',
	component: CheckoutReceipt,
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
				return mockedAPIResponse.data.my.userAccount
			}
		},
		receipt: {
			type: Object,
			default() {
				return mockedReceiptData
			}
		}
	},
});
