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
					:enable-five-dollars-notes="enableFiveDollarsNotes"
				/>
			</kv-page-container>
		</article>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanSearchInterface from '@/components/Lend/LoanSearch/LoanSearchInterface';
import { mdiEarth, mdiFilter, mdiClose } from '@mdi/js';
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '@/plugins/five-dollars-test-mixin';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const FLSS_ONGOING_EXP_KEY = 'EXP-FLSS-Ongoing-Sitewide-2';
const CATEGORY_REDIRECT_EXP_KEY = 'category_filter_redirect';

const getHasEverLoggedIn = client => !!(client.readQuery({ query: hasEverLoggedInQuery })?.hasEverLoggedIn);

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
			enableSavedSearch: true,
			mdiEarth,
			mdiFilter,
			mdiClose,
			savedSearchName: ''
		};
	},
	mixins: [fiveDollarsTest],
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client, args) {
			return client.query({ query: experimentQuery, variables: { id: CATEGORY_REDIRECT_EXP_KEY } })
				.then(() => {
					const query = args?.route?.query ?? {};

					// Redirect to /lend-category-beta if user has previously signed in and experiment is assigned
					const { version } = client.readFragment({
						id: `Experiment:${CATEGORY_REDIRECT_EXP_KEY}`,
						fragment: experimentVersionFragment,
					}) ?? {};

					if (version === 'b' && getHasEverLoggedIn(client)) {
						return Promise.reject({ path: '/lend-category-beta', query });
					}

					return Promise.all([
						client.query({ query: experimentQuery, variables: { id: 'extend_flss_filters' } }),
						client.query({ query: experimentQuery, variables: { id: FLSS_ONGOING_EXP_KEY } }),
						client.query({ query: experimentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
					]);
				});
		},
	},
	created() {
		this.initializeFiveDollarsNotes();

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

		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'Lending',
			FLSS_ONGOING_EXP_KEY,
			'EXP-VUE-FLSS-Ongoing-Sitewide'
		);
	},
	mounted() {
		if (getHasEverLoggedIn(this.apollo)) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				CATEGORY_REDIRECT_EXP_KEY,
				'EXP-CORE-1205-May2023'
			);
		}
	},
};
</script>
