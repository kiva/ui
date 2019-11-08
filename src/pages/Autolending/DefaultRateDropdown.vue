<template>
	<div>
		<h3 class="filter-title">
			Partner default rate
		</h3>
		<kv-dropdown-rounded v-model="defaultRate">
			<option value="0">
				All
			</option>
			<option value="1">
				1% or less
			</option>
			<option value="2">
				2% or less
			</option>
			<option value="3">
				3% or less
			</option>
			<option value="4">
				4% or less
			</option>
			<option value="5">
				5% or less
			</option>
			<option value="6">
				6% or less
			</option>
			<option value="7">
				7% or less
			</option>
			<option value="8">
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
			defaultRate: 0,
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
			const defaultRateMax = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.defaultRate.max') || 0;
			this.defaultRate = defaultRateMax;
		},
	},
	watch: {
		defaultRate(defaultRateMax, previousDefaultRateMax) {
			let defaultRate = null;
			if (defaultRateMax !== previousDefaultRateMax) {
				defaultRate = defaultRateMax;
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										defaultRate: {
											min: 0
											max: ${defaultRate || null}
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
