<template>
	<div>
		<h3 class="tw-mb-2">
			Field Partner risk ratings
		</h3>
		<kv-select v-model="riskRating">
			<option value="0">
				All loans
			</option>
			<option value="1">
				&#9733; and up
			</option>
			<option value="2">
				&#9733; &#9733; and up
			</option>
			<option value="3">
				&#9733; &#9733; &#9733; and up
			</option>
			<option value="4">
				&#9733; &#9733; &#9733; &#9733; and up
			</option>
		</kv-select>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import KvSelect from '@/components/Kv/KvSelect';

export default {
	name: 'RiskRatingDropdown',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvSelect,
	},
	data() {
		return {
			riskRating: 0,
		};
	},
	apollo: {
		query: gql`query autolendProfileRiskRating {
			autolending @client {
				id
				currentProfile {
					id
					loanSearchCriteria {
						filters {
							riskRating {
								min
							}
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			// eslint-disable-next-line max-len
			const riskRatingMin = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.riskRating.min') || 0;
			this.riskRating = riskRatingMin;
		},
	},
	watch: {
		riskRating(riskRatingMin, previousRiskRatingMin) {
			let riskRating = null;
			if (riskRatingMin !== previousRiskRatingMin) {
				riskRating = riskRatingMin;
				this.apollo.mutate({
					mutation: gql`mutation updateRiskRating($min: Float) {
						autolending @client {
							id
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										riskRating: {
											min: $min
											max: 5
										}
									}
								}
							})
						}
					}`,
					variables: {
						min: Number(riskRating) || null,
					},
				});
			}
		}
	},
};
</script>
