<template>
	<www-page id="borrower-profile">
		<div class="tw-container">
			<div class="tw-grid tw-grid-cols-12 tw-gap-x-2">
				<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-7">
					<summary-card />
					<!-- Borrower details -->
				</div>
				<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-5">
					<!-- Powered by lenders info -->
					<lend-cta />
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import SummaryCard from '@/components/BorrowerProfile/SummaryCard';
import LendCta from '@/components/BorrowerProfile/LendCta';

export default {
	components: {
		SummaryCard,
		WwwPage,
		LendCta,
	},
};
</script>
