<template>
	<div class="gender-radios">
		<template>
			<kv-radio
				label-set="genderRadioSetBoth"
				name-set="genderRadio"
				value="both"
				v-model="gender"
				class="both-radio"
			>
				Both
			</kv-radio>
			<br>
			<kv-radio
				label-set="genderRadioSetMale"
				name-set="genderRadio"
				value="male"
				v-model="gender"
				class="male-radio"
			>
				Male
			</kv-radio>
			<br>
			<kv-radio
				label-set="genderRadioSetFemale"
				name-set="genderRadio"
				value="female"
				v-model="gender"
				class="female-radio"
			>
				Female
			</kv-radio>
		</template>
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
			isEnabled: false,
			gender: 'both',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					isEnabled
					loanSearchCriteria {
						loanSearchFilters {
							gender
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.gender = !!_get(data, 'autolending.currentProfile.loanSearchCriteria.loanSearchFilters.gender');
		},
	},
	watch: {
		isEnabled(enabled, previouslyEnabled) {
			if (enabled !== previouslyEnabled) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { isEnabled: ${enabled} })
						}
					}`,
				});
			}
		},
		gender(gender, previousGender) {
			if (gender !== previousGender) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										gender: ${gender}
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

// .gender-radio {
// 	.toggle-text-wrapper {
// 		margin-left: 3rem;
// 	}

// 	.toggle-text {
// 		font-size: $normal-text-font-size;
// 		font-weight: 400;
// 	}

// 	.toggle-sub-text {
// 		display: block;
// 		color: $kiva-text-light;
// 	}
// }
</style>
