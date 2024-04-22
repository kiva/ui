<template>
	<div class="tw-bg-brand-100 tw-rounded tw-p-2 md:tw-p-4">
		<div class="tw-w-full tw-flex tw-items-center tw-justify-between tw-mb-1">
			<h4 class="tw-text-action">
				Don’t miss out on your free $25 lending credit!
			</h4>
			<button
				@click="toggleAccordion"
			>
				<kv-material-icon
					class="tw-w-4 tw-h-4"
					@click="toggleAccordion"
					:icon="open ? mdiChevronUp : mdiChevronDown"
				/>
			</button>
		</div>
		<kv-expandable easing="ease-in-out">
			<div v-show="open" class="tw-flex tw-flex-col tw-items-center lg:tw-flex-row tw-flex-no-wrap upsellModule">
				<div class="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-w-full md:tw-basis-4/5">
					<div>
						<img
							:src="imageUrl"
							class="tw-rounded-full sm:tw-w-6 tw-w-16 borrowerImage"
						>
					</div>
					<div class="tw-grow tw-flex tw-flex-col tw-justify-center upsellLoanDetails">
						<h3 class="tw-mb-0.5">
							Lend to {{ borrowerName }} in Honduras
						</h3>
						<p class="tw-mb-2 tw-hidden md:tw-block">
							<!-- eslint-disable-next-line max-len -->
							A loan of {{ amountLeft | numeral('$0,0[.]00') }} helps {{ loan.use }}
						</p>
					</div>
				</div>
				<div class="tw-grow tw-flex tw-flex-wrap tw-w-full lg:tw-w-auto lg:tw-basis-1/5">
					<div class="tw-w-full tw-text-right tw-self-end">
						<kv-button
							variant="link"
							class="tw-w-full"
							@click="addToBasket(loanId, amountToLend)"
						>
							Add {{ amountToLend | numeral('$0,0[.]00') }} loan to basket
						</kv-button>
					</div>
				</div>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import {
	mdiChevronDown,
	mdiChevronUp
} from '@mdi/js';
import KvExpandable from '@/components/Kv/KvExpandable';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'DepositLcUpsell',
	components: {
		KvButton,
		KvMaterialIcon,
		KvExpandable,
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
		amountToLend: {
			type: Number,
			default: 0,
		}
	},
	data() {
		return {
			mdiChevronDown,
			mdiChevronUp,
			open: false,
		};
	},
	mounted() {
		this.$kvTrackEvent(
			'Basket',
			'view-checkout-upsell',
			'View',
			this.loan?.id,
			this.amountToLend
		);
		this.toggleAccordion();
	},
	computed: {
		loanId() {
			return this.loan?.id;
		},
		imageUrl() {
			return this.loan?.image?.url;
		},
		pronouns() {
			if (this.loan?.gender === 'male') return ['him', 'his'];
			if (this.loan?.gender === 'female') return ['her', 'her'];
			return ['them', 'their'];
		},
		borrowerName() {
			return this.loan?.name ?? '';
		},
		amountLeft() {
			const amountLeft = this.loan?.loanAmount
			- this.loan?.loanFundraisingInfo?.fundedAmount
			- this.loan?.loanFundraisingInfo?.reservedAmount;
			return amountLeft < 0 ? 0 : amountLeft;
		},
	},
	methods: {
		toggleAccordion() {
			this.open = !this.open;
			this.$kvTrackEvent('Basket', 'click', `${this.open ? 'show' : 'hide'}-deposit-lc-upsell`);
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

@media screen and (min-width: 734px) {
	.upsellModule {
		gap: 32px;

		.borrowerImage {
			width: 128px;
		}
	}
}

@media screen and (max-width: 733px) {
	.upsellModule {
		gap: 8px;

		.borrowerImage {
			width: 48px;
		}
	}
}

</style>
