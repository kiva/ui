<template>
	<div class="column column-block">
		<h3 v-if="title">
			{{ title }}
		</h3>
		<div class="loan-card-rounded tw-flex tw-flex-col tw-h-full tw-bg-primary tw-border tw-border-tertiary">
			<loan-tag v-if="showTags" :loan="loan" :amount-left="amountLeft" />

			<router-link
				:to="loanPath"
				:v-kv-track-event="trackViewLoanData"
				class="loan-card-rounded-image tw-relative tw-h-0 tw-overflow-hidden tw-cursor-pointer"
			>
				<img
					:srcset="`${loan.image.retina} 2x`"
					:src="loan.image.default"
					:alt="`photo of ${loan.name}`"
					loading="lazy"
					class="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full"
				>
				<favorite-star
					v-if="!isVisitor"
					class="tw-absolute tw-bottom-0 tw-right-0"
					:is-favorite="isFavorite"
					:loan-id="loan.id"
					@favorite-toggled="$emit('toggle-favorite')"
				/>
			</router-link>

			<router-link
				:to="loanPath"
				:v-kv-track-event="trackViewLoanData"
				class="loan-card-rounded-use tw-text-center tw-p-2.5 tw-grow tw-leading-5 tw-cursor-pointer"
			>
				<span>{{ loan.use | loanUse(loan.name, loan.status, loan.loanAmount, loan.borrowerCount, 500) }}</span>
			</router-link>

			<div class="tw-p-2.5 tw-pb-2 tw-text-center tw-grow-0">
				<router-link
					:to="loanPath"
					:v-kv-track-event="trackViewLoanData"
					class="loan-card-rounded-status tw-cursor-pointer"
				>
					<fundraising-status
						:amount-left="amountLeft"
						:percent-raised="percentRaised"
						:expiring-soon-message="expiringSoonMessage"
						:is-funded="loan.status==='funded'"
					/>
				</router-link>

				<action-button
					:loan-id="loan.id"
					:loan="loan"
					:items-in-basket="itemsInBasket"
					:is-lent-to="loan.userProperties.lentTo"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"
					:is-amount-lend-button="lessThan25"
					:amount-left="amountLeft"
					:show-now="true"
					class="tw-mt-2 tw-w-full"
					:class="{ 'tw-mb-2' : !isMatchAtRisk && !isFunded && !isSelectedByAnother }"
					@click.native="addToBasket"
					@add-to-basket="$emit('add-to-basket', $event)"
				/>

				<matching-text
					v-if="!isMatchAtRisk && !!loan.matchingText"
					:matching-text="loan.matchingText"
					:match-ratio="loan.matchRatio"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo/BorrowerInfo';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus/FundraisingStatus';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MatchingText from '@/components/LoanCards/MatchingText';
import LoanTag from '@/components/LoanCards/LoanTags/LoanTag';
import FavoriteStar from '@/components/LoanCards/FavoriteStar';

export default {
	name: 'LoanCardRounded',
	components: {
		ActionButton,
		BorrowerInfo,
		FundraisingStatus,
		LoanCardImage,
		MatchingText,
		LoanTag,
		FavoriteStar,
	},
	props: {
		amountLeft: {
			type: Number,
			default: 0,
		},
		expiringSoonMessage: {
			type: String,
			default: ''
		},
		isFavorite: {
			type: Boolean,
			default: false
		},
		isFunded: {
			type: Boolean,
			default: false
		},
		isMatchAtRisk: {
			type: Boolean,
			default: false
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false
		},
		isVisitor: {
			type: Boolean,
			required: true,
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: { country: {} },
					image: {},
				};
			}
		},
		percentRaised: {
			type: Number,
			default: 0,
		},
		title: {
			type: String,
			default: ''
		},
		showTags: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		loanPath() {
			return `/lend/${this.loan.id}`;
		},
		trackViewLoanData() {
			return ['loan-card', 'click', 'view-loan', this.loan.id]
		},
		lessThan25() {
			return this.amountLeft < 25 && this.amountLeft !== 0;
		},
	},
	methods: {
		addToBasket() {
			const lendAmount = this.lessThan25 ? this.amountLeft : 25;
			this.$kvTrackEvent('loan-card', 'add-to-basket', null, this.loan.id, lendAmount);
		},
	},
};
</script>

<style lang="postcss" scoped>
.loan-card-rounded:hover {
	box-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.loan-card-rounded:hover >>> .loan-card-rounded-use {
	@apply tw-underline;
}

.loan-card-rounded-image {
	padding-top: 75%;
	background: #d8d8d8;
}

.loan-card-rounded-use {
	color: inherit;
}

.loan-card-rounded-status:hover {
	@apply tw-no-underline;
}
</style>
