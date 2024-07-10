<template>
	<div>
		<h3 class="tw-mb-2">
			Loan terms
		</h3>
		<kv-select v-model="loanTerm">
			<option value="0">
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
		</kv-select>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import KvSelect from '@/components/Kv/KvSelect';

export default {
	name: 'LoanTermDropdown',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvSelect,
	},
	data() {
		return {
			loanTerm: 0,
		};
	},
	apollo: {
		query: gql`query autolendProfileLoanTerm {
			autolending @client {
				id
				currentProfile {
					id
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
			this.loanTerm = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.lenderTerm.max') || 0;
		},
	},
	watch: {
		loanTerm(loanTermMax, previousLoanTermMax) {
			if (loanTermMax !== previousLoanTermMax) {
				this.apollo.mutate({
					mutation: gql`mutation updateLoamTerm($max: Float) {
						autolending @client {
							id
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										lenderTerm: {
											min: 0
											max: $max
										}
									}
								}
							})
						}
					}`,
					variables: {
						max: Number(loanTermMax) || null,
					},
				});
			}
		}
	},
};
</script>
