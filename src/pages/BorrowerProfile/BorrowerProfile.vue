<template>
	<www-page id="borrower-profile">
		<div class="tw-relative tw-overflow-hidden md:tw-py-6 lg:tw-py-8 tw-bg-gray-50">
			<hero-background class="tw-absolute tw-top-0" />
			<div class="tw-container tw-relative">
				<div class="tw-grid tw-grid-cols-12 tw-gap-x-2">
					<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-7">
						<summary-card />
					</div>
					<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-5">
						<lend-cta />
					</div>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import HeroBackground from '@/components/BorrowerProfile/HeroBackground';
import SummaryCard from '@/components/BorrowerProfile/SummaryCard';
import LendCta from '@/components/BorrowerProfile/LendCta';

export default {
	components: {
		HeroBackground,
		SummaryCard,
		WwwPage,
		LendCta,
	},
};
</script>
