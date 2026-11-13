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
			<div v-else class="tw-grid tw-grid-cols-12 tw-gap-3">
				<account-overview-card class="tw-col-span-12 lg:tw-col-span-8" />
			</div>
		</div>

		<div class="tw-grid tw-grid-cols-12 tw-gap-3">
			<div class="tw-col-span-12 lg:tw-col-span-8 tw-min-w-0 tw-flex tw-flex-col tw-gap-3">
				<h2 class="tw-text-h3">
					Your impact diversity
				</h2>
				<impact-stats-row />
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-geographic-reach">
					<h3 class="tw-text-h4">
						Geographic reach
					</h3>
				</section>
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-sector">
					<h3 class="tw-text-h4">
						By Sector
					</h3>
				</section>
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-activity">
					<h3 class="tw-text-h4">
						By Activity
					</h3>
				</section>
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-gender">
					<h3 class="tw-text-h4">
						By Gender
					</h3>
				</section>
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-partner">
					<h3 class="tw-text-h4">
						By Lending Partner
					</h3>
				</section>
			</div>

			<div class="tw-col-span-12 lg:tw-col-span-4 tw-min-w-0 tw-flex tw-flex-col tw-gap-3">
				<h2 class="tw-text-h3">
					Achievements
				</h2>
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-goal">
					<h3 class="tw-text-h4">
						Goal
					</h3>
				</section>
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-percentile">
					<h3 class="tw-text-h4">
						Lending percentile
					</h3>
				</section>
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-badges">
					<h3 class="tw-text-h4">
						Badges
					</h3>
				</section>
				<h2 class="tw-text-h3">
					Remember them?
				</h2>
				<section class="tw-bg-white tw-rounded tw-p-2 md:tw-p-3" data-testid="impact-first-loan">
					<h3 class="tw-text-h4">
						Your first loan on Kiva
					</h3>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
import AccountOverviewCard from '#src/components/Portfolio/ImpactStats/AccountOverviewCard';
import GivingFundCard from '#src/components/Portfolio/ImpactStats/GivingFundCard';
import ImpactStatsRow from '#src/components/Portfolio/ImpactStats/ImpactStatsRow';
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'ImpactStatsLayout' });

const { showGivingFund } = useImpactStats();
</script>
