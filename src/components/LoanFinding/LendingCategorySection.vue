<template>
	<div class="tw-w-full">
		<div class="tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-end lg:tw-items-center">
				<div class="tw-w-full lg:tw-w-auto">
					<h2 v-html="title" class="tw-text-h2 tw-text-primary"></h2>
					<p
						v-if="subtitle"
						class="tw-text-subhead tw-text-primary"
						:class="{ 'tw-hidden lg:tw-block' : enableRelendingExp }"
					>
						{{ subtitle }}
					</p>
				</div>
				<multiple-atc-button
					v-if="enableRelendingExp"
					:amount="multipleAmount"
					:loans-number="totalLoans"
					:disabled="disableMultipleButton"
					@add-multiple="addMultipleLoans"
				/>
			</div>
			<kv-carousel
				class="tw-w-full tw-overflow-hidden tw-mt-1 tw-pb-2"
				:class="{ 'tw-px-1 tw-pt-1' : enableLoanCardExp }"
				id="customizedCarousel"
				:multiple-slides-visible="true"
				slides-to-scroll="visible"
				:slide-max-width="singleSlideWidth"
				:embla-options="{ loop: false }"
			>
				<template v-for="(loan, index) in loans" #[`slide${index}`]>
					<kiva-classic-basic-loan-card-exp
						v-if="enableLoanCardExp"
						:key="loanCardKey(index)"
						:loan-id="loan.id"
						:show-action-button="true"
						:show-tags="true"
						:use-full-width="true"
						:large-card="isLargeCard"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						class="tw-h-full"
						:ref="loanCardKey(index)"
						:enable-relending-exp="enableRelendingExp"
						:user-balance="userBalance"
						@add-to-basket="addToBasket"
					/>
					<kiva-classic-basic-loan-card
						v-else
						:key="index"
						:item-index="index"
						:loan-id="loan.id"
						:show-action-button="true"
						:show-tags="true"
						:use-full-width="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						class="tw-mr-2"
						@add-to-basket="addToBasket"
					/>
				</template>
			</kv-carousel>
		</div>
	</div>
</template>

<script>
import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
import KivaClassicBasicLoanCard from '@/components/LoanCards/KivaClassicBasicLoanCard';
import MultipleAtcButton from '@/components/LoanCards/Buttons/MultipleAtcButton';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	name: 'LendingCategorySection',
	components: {
		KvCarousel,
		KivaClassicBasicLoanCardExp,
		KivaClassicBasicLoanCard,
		MultipleAtcButton
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
		loans: {
			type: Array,
			default: () => []
		},
		perStep: {
			type: Number,
			default: 3
		},
		enableLoanCardExp: {
			type: Boolean,
			default: false
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		enableRelendingExp: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			disableMultipleButton: false
		};
	},
	computed: {
		isLargeCard() {
			return this.perStep === 2;
		},
		singleSlideWidth() {
			const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
			// handle tiny screens
			if (viewportWidth < 414) {
				return `${viewportWidth - 80}px`;
			}
			if (viewportWidth >= 414 && viewportWidth < 768) return '278px';
			if (viewportWidth >= 768 && viewportWidth < 1024) {
				if (this.enableLoanCardExp) return '328px'; return '336px';
			}
			if (viewportWidth >= 1024) {
				if (this.enableLoanCardExp) {
					if (this.isLargeCard) return '512px'; return '328px';
				}
				if (this.isLargeCard) return '520px'; return '336px';
			}
			return '336px';
		},
		multipleAmount() {
			let amount = 0;
			for (let index = 0; index < this.totalLoans; index += 1) {
				const loan = this.loans[index];
				const { unreservedAmount } = loan;

				if (this.enableFiveDollarsNotes) {
					if (this.userBalance > 20) {
						amount += unreservedAmount > 25 ? 25 : Number(unreservedAmount);
					} else {
						amount += unreservedAmount > 5 ? 5 : Number(unreservedAmount);
					}
				} else {
					amount += unreservedAmount > 25 ? 25 : Number(unreservedAmount);
				}
			}
			return amount;
		},
		totalLoans() {
			return this.loans.length;
		}
	},
	methods: {
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
		addMultipleLoans() {
			this.disableMultipleButton = true;
			const { multipleAmount } = this;
			for (let index = 0; index < this.totalLoans; index += 1) {
				const { unreservedAmount } = this.loans[index];
				const key = this.loanCardKey(index);

				let amount = '';
				amount = unreservedAmount > 25 ? '25' : unreservedAmount;
				if (this.enableFiveDollarsNotes) amount = unreservedAmount > 5 ? '5' : unreservedAmount;

				this.$refs[key][0].addToBasket(amount);
			}
			this.$kvTrackEvent('loan-card', 'add-to-basket', 'relending-lending-home-add-all', this.userBalance, multipleAmount); // eslint-disable-line max-len
			this.$router.push({
				path: '/checkout',
			});
		},
		loanCardKey(index) {
			return `loan-card-${index}`;
		}
	},
};
</script>

<style lang="postcss" scoped>
#customizedCarousel >>> .kv-carousel__controls {
	justify-content: center;
}

#customizedCarousel >>> .kv-carousel__controls div {
	visibility: visible;
}
</style>
