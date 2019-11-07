<template>
	<div>
		<h3 class="filter-title">
			Partner delinquency rate
		</h3>
		<kv-dropdown-rounded v-model="delinquencyRate">
			<option value="50">
				All delinquency rates
			</option>
			<option value="5">
				5% or less
			</option>
			<option value="10">
				10% or less
			</option>
			<option value="15">
				15% or less
			</option>
			<option value="20">
				20% or less
			</option>
			<option value="25">
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
			delinquencyRate: '50',
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
			const delinquencyRateMax = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.arrearsRate.max');
			this.delinquencyRate = delinquencyRateMax;
		},
	},
	watch: {
		delinquencyRate(delinquencyRateMax, previousDelinquencyRateMax) {
			let delinquencyRate = null;
			if (delinquencyRateMax !== previousDelinquencyRateMax) {
				delinquencyRate = delinquencyRateMax;
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										arrearsRate: {
											max: ${delinquencyRate}
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
