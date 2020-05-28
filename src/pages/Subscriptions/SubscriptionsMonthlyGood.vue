<template>
	<div class="row mg-area">
		<div class="column large-8 settings-card">
			<div class="icon-wrapper">
				<kv-icon
					class="icon"
					title="Monthly Good"
					name="auto-icon-when"
				/>
			</div>
			<div class="title-wrapper">
				<h3 v-if="!isOnetime">
					Monthly Good
				</h3>
				<h3 v-if="isOnetime">
					Global COVID-19 Response Lending
				</h3>
			</div>
			<div class="content-wrapper">
				<router-link v-if="!isMonthlyGoodSubscriber"
					to="/monthlygood"
				>
					Sign up for a Kiva Monthly Good subscription
				</router-link>
				<div v-if="isMonthlyGoodSubscriber && !isOnetime">
					<p>
						On the {{ dayOfMonth | numeral('Oo') }} of each month ${{ autoDepositAmount }} will be
						transferred from PayPal <span v-if="selectedGroupDescriptor">to support
							{{ selectedGroupDescriptor }}</span>.
					</p>
				</div>
				<div v-if="isMonthlyGoodSubscriber && isOnetime">
					<p class="one-time-message">
						Thank you for supporting those affected by COVID-19. Your deposit will occur within one hour,
						after which you will be unable to cancel.
						<!-- ! TODO <a>Cancel contribution</a> -->
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import numeral from 'numeral';
import KvIcon from '@/components/Kv/KvIcon';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

const pageQuery = gql`{
	my {
		autoDeposit {
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
	inject: ['apollo'],
	components: {
		KvIcon,
	},
	data() {
		return {
			autoDepositAmount: 0,
			autoDepositId: null,
			category: null,
			dayOfMonth: new Date().getDate(),
			donation: 0,
			isMonthlyGoodSubscriber: false,
			isOnetime: false,
			selectedGroupDescriptor: ''
		};
	},
	mixins: [
		loanGroupCategoriesMixin
	],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			});
		},
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			if (this.isMonthlyGoodSubscriber) {
				this.isOnetime = _get(data, 'my.autoDeposit.isOnetime', false);
				this.autoDepositAmount = numeral(_get(data, 'my.autoDeposit.amount', 0)).format('0.00');
				this.donation = numeral(_get(data, 'my.autoDeposit.donateAmount', 0)).format('0.00');
				this.dayOfMonth = _get(data, 'my.autoDeposit.dayOfMonth');
				this.category = _get(data, 'my.monthlyGoodCategory');

				// eslint-disable-next-line max-len
				const selectedCategory = this.lendingCategories.find(category => category.value === this.category) || {};
				// Sanitize and set initial form values.
				this.selectedGroupDescriptor = selectedCategory ? selectedCategory.shortName : '';
			}
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
