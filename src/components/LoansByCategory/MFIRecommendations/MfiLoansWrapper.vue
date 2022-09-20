<template>
	<div class="tw-my-4 tw-px-2 lg:tw-px-0">
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
				href="https://www.kiva.org/lend?partner=59&status=fundRaising&sortBy=newest"
				v-kv-track-event="['Lending', 'click-MFI-feature', 'view all']"
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

<style lang="scss" scoped>
	@import 'settings';
	@include breakpoint(xxlarge) {
		#carousel_exp {
			position: relative;
		}
		#carousel_exp >>> section > div:nth-child(2) {
			position: absolute;
			top: -55px;
			margin-left: -40px;

		}

		#carousel_exp >>> section > div:nth-child(2) > button {
			width: 24px;
			height: 24px;
			margin-right: 15px;
		}

		#carousel_exp >>> section > div:nth-child(2) > div {
			display: none;
		}
	}

	#carousel_exp >>> section > div:nth-child(1) > div {
		max-width: 280px !important;
	}
</style>
