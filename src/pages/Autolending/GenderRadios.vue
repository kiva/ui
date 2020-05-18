<template>
	<div class="gender-radios">
		<h3 class="filter-title">
			Genders
		</h3>
		<kv-radio
			id="gender-radio-both"
			radio-value="both"
			v-model="gender"
		>
			Everyone
		</kv-radio>
		<kv-radio
			id="gender-radio-female"
			radio-value="female"
			v-model="gender"
		>
			Women only
		</kv-radio>
		<kv-radio
			id="gender-radio-male"
			radio-value="male"
			v-model="gender"
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
	kvapollo: {
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
			this.gender = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.gender') || 'both';
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
</style>
