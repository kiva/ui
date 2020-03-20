<template>
	<www-page>
		<div class="row align-center monthly-good-thanks-page">
			<div class="small-12 medium-11 large-8 column">
				<h1 class="text-center impact-text">
					<icon-confirmation class="icon-confirmation" /> You joined Monthly Good!
				</h1>

				<p class="text-center">
					${{ mgAmount }}/month
					<span v-if="donation > 0">(along with a ${{ donation }} donation)</span>
				</p>

				<div class="panel">
					<p class="text-center">
						<strong>
							Based on your contribution, you'll support your first borrower {{ monthWording }}.
						</strong>
					</p>
					<p class="text-center">
						<strong><em>This is our best guess but loan lengths and repayment rates vary.</em></strong>
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
import IconConfirmation from '@/assets/inline-svgs/icons/confirmation.svg';
import WwwPage from '@/components/WwwFrame/WwwPage';
import userInfoQuery from '@/graphql/query/userInfo.graphql';

const pageQuery = gql`{
	my {
		autoDeposit {
			id
			amount
			donateAmount
			dayOfMonth
			isSubscriber
		}
	}
}`;

export default {
	components: {
		IconConfirmation,
		WwwPage,
	},
	data() {
		return {
			mgAmount: 0,
			donation: 0,
			dayOfMonth: new Date().getDate(),
			// user flags
			isMonthlyGoodSubscriber: false,
		};
	},
	inject: ['apollo'],
	apollo: {
		query: pageQuery,
		preFetch(config, client, { route }) {
			return client.query({ query: userInfoQuery })
				.then(({ data }) => {
					const userId = _get(data, 'my.userAccount.id');
					if (!userId) {
						throw new Error('activeLoginRequired');
					}
				})
				.then(() => {
					return client.query({ query: pageQuery, fetchPolicy: 'network-only' });
				})
				.catch(e => {
					if (e.message.indexOf('activeLoginRequired') > -1) {
						// Force a login when active login is required
						return Promise.reject({
							path: '/ui-login',
							query: { doneUrl: route.fullPath }
						});
					}
					if (e.message.indexOf('notMonthlyGoodSubscriber') > -1) {
						// Force a login when active login is required
						return Promise.reject({
							path: '/monthlygood',
						});
					}
					// Log other errors
					console.error(e);
				});
		},
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			if (!this.isMonthlyGoodSubscriber) {
				this.$router.push({ path: '/monthlygood' });
			}
			const totalAmount = numeral(_get(data, 'my.autoDeposit.amount', 0)).format('0.00');
			this.donation = numeral(_get(data, 'my.autoDeposit.donateAmount', 0)).format('0.00');
			this.mgAmount = totalAmount - this.donation;
			this.dayOfMonth = _get(data, 'my.autoDeposit.dayOfMonth');
		},
	},
	computed: {
		monthWording() {
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
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.monthly-good-thanks-page {
	padding-top: 1rem;

	h1 { margin-bottom: 1rem; }

	.icon-confirmation {
		height: 3rem;
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
