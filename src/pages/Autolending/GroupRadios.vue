<template>
	<div class="group-individuals-radios">
		<h3 class="filter-title">Individuals/Groups</h3>
		<kv-radio
			label-set="groupIndividualsRadioSetBoth"
			name-set="groupIndividualsRadio"
			radio-value="both"
			v-model="groupIndividual"
			class="both-radio"
		>
			Both
		</kv-radio>
		<br>
		<kv-radio
			label-set="groupIndividualsRadioSetMale"
			name-set="groupIndividualsRadio"
			radio-value="individuals-only"
			v-model="groupIndividual"
			class="individual-radio"
		>
			Individuals only
		</kv-radio>
		<br>
		<kv-radio
			label-set="groupIndividualsRadioSetFemale"
			name-set="groupIndividualsRadio"
			radio-value="groups-only"
			v-model="groupIndividual"
			class="group-radio"
		>
			Groups only
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
			isGroup: 'both',
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					loanSearchCriteria {
						loanSearchFilters {
							isGroup
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.gender = !!_get(data, 'autolending.currentProfile.loanSearchCriteria.loanSearchFilters.isGroup');
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
										isGroup: ${gender === 'both' ? null : gender}
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
