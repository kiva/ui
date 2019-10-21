<template>
	<span class="gender-radios">
		<kv-radio
			class="male-radio"
			:id="labelSet"
			:name="nameSet"
		>
			Male
		</kv-radio>
		<kv-radio
			class="female-radio"
			:id="labelSet"
			:name="nameSet"
		>
			Female
		</kv-radio>
	</span>
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
			gender: 'male',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
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
