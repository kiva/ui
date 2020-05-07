<template>
	<div>
		<h3 class="filter-title">
			Field Partners
		</h3>
		<kv-radio
			:id="`filter-all-partners`"
			radio-value="all"
			v-model="radio"
			@click="saveAny"
		>
			Any Field Partners
		</kv-radio>
		<kv-radio
			:id="`filter-some-partners`"
			radio-value="some"
			v-model="radio"
			@click="emitChangeEvent('some')"
		>
			Selected FIeld Partners only
			<button
				v-if="currentPartnerIds.length > 0"
				class="edit-button"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" />
			</button>
		</kv-radio>
		<p class="partner-list">
			{{ selectedPartnersString }}
		</p>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import partnerListQuery from '@/graphql/query/autolending/partnerList.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import KvRadio from '@/components/Kv/KvRadio';

export default {
	inject: ['apollo'],
	components: {
		KvIcon,
		KvRadio,
	},
	props: {
		selectorShown: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			allPartners: [],
			currentPartnerIds: [],
			radio: 'all',
		};
	},
	apollo: {
		query: partnerListQuery,
		preFetch: true,
		result({ data }) {
			this.allPartners = _get(data, 'general.partners.values') || [];
			this.currentPartnerIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.partner') || [];

			if (this.currentPartnerIds.length) {
				this.radio = 'some';
			} else {
				this.radio = 'all';
			}
		},
	},
	methods: {
		saveAny() {
			this.apollo.mutate({
				mutation: gql`mutation($partners: [Int]) {
							autolending @client {
								editProfile(profile: {
									loanSearchCriteria: {
										filters: {
											partner: $partners
										}
									}
								})
							}
						}`,
				variables: {
					partners: null,
				}
			});
		},
		emitChangeEvent(value) {
			this.$emit('change', {
				radioKey: 'partners',
				value
			});
		}
	},
	computed: {
		selectedPartners() {
			return this.allPartners.filter(partner => this.currentPartnerIds.includes(partner.id));
		},
		// the selected items limited to 10
		selectedPartnersShortList() {
			return this.selectedPartners.slice(0, 10);
		},
		// the count of items that aren't being displayed
		partnersRemaining() {
			return this.selectedPartners.length - this.selectedPartnersShortList.length;
		},
		// string of names of selected items
		selectedPartnersString() {
			const arrayOfSelectedPartnerNames = this.selectedPartnersShortList.map(partner => partner.name).join(', ');
			const extra = this.partnersRemaining > 0 ? `, +${this.partnersRemaining} more` : '';
			return `${arrayOfSelectedPartnerNames}${extra}`;
		},
	},
	watch: {
		selectorShown(value) {
			// If going 'back to all options' and no partners are selected, set value back to any
			if (!value && this.currentPartnerIds.length === 0) {
				this.radio = 'all';
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

$section-padding: 0.4rem 0.5rem;

.edit-button {
	color: $kiva-textlink;
	font-weight: 300;
	margin-left: 0.55em;

	::v-deep .icon {
		width: 0.75rem;
		height: 0.75rem;
	}
}

p.partner-list {
	color: $kiva-text-light;
	padding: $section-padding;
}
</style>
