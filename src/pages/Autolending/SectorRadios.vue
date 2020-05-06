<template>
	<div>
		<h3 class="filter-title">
			Sectors
		</h3>
		<kv-radio
			:id="`filter-all-sectors`"
			radio-value="all"
			v-model="radio"
			@click="saveAny"
		>
			Any sectors
		</kv-radio>
		<kv-radio
			:id="`filter-some-sectors`"
			radio-value="some"
			v-model="radio"
			@click="emitChangeEvent('some')"
		>
			Selected sectors only
			<button
				v-if="currentSectorIds.length > 0"
				class="edit-button"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" />
			</button>
		</kv-radio>
		<p class="sector-list">
			{{ selectedSectorsString }}
		</p>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import sectorListQuery from '@/graphql/query/autolending/sectorList.graphql';
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
			allSectors: [],
			currentSectorIds: [],
			radio: 'all',
		};
	},
	apollo: {
		query: sectorListQuery,
		preFetch: true,
		result({ data }) {
			this.allSectors = _get(data, 'lend.sector') || [];
			this.currentSectorIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.sector') || [];

			if (this.currentSectorIds.length) {
				this.radio = 'some';
			} else {
				this.radio = 'all';
			}
		},
	},
	methods: {
		saveAny() {
			this.apollo.mutate({
				mutation: gql`mutation($sectors: [Int]) {
							autolending @client {
								editProfile(profile: {
									loanSearchCriteria: {
										filters: {
											sector: $sectors
										}
									}
								})
							}
						}`,
				variables: {
					sectors: null,
				}
			});
		},
		emitChangeEvent(value) {
			this.$emit('change', {
				radioKey: 'sectors',
				value
			});
		}
	},
	computed: {
		selectedSectors() {
			return this.allSectors.filter(sector => this.currentSectorIds.includes(sector.id));
		},
		// the selected items limited to 10
		selectedSectorsShortList() {
			return this.selectedSectors.slice(0, 10);
		},
		// the count of items that aren't being displayed
		sectorsRemaining() {
			return this.selectedSectors.length - this.selectedSectorsShortList.length;
		},
		// string of names of selected items
		selectedSectorsString() {
			const arrayOfSelectedSectorNames = this.selectedSectorsShortList.map(sector => sector.name).join(', ');
			const extra = this.sectorsRemaining > 0 ? `, +${this.sectorsRemaining} more` : '';
			return `${arrayOfSelectedSectorNames}${extra}`;
		},
	},
	watch: {
		selectorShown(value) {
			// If going 'back to all options' and no sectors are selected, set value back to any
			if (!value && this.currentSectorIds.length === 0) {
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

p.sector-list {
	color: $kiva-text-light;
	padding: $section-padding;
}
</style>
