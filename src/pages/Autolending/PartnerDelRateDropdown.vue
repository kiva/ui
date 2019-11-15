<template>
	<div>
		<h3 class="filter-title">
			Partner delinquency rate
		</h3>
		<kv-dropdown-rounded v-model="delinquencyRate">
			<option value="0">
				All delinquency rates
			</option>
			<option value="0.05">
				5% or less
			</option>
			<option value="0.1">
				10% or less
			</option>
			<option value="0.15">
				15% or less
			</option>
			<option value="0.2">
				20% or less
			</option>
			<option value="0.25">
				25% or less
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
			delinquencyRate: 0,
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					loanSearchCriteria {
						filters {
							arrearsRate {
								max
							}
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			// eslint-disable-next-line max-len
			this.delinquencyRate = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.arrearsRate.max') || 0;
		},
	},
	watch: {
		delinquencyRate(delinquencyRateMax, previousDelinquencyRateMax) {
			if (delinquencyRateMax !== previousDelinquencyRateMax) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										arrearsRate: {
											min: 0
											max: ${delinquencyRateMax || null}
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
