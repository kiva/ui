<template>
	<div class="tw-flex tw-flex-col tw-gap-4">
		<div>
			<h2 class="tw-text-h3 tw-mb-1.5">
				Account overview
			</h2>
			<div v-if="showGivingFund" class="tw-grid tw-gap-2 md:tw-grid-cols-2">
				<account-overview-card />
				<giving-fund-card />
			</div>
			<div v-else class="tw-grid tw-grid-cols-12 tw-gap-3 lg:tw-gap-x-4">
				<account-overview-card class="tw-col-span-12 lg:tw-col-span-8" />
			</div>
		</div>

		<div class="tw-grid tw-grid-cols-12 tw-gap-3 lg:tw-gap-x-4">
			<div class="tw-col-span-12 lg:tw-col-span-8 tw-min-w-0 tw-flex tw-flex-col tw-gap-3">
				<h2 class="tw-text-h3">
					Your impact diversity
				</h2>
				<impact-stats-row />
				<impact-section-card title="Geographic Reach" data-testid="impact-geographic-reach" />
				<impact-section-card title="By Sector" data-testid="impact-sector" />
				<impact-section-card title="By Activity" data-testid="impact-activity" />
				<impact-section-card title="By Gender" data-testid="impact-gender" />
				<impact-section-card title="By Lending Partner" data-testid="impact-partner" />
			</div>

			<div class="tw-col-span-12 lg:tw-col-span-4 tw-min-w-0 tw-flex tw-flex-col tw-gap-3">
				<h2 class="tw-text-h3">
					Achievements
				</h2>
				<impact-section-card title="Goal" data-testid="impact-goal" />
				<impact-section-card title="Lending percentile" data-testid="impact-percentile" />
				<impact-section-card title="Badges" data-testid="impact-badges" />
				<h2 class="tw-text-h3">
					Remember them?
				</h2>
				<impact-section-card title="Your first loan on Kiva" data-testid="impact-first-loan" />
			</div>
		</div>
	</div>
</template>

<script setup>
import AccountOverviewCard from '#src/components/Portfolio/ImpactStats/AccountOverviewCard';
import GivingFundCard from '#src/components/Portfolio/ImpactStats/GivingFundCard';
import ImpactSectionCard from '#src/components/Portfolio/ImpactStats/ImpactSectionCard';
import ImpactStatsRow from '#src/components/Portfolio/ImpactStats/ImpactStatsRow';
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'ImpactStatsLayout' });

const { showGivingFund } = useImpactStats();
</script>
