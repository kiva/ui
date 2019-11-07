<template>
	<div>
		<h3 class="filter-title">
			Loan term
		</h3>
		<kv-dropdown-rounded v-model="loanTerm">
			<option value="default">
				All loan terms
			</option>
			<option value="6">
				6 months or less
			</option>
			<option value="12">
				12 months or less
			</option>
			<option value="18">
				18 months or less
			</option>
			<option value="24">
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
				this.loanTerm = 6;
			} else if (loanTermMax > 6 && loanTermMax <= 12) {
				this.loanTerm = 12;
			} else if (loanTermMax > 12 && loanTermMax <= 18) {
				this.loanTerm = 18;
			} else if (loanTermMax > 18 && loanTermMax <= 24) {
				this.loanTerm = 24;
			}
		},
	},
	watch: {
		loanTerm(loanTermMax, previousLoanTermMax) {
			let loanTerm = null;
			if (loanTermMax !== previousLoanTermMax) {
				if (loanTermMax === 6) {
					loanTerm = 6;
				} else if (loanTermMax === 12) {
					loanTerm = 12;
				} else if (loanTermMax === 18) {
					loanTerm = 18;
				} else if (loanTermMax === 24) {
					loanTerm = 24;
				}
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria {
									filters {
										lenderTerm {
											max: ${loanTerm}
										}
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

<style lang="scss">
@import 'settings';

.filter-title {
	font-size: 1rem;
	color: $kiva-text-light;
	margin-bottom: 0.5rem;
}

</style>
