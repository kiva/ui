<template>
	<div
		class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8"
		style="max-width: 1200px;"
	>
		<div class="tw-flex tw-flex-col tw-justify-center tw-mb-1">
			<h4 class="tw-text-h4 tw-text-action tw-flex tw-items-center">
				<img class="tw-mr-1" src="@/assets/images/hand_orange.svg">
				Featured borrower
			</h4>
			<h2 class="tw-text-h2 md:tw-text-h1 tw-text-primary tw-my-0.5">
				{{ title }}
			</h2>
			<p class="tw-text-base md:tw-text-subhead tw-text-primary">
				{{ subtitle }}
			</p>
		</div>
		<div>
			<kv-classic-loan-card-container
				:loan-id="loan.id"
				:use-full-width="true"
				:show-tags="true"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:large-card="true"
				:user-balance="userBalance"
				@add-to-basket="addToBasket"
				class="tw-h-full"
			/>
		</div>
	</div>
</template>

<script>
import KvClassicLoanCardContainer from '@/components/LoanCards/KvClassicLoanCardContainer';

export default {
	name: 'LoanFindingFeaturedLoan',
	components: {
		KvClassicLoanCardContainer
	},
	props: {
		title: {
			type: String,
			default: '',
			required: true
		},
		subtitle: {
			type: String,
			default: ''
		},
		loan: {
			type: Object,
			default: () => {}
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: String,
			default: undefined
		},
	},
	methods: {
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
	}
};
</script>
