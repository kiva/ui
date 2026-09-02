<template>
	<div
		class="tw-bg-brand-100 tw-rounded"
		:class="isUpsellLayoutExpEnabled
			? 'tw-relative tw-p-4 md:tw-p-1 md:tw-min-h-15 md:tw-flex md:tw-flex-col md:tw-justify-center'
			: 'tw-p-4'"
	>
		<button
			v-if="isUpsellLayoutExpEnabled"
			class="tw-hidden md:tw-block tw-absolute tw-top-1 tw-right-1"
			@click="closeUpsellModule(amountLeft)"
		>
			<kv-material-icon
				class="tw-w-3"
				:icon="mdiClose"
			/>
		</button>
		<div
			class="tw-w-full tw-text-right tw-h-3"
			:class="{ 'md:tw-hidden': isUpsellLayoutExpEnabled }"
		>
			<button
				@click="closeUpsellModule(amountLeft)"
			>
				<kv-material-icon
					class="tw-w-3"
					:icon="mdiClose"
				/>
			</button>
		</div>
		<div
			class="tw-flex tw-flex-col md:tw-flex-row tw-flex-no-wrap tw-gap-1 md:tw-gap-4"
			:class="{ 'md:tw-items-center': isUpsellLayoutExpEnabled }"
		>
			<div>
				<img
					:src="imageUrl"
					class="tw-rounded-full"
					:class="isUpsellLayoutExpEnabled ? 'tw-w-6 md:tw-w-10' : 'tw-w-6 md:tw-w-16'"
				>
			</div>
			<div class="tw-grow tw-flex tw-flex-col tw-justify-center upsellLoanDetails">
				<p class="tw-text-upper tw-text-action tw-mb-0.5">
					Support Another Borrower
				</p>
				<h4
					v-if="isExpiringSoonExpEnabled"
					:class="isUpsellLayoutExpEnabled ? 'tw-mb-2 md:tw-mb-1' : 'tw-mb-2'"
				>
					Time is running out for {{ possessiveName }} loan. Add $25 before it expires.
				</h4>
				<h4
					v-else
					:class="isUpsellLayoutExpEnabled ? 'tw-mb-2 md:tw-mb-1' : 'tw-mb-2'"
				>
					<!-- eslint-disable-next-line max-len -->
					{{ loan.name }} is missing just {{ $filters.numeral(amountLeft, '$0,0[.]00') }}! Be the person to complete their loan.
				</h4>
				<div :class="{ 'md:tw-max-w-lg': isUpsellLayoutExpEnabled }">
					<fundraising-status-meter
						:amount-left="amountLeft"
						:percent-raised="percentRaised"
						:is-funded="loan.status==='funded'"
						:short-meter="!isUpsellLayoutExpEnabled"
						class="tw-mb-1"
					/>
					<p class="tw-text-upper tw-m-0">
						{{ $filters.numeral(amountLeft, '$0,0[.]00') }} to go
					</p>
				</div>
			</div>
			<div class="tw-grow tw-flex tw-flex-wrap">
				<div
					class="tw-w-full tw-text-right"
					:class="{ 'tw-self-end': !isUpsellLayoutExpEnabled }"
				>
					<kv-button
						:variant="isUpsellLayoutExpEnabled ? 'primary' : 'link'"
						class="tw-w-full"
						:class="isUpsellLayoutExpEnabled
							? 'tw-mt-2 md:tw-mt-0 md:tw-w-auto md:tw-mr-3'
							: 'tw-mt-2 md:tw-mt-7 md:tw-w-44'"
						@click="addToBasket(loanId, reservationAmount)"
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
import { formatPossessiveName } from '#src/util/stringParserUtils';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';

export const UPSELL_LAYOUT_EXP_KEY = 'checkout_upsell_layout';

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
		isExpiringSoonExpEnabled: {
			type: Boolean,
			default: false,
		},
		isUpsellLayoutExpEnabled: {
			type: Boolean,
			default: false,
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
			return this.loan?.image?.s100;
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
		reservationAmount() {
			return this.isExpiringSoonExpEnabled ? 25 : this.amountLeft;
		},
		possessiveName() {
			return formatPossessiveName(this.loan?.name);
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

<style scoped>
@media screen and (width >= 1160px) {
	.upsellLoanDetails {
		min-width: 600px;
	}
}
</style>
