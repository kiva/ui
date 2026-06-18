<template>
	<div class="tw-py-6">
		<h2 class="tw-text-subhead tw-mb-2">
			You haven't made a loan yet.
		</h2>
		<p class="tw-text-base">
			Make your first loan today and change a life! Start by lending to a
			<a
				href="/lend-by-category/women"
				class="tw-text-action tw-underline"
				v-kv-track-event="['portfolio', 'click', 'first-loan-cta-women']"
			>woman</a>,
			<a
				href="/lend-by-category/single-parents"
				class="tw-text-action tw-underline"
				v-kv-track-event="['portfolio', 'click', 'first-loan-cta-single-parents']"
			>single parent</a>,
			or
			<a
				href="/lend-by-category"
				class="tw-text-action tw-underline"
				v-kv-track-event="['portfolio', 'click', 'first-loan-cta-another-category']"
			>another category</a>.
		</p>
	</div>
</template>

<script>
export default {
	name: 'LoansFirstLoanCta',
};
</script>
