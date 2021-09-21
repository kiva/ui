<template>
	<www-page
		id="lend-filter-alpha"
		:header-theme="headerTheme"
		:main-class="'kv-tailwind'"
	>
		<article class="tw-bg-secondary tw-relative tw-pt-6">
			<div class="tw-relative" style="max-height: 460px;">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
				</div>
			</div>
			<div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8">
			</div>
			<div>
				<kv-page-container>
					<div class="tw-flex tw-items-start">
						<div class="tw-flex-1">
							<h2 class="tw-mb-2">
								Make a loan, change a life
							</h2>
							<p class="tw-mb-3p tw-hidden md:tw-block">
								Each Kiva loan helps people build a better future for themselves and their families.
							</p>
						</div>
						<button class="tw-mb-2 tw-border-r tw-border-tertiary tw-px-2">
							<kv-material-icon :icon="mdiCompassRose" class="tw-text-secondary tw-w-5 tw-h-5" />
							<p class="tw-hidden md:tw-block">
								Explore
							</p>
						</button>
						<button class="tw-mb-2 tw-px-2">
							<kv-material-icon :icon="mdiFilterVariant" class="tw-text-brand tw-w-5 tw-h-5" />
							<p class="tw-hidden md:tw-block">
								Filters
							</p>
						</button>
					</div>
					<kv-grid class="tw-grid-cols-2 md:tw-grid-cols-3">
						<div class="tw-bg-tertiary tw-text-left md:tw-text-center">
							<p>Filters</p>
							<hr>
							<fieldset>
								<legend>Gender Filter</legend>
								<kv-radio
									value="female"
									v-model="gender"
								>
									Women
								</kv-radio>
								<kv-radio
									value="male"
									v-model="gender"
								>
									Men
								</kv-radio>
								<kv-radio
									value="both"
									v-model="gender"
								>
									All
								</kv-radio>

								<span>gender: {{ gender }}</span>
							</fieldset>
							<hr>
							<br> Loan Term
							<br> Country
							<br> Sector
							<br>
							<kv-button
								v-model="loanQueryFilters"
								@click="updateQuery"
							>
								Search
							</kv-button>
							<kv-button
								v-model="loanQueryFilters"
								@click="resetFilter"
							>
								Reset Filters
							</kv-button>
						</div>
						<div class="md:tw-hidden">
							<p> {{ totalCount }} Loans </p>
						</div>
						<div class="tw-col-span-2">
							<div class="tw-bg-tertiary tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
								Search Loans
							</div>
							<div class="tw-hidden md:tw-block tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
								<p> {{ totalCount }} Loans </p>
							</div>
							<kv-grid class="tw-grid-rows-4">
								<loan-card-controller
									v-for="loan in loans"
									:items-in-basket="null"
									:is-visitor="true"
									:key="loan.id"
									:loan="loan"
									loan-card-type="ListLoanCard"
								/>
							</kv-grid>
						</div>
					</kv-grid>
				</kv-page-container>
			</div>
		</article>
		<!-- <aside>Similar loans</aside> -->
	</www-page>
</template>

<script>
import { mdiFilterVariant, mdiCompassRose } from '@mdi/js';
import { lightHeader } from '@/util/siteThemes';
import { fetchData, filterGender, allSectors } from '@/util/flssUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvRadio from '~/@kiva/kv-components/vue/KvRadio';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		KvGrid,
		KvPageContainer,
		KvMaterialIcon,
		LoanCardController,
		KvRadio,
		KvButton,
	},
	data() {
		return {
			headerTheme: lightHeader,
			loanId: Number(this.$route.params.id || 0),
			loanQueryFilters: {},
			totalCount: 0,
			loans: [],
			zeroLoans: false,
			mdiFilterVariant,
			mdiCompassRose,
			gender: 'both',
			sector: ['food', 'education'],
			country: ['TZ', 'KE'],
		};
	},
	methods: {
		populateSector() {
			console.log(allSectors);
		},
		filterSector() {
			// # TODO: collect sector from checkbox inputs
			let sectorFilter = {};
			// this.sector = ['education', 'agriculture'];
			const sectorsSelected = this.sector;

			if (sectorsSelected.length < 1) {
				sectorFilter = { none: [] };
			} else {
				sectorFilter = sectorsSelected;
			}
			console.log('from filterSector', sectorFilter);
			return sectorFilter;
		},
		filterCountry() {
			// # TODO: collect country from checkbox inputs
			// let countryFilter = ['TZ', 'KE'];
			const countryFilter = { any: this.country };
			console.log('from filterCountrey', countryFilter);
			return countryFilter;
		},
		resetFilter() {
			this.loanQueryFilters = {};
			this.runQuery();
		},
		runQuery() {
			console.log('filters into fetchData:', this.loanQueryFilters);
			fetchData(this.loanQueryFilters, this.apollo).then(flssData => {
				this.loans = flssData.values ?? [];
				this.totalCount = flssData.totalCount;
				console.log('num loans:', this.totalCount);

				if (this.totalCount === 0) {
					this.zeroLoans = true;
				}
			});
		},
		updateQuery() {
			this.loanQueryFilters = this.queryFilters;
			console.log('from updateQuery', this.loanQueryFilters);
			console.log('new query ran, yes!');
		},
	},
	mounted() {
		this.loanQueryFilters = { countryIsoCode: { any: ['US'] } };
		this.runQuery();
	},
	computed: {
		queryFilters() {
			const genderFilter = filterGender(this.gender);
			console.log('this is filtergender', genderFilter);

			const loanQueryFilters = {
				countryIsoCode: { any: this.country },
				gender: genderFilter,
				sector: { any: this.sector },
			};
			console.log('yo! from queryFilters', loanQueryFilters);
			return loanQueryFilters;
		},
	},
	watch: {
		gender: { handler: 'updateQuery' },
		// sector: { handler: 'updateQuery' },
		// country: { handler: 'updateQuery' },
		loanQueryFilters: { handler: 'updateQuery' },
	},
};
</script>
