<template>
	<div>
		<router-link
			to="/monthlygood"
			class="tw-flex tw-gap-0.5 tw-py-1 tw-mb-2 tw-border-b tw-border-tertiary tw-font-medium"
			v-kv-track-event="['TopNav','click-Find-a-Cause', 'Find a cause']"
		>
			Find a cause
			<kv-material-icon :icon="mdiArrowRight" />
		</router-link>

		<kv-tabs>
			<template #tabNav>
				<kv-tab for="nav-lend-categories">
					Categories
				</kv-tab>
				<kv-tab for="nav-lend-regions">
					Regions
				</kv-tab>
				<kv-tab for="nav-my-kiva" v-if="userId || true">
					My Kiva
				</kv-tab>
			</template>
			<template #tabPanels>
				<kv-tab-panel id="nav-lend-categories">
					<kv-loading-spinner
						v-if="isChannelsLoading"
						class="tw-mx-auto tw-mt-4 tw-mb-2"
					/>
					<ul
						v-else
					>
						<li v-for="(category, index) in categories" :key="index">
							<a
								:href="category.url"
								v-kv-track-event="['TopNav', 'click-Lend-Category', category.name, index + 1]"
								class="lend-link"
							>
								{{ category.name }}
							</a>
						</li>
						<li class="tw-border-t tw-border-tertiary">
							<router-link to="/lend" class="lend-link">
								All loans
							</router-link>
						</li>
						<li>
							<router-link to="/categories" class="lend-link">
								All categories
							</router-link>
						</li>
					</ul>
				</kv-tab-panel>
				<kv-tab-panel id="nav-lend-regions">
					<kv-loading-spinner
						v-if="isRegionsLoading"
						class="tw-mx-auto tw-mt-4 tw-mb-2"
					/>
					<template v-else>
						<kv-accordion-item
							v-for="region in regions"
							:key="region.name"
							:id="`lend-menu-${region.name}-panel` | changeCase('paramCase')"
						>
							<template #header>
								<h3 class="tw-text-h4">
									<span v-kv-track-event="['TopNav','click-Lend-Region', region.name]">
										{{ region.name }}
									</span>
								</h3>
							</template>
							<country-list :countries="region.countries" />
						</kv-accordion-item>
					</template>
				</kv-tab-panel>
				<kv-tab-panel id="nav-my-kiva" v-if="userId || true">
					<ul>
						<li>
							<router-link
								v-if="favorites > 0"
								:to="{ path: '/lend', query: { lenderFavorite: userId } }"
								class="lend-link"
								v-kv-track-event="['TopNav','click-Lend-Favorites']"
							>
								Starred loans
							</router-link>
							<span
								v-else
								class="tw-block tw-py-1 tw-text-tertiary"
							>Starred loans</span>
						</li>
						<li
							v-if="hasSearches"
						>
							<kv-accordion-item
								id="lend-menu-saved-searches-panel"
								ref="searches"
							>
								<template #header>
									<h3 class="tw-text-base">
										Saved searches
									</h3>
								</template>
								<search-list :searches="searches" />
							</kv-accordion-item>
						</li>
						<li v-else>
							<span class="tw-block tw-py-1 tw-text-tertiary">Saved searches</span>
						</li>
						<li>
							<router-link
								to="/lend/countries-not-lent"
								class="lend-link"
								v-kv-track-event="['TopNav','click-Lend-Countries_Not_Lent']"
							>
								Countries I haven't lent to
							</router-link>
						</li>
					</ul>
				</kv-tab-panel>
			</template>
		</kv-tabs>
	</div>
</template>

<script>
import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import { mdiArrowRight } from '@mdi/js';
import SearchList from './SearchList';
import CountryList from './CountryList';
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabPanel from '~/@kiva/kv-components/vue/KvTabPanel';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		CountryList,
		KvAccordionItem,
		KvMaterialIcon,
		KvTab,
		KvTabPanel,
		KvTabs,
		KvLoadingSpinner,
		SearchList,
	},
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
		favorites: {
			type: Number,
			default: 0,
		},
		userId: {
			type: Number,
			default: null,
		},
		regions: {
			type: Array,
			default: () => [],
		},
		searches: {
			type: Array,
			default: () => [],
		},
		isRegionsLoading: {
			type: Boolean,
			default: true,
		},
		isChannelsLoading: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			mgHighlightInNavVersion: null,
			mdiArrowRight,
		};
	},
	computed: {
		hasSearches() {
			return this.searches.length > 0;
		},
	},
	methods: {
		onClose() {
			// if (this.categories.length) {
			// 	this.$refs.categories.collapse();
			// }
			// if (this.regions.length) {
			// 	this.$refs.regions.collapse();
			// 	this.$refs.regionCountries.forEach(region => region.collapse());
			// }
			// if (this.userId) {
			// 	this.$refs.myKiva.collapse();
			// }
			// if (this.hasSearches) {
			// 	this.$refs.searches.collapse();
			// }
		}
	},
};
</script>

<style lang="postcss" scoped>
.lend-link {
	@apply tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1;
}
</style>
