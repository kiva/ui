<template>
	<div class="lend-homepage-loan-card">
		<div class="tw-relative">
			<borrower-image
				class="
        tw-relative
        tw-w-full
        tw-bg-black
        tw-rounded
      "
				:alt="'photo of ' + borrowerName"
				:aspect-ratio="3 / 4"
				:default-image="{ width: 336 }"
				:hash="imageHash"
				:images="[
					{ width: 336, viewSize: 1024 },
					{ width: 336, viewSize: 768 },
					{ width: 416, viewSize: 480 },
					{ width: 374, viewSize: 414 },
					{ width: 335, viewSize: 375 },
					{ width: 280 },
				]"
				@image-click="$emit('image-click', {loanId: loan.id})"
				@track-loan-card-interaction="trackInteractionBorrowerInfoName"
			/>
			<!-- <loan-card-image
        class="lend-homepage-loan-card__image-wrapper"
        :loan-id="loan.id"
        :name="loan.name"
        :retina-image-url="loan.image.retina"
        :standard-image-url="loan.image.default"
        :disable-link="disableRedirects"
        :is-visitor="isVisitor"
        :is-favorite="isFavorite"
        :use-default-styles="false"
        @favorite-toggled="toggleFavorite"
        @image-click="$emit('image-click', {loanId: loan.id})"
        @track-loan-card-interaction="trackInteractionBorrowerInfoName"
      /> -->
			<div v-if="countryName">
				<summary-tag
					class="tw-absolute tw-bottom-2 tw-left-1 tw-text-primary"
					:city="city"
					:state="state"
					:country-name="countryName"
				>
					<kv-material-icon
						class="tw-h-2.5 tw-w-2.5 tw-mr-0.5"
						:icon="mdiMapMarker"
					/>
					{{ formattedLocation }}
				</summary-tag>
			</div>
		</div>
		<div class="lend-homepage-loan-card__name-row">
			<borrower-info-name
				:disable-link="disableRedirects"
				:name="loan.name"
				:loan-id="loan.id"
				class="tw-mb-1 tw-text-h3"
				@name-click="$emit('name-click', {loanId: loan.id})"
				@track-loan-card-interaction="trackInteractionBorrowerInfoName"
			/>
		</div>
		<!-- Contains amount to go and fundraising bar -->
		<loan-progress-group
			class="tw-mb-2.5"
			:money-left="String(amountLeft)"
			:progress-percent="percentRaised"
			:time-left="timeLeftMessage"
			:all-shares-reserved="allSharesReserved"
		/>

		<borrower-info-body
			class="lend-homepage-loan-card__borrower-info"
			:amount="loan.loanAmount"
			:borrower-count="loan.borrowerCount"
			:disable-link="disableRedirects"
			:name="loan.name"
			:status="loan.status"
			:use="loan.use"
			:loan-id="loan.id"
			:max-use-length="59"
			read-more-link-text="Learn more"
			@read-more-link="$emit('read-more-link', {loanId: loan.id})"
			@track-loan-card-interaction="trackInteraction"
		/>
		<loan-matching-text
			v-if="loan.matchingText !== '' && !isMatchAtRisk"
			class="tw-mb-1.5"
			:matcher-name="loan.matchingText"
			:match-ratio="loan.matchRatio"
			:status="loan.status"
			:funded-amount="loan.loanFundraisingInfo.fundedAmount"
			:reserved-amount="loan.loanFundraisingInfo.reservedAmount"
			:loan-amount="loan.loanAmount"
		/>
		<div class="lend-homepage-loan-card__action-row">
			<div
				:class="{'full-width': isFunded || isExpired}"
			>
				<kv-button
					v-if="showViewLoanCta"
					class="action-button"
					:to="`/lend/${loan.id}`"
					v-kv-track-event="[
						'Lending',
						'click-Read more',
						'View loan',
						loan.id
					]"
				>
					View loan
				</kv-button>
				<action-button
					v-else
					class="action-button"
					:amount-left="amountLeft"
					:disable-redirects="disableRedirects"
					:loan-id="loan.id"
					:loan="loan"
					:items-in-basket="itemsInBasket"
					:is-amount-lend-button="lessThan25"
					:is-lent-to="loan.userProperties.lentTo"
					:is-funded="isFunded"
					:is-expired="isExpired"
					:is-selected-by-another="isSelectedByAnother"
					:is-simple-lend-button="true"
					:minimal-checkout-button="true"

					@click.native="trackInteraction({
						interactionType: 'addToBasket',
						interactionElement: 'Lend25'
					})"

					@add-to-basket="handleAddToBasket"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import BorrowerInfoName from '@/components/LoanCards/BorrowerInfo/BorrowerInfoName';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import { mdiChevronRight, mdiMapMarker } from '@mdi/js';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import LoanProgressGroup from '@/components/LoanCards/LoanProgressGroup';
