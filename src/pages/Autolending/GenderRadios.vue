<template>
	<div>
		<h3 class="tw-mb-2">
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
import { gql } from '@apollo/client';
import KvRadio from '@/components/Kv/KvRadio';

export default {
	name: 'GenderRadios',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvRadio,
	},
	data() {
		return {
			gender: 'both',
		};
	},
	apollo: {
		query: gql`query autolendProfileGender {
			autolending @client {
				currentProfile {
					id
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
					mutation: gql`mutation updateGender($gender: GenderEnum) {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										gender: $gender
									}
								}
							})
						}
					}`,
					variables: {
						gender: gender === 'both' ? null : gender,
					},
				});
			}
		}
	},
};
</script>
