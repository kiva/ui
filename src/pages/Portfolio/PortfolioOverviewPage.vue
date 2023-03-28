<template>
	<www-page main-class="tw-bg-secondary">
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
				<the-portfolio-tertiary-menu class="tw-pt-2 tw-col-span-3 tw-hidden md:tw-block" />
				<div class="tw-col-span-12 md:tw-col-span-9 tw-pt-3">
					<account-overview />
					<recent-loans-list />
					<recommended-loans-list />
					<kiva-credit-stats />
					<account-updates />
					<lending-insights />
					<your-teams />
					<!-- stat graphs -->
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import AccountOverview from './AccountOverview';
import AccountUpdates from './AccountUpdates';
import KivaCreditStats from './KivaCreditStats';
import LendingInsights from './LendingInsights';
import RecentLoansList from './RecentLoansList';
import RecommendedLoansList from './RecommendedLoansList';
import YourTeams from './YourTeams';

export default {
	name: 'PortfolioOverviewPage',
	components: {
		AccountOverview,
		AccountUpdates,
		KivaCreditStats,
		KvGrid,
		KvPageContainer,
		LendingInsights,
		RecentLoansList,
		RecommendedLoansList,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		WwwPage,
		YourTeams,
	},
};
</script>
