<template>
	<div class="tw-bg-brand-100 tw-rounded tw-p-4">
		<div class="tw-w-full tw-text-right tw-h-3">
			<button
				@click="closeUpsellModule(amountLeft)"
			>
				<kv-material-icon
					class="tw-w-3"
					:icon="mdiClose"
				/>
			</button>
		</div>
		<div class="tw-flex tw-flex-col md:tw-flex-row tw-flex-no-wrap upsellModule">
			<div>
				<img :src="imageUrl" class="tw-rounded-full sm:tw-w-6 tw-w-16 borrowerImage">
			</div>
			<div class="tw-grow tw-flex tw-flex-col tw-justify-center upsellLoanDetails">
				<h4 class="tw-text-h4 tw-text-action tw-mb-0.5">
					Support Another Borrower
				</h4>
				<h3 class="tw-text-h3 tw-mb-2">
					<!-- eslint-disable-next-line max-len -->
					{{ loan.name }} is missing just {{ $filters.numeral(amountLeft, '$0,0[.]00') }}! Be the person to complete their loan.
				</h3>
				<div>
					<fundraising-status-meter
						:amount-left="amountLeft"
						:percent-raised="percentRaised"
						:is-funded="loan.status==='funded'"
						:short-meter="true"
						class="tw-mb-1"
					/>
					<p class="tw-text-h4 tw-m-0">
						{{ $filters.numeral(amountLeft, '$0,0[.]00') }} to go
					</p>
				</div>
			</div>
			<div class="tw-grow tw-flex tw-flex-wrap">
				<div class="tw-w-full tw-text-right tw-self-end">
					<kv-button
						variant="link"
						class="tw-w-full md:tw-w-44 tw-mt-2 md:tw-mt-7"
						@click="addToBasket(loanId, amountLeft)"
					>
						Add loan to basket
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	mdiClose
} from '@mdi/js';
import FundraisingStatusMeter from '#src/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';
import KvButton from '#kv-components/KvButton';
import KvMaterialIcon from '#kv-components/KvMaterialIcon';

export default {
	name: 'UpsellModule',
	components: {
		KvButton,
		KvMaterialIcon,
		FundraisingStatusMeter,
	},
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
		closeUpsellModule: {
			type: Function,
			default: () => {}
		},
		addToBasket: {
			type: Function,
			default: () => {}
		},
	},
	data() {
		return {
			mdiClose,
		};
	},
	mounted() {
		this.$kvTrackEvent(
			'Basket',
			'view-checkout-upsell',
			'View',
			this.loan?.id,
			this.amountLeft
		);
	},
	computed: {
		loanId() {
			return this.loan?.id;
		},
		imageUrl() {
			return this.loan?.image?.url;
		},
		loanAmount() {
			return this.loan?.loanAmount ?? 0;
		},
		amountLeft() {
			const fundedAmount = this.loan?.loanFundraisingInfo?.fundedAmount ?? 0;
			const reservedAmount = this.loan?.loanFundraisingInfo?.reservedAmount ?? 0;
			const amountLeft = this.loanAmount - fundedAmount - reservedAmount;
			return amountLeft < 0 ? 0 : amountLeft;
		},
		percentRaised() {
			return (this.loanAmount - this.amountLeft) / this.loanAmount;
		},
		pronouns() {
			if (this.loan?.gender === 'male') return ['him', 'his'];
			if (this.loan?.gender === 'female') return ['her', 'her'];
			return ['them', 'their'];
		},
	},
};
</script>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';

@media screen and (width >= 1160px) {
	.upsellLoanDetails {
		min-width: 600px;
	}
}

@media screen and (width >= 734px) {
	.upsellModule {
		gap: 32px;

		.borrowerImage {
			width: 128px;
		}
	}
}

@media screen and (width <= 733px) {
	.upsellModule {
		gap: 8px;

		.borrowerImage {
			width: 48px;
		}
	}
}

</style>
