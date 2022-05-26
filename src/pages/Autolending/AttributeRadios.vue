<template>
	<div>
		<h3 class="tw-mb-2">
			Attributes
		</h3>
		<kv-radio
			:id="`filter-all-attributes`"
			radio-value="all"
			v-model="radio"
			@click="saveAny"
		>
			Any attributes
		</kv-radio>
		<kv-radio
			:id="`filter-some-attributes`"
			radio-value="some"
			v-model="radio"
			@click="emitChangeEvent('some')"
		>
			Selected attributes only
			<button
				v-if="currentFilterValues.length > 0"
				class="tw-text-link"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" class="tw-w-1.5 tw-h-1.5" />
			</button>
		</kv-radio>
		<p class="tw-text-tertiary tw-p-1">
			{{ selectedFiltersFormattedString(selectedThemes) }}
		</p>
	</div>
</template>

<script>
import _get from 'lodash/get';

import themeListQuery from '@/graphql/query/autolending/themeList.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import KvRadio from '@/components/Kv/KvRadio';
import anyOrSelectedAutolendingRadio from '@/plugins/any-or-selected-autolending-radio-mixin';

export default {
	name: 'AttributeRadios',
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
			allThemes: [],
			radioKey: 'theme',
		};
	},
	apollo: {
		query: themeListQuery,
		preFetch: true,
		result({ data }) {
			this.allThemes = _get(data, 'lend.loanThemeFilter') || [];
			this.currentFilterValues = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.theme') || [];

			if (this.currentFilterValues.length) {
				this.radio = 'some';
			} else {
				this.radio = 'all';
			}
		},
	},
	computed: {
		selectedThemes() {
			return this.allThemes.filter(theme => this.currentFilterValues.includes(theme.name));
		},
	},
};
</script>
