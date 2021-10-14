<template>
	<www-page>
		<div class="row align-center monthly-good-thanks-page">
			<div class="small-12 medium-11 large-8 column">
				<h1 class="tw-text-center impact-text">
					<kv-icon name="confirmation" class="icon-confirmation" /> {{ headline }}
				</h1>

				<p class="tw-text-center">
					Your contribution: ${{ mgAmount }}<span v-if="!isOnetime">/month</span>
					<span v-if="donation > 0">(including your ${{ donation }} donation)</span>
				</p>

				<div class="panel" v-if="!fromCovidLanding">
					<p class="tw-text-center">
						<strong>
							Based on your contribution, you'll support your first borrower {{ monthWording }}.
						</strong>
					</p>
					<p class="tw-text-center">
						<strong><em>This is our best guess but loan lengths and repayment rates vary.</em></strong>
					</p>
				</div>
				<div class="panel" v-else>
					<p class="tw-text-center">
						<strong>
							Thank you for choosing to support someone who has been impacted by COVID‑19 coronavirus.
						</strong>
					</p>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import numeral from 'numeral';

import { addMonths, formatDistanceToNow } from 'date-fns';
import KvIcon from '@/components/Kv/KvIcon';
import WwwPage from '@/components/WwwFrame/WwwPage';

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
	components: {
		KvIcon,
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
			category: null
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

<style lang="scss" scoped>
@import 'settings';

.monthly-good-thanks-page {
	padding-top: 4rem;

	h1 { margin-bottom: 1rem; }

	.icon-confirmation {
		height: 3rem;
		width: 3rem;
		color: $kiva-green;
		fill: $kiva-green;
		vertical-align: middle;
		margin-top: -0.65rem;
	}

	.panel {
		border: 1px solid $light-gray;
		padding: 1rem 1rem 0;
		background-color: $platinum;
		margin: 2rem auto;
	}
}
</style>
