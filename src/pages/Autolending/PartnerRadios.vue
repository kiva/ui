<template>
	<div>
		<h3 class="tw-mb-2">
			Lending Partners
		</h3>
		<kv-radio
			:id="`filter-all-partners`"
			radio-value="all"
			v-model="radio"
			@click="saveAny"
		>
			Any Lending Partners
		</kv-radio>
		<kv-radio
			:id="`filter-some-partners`"
			radio-value="some"
			v-model="radio"
			@click="emitChangeEvent('some')"
		>
			Selected Lending Partners only
			<button
				v-if="currentFilterValues.length > 0"
				class="tw-text-link"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" class="tw-w-1.5 tw-h-1.5" />
			</button>
		</kv-radio>
		<p class="tw-text-tertiary tw-p-1">
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
	name: 'PartnerRadios',
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
