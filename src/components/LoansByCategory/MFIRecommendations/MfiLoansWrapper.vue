<template>
	<div class="tw-py-4 tw-px-2 lg:tw-px-0">
		<h4 class="tw-text-h4 tw-text-action">
			Support Borrowers from Fundación Pro Mujer
		</h4>
		<kiva-classic-loan-carousel-exp
			:is-visible="true"
			:loan-ids="selectedChannelLoanIds"
			:selected-channel="selectedChannel"
			:show-view-more-card="true"
			:is-personalized="true"
			:is-mfi="true"
			id="carousel_exp"
			class="-tw-mt-4"
		/>

		<div class="tw-flex tw-justify-center tw-mt-4">
			<a
				class="tw-text-action tw-text-base"
				href="https://www.kiva.org/lend/filter?partner=59"
				v-kv-track-event="['event-tracking', 'click', 'mfi-view-all']"
			>
				View All
			</a>
		</div>
	</div>
</template>

<script>
import KivaClassicLoanCarouselExp from '@/components/LoanCollections/KivaClassicLoanCarouselExp';

export default {
	name: 'MfiLoansWrapper',
	props: {
		selectedChannelLoanIds: {
			type: Array,
			default: () => [],
		},
		selectedChannel: {
			type: Object,
			default: () => {},
		}
	},
	components: {
		KivaClassicLoanCarouselExp
	}
};

</script>

<style scoped>

	#carousel_exp >>> .kv-carousel__controls {
		justify-content: center;
	}

	#carousel_exp >>> .kv-carousel__controls div {
		visibility: visible;
	}

</style>
