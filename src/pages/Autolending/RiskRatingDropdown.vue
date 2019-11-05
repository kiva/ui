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
			<option value="5-star-up">
				&#9733; &#9733; &#9733; &#9733; &#9733; and up
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
								max
							}
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			console.log('data:', data)
			// eslint-disable-next-line max-len 
			const riskRatingMax = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.riskRating.max');
			const riskRatingMin = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.riskRating.min');
			console.log('riskRatingMax', riskRatingMax);
			console.log('riskRatingMin', riskRatingMin);

			if (riskRatingMax <= 1) {
				this.riskRating = '1-star-up';
			} else if (riskRatingMax <= 2) {
				this.riskRating = '2-star-up';
			} else if (riskRatingMax <= 3) {
				this.riskRating = '3-star-up';
			} else if (riskRatingMax <= 4) {
				this.riskRating = '4-star-up';
			} else if (riskRatingMax <= 5) {
				this.riskRating = '5-star-up';
			}
		},
	},
	watch: {
		delinquencyRate(riskRatingMax, previousRiskRatingMax) {
			let riskRating = null;
			if (riskRatingMax !== previousRiskRatingMax) {
				if (riskRatingMax === '5-or-less') {
					riskRating = 5;
				} else if (riskRatingMax === '10-or-less') {
					riskRating = 10;
				} else if (riskRatingMax === '15-or-less') {
					riskRating = 15;
				} else if (riskRatingMax === '20-or-less') {
					riskRating = 20;
				} else if (riskRatingMax === '25-or-less') {
					riskRating = 25;
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
