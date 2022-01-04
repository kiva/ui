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
					<kv-loading-spinner
						v-if="isChannelsLoading"
						class="tw-mx-auto tw-mt-4 tw-mb-2"
					/>

					<div class="tw-flex tw-gap-4 tw-whitespace-nowrap">
						<ul class="category-list">
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
					<div>
						<h2 v-if="userId" class="tw-text-base">
							My Kiva
						</h2>
						<ul v-if="userId">
							<li>
								<router-link
									v-if="favorites > 0"
									:to="{ path: '/lend', query: { lenderFavorite: userId } }"
									v-kv-track-event="['TopNav','click-Lend-Favorites']"
								>
									Starred loans
								</router-link>
								<span v-else>Starred loans</span>
							</li>
							<li>
								<button
									v-if="hasSearches"
									@click="openSection(savedSearchesTitle)"
									:aria-pressed="isOpenSection(savedSearchesTitle) ? 'true' : 'false'"
								>
									{{ savedSearchesTitle }}
								</button>
								<span v-else>Saved searches</span>
								<div v-if="isOpenSection(savedSearchesTitle)" class="right-section">
									<h2>{{ savedSearchesTitle }}</h2>
									<search-list :searches="searches" />
								</div>
							</li>
							<li>
								<router-link
									to="/lend/countries-not-lent"
									v-kv-track-event="['TopNav','click-Lend-Countries_Not_Lent']"
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
					<kv-loading-spinner
						v-if="isRegionsLoading"
						class="tw-mx-auto tw-mt-4 tw-mb-2"
					/>
					<template v-else>
						<h2 class="tw-text-base tw-mb-2">
							Regions
						</h2>
						<div class="tw-flex tw-whitespace-nowrap tw-h-full">
							<ul>
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
							</ul>
							<div
								v-for="region in openRegions"
								:key="region.name"
								class="tw-h-full"
							>
								<country-list :countries="region.countries" class="region-list tw-h-full" />
							</div>
						</div>
					</template>
				</div>
			</kv-grid>
		</div>
	</div>
</template>

<script>
import { mdiArrowRight, mdiChevronLeft } from '@mdi/js';
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import CountryList from './CountryList';
import SearchList from './SearchList';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		CountryList,
		KvGrid,
		KvLoadingSpinner,
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