import LoanMatchingText from '@/components/LoanCards/LoanMatchingText';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

/**
 * KivaClassicLendHomepageLoanCard
 * Should be used with a drop shadow or distinction for the border.
 * To some extent this component is responsive, as long as the max
 * width is set to the effective width of the loan image
 */
export default {
	name: 'KivaClassicLendHomepageLoanCard',
	components: {
		BorrowerInfoBody,
		ActionButton,
		KvButton,
		BorrowerInfoName,
		BorrowerImage,
		SummaryTag,
		KvMaterialIcon,
		LoanProgressGroup,
		LoanMatchingText
	},
	mixins: [percentRaisedMixin, timeLeftMixin],
	data() {
		return {
			mdiChevronRight,
			mdiMapMarker
		};
	},
	props: {
		disableRedirects: {
			type: Boolean,
			default: false,
		},
		showViewLoanCta: {
			type: Boolean,
			default: false,
		},
		isFavorite: {
			type: Boolean,
			default: false
		},
		isExpired: {
			type: Boolean,
			default: false,
		},
		isFunded: {
			type: Boolean,
			default: false,
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
					geocode: {
						country: {}
					},
					image: {}
				};
			}
		}
	},
	computed: {
		lessThan25() {
			return this.amountLeft < 25 && this.amountLeft !== 0;
		},
		borrowerName() {
			return this.loan?.name || '';
		},
		imageHash() {
			return this.loan?.image?.hash ?? '';
		},
		countryName() {
			return this.loan?.geocode?.country?.name || '';
		},
		city() {
			return this.loan?.geocode?.city || '';
		},
		state() {
			return this.loan?.geocode?.state || '';
		},
		formattedLocation() {
			if (this.distributionModel === 'direct') {
				const formattedString = `${this.city}, ${this.state}, ${this.countryName}`;
				return formattedString;
			}
			if (this.countryName === 'Puerto Rico') {
				const formattedString = `${this.city}, PR`;
				return formattedString;
			}
			return this.countryName;
		},
		allSharesReserved() {
			if (parseFloat(this.amountLeft) === 0) {
				return true;
			}
			return false;
		},
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
		trackInteractionBorrowerInfoName(args) {
			this.trackInteraction({
				...args,
				interactionElement: `${args.interactionElement}HoverCard`,
			});
		},
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
		toggleFavorite() {
			this.$emit('toggle-favorite');
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.lend-homepage-loan-card {
	background: $white;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	height: fit-content;
	border-radius: 0.65rem;

	&__name-row {
		display: flex;
		align-items: center;
	}

	&__flag {
		width: rem-calc(30);
		flex-shrink: 0;
		margin-right: 0.95rem;
	}

	&__borrower-info {
		text-align: left;
		margin: 0.65rem 0;
		min-height: rem-calc(66);
	}

	&__fundraising-status {
		margin-top: 0.45rem;

		::v-deep .left-and-to-go-line {
			text-align: left;
			font-size: 1rem;
			height: 1.25rem;
			margin-bottom: 0.15rem;
		}
	}

	&__action-row {
		display: flex;
		flex-wrap: wrap;
	}

	&__action-button-container {
		&.full-width {
			width: 100%;
		}

		.button.action-button {
			margin: 0;
			padding: 0.95rem 1rem;
			width: 100%;
		}

		.action-button:not(.loan-funded-text):not(.loan-expired-text):not(.loan-selected-text) {
			font-size: rem-calc(20);
		}
	}

	&__matching-text-container {
		flex-grow: 1;
		padding: 0 0 0 0.65rem;
		text-align: center;
		width: rem-calc(110);
	}
}
</style>
