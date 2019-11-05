<template>
	<div>
		<h3 class="filter-title">
			Risk Rating
		</h3>
		<kv-dropdown-rounded v-model="riskRating">
			<option value="1-star-up">
				&#9733; and up
			</option>
			<option value="2-star-up">
				&#9733; &#9733; and up
			</option>
			<option value="3-star-up">
				&#9733; &#9733; &#9733; and up
			</option>
			<option value="4-star-up">
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
			riskRating: '1-star-up',
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
			const riskRatingMin = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.riskRating.min');

			if (riskRatingMin <= 1.9) {
				this.riskRating = '1-star-up';
			} else if (riskRatingMin <= 2.9) {
				this.riskRating = '2-star-up';
			} else if (riskRatingMin <= 3.9) {
				this.riskRating = '3-star-up';
			} else if (riskRatingMin <= 5) {
				this.riskRating = '4-star-up';
			}
		},
	},
	watch: {
		riskRating(riskRatingMin, previousRiskRatingMin) {
			let riskRating = null;
			if (riskRatingMin !== previousRiskRatingMin) {
				if (riskRatingMin === '1-star-up') {
					riskRating = 1;
				} else if (riskRatingMin === '2-star-up') {
					riskRating = 2;
				} else if (riskRatingMin === '3-star-up') {
					riskRating = 3;
				} else if (riskRatingMin === '4-star-up') {
					riskRating = 4;
				}
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { riskRating: ${riskRating} })
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
