<template>
	<www-page
		id="lend-filter-alpha"
		:header-theme="headerTheme"
	>
		<article class="tw-bg-secondary tw-relative tw-pt-6">
			<div class="tw-relative" style="max-height: 460px;">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
				</div>
			</div>
			<!-- <div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8">
			</div> -->
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
									class="tw-text-left"
									value="female"
									v-model="gender"
								>
									Women
								</kv-radio>
								<kv-radio
									class="tw-text-left"
									value="male"
									v-model="gender"
								>
									Men
								</kv-radio>
								<kv-radio
									class="tw-text-left"
									value="both"
									v-model="gender"
								>
									All
								</kv-radio>

								<span>gender: {{ gender }}</span>
							</fieldset>
							<hr>
							<fieldset>
								<legend>Sector</legend>
								<kv-checkbox
									class="tw-text-left"
									v-for=" sectorBox in allSectors"
									name="sectorBox.name"
									v-model="sector"
									:key="sectorBox.id"
									:value="sectorBox.name"
								>
									{{ sectorBox.name }}
								</kv-checkbox>
							</fieldset>
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
							<hr>
							<br> Loan Term
							<br> Country
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
import {
	fetchData, filterGender, allSectors, filterSector
} from '@/util/flssUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvRadio from '~/@kiva/kv-components/vue/KvRadio';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';

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
		KvCheckbox,
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
			sector: ['Food', 'Education'],
			country: ['TZ', 'KE'],
			allSectors,
		};
	},
	methods: {
		filterCountry() {
			// # TODO: collect country from checkbox inputs
			// let countryFilter = ['TZ', 'KE'];
			const countryFilter = { any: this.country };
			console.log('from filterCountrey', countryFilter);
			return countryFilter;
		},
		resetFilter() {
			this.gender = 'both';
			this.sector = [];
			this.country = [];
			this.loanQueryFilters = {};
			this.runQuery(this.loanQueryFilters);
		},
		runQuery(loanQueryFilters) {
			console.log('filters into runQuery:', loanQueryFilters);
			fetchData(loanQueryFilters, this.apollo).then(flssData => {
				this.loans = flssData.values ?? [];
				this.totalCount = flssData.totalCount;
				console.log('num loans:', this.totalCount);

				if (this.totalCount === 0) {
					this.zeroLoans = true;
				}
			});
		},
		updateQuery() {
			// this.country = ['TZ', 'KE'];

			const updatedQueryFilters = this.queryFilters;
			console.log('from updateQuery', updatedQueryFilters);
			console.log('new query ran, yes!');
			this.runQuery(updatedQueryFilters);
		},
	},
	mounted() {
		this.loanQueryFilters = { countryIsoCode: { any: ['US'] } };
		console.log('mounted query ran:', this.loanQueryFilters);
		this.runQuery(this.loanQueryFilters);
	},
	computed: {
		queryFilters() {
			// // TODO: enable genderFilter when its working
			const genderFilter = filterGender(this.gender);
			console.log('this is filtergender', genderFilter);

			const sectorFilter = filterSector(this.sector);
			console.log('this is filterSector', sectorFilter);

			const loanQueryFilters = {
				countryIsoCode: { none: [] },
				// TODO: enable genderFilter when its working
				// gender: genderFilter,
				sector: sectorFilter,
			};
			console.log('yo! from queryFilters', loanQueryFilters);
			return loanQueryFilters;
		},
	},
	watch: {
		gender: { handler: 'updateQuery' },
		sector: { handler: 'updateQuery' },
		// // country: { handler: 'updateQuery' },
	},
};
</script>
