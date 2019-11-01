<template>
	<div>
		<h3 class="filter-title">
			Loan term
		</h3>
		<kv-dropdown-rounded v-model="loanTerm">
			<option value="default">
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
import gql from 'graphql-tag';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

export default {
	inject: ['apollo'],
	components: {
		KvDropdownRounded,
	},
	data() {
		return {
			loanTerm: 'default',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					loanSearchCriteria {
						filters {
							lenderTerm {
								max
							}
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			const loanTermMax = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.lenderTerm.max');
			if (loanTermMax <= 6) {
				this.loanTerm = '6m-or-less';
			} else if (loanTermMax > 6 && loanTermMax <= 12) {
				this.loanTerm = '12m-or-less';
			} else if (loanTermMax > 12 && loanTermMax <= 18) {
				this.loanTerm = '18m-or-less'
			} else if (loanTermMax > 18 && loanTermMax <= 24) {
				this.loanTerm = '24m-or-less'
			}
		},
	},
	watch: {
		loanTerm(loanTermMax, previousLoanTermMax) {
			let loanTerm = null;
			if (loanTermMax !== previousLoanTermMax) {		
				if (loanTermMax === '6m-or-less') {
					loanTerm = 6;
				}
				else if (loanTermMax === '12m-or-less' ) {
					loanTerm = 12;
				} else if (loanTermMax === '18m-or-less') {
					loanTerm = 18;
				} else if (loanTermMax === '24m-or-less') {
					loanTerm = 24;
				}
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
