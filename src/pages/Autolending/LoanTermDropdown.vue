<template>
	<div>
		<h3 class="filter-title">
			Loan term
		</h3>
		<kv-dropdown-rounded v-model="loanTerm">
			<option value="all">
				All loan terms
			</option>
			<option value="6m-or-less">
				6 months or less
			</option>
			<option value="12m-or-less">
				12 months or less
			</option>
			<option value="18m-or-less">
				18 months or less
			</option>
			<option value="24m-or-less">
				24 months or less
			</option>
		</kv-dropdown-rounded>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _isFinite from 'lodash/isFinite';
import gql from 'graphql-tag';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

export default {
	inject: ['apollo'],
	components: {
		KvDropdownRounded,
	},
	data() {
		return {
			loanTerm: 'all',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					loanSearchCriteria {
						filters {
							lenderTerm
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			const loanTermMin = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.lenderTerm.min');
			console.log('loan term:', loanTermMin);
			// Here I'll have to handle the date ranges from the endpoint
			// which comes through as a min and max
			// this.loanTerm = _isFinite(loanTerm) ? loanTerm : 'all';
		},
	},
	watch: {
		donation(loanTerm, previousLoanTerm) {
			if (loanTerm !== previousLoanTerm) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { lenderTerm: ${loanTerm} })
						}
					}`,
				});
			}
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.filter-title {
	font-size: 1rem;
	color: $kiva-text-light;
	margin-bottom: 0.5rem;
}

</style>
