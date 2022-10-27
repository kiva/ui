<template>
	<div class="lend-mega-menu tw-overflow-hidden tw-pb-3 lg:tw-pt-3">
		<router-link
			v-if="showMGUpsellLink"
			to="/monthlygood"
			@click.native="trackMgLinkClick"
			:class="{ 'hover:tw-no-underline': newMgEntrypoint}"
		>
			<!-- NEW MG ENTRYPOINT CORE-641 -->
			<monthly-good-entrypoint v-if="newMgEntrypoint" />

			<span class="tw-inline-flex tw-items-center tw-py-2 tw-mb-2 tw-gap-0.5 tw-font-medium" v-else>
				Lend monthly
				<kv-material-icon :icon="mdiArrowRight" class="tw-w-3 tw-h-3" />
			</span>
		</router-link>
		<div v-else class="tw-block tw-py-2 tw-mb-2 tw-w-16">
			<kv-loading-placeholder
				style="height: 1.5rem;"
			/>
		</div>
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
						<ul class="tw-columns-2 tw-gap-4 tw-font-medium">
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
									<span class="tw-py-1 tw-inline-block">&nbsp;</span>
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
									tw-py-1 tw-inline-block"
										v-kv-track-event="['TopNav', 'click-Lend-Category', category.name, index + 1]"
									>
										{{ category.name }}
									</a>
								</li>
							</template>
						</ul>
						<div>
							<ul class="tw-font-medium">
								<li class="tw-w-[11rem]">
									<router-link
										to="/lend-by-category/recommended-by-lenders"
										class="tw-text-action hover:tw-text-action-highlight tw-inline-block tw-py-1"
										v-kv-track-event="['TopNav','click-Lend-Recommended-by-lenders']"
									>
										Recommended by lenders
									</router-link>
								</li>
								<li class="tw-w-[11rem]">
									<router-link
										to="/categories"
										class="tw-text-primary hover:tw-text-action-highlight tw-inline-block tw-py-1"
										v-kv-track-event="['TopNav','click-Lend-All_Categories']"
									>
										All categories
									</router-link>
								</li>
								<li class="tw-w-[11rem]" ref="allLoans">
									<router-link
										class="tw-text-primary hover:tw-text-action-highlight tw-inline-block tw-py-1"
										to="/lend"
										v-kv-track-event="['TopNav','click-Lend-All_Loans']"
									>
										All loans
									</router-link>
								</li>
							</ul>
							<!-- My Kiva -->
							<div v-if="userId">
								<!-- blank line to keep things lined up just right -->
								<span class="tw-inline-block tw-py-1">&nbsp;</span>

								<h2 class="tw-text-base tw-my-1">
									My Kiva
								</h2>
								<ul class="tw-font-medium">
									<li>
										<router-link
											v-if="favorites > 0"
											:to="{ path: '/lend', query: { lenderFavorite: userId } }"
											v-kv-track-event="['TopNav','click-Lend-Favorites']"
											class="tw-text-primary tw-text-left hover:tw-text-action-highlight
												tw-py-1 tw-inline-block"
										>
											Saved loans
										</router-link>
										<span
											v-else
											class="tw-text-secondary tw-py-1 tw-inline-block"
										>
											Saved loans
										</span>
									</li>
									<li>
										<button
											v-if="hasSearches"
											@click="openSection(savedSearchesTitle)"
											:aria-pressed="isOpenSection(savedSearchesTitle) ? 'true' : 'false'"
											class="tw-text-primary tw-text-left tw-py-1 tw-inline-block
											hover:tw-text-action-highlight hover:tw-underline"
										>
											{{ savedSearchesTitle }}
										</button>
										<span
											v-else
											class="tw-text-secondary tw-py-1 tw-inline-block"
										>
											Saved searches
										</span>
									</li>
									<li>
										<a
											href="/lend/countries-not-lent"
											v-kv-track-event="['TopNav','click-Lend-Countries_Not_Lent']"
											class="tw-text-primary tw-text-left hover:tw-text-action-highlight
												tw-py-1 tw-inline-block"
										>
											Countries I haven't lent to
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div class="tw-col-span-2">
					<button
						class="tw-flex"
						v-if="sectionOpen"
						@click="openedSection = ''"
					>
						<kv-material-icon class="tw-flex-shrink-0 tw-w-3 tw-h-3" :icon="mdiChevronLeft" />
						<span class="tw-text-base">
							Back
						</span>
					</button>
				</div>

				<!-- regions -->
				<div class="tw-col-span-8 tw-flex tw-flex-col">
					<template v-if="isOpenSection(savedSearchesTitle)">
						<h2 class="tw-text-base tw-mb-2">
							Saved Searches
						</h2>
						<search-list
							class="search-list tw-h-full"
							:searches="searches"
						/>
					</template>
					<template v-else>
						<h2 class="tw-text-base tw-mb-2">
							Regions
						</h2>
						<div class="tw-flex tw-whitespace-nowrap tw-h-full">
							<ul class="tw-font-medium">
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
										<span class="tw-py-1 tw-inline-block">&nbsp;</span>
									</li>
								</template>
								<template v-else>
									<li v-for="region in regions" :key="region.name" class="tw-w-[11rem] tw-mr-4">
										<button
											@click="openSection(region.name)"
											:aria-pressed="isOpenSection(region.name) ? 'true' : 'false'"
											v-kv-track-event="['TopNav','click-Lend-Region', region.name]"
											class="tw-text-primary tw-text-left tw-py-1
											hover:tw-text-action-highlight hover:tw-underline "
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
					</template>
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
import MonthlyGoodEntrypoint from './MonthlyGoodEntrypoint';

export default {
	name: 'LendMegaMenu',
	inject: ['apollo', 'cookieStore'],
	components: {
		CountryList,
		KvGrid,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		SearchList,
		MonthlyGoodEntrypoint,
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
		},
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
		trackMgLinkClick() {
			const trackerLA = this.newMgEntrypoint ? 'Become-a-member' : 'Lend-monthly';
			this.$kvTrackEvent('TopNav', 'click-Lend-Menu-Monthly-Good', trackerLA);
		}
	},
};
</script>

<style lang="postcss" scoped>
.region-list,
.search-list {
	column-fill: auto; /* Tailwind doesnt have a column-fill option currently */
	@apply tw-columns-3 tw-gap-4;
}
</style>
