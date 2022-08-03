<template>
	<div class="tw-pb-2">
		<router-link
			v-if="showMGUpsellLink"
			to="/monthlygood"
			@click.native="trackMgLinkClick"
			:class="{ 'hover:tw-no-underline': newMgEntrypoint}"
		>
			<div class="tw-mb-4 tw-inline-flex-col tw-items-center" v-if="newMgEntrypoint">
				<div class="tw-flex-col">
					<div class="tw-inline-flex">
						<img class="tw-w-4.5" src="@/assets/images/jill.svg">
						<img class="tw-w-4.5" src="@/assets/images/lara.svg">
						<img class="tw-w-4.5" src="@/assets/images/zawa.svg">
					</div>
					<h3 class="tw-text-h3 tw-text-primary">
						Join our community of monthly lenders
					</h3>
					<p class="tw-text-base tw-text-secondary">
						Personalized, automatic lending for you
					</p>
				</div>
				<!-- eslint-disable-next-line max-len -->
				<span class="tw-inline-flex tw-items-center tw-font-medium tw-gap-0.5 tw-mt-2 tw-text-brand hover:tw-underline">
					Become a member
					<kv-material-icon :icon="mdiArrowRight" class="tw-w-3 tw-h-3" />
				</span>
			</div>
			<!-- eslint-disable-next-line max-len -->
			<span v-else class="tw-inline-flex tw-items-center tw-py-2 tw-mb-2 tw-gap-0.5 tw-border-b tw-border-tertiary tw-font-medium">
				Lend monthly
				<kv-material-icon :icon="mdiArrowRight" class="tw-w-3 tw-h-3" />
			</span>
		</router-link>
		<!-- <router-link
			v-if="showMGUpsellLink"
			to="/monthlygood"
			class="tw-inline-flex tw-gap-0.5 tw-py-2 tw-mb-2 tw-border-b tw-border-tertiary tw-font-medium"
			@click.native="trackMgLinkClick"
		>
			Lend monthly
			<kv-material-icon class="tw-w-3 tw-h-3" :icon="mdiArrowRight" />
		</router-link> -->
		<div v-else class="tw-block tw-py-2 tw-mb-2 tw-w-16">
			<kv-loading-placeholder
				style="height: 1.5rem;"
			/>
		</div>
		<kv-tabs ref="navLendCategories">
			<template #tabNav>
				<kv-tab for-panel="nav-lend-categories">
					Categories
				</kv-tab>
				<kv-tab for-panel="nav-lend-regions">
					Regions
				</kv-tab>
				<kv-tab for-panel="nav-my-kiva" v-if="userId">
					My Kiva
				</kv-tab>
			</template>
			<template #tabPanels>
				<kv-tab-panel id="nav-lend-categories">
					<ul
						class="tw-font-medium"
					>
						<template v-if="isChannelsLoading">
							<li
								v-for="i in 14"
								:key="i"
								class="tw-w-[11rem] tw-py-1 tw-flex"
							>
								<kv-loading-placeholder
									class="tw-inline-block tw-align-middle"
									style="height: 1rem; display: inline-block;"
								/>
								<span class="tw-inline-block">&nbsp;</span>
							</li>
						</template>
						<template v-else>
							<li v-for="(category, index) in categories" :key="index">
								<a
									:href="category.url"
									v-kv-track-event="['TopNav', 'click-Lend-Category', category.name, index + 1]"
									class="lend-link"
								>
									{{ category.name }}
								</a>
							</li>
						</template>
						<li class="tw-border-t tw-border-tertiary">
							<router-link
								to="/lend-by-category/recommended-by-lenders"
								class="lend-link tw-text-brand"
								v-kv-track-event="['TopNav','click-Lend-Recommended-by-lenders']"
							>
								Recommended by lenders
							</router-link>
						</li>
						<li>
							<router-link
								to="/lend"
								class="lend-link"
								v-kv-track-event="['TopNav','click-Lend-All_Loans']"
							>
								All loans
							</router-link>
						</li>
						<li>
							<router-link
								to="/categories"
								class="lend-link"
								v-kv-track-event="['TopNav','click-Lend-All_Categories']"
							>
								All categories
							</router-link>
						</li>
					</ul>
				</kv-tab-panel>
				<kv-tab-panel id="nav-lend-regions">
					<template v-if="isRegionsLoading">
						<kv-accordion-item
							v-for="i in 8"
							:key="i"
							:id="`placeholder-${i}-panel` | changeCase('paramCase')"
							:disabled="true"
						>
							<template #header>
								<div class="tw-flex">
									<kv-loading-placeholder
										class="tw-inline-block tw-align-middle"
										style="height: 1rem; display: inline-block;"
									/>
									<span class="tw-inline-block tw-text-h4">&nbsp;</span>
								</div>
							</template>
						</kv-accordion-item>
					</template>
					<template v-else>
						<kv-accordion-item
							v-for="region in regions"
							:key="region.name"
							:id="`lend-menu-${region.name}-panel` | changeCase('paramCase')"
							ref="regionAccordions"
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
				<kv-tab-panel id="nav-my-kiva" v-if="userId">
					<ul class="tw-font-medium">
						<li>
							<router-link
								v-if="favorites > 0"
								:to="{ path: '/lend', query: { lenderFavorite: userId } }"
								class="lend-link"
								v-kv-track-event="['TopNav','click-Lend-Favorites']"
							>
								Saved loans
							</router-link>
							<span
								v-else
								class="tw-block tw-py-1 tw-text-tertiary"
							>Saved loans</span>
						</li>
						<li
							v-if="hasSearches"
						>
							<kv-accordion-item
								id="lend-menu-saved-searches-panel"
								ref="searches"
							>
								<template #header>
									<p class="tw-font-medium">
										Saved searches
									</p>
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
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import SearchList from './SearchList';
import CountryList from './CountryList';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabPanel from '~/@kiva/kv-components/vue/KvTabPanel';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';

export default {
	name: 'LendListMenu',
	inject: ['apollo', 'cookieStore'],
	components: {
		CountryList,
		KvAccordionItem,
		KvMaterialIcon,
		KvTab,
		KvTabPanel,
		KvTabs,
		KvLoadingPlaceholder,
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
		showMGUpsellLink: {
			type: Boolean,
			default: false,
		},
		newMgEntrypoint: {
			type: Boolean,
			default: false,
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
			// reset the tabs
			if (this.$refs?.navLendCategories?.tabContext?.setTab) {
				this.$refs.navLendCategories.tabContext?.setTab(0);
			}

			// close all region accordions
			if (this.$refs?.regionAccordions) {
				this.$refs.regionAccordions.forEach(accordionRef => {
					accordionRef.collapse();
				});
			}

			// close saved search accordions
			if (this.hasSearches && this.$refs?.searches) {
				this.$refs.searches.collapse();
			}
		},
		trackMgLinkClick() {
			const trackerLA = this.newMgEntrypoint ? 'Become a member' : 'Lend monthly';
			this.$kvTrackEvent('TopNav', 'click-Lend-Menu-Monthly-Good', trackerLA);
		}
	},
};
</script>

<style lang="postcss" scoped>
.lend-link {
	@apply tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1;
}
</style>
