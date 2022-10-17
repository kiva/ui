<template>
	<div class="loan-increment-dropdown">
		<h3 class="tw-mb-2">
			Max loan amount
		</h3>
		<kv-select v-model="loanIncrement">
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
		</kv-select>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvSelect from '@/components/Kv/KvSelect';

export default {
	name: 'LoanIncrementDropdown',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvSelect,
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
