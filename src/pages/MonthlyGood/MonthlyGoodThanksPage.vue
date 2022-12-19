<template>
	<www-page>
		<kv-default-wrapper class="monthly-good-thanks-page row align-center">
			<div class="small-12 medium-11 large-9 column tw-text-center">
				<h1 class="tw-text-center tw-mb-2">
					<kv-material-icon
						:icon="mdiCheckCircle"
						style="height: 1em; width: 1em; margin-top: -0.25em;"
						class="tw-text-brand tw-align-middle"
					/>
					{{ headline }}
				</h1>
				<p class="tw-text-subhead tw-mb-6">
					Your contribution: ${{ mgAmount }}<span v-if="!isOnetime">/month</span>
					<span v-if="donation > 0">(including your ${{ donation }} donation)</span>
				</p>
				<div v-if="fromCovidLanding" class="tw-font-medium tw-bg-secondary tw-p-4 ">
					<p>
						Thank you for choosing to support someone who has been impacted by COVID‑19 coronavirus.
					</p>
				</div>
			</div>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import numeral from 'numeral';
import { mdiCheckCircle } from '@mdi/js';

import { addMonths, formatDistanceToNow } from 'date-fns';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const pageQuery = gql`query monthlyGoodThanksPage {
	my {
		autoDeposit {
			id
			amount
			donateAmount
			dayOfMonth
			isSubscriber
			isOnetime
		}
		monthlyGoodCategory
	}
}`;

export default {
	name: 'MonthlyGoodThanksPage',
	metaInfo: {
		title: 'Joined successfully'
	},
	components: {
		KvDefaultWrapper,
		KvMaterialIcon,
		WwwPage,
	},
	props: {
		onetime: {
			type: String,
			default: 'false'
		},
		source: {
			type: String,
			default: ''
		},
		paymentType: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			mgAmount: 0,
			donation: 0,
			autoDepositAmount: 0,
			dayOfMonth: new Date().getDate(),
			// user flags
			isMonthlyGoodSubscriber: false,
			isOnetimePayment: null,
			autoDepositId: null,
			category: null,
			mdiCheckCircle,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			if (!this.isMonthlyGoodSubscriber) {
				this.$router.push({ path: '/monthlygood' });
			}
			this.autoDepositAmount = numeral(_get(data, 'my.autoDeposit.amount', 0)).format('0.00');
			this.donation = numeral(_get(data, 'my.autoDeposit.donateAmount', 0)).format('0.00');
			this.mgAmount = this.autoDepositAmount - this.donation;
			this.dayOfMonth = _get(data, 'my.autoDeposit.dayOfMonth');
			this.category = _get(data, 'my.monthlyGoodCategory');
			this.isOnetimePayment = _get(data, 'my.autoDeposit.isOnetime');
			this.autoDepositId = _get(data, 'my.autoDeposit.id');
		},
	},
	mounted() {
		// eslint-disable-next-line max-len
		const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_monthlygood_checkout_event_schema_1_0_1.json#';
		const mgSubscriptionType = this.isOnetimePayment ? 'one-time' : 'monthly';
		const checkoutEventData = {
			schema,
			data: {
				id: this.autoDepositId,
				subscriptionType: mgSubscriptionType,
				category: this.category,
				depositAmount: this.autoDepositAmount,
				donationAmount: this.donation,
				paymentType: this.paymentType
			},
		};
		this.$kvTrackSelfDescribingEvent(checkoutEventData);
	},
	computed: {
		headline() {
			if (this.fromCovidLanding) {
				return 'You joined the Global COVID‑19 Response Fund!';
			}
			return 'You joined Monthly Good!';
		},
		monthWording() {
			try {
				let numOfMonthUntilLoan = Math.ceil(25 / this.mgAmount);
				if (this.dayOfMonth < new Date().getDate()) {
					numOfMonthUntilLoan += 1;
				}
				if (numOfMonthUntilLoan === 1) {
					return 'this month';
				} if (numOfMonthUntilLoan === 2) {
					return 'next month';
				}
				const dateOfFirstLoan = addMonths(new Date(), numOfMonthUntilLoan);
				return `in ${formatDistanceToNow(dateOfFirstLoan)}`;
			} catch {
				// This catch avoids a 500 error if this url is reached in an erroneous state
				return '';
			}
		},
		isOnetime() {
			// ensure this is cast to a bool for use in Graphql mutation
			return this.onetime === 'true';
		},
		fromCovidLanding() {
			return this.source === 'covid19response';
		}
	},
};
</script>
