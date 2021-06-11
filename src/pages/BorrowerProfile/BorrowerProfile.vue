<template>
	<www-page id="borrower-profile">
		<div class="tw-container">
			<div class="tw-grid tw-grid-cols-12 tw-gap-x-2">
				<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-7">
					<summary-card />
					<!-- Borrower details -->
				</div>
				<div class="tw-col-span-12 md:tw-col-start-6 md:tw-col-span-6 lg:tw-col-span-5">
					<!-- Powered by lenders info -->
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import SummaryCard from '@/components/BorrowerProfile/SummaryCard';

export default {
	components: {
		SummaryCard,
		WwwPage,
	},
	data() {
		return {

		};
	}
};
</script>
