<template>
	<div>
		<h3 class="tw-mb-2">
			Field Partner default rates
		</h3>
		<kv-select v-model="defaultRate">
			<option value="0">
				All
			</option>
			<option value="0.01">
				1% or less
			</option>
			<option value="0.02">
				2% or less
			</option>
			<option value="0.03">
				3% or less
			</option>
			<option value="0.04">
				4% or less
			</option>
			<option value="0.05">
				5% or less
			</option>
			<option value="0.06">
				6% or less
			</option>
			<option value="0.07">
				7% or less
			</option>
			<option value="0.08">
				8% or less
			</option>
		</kv-select>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import KvSelect from '@/components/Kv/KvSelect';

export default {
	name: 'DefaultRateDropdown',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvSelect,
	},
	data() {
		return {
			defaultRate: 0,
		};
	},
	apollo: {
		query: gql`query autolendProfileDefaultRate {
			autolending @client {
				currentProfile {
					id
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
				defaultRate = Number(defaultRateMax) || null;
				this.apollo.mutate({
					mutation: gql`mutation updateDefaultRate($defaultRate: Float) {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										defaultRate: {
											min: 0
											max: $defaultRate
										}
									}
								}
							})
						}
					}`,
					variables: {
						defaultRate,
					},
				});
			}
		}
	},
};
</script>
