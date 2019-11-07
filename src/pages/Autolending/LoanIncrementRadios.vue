<template>
	<div class="loan-increment-radios">
		<h3 class="filter-title">
			Loan increment
		</h3>
		<kv-radio
			label-set="loanIncrementRadioSetAny"
			name-set="loanIncrementRadio"
			radio-value="any"
			v-model="loanIncrement"
			class="filter-radio"
		>
			Any amount
		</kv-radio>
		<kv-radio
			label-set="LoanIncrementRadioSet25"
			name-set="LoanIncrementRadio"
			radio-value="25"
			v-model="loanIncrement"
			class="filter-radio"
		>
			Limit my loans to $25 increments
		</kv-radio>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvRadio from '@/components/Kv/KvRadio';

export default {
	inject: ['apollo'],
	components: {
		KvRadio,
	},
	data() {
		return {
			loanIncrement: 'any',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					loanSearchCriteria {
						filters {
							loanLimit
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.loanIncrement = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.loanLimit') || 'any';
		},
	},
	watch: {
		loanIncrement(loanIncrement, previousLoanIncrement) {
			if (loanIncrement !== previousLoanIncrement) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										loanLimit: ${loanIncrement === 'any' ? null : loanIncrement}
									}
								}
							})
						}
					}`,
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.filter-title {
	font-size: 1rem;
	color: $kiva-text-light;
}

.filter-radio {
	display: block;
	margin: 0 0 0 -0.875rem;
}

</style>
