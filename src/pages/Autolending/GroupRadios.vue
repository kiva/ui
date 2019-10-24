<template>
	<div class="group-radios">
		<h3 class="filter-title">
			Individuals/groups
		</h3>
		<kv-radio
			label-set="groupRadioSetBoth"
			name-set="groupRadio"
			radio-value="both"
			v-model="isGroup"
			class="both-radio"
		>
			Both
		</kv-radio>
		<br>
		<kv-radio
			label-set="groupRadioSetMale"
			name-set="groupRadio"
			radio-value="individual-only"
			v-model="isGroup"
			class="individual-radio"
		>
			Individuals only
		</kv-radio>
		<br>
		<kv-radio
			label-set="groupRadioSetFemale"
			name-set="groupRadio"
			radio-value="group-only"
			v-model="isGroup"
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
						filters {
							isGroup
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			const isGroup = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.isGroup');
			if (isGroup === true) {
				this.isGroup = 'group-only';
			} else if (isGroup === false) {
				this.isGroup = 'individual-only';
			} else {
				this.isGroup = 'both';
			}
		},
	},
	watch: {
		isGroup(groupOption, previousGroupOption) {
			if (groupOption !== previousGroupOption) {
				let isGroup = null;
				if (groupOption === 'group-only') {
					isGroup = true;
				} else if (groupOption === 'individual-only') {
					isGroup = false;
				}
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										isGroup: ${isGroup}
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
