<template>
	<div class="tw-w-full">
		<div class="tw-mx-auto tw-px-0 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<!-- eslint-disable-next-line max-len -->
			<div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-end lg:tw-items-center tw-px-2.5 md:tw-px-0">
				<div class="tw-w-full lg:tw-w-auto">
					<div class="tw-flex tw-items-center">
						<img v-if="titleIcon" :src="titleIcon" class="tw-mr-1 tw-w-4">
						<h2 v-html="title" class="tw-text-h2 tw-text-primary"></h2>
					</div>
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
					:is-adding="isAddingMultiple"
					:show-checkout="hasMultipleBeenAdded"
					@add-multiple="addMultipleLoans"
					@checkout="checkout"
				/>
			</div>
			<kv-carousel
				class="tw-w-full tw-overflow-hidden tw-mt-1 tw-pb-2 tw-px-1 tw-pt-1"
				id="customizedCarousel"
				:multiple-slides-visible="true"
				slides-to-scroll="visible"
				:slide-max-width="singleSlideWidth"
				:embla-options="{ loop: false }"
			>
				<template v-for="(loan, index) in loans" #[`slide${index}`]>
					<kv-classic-loan-card-container
						:key="loanCardKey(index)"
						:ref="loanCardKey(index)"
						:loan-id="loan.id"
						:use-full-width="true"
						:show-tags="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:large-card="isLargeCard"
						:user-balance="userBalance"
						:five-dollars-selected="fiveDollarsSelected"
						@add-to-basket="addToBasket"
						class="tw-h-full"
					/>
				</template>
				<template v-if="enableQfMobile && !emptyState">
					<view-more-card
						:loan-search-state="loanSearchState"
					/>
				</template>
			</kv-carousel>
		</div>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';
import KvClassicLoanCardContainer from '@/components/LoanCards/KvClassicLoanCardContainer';
import MultipleAtcButton from '@/components/LoanCards/Buttons/MultipleAtcButton';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';
import ViewMoreCard from './ViewMoreCard';

export default {
	name: 'LendingCategorySection',
	components: {
		KvCarousel,
		KvClassicLoanCardContainer,
		MultipleAtcButton,
		ViewMoreCard,
	},
	props: {
		title: {
			type: String,
			default: '',
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
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		enableRelendingExp: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: String,
			default: undefined
		},
		fiveDollarsSelected: {
			type: Boolean,
			default: false
		},
		titleIcon: {
			type: String,
			default: ''
		},
		enableQfMobile: {
			type: Boolean,
			default: false
		},
		loanSearchState: {
			type: Object,
			default: () => {}
		},
		emptyState: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isAddingMultiple: false,
			hasMultipleBeenAdded: false,
			windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
			handleResize: _throttle(this.isWindowWidth, 200)
		};
	},
	computed: {
		isLargeCard() {
			return this.perStep === 2;
		},
		singleSlideWidth() {
			if (this.windowWidth <= 733) {
				return '100%';
			}
			if (this.windowWidth > 733 && this.windowWidth < 1024) {
				return '328px';
			}
			if (this.windowWidth >= 1024) {
				if (this.isLargeCard) {
					return '512px';
				}
				return '328px';
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
		async addMultipleLoans() {
			this.isAddingMultiple = true;

			const { multipleAmount } = this;

			for (let index = 0; index < this.totalLoans; index += 1) {
				const { unreservedAmount } = this.loans[index];
				const key = this.loanCardKey(index);

				let amount = '';
				if (this.enableFiveDollarsNotes && this.userBalance <= 20) {
					amount = Number(unreservedAmount) > 5 ? '5' : unreservedAmount;
				} else {
					amount = Number(unreservedAmount) > 25 ? '25' : unreservedAmount;
				}

				// We occasionally get fully funded loans from dev FLSS
				if (Number(amount) > 0) {
					try {
						// Ensure the reservations happen synchronously to prevent race conditions with the basket
						// eslint-disable-next-line no-await-in-loop
						await this.$refs[key][0].addToBasket(amount);
					} catch {
						// no-op
					}
				}
			}

			this.$kvTrackEvent(
				'loan-card',
				'add-all-to-basket',
				'relending-lending-home-add-all',
				this.userBalance,
				multipleAmount
			);

			this.isAddingMultiple = false;
			this.hasMultipleBeenAdded = true;
		},
		checkout() {
			this.$kvTrackEvent('loan-card', 'checkout', 'relending-lending-home-add-all');

			this.$router.push({ path: '/checkout' });
		},
		loanCardKey(index) {
			return `loan-card-${index}`;
		},
		isWindowWidth() {
			this.windowWidth = window.innerWidth;
		}
	},
	mounted() {
		window.addEventListener('resize', this.handleResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize);
	}
};
</script>

<style lang="postcss" scoped>
#customizedCarousel {
	@apply tw-px-0;
}

#customizedCarousel >>> .kv-carousel__controls {
	@apply tw-justify-center;
	@apply tw-w-16;
	@apply tw-mx-auto;
	@apply tw-rounded-lg;

	box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.18);
	-webkit-box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.18);
	-moz-box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.18);
}

#customizedCarousel >>> .kv-carousel__controls div {
	@apply tw-visible;
}

#customizedCarousel >>> .kv-carousel__controls button {
	@apply tw-border-0;
}

#customizedCarousel >>> .kv-carousel__controls button span {
	@apply tw-invisible;
}

#customizedCarousel >>> .kv-carousel__controls button:first-child span::after {
	@apply tw-visible;
	@apply tw-text-h3;
	@apply tw-rotate-180;

	content: '\2794';
}

#customizedCarousel >>> .kv-carousel__controls button:nth-child(3) span::before {
	@apply tw-visible;
	@apply tw-text-h3;

	content: '\2794';
}

#customizedCarousel >>> div:first-child div div div,
#customizedCarousel >>> div:first-child > div > div.loan-card-active-hover a picture {
	@apply tw-rounded-none;
}

@screen md {
	#customizedCarousel {
		@apply tw-px-1;
	}

	#customizedCarousel >>> .kv-carousel__controls {
		@apply tw-w-full;
		@apply tw-rounded-none;

		box-shadow: none;
		-webkit-box-shadow: none;
		-moz-box-shadow: none;
	}

	#customizedCarousel >>> div:first-child div div div {
		@apply tw-rounded;
	}

	#customizedCarousel >>> div:first-child > div > div.loan-card-active-hover a picture {
		@apply tw-rounded-t;
	}

	#customizedCarousel >>> .kv-carousel__controls button {
		@apply tw-border-2;
	}

	#customizedCarousel >>> .kv-carousel__controls button span {
		@apply tw-visible;
	}

	#customizedCarousel >>> .kv-carousel__controls button:first-child span::after,
	#customizedCarousel >>> .kv-carousel__controls button:nth-child(3) span::before {
		content: '';
	}
}
</style>
