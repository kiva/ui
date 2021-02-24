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
				v-if="currentFilterValues.length > 0"
				class="edit-button"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" />
			</button>
		</kv-radio>
		<p class="sector-list">
			{{ selectedFiltersFormattedString(selectedSectors) }}
		</p>
	</div>
</template>

<script>
import _get from 'lodash/get';

import sectorListQuery from '@/graphql/query/autolending/sectorList.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import KvRadio from '@/components/Kv/KvRadio';
import anyOrSelectedAutolendingRadio from '@/plugins/any-or-selected-autolending-radio-mixin';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		KvIcon,
		KvRadio,
	},
	mixins: [
		anyOrSelectedAutolendingRadio
	],
	data() {
		return {
			allSectors: [],
			radioKey: 'sector',
		};
	},
	apollo: {
		query: sectorListQuery,
		preFetch: true,
		result({ data }) {
			this.allSectors = _get(data, 'lend.sector') || [];
			this.currentFilterValues = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.sector') || [];

			if (this.currentFilterValues.length) {
				this.radio = 'some';
			} else {
				this.radio = 'all';
			}
		},
	},
	computed: {
		selectedSectors() {
			return this.allSectors.filter(sector => this.currentFilterValues.includes(sector.id));
		},
	},
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
