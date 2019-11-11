<template>
	<div>
		<h3 class="filter-title">
			Risk Rating
		</h3>
		<kv-dropdown-rounded v-model="riskRating">
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
			riskRating: 0,
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
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
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										riskRating: {
											min: ${riskRating || null}
											max: 5
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
