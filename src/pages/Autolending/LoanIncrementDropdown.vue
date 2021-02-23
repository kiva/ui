<template>
	<div class="loan-increment-dropdown">
		<h3 class="filter-title">
			Loan sizes
		</h3>
		<kv-dropdown-rounded v-model="loanIncrement">
			<option value="any">
				Any amounts
			</option>
			<option value="25">
				$25
			</option>
			<option value="50">
				$50
			</option>
			<option value="75">
				$75
			</option>
			<option value="100">
				$100
			</option>
			<option value="250">
				$250
			</option>
			<option value="500">
				$500
			</option>
			<option value="1000">
				$1000
			</option>
		</kv-dropdown-rounded>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		KvDropdownRounded,
	},
	data() {
		return {
			loanIncrement: 'any',
		};
	},
	apollo: {
		query: gql`query autolendProfileLoanLimit {
			autolending @client {
				currentProfile {
					id
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
					mutation: gql`mutation updateLoanLimit($loanLimit: Int) {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										loanLimit: $loanLimit
									}
								}
							})
						}
					}`,
					variables: {
						loanLimit: loanIncrement === 'any' ? null : Number(loanIncrement),
					},
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
