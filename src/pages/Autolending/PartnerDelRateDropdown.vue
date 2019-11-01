<template>
	<div>
		<h3 class="filter-title">
			Partner delinquency rate
		</h3>
		<kv-dropdown-rounded v-model="delinquencyRate">
			<option value="default">
				All delinquency rates
			</option>
			<option value="5-or-less">
				5% or less
			</option>
			<option value="10-or-less">
				10% or less
			</option>
			<option value="15-or-less">
				15% or less
			</option>
			<option value="20-or-less">
				20% or less
			</option>
			<option value="25-or-less">
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
			delinquency: 'default',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					loanSearchCriteria {
						filters {
							delinquencyRate {
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
			const delinquencyRate = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.loanTerm.max');
			if (delinquencyRate <= 5) {
				this.loanTerm = '5-or-less';
			} else if (delinquencyRate > 5 && delinquencyRate <= 10) {
				this.loanTerm = '10-or-less';
			} else if (delinquencyRate > 10 && delinquencyRate <= 15) {
				this.loanTerm = '15-or-less';
			} else if (delinquencyRate > 15 && delinquencyRate <= 20) {
				this.loanTerm = '20-or-less';
			} else if (delinquencyRate > 20 && delinquencyRate <= 25) {
				this.loanTerm = '25-or-less';
			}
		},
	},
	watch: {
		delinquencyRate(delinquencyRateMax, previousDelinquencyRateMax) {
			let delinquencyRate = null;
			if (delinquencyRateMax !== previousDelinquencyRateMax) {
				if (delinquencyRateMax === '5-or-less') {
					delinquencyRate = 5;
				} else if (delinquencyRateMax === '10-or-less') {
					delinquencyRate = 10;
				} else if (delinquencyRateMax === '15-or-less') {
					delinquencyRate = 15;
				} else if (delinquencyRateMax === '20-or-less') {
					delinquencyRate = 20;
				} else if (delinquencyRateMax === '25-or-less') {
					delinquencyRate = 25;
				}
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { delinquencyRate: ${delinquencyRate} })
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
