<template>
	<div class="lend-mega-menu tw-overflow-hidden tw-hidden lg:tw-block tw-pb-2.5 lg:tw-pt-3">
		<router-link
			to="/monthlygood"
			class="tw-flex tw-gap-0.5 tw-py-2 tw-mb-2 tw-font-medium"
			v-kv-track-event="['TopNav','click-Find-a-Cause', 'Find a cause']"
		>
			Find a cause
			<kv-material-icon :icon="mdiArrowRight" />
		</router-link>
		<div
			:style="computedStyle"
			class="tw-transition tw-duration-1000 tw-ease-in-out"
		>
			<kv-grid style="grid-template-columns: repeat(18, minmax(0, 1fr));">
				<!-- categories -->
				<div class="tw-col-span-7" ref="categories">
					<h2 class="tw-text-base tw-mb-2">
						Categories
					</h2>

					<div class="tw-flex tw-gap-4 tw-whitespace-nowrap">
						<ul class="category-list">
							<template v-if="isChannelsLoading">
								<li
									v-for="i in 14"
									:key="i"
									class="tw-w-[11rem]"
								>
									<kv-loading-placeholder
										class="tw-inline-block tw-align-middle"
										style="height: 1.25rem;"
									/>
									<span class="tw-py-1 tw-font-medium tw-inline-block">&nbsp;</span>
								</li>
							</template>
							<template v-else>
								<li
									v-for="(category, index) in categories"
									:key="index"
									class="tw-w-[11rem]"
								>
									<a
										:href="category.url"
										class="tw-text-primary tw-text-left hover:tw-text-action-highlight
									tw-py-1 tw-font-medium tw-inline-block"
										v-kv-track-event="['TopNav', 'click-Lend-Category', category.name, index + 1]"
									>
										{{ category.name }}
									</a>
								</li>
							</template>
						</ul>
						<ul>
							<li class="tw-w-[11rem]">
								<router-link
									to="/categories"
									class="tw-text-primary tw-font-medium
									hover:tw-text-action-highlight tw-inline-block tw-py-1"
									v-kv-track-event="['TopNav','click-Lend-All_Categories']"
								>
									All categories
								</router-link>
							</li>
							<li class="tw-w-[11rem]" ref="allLoans">
								<router-link
									class="tw-text-primary tw-font-medium
									hover:tw-text-action-highlight tw-inline-block tw-py-1"
									to="/lend"
									v-kv-track-event="['TopNav','click-Lend-All_Loans']"
								>
									All loans
								</router-link>
							</li>
						</ul>
					</div>

					<!-- my kiva -->
					<!-- TODO: Where should this go? -->
					<!-- My Kiva -->
					<div class="tw-mt-6 tw-hidden">
						<h2 v-if="userId" class="tw-text-base tw-mb-2">
							My Kiva
						</h2>
						<ul v-if="userId">
							<li>
								<router-link
									v-if="favorites > 0"
									:to="{ path: '/lend', query: { lenderFavorite: userId } }"
									v-kv-track-event="['TopNav','click-Lend-Favorites']"
									class="tw-text-primary tw-text-left hover:tw-text-action-highlight
												tw-py-1 tw-font-medium tw-inline-block"
								>
									Starred loans
								</router-link>
								<span
									v-else
									class="tw-text-primary tw-py-1 tw-inline-block"
								>
									Starred loans
								</span>
							</li>
							<li>
								<button
									v-if="hasSearches"
									@click="openSection(savedSearchesTitle)"
									:aria-pressed="isOpenSection(savedSearchesTitle) ? 'true' : 'false'"
									class="tw-text-primary tw-text-left hover:tw-text-action-highlight
									tw-py-1 tw-font-medium tw-inline-block"
								>
									{{ savedSearchesTitle }}
								</button>
								<span
									v-else
									class="tw-text-primary tw-py-1 tw-inline-block"
								>
									Saved searches
								</span>
								<div v-if="isOpenSection(savedSearchesTitle)" class="right-section">
									<h2>{{ savedSearchesTitle }}</h2>
									<search-list :searches="searches" />
								</div>
							</li>
							<li>
								<router-link
									to="/lend/countries-not-lent"
									v-kv-track-event="['TopNav','click-Lend-Countries_Not_Lent']"
									class="tw-text-primary tw-text-left hover:tw-text-action-highlight
												tw-py-1 tw-font-medium tw-inline-block"
								>
									Countries I haven't lent to
								</router-link>
							</li>
						</ul>
					</div>
				</div>

				<div class="tw-col-span-2">
					<button
						class="tw-flex"
						v-if="sectionOpen"
						@click="openedSection = ''"
					>
						<kv-material-icon class="tw-flex-shrink-0" :icon="mdiChevronLeft" />
						<span class="tw-text-base">
							Back
						</span>
					</button>
				</div>

				<!-- regions -->
				<div class="tw-col-span-8 tw-flex tw-flex-col">
					<h2 class="tw-text-base tw-mb-2">
						Regions
					</h2>
					<div class="tw-flex tw-whitespace-nowrap tw-h-full">
						<ul>
							<template v-if="isRegionsLoading">
								<li
									v-for="i in 8"
									:key="i"
									class="tw-w-[11rem]"
								>
									<kv-loading-placeholder
										class="tw-inline-block tw-align-middle"
										style="height: 1.25rem;"
									/>
									<span class="tw-py-1 tw-font-medium tw-inline-block">&nbsp;</span>
								</li>
							</template>
							<template v-else>
								<li v-for="region in regions" :key="region.name" class="tw-w-[11rem] tw-mr-4">
									<button
										@click="openSection(region.name)"
										:aria-pressed="isOpenSection(region.name) ? 'true' : 'false'"
										v-kv-track-event="['TopNav','click-Lend-Region', region.name]"
										class="tw-text-primary tw-text-left
											tw-font-medium hover:tw-text-action-highlight tw-py-1"
										:class="{ 'tw-text-action' : isOpenSection(region.name)}"
									>
										{{ region.name }}
									</button>
								</li>
							</template>
						</ul>
						<div
							v-for="region in openRegions"
							:key="region.name"
							class="tw-h-full"
						>
							<country-list :countries="region.countries" class="region-list tw-h-full" />
						</div>
					</div>
				</div>
			</kv-grid>
		</div>
	</div>
