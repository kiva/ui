<template>
	<div class="gender-radios">
		<h3 class="filter-title">
			Gender
		</h3>
		<kv-radio
			label-set="genderRadioSetBoth"
			name-set="genderRadio"
			radio-value="both"
			v-model="gender"
			class="both-radio"
		>
			Everyone
		</kv-radio>
		<br>
		<kv-radio
			label-set="genderRadioSetFemale"
			name-set="genderRadio"
			radio-value="female"
			v-model="gender"
			class="female-radio"
		>
			Women only
		</kv-radio>
		<br>
		<kv-radio
			label-set="genderRadioSetMale"
			name-set="genderRadio"
			radio-value="male"
			v-model="gender"
			class="male-radio"
		>
			Men only
		</kv-radio>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvRadio from '@/components/Kv/KvRadio';

export default {
	inject: ['apollo'],
	components: {
		KvRadio,
	},
	data() {
		return {
			gender: 'both',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					loanSearchCriteria {
						filters {
							gender
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.gender = !!_get(data, 'autolending.currentProfile.loanSearchCriteria.filters.gender');
		},
	},
	watch: {
		gender(gender, previousGender) {
			if (gender !== previousGender) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										gender: ${gender === 'both' ? null : gender}
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

<style lang="scss" scoped>
@import 'settings';

.filter-title {
	font-size: 1rem;
	color: $kiva-text-light;
}

</style>
