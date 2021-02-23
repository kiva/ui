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
			Selected Field Partners only
			<button
				v-if="currentFilterValues.length > 0"
				class="edit-button"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" />
			</button>
		</kv-radio>
		<p class="partner-list">
			{{ selectedFiltersFormattedString(selectedPartners) }}
		</p>
	</div>
</template>

<script>
import _get from 'lodash/get';

import partnerListQuery from '@/graphql/query/autolending/partnerList.graphql';
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
			allPartners: [],
			radioKey: 'partner',
		};
	},
	apollo: {
		query: partnerListQuery,
		preFetch: true,
		result({ data }) {
			this.allPartners = _get(data, 'general.partners.values') || [];
			this.currentFilterValues = _get(
				data, 'autolending.currentProfile.loanSearchCriteria.filters.partner'
			) || [];

			if (this.currentFilterValues.length) {
				this.radio = 'some';
			} else {
				this.radio = 'all';
			}
		},
	},
	computed: {
		selectedPartners() {
			return this.allPartners.filter(partner => this.currentFilterValues.includes(partner.id));
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

p.partner-list {
	color: $kiva-text-light;
	padding: $section-padding;
}
</style>
