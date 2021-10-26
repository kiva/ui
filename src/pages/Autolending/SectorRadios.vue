<template>
	<div>
		<h3 class="tw-mb-2">
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
				class="tw-text-link tw-ml-1"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" class="tw-w-1.5 tw-h-1.5" />
			</button>
		</kv-radio>
		<p class="tw-text-tertiary tw-p-1">
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
