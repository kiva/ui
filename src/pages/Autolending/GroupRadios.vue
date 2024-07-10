<template>
	<div>
		<h3 class="tw-mb-2">
			Individuals or groups
		</h3>
		<kv-radio
			id="group-radio-both"
			radio-value="both"
			v-model="isGroup"
		>
			Both
		</kv-radio>
		<kv-radio
			id="group-radio-individual"
			radio-value="individual-only"
			v-model="isGroup"
		>
			Individuals only
		</kv-radio>
		<kv-radio
			id="group-radio-groups"
			radio-value="group-only"
			v-model="isGroup"
		>
			Groups only
		</kv-radio>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import KvRadio from '@/components/Kv/KvRadio';

export default {
	name: 'GroupRadios',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvRadio,
	},
	data() {
		return {
			isGroup: 'both',
		};
	},
	apollo: {
		query: gql`query autolendProfileIsGroup {
			autolending @client {
				id
				currentProfile {
					id
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
					mutation: gql`mutation updateIsGroup($isGroup: Boolean) {
						autolending @client {
							id
							editProfile(profile: {
								loanSearchCriteria: {
									filters: {
										isGroup: $isGroup
									}
								}
							})
						}
					}`,
					variables: {
						isGroup,
					},
				});
			}
		}
	},
};
</script>
