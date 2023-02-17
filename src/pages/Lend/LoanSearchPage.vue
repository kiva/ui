<template>
	<www-page id="lend-filter">
		<article class="tw-bg-secondary tw-relative tw-pt-6">
			<kv-page-container>
				<div class="tw-flex tw-items-start tw-pb-8">
					<div class="tw-flex-1">
						<h1 class="tw-mb-2">
							Make a loan, change a life
						</h1>
						<p class="tw-text-h3 tw-text-secondary md:tw-w-2/3 tw-mb-3p tw-hidden md:tw-block">
							Each Kiva loan helps people build a better future for themselves and their families.
						</p>
					</div>
					<a
						href="/lend-by-category"
						class="
							tw-mb-2 tw-mt-3 tw-px-1 md:tw-px-2
							tw-border-r tw-border-tertiary
							tw-text-secondary hover:tw-text-action
							tw-text-center hover:tw-no-underline"
					>
						<kv-material-icon :icon="mdiEarth" class=" tw-w-3 tw-h-3" />
						<span class="tw-hidden md:tw-block">
							Explore
						</span>
					</a>
					<a class="tw-mb-2 tw-mt-3 tw-px-1 md:tw-px-2 tw-text-center hover:tw-no-underline">
						<kv-material-icon :icon="mdiFilter" class="tw-text-brand tw-w-3 tw-h-3" />
						<span class="tw-text-secondary tw-hidden md:tw-block">
							Filters
						</span>
					</a>
				</div>
				<loan-search-interface
					:extend-flss-filters="extendFlssFilters"
					:enable-saved-search="enableSavedSearch"
				/>
			</kv-page-container>
		</article>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanSearchInterface from '@/components/Lend/LoanSearch/LoanSearchInterface';
import { mdiEarth, mdiFilter, mdiClose } from '@mdi/js';
import { gql } from '@apollo/client';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const pageQuery = gql`query loanSearchPage {
	general {
		extendFlssFilters: uiExperimentSetting(key: "extend_flss_filters") {
			key
			value
		}
		lendFilterFlssQuery: uiExperimentSetting(key: "EXP-FLSS-Lend-Filter") {
			key
			value
		}
	}
}`;

export default {
	name: 'LoanSearchPage',
	components: {
		WwwPage,
		KvPageContainer,
		KvMaterialIcon,
		LoanSearchInterface,
	},
	data() {
		return {
			extendFlssFilters: false,
			enableFlssQueryExp: false,
			enableSavedSearch: true,
			mdiEarth,
			mdiFilter,
			mdiClose,
			savedSearchName: '',
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			}).then(() => {
				return Promise.all([
					client.query({ query: experimentQuery, variables: { id: 'extend_flss_filters' } }),
					client.query({ query: experimentQuery, variables: { id: 'EXP-FLSS-Lend-Filter' } }),
				]);
			});
		},
		result() {
			// Extended FLSS Loan Filter Experiment
			const showMoreFiltersExp = this.apollo.readFragment({
				id: 'Experiment:extend_flss_filters',
				fragment: experimentVersionFragment,
			}) || {};
			this.extendFlssFilters = showMoreFiltersExp.version === 'b';
			if (showMoreFiltersExp.version) {
				this.$kvTrackEvent(
					'Lending',
					'EXP-VUE-1323-Nov-2022',
					showMoreFiltersExp.version
				);
			}
			// Lend Filter Flss Query Experiment
			const lendFilterFlssQuery = this.apollo.readFragment({
				id: 'Experiment:EXP-FLSS-Lend-Filter',
				fragment: experimentVersionFragment,
			}) || {};
			this.enableFlssQueryExp = lendFilterFlssQuery.version;
			if (lendFilterFlssQuery.version) {
				this.$kvTrackEvent(
					'Lending',
					'EXP-VUE-1346-Oct-2022',
					lendFilterFlssQuery.version
				);
			}
		}
	},
};
</script>