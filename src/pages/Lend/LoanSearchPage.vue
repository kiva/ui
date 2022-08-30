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
					<button class="tw-mb-2 tw-mt-3 tw-border-r tw-border-tertiary tw-px-1 md:tw-px-2">
						<kv-material-icon :icon="mdiEarth" class="tw-text-secondary tw-w-3 tw-h-3" />
						<p class="tw-text-tertiary tw-hidden md:tw-block">
							Explore
						</p>
					</button>
					<button class="tw-mb-2  tw-mt-3 tw-px-1 md:tw-px-2">
						<kv-material-icon :icon="mdiFilter" class="tw-text-brand tw-w-3 tw-h-3" />
						<p class="tw-text-tertiary tw-hidden md:tw-block">
							Filters
						</p>
					</button>
				</div>
				<loan-search-interface
					:enable-saved-search="enableSavedSearch"
				/>
			</kv-page-container>
		</article>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanSearchInterface from '@/components/Lend/LoanSearch/LoanSearchInterface';
import { mdiEarth, mdiFilter } from '@mdi/js';
import gql from 'graphql-tag';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const pageQuery = gql`query loanSearchPage {
	general {
		enableSavedSearch: uiExperimentSetting(key: "saved_search") {
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
		LoanSearchInterface
	},
	data() {
		return {
			enableSavedSearch: false,
			mdiEarth,
			mdiFilter,
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
					client.query({ query: experimentQuery, variables: { id: 'saved_search' } }),
				]);
			});
		},
		result() {
			const savedSearchExp = this.apollo.readFragment({
				id: 'Experiment:saved_search',
				fragment: experimentVersionFragment,
			}) || {};
			this.enableSavedSearch = savedSearchExp.version === 'b';
			if (savedSearchExp.version) {
				this.$kvTrackEvent(
					'Lending',
					'EXP-CORE-687-Aug-2022',
					savedSearchExp.version
				);
			}
		}
	},
};
</script>
