<template>
	<www-page id="lend-filter-alpha">
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
				<loan-search-interface />
			</kv-page-container>
		</article>
	</www-page>
</template>

<script>
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import {
	getExperimentSettingAsync,
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experimentUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanSearchInterface from '@/components/Lend/LoanSearch/LoanSearchInterface';
import { mdiEarth, mdiFilter } from '@mdi/js';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const lendFilterRedirectEXP = 'lend_filter_flss_v1';

export default {
	name: 'LoanSearchPage',
	components: {
		WwwPage,
		KvPageContainer,
		KvMaterialIcon,
		LoanSearchInterface
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			mdiEarth,
			mdiFilter
		};
	},
	apollo: {
		preFetch(config, client) {
			// get experiment setting and assignment
			return getExperimentSettingAsync(client, lendFilterRedirectEXP)
				.then(() => {
					// running the assignment query ensures any existing assignment is in the apollo cache
					return client.query({ query: experimentAssignmentQuery, variables: { id: lendFilterRedirectEXP } });
				});
		}
	},
	created() {
		const { enabled } = getExperimentSettingCached(this.apollo, lendFilterRedirectEXP);
		if (enabled) {
			// this method will get the version from the apollo cache
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				lendFilterRedirectEXP,
				'EXP-VUE-1061-June2022'
			);
		}
	}
};
</script>
