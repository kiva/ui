import SocialShareButton from '@/components/BorrowerProfile/SocialShareButton';
import mockedReceiptData from '../mock-data/receipt-data-mock';

const mockedAPIResponse = {
	"data": {
		"my": {
			"userAccount": {
				"firstName": "Alan",
				"lastName": "Smithee",
				"email": "user_1003394@braincrave.org",
				"inviterName": "alans",
				"public": true
			}
		}
	}
}

export default {
	title: 'Components/SocialShareButton',
	component: SocialShareButton,
};

export const Default = () => ({
	components: {
		SocialShareButton,
	},
	template: `
		<social-share-button
			:lender="lender"
			:loan="loan"
		/>
	`,
	props: {
		lender: {
			type: Object,
			default() {
				return {
					...mockedAPIResponse.data.my.userAccount,
				};
			}
		},
		loan: {
			type: Object,
			default() {
				return mockedReceiptData.items.values[0].loan;
			}
		},
	},
});
