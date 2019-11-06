<template>
	<div>
		<h3 class="filter-title">
			Partner default rate
		</h3>
		<kv-dropdown-rounded v-model="defaultRate">
			<option value="default">
				All
			</option>
			<option value="1-or-less">
				1% or less
			</option>
			<option value="2-or-less">
				2% or less
			</option>
			<option value="3-or-less">
				3% or less
			</option>
			<option value="4-or-less">
				4% or less
			</option>
			<option value="5-or-less">
				5% or less
			</option>
			<option value="6-or-less">
				6% or less
			</option>
			<option value="7-or-less">
				7% or less
			</option>
			<option value="8-or-less">
				8% or less
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
			defaultRate: 'default',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					loanSearchCriteria {
						filters {
							defaultRate {
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
			const defaultRateMax = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.defaultRate.max');
			console.log('default rate max', defaultRateMax);

			if (defaultRate <= 5) {
				this.defaultRate = '5-or-less';
			} else if (defaultRate > 5 && defaultRate <= 10) {
				this.defaultRate = '10-or-less';
			} else if (defaultRate > 10 && defaultRate <= 15) {
				this.defaultRate = '15-or-less';
			} else if (defaultRate > 15 && defaultRate <= 20) {
				this.defaultRate = '20-or-less';
			} else if (defaultRate > 20 && defaultRate <= 25) {
				this.defaultRate = '25-or-less';
			}
		},
	},
	watch: {
		defaultRate(defaultRateMax, previousDefaultRateMax) {
			let defaultRate = null;
			if (defaultRateMax !== previousDefaultRateMax) {
				if (defaultRateMax === '5-or-less') {
					defaultRate = 5;
				} else if (defaultRateMax === '10-or-less') {
					defaultRate = 10;
				} else if (defaultRateMax === '15-or-less') {
					defaultRate = 15;
				} else if (defaultRateMax === '20-or-less') {
					defaultRate = 20;
				} else if (defaultRateMax === '25-or-less') {
					defaultRate = 25;
				}
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { defaultRate: ${defaultRate} })
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
