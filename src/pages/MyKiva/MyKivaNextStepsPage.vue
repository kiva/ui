<template>
	<WwwPage
		page-title="My Kiva Next Steps"
		main-class="tw-bg-secondary tw-overflow-hidden tw-relative" class="tw-relative"
	>
		<MyKivaNextStepsPageContent />
	</WwwPage>
</template>

<script setup>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaNextStepsPageContent from '#src/pages/MyKiva/MyKivaNextStepsPageContent';

</script>

<style lang="postcss" scoped>
/*
.page-container :deep(> div > div > *:not(#mykiva-journal-updates, #mykiva-achievements, #mykiva-borrower-carousel)) {
	@apply tw-p-2 tw--m-2;
}
*/

.page-container :deep(> div > div > *), #mykiva-journal-updates :deep(> section) {
	@apply tw-overflow-visible lg:tw-overflow-hidden;
}

:deep(.kv-carousel) {
	@apply tw-overflow-visible;
}

:deep(.kv-carousel > div:first-child) {
	@apply tw-gap-2 lg:tw-gap-4;
}

:deep(#recommended-loans #customizedCarousel div:first-child div div div) {
	@apply !tw-rounded;
}

:deep(#recommended-loans #customizedCarousel div:first-child > div > div.loan-card-active-hover a picture) {
	@apply !tw-rounded-t;
}

:deep(#recommended-loans h2) {
	@apply !tw-text-h3 !tw-font-sans;
}

:deep(#recommended-loans > div) {
	@apply !tw-px-0;
}

:deep(#recommended-loans > div > div) {
	@apply !tw-px-0;
}

#recommended-loans :deep(.kv-carousel) {
	@apply !tw-w-full;
}

:deep(.kv-carousel__controls) {
	@apply tw-hidden md:tw-flex;
}

/* Ensure scroll position accounts for sticky header */
#mykiva-achievements {
	scroll-margin-top: 85px;

	@media (width >= 1024px) {
		scroll-margin-top: 116px;
	}
}
</style>