</template>

<script>
import { mdiArrowRight, mdiChevronLeft } from '@mdi/js';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import CountryList from './CountryList';
import SearchList from './SearchList';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		CountryList,
		KvGrid,
		KvLoadingPlaceholder,
		KvMaterialIcon,
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
		isRegionsLoading: {
			type: Boolean,
			default: true,
		},
		isChannelsLoading: {
			type: Boolean,
			default: true,
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
	},
	data() {
		return {
			categoriesWidth: null,
			openedSection: '',
			savedSearchesTitle: 'Saved searches',
			mdiArrowRight,
			mdiChevronLeft,
		};
	},
	computed: {
		computedStyle() {
			let style = 'width: 150%;';
			if (this.sectionOpen) {
				const categoryWidth = this.getRefWidth('categories');
				style += `transform: translateX(${categoryWidth * -1}px);`;
			}
			return style;
		},
		hasSearches() {
			return this.searches.length > 0;
		},
		sectionOpen() {
			return this.openedSection !== '';
		},
		openRegions() {
			return this.regions.filter(region => this.isOpenSection(region.name));
		}
	},
	methods: {
		getRefWidth(refPath) {
			const ref = this.$refs[refPath] || null;
			return ref?.clientWidth ?? 0;
		},
		onClose() {
			this.closeSection();
		},
		isOpenSection(section) {
			return this.openedSection === section;
		},
		openSection(section) {
			this.openedSection = section;
		},
		closeSection() {
			this.openedSection = '';
		},
	},
};
</script>

<style lang="postcss" scoped>
/* TODO: Tailwind 3 has classes for columns */
.region-list {
	column-count: 3;
	column-fill: auto;
	column-gap: theme('spacing.4');
}

.category-list {
	column-count: 2;
	column-gap: theme('spacing.4');
}
</style>
