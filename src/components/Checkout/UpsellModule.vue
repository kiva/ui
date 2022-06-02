<template>
	<div class="tw-bg-brand-100 tw-rounded tw-p-4 tw-flex tw-gap-4 tw-flex-col md:tw-flex-row">
		<div>
			<img :src="imageUrl" class="tw-rounded-full tw-w-16">
		</div>
		<div class="tw-grow tw-flex tw-flex-col tw-justify-center upsellLoanDetails">
			<h4 class="tw-text-h4 tw-text-action tw-mb-0.5">
				Support Another Borrower
			</h4>
			<h3 class="tw-text-h3 tw-mb-2">
				Complete {{ loan.name }}'s loan for just ${{ amountLeft }}
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
					{{ amountLeft | numeral('$0,0[.]00') }} to go
				</p>
			</div>
		</div>
		<div class="tw-grow tw-flex tw-flex-wrap">
			<div class="tw-w-full tw-text-right">
				<button
					@click="closeUpsellModule()"
				>
					<kv-material-icon
						class="tw-w-3"
						:icon="mdiClose"
					/>
				</button>
			</div>
			<div class="tw-w-full tw-text-right">
				<kv-button variant="link"
					class="tw-w-44 lg:tw-w-full tw-mt-7"
					@click="addToBasket(loanId, amountLeft)"
				>
					Add loan to basket
				</kv-button>
			</div>
		</div>
	</div>
</template>

<script>
import {
	mdiClose
} from '@mdi/js';
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

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
		}
	},
	data() {
		return {
			mdiClose,
		};
	},
	computed: {
		loanId() {
			return this.loan?.id;
		},
		imageUrl() {
			return this.loan?.image?.url;
		},
		amountLeft() {
			const amountLeft = this.loan?.loanAmount
			- this.loan?.loanFundraisingInfo?.fundedAmount
			- this.loan?.loanFundraisingInfo?.reservedAmount;
			return amountLeft < 0 ? 0 : amountLeft;
		},
		percentRaised() {
			return (this.loan?.loanAmount - this.amountLeft) / this.loan?.loanAmount;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

@media screen and (min-width: 1160px) {
	.upsellLoanDetails {
		min-width: 600px;
	}
}

@media screen and (max-width: 400px) {
	.upsellModule {
		flex-direction: column;
	}
}

</style>
