<template>
	<div>
		<h3 class="filter-title">
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
				v-if="currentThemeIds.length > 0"
				class="edit-button"
				@click="emitChangeEvent('some')"
			>
				Edit <kv-icon name="pencil" />
			</button>
		</kv-radio>
		<p class="attribute-list">
			{{ selectedThemesString }}
		</p>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import themeListQuery from '@/graphql/query/autolending/themeList.graphql';
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
			allThemes: [],
			currentThemeIds: [],
			radio: 'all',
		};
	},
	apollo: {
		query: themeListQuery,
		preFetch: true,
		result({ data }) {
			this.allThemes = _get(data, 'lend.loanThemeFilter') || [];
			this.currentThemeIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.theme') || [];

			if (this.currentThemeIds.length) {
				this.radio = 'some';
			} else {
				this.radio = 'all';
			}
		},
	},
	methods: {
		saveAny() {
			this.apollo.mutate({
				mutation: gql`mutation($themes: [String]) {
							autolending @client {
								editProfile(profile: {
									loanSearchCriteria: {
										filters: {
											theme: $themes
										}
									}
								})
							}
						}`,
				variables: {
					themes: null,
				}
			});
		},
		emitChangeEvent(value) {
			this.$emit('change', {
				radioKey: 'attributes',
				value
			});
		}
	},
	computed: {
		selectedThemes() {
			return this.allThemes.filter(theme => this.currentThemeIds.includes(theme.name));
		},
		// the selected items limited to 10
		selectedThemesShortList() {
			return this.selectedThemes.slice(0, 10);
		},
		// the count of items that aren't being displayed
		themesRemaining() {
			return this.selectedThemes.length - this.selectedThemesShortList.length;
		},
		// string of names of selected items
		selectedThemesString() {
			const arrayOfSelectedThemeNames = this.selectedThemesShortList.map(theme => theme.name).join(', ');
			const extra = this.themesRemaining > 0 ? `, +${this.themesRemaining} more` : '';
			return `${arrayOfSelectedThemeNames}${extra}`;
		},
	},
	watch: {
		selectorShown(value) {
			// If going 'back to all options' and no themes are selected, set value back to any
			if (!value && this.currentThemeIds.length === 0) {
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

p.attribute-list {
	color: $kiva-text-light;
	padding: $section-padding;
}
</style>
