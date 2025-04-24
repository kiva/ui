<template>
	<www-page main-class="tw-bg-secondary tw-overflow-hidden tw-relative" class="tw-relative">
		<my-kiva-page-content />
	</www-page>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaPageContent from '#src/pages/MyKiva/MyKivaPageContent';

/**
 * Options API parent needed to ensure WWwPage children options API preFetch works,
 * specifically for header component data preFetch
 */
export default {
	name: 'MyKivaPage',
	components: {
		WwwPage,
		MyKivaPageContent,
	},
};
</script>
