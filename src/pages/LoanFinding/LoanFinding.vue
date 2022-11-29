<template>
	<www-page>
		<div class="tw-max-w-5xl tw-mx-auto tw-p-2 lg:tw-pt-4">
			<h3 class="tw-text-h3 tw-text-primary">
				Welcome back, <span class="tw-text-action fs-mask">{{ firstName }}</span>
			</h3>

			<quick-filters-section class="tw-mt-2" />
		</div>
	</www-page>
</template>

<script>
import userInfoQuery from '@/graphql/query/userInfo.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import QuickFiltersSection from '@/components/LoanFinding/QuickFiltersSection';

export default {
	name: 'LoanFinding',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		QuickFiltersSection,
	},
	data() {
		return {
			userInfo: {}
		};
	},
	apollo: {
		query: userInfoQuery,
		preFetch(config, client) {
			return client
				.query({
					query: userInfoQuery,
				});
		},
		result({ data }) {
			this.userInfo = data?.my?.userAccount ?? {};
		}
	},
	computed: {
		firstName() {
			return this.userInfo?.firstName ?? '';
		}
	},
};
</script>
