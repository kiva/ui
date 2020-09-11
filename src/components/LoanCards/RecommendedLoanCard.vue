<template>
	<div class="rec-loan-card" :id="`${loanId}-loan-card`">
		<kv-loading-placeholder
			class="rec-loan-card__sector rec-loan-card__sector--loading"
			v-if="isLoading"
		/>
		<div class="rec-loan-card__sector" v-show="!isLoading">
			A loan for <strong>{{ sectorName }}</strong> in <strong>{{ countryName }}</strong>
		</div>
		<div class="rec-loan-card__card">
			<kv-loading-placeholder
				class="rec-loan-card__image-wrapper rec-loan-card__image-wrapper--loading"
				v-if="isLoading"
			/>
			<div class="rec-loan-card__image-wrapper" v-show="!isLoading">
				<img class="rec-loan-card__image"
					v-if="imageUrl"
					:srcset="imageRetinaUrl + ' 2x'"
					:src="imageUrl"
					:alt="'photo of ' + borrowerName"
					loading="lazy"
				>
				<div class="rec-loan-card__image-overlay">
					<kv-flag class="rec-loan-card__country-flag"
						v-if="countryISO"
						:country="countryISO"
						aspect-ratio="1x1"
						:inline-svg="true"
					/>
					<span class="rec-loan-card__time-left">
						{{ timeLeftMessage }}
					</span>
					<span class="rec-loan-card__amount-left">
						{{ amountLeftWithoutReservation | numeral('$0,0') }} to go
					</span>
				</div>
			</div>
			<fundraising-status-meter
				class="medium square"
				:percent-raised="percentRaised"
			/>
			<div class="rec-loan-card__summary">
				<kv-loading-placeholder
					class="rec-loan-card__name rec-loan-card__name--loading"
					v-if="isLoading"
				/>
				<h2 class="rec-loan-card__name" v-show="!isLoading">
					{{ borrowerName }}
				</h2>
				<kv-loading-paragraph
					class="rec-loan-card__loan-use rec-loan-card__loan-use--loading"
					v-if="isLoading"
				/>
				<p class="rec-loan-card__loan-use" v-show="!isLoading">
					{{ loanUse }}
					<router-link class="rec-loan-card__learn-more"
						:to="`/lend/${loanId}`"
						v-kv-track-event="['Lending', 'click-Read more', 'loan-use-learn-more', loanId, 'true']"
					>
						Learn more &rarr;
					</router-link>
				</p>
				<kv-loading-placeholder
					class="rec-loan-card__why-special rec-loan-card__why-special--loading"
					v-if="isLoading"
				/>
				<why-special :text="whySpecial" v-show="!isLoading" />
				<kv-loading-placeholder
					class="rec-loan-card__button rec-loan-card__button--loading"
					v-if="isLoading"
				/>
				<lend-button class="rec-loan-card__button rounded"
					v-show="!isLoading"
					:loan-id="loanId"
					:is-in-basket="isInBasket"
					:is-lent-to="isLentTo"
					:price="25"
				>
					Lend $25
				</lend-button>
			</div>
		</div>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import loanUseMixin from '@/plugins/loan/loan-use-mixin';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';
import KvFlag from '@/components/Kv/KvFlag';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import LendButton from '@/components/LoanCards/Buttons/LendButton2';
import WhySpecial from '@/components/LoanCards/WhySpecial';

const loanQuery = gql`query recLoanCard($basketId: String, $loanId: Int!) {
	shop (basketId: $basketId) {
		basket {
			# for isInBasket
			items {
				values {
					id
				}
			}
		}
	}
	lend {
		loan(id: $loanId) {
			id
			geocode {
				country {
					name
					isoCode
				}
			}
			image {
				default: url(customSize: "w480h300")
				retina: url(customSize: "w960h600")
			}
			name
			sector {
				name
			}
			whySpecial

			# for isLentTo
			userProperties {
				lentTo
			}

			# for loan-use-mixin
			use
			status
			loanAmount
			borrowerCount

			# for percent-raised-mixin
			loanFundraisingInfo {
				fundedAmount
				reservedAmount
			}

			# for time-left-mixin
			plannedExpirationDate
		}
	}
}`;

export default {
	props: {
		loanId: {
			type: Number,
			required: true,
		}
	},
	inject: ['apollo'],
	mixins: [loanUseMixin, percentRaisedMixin, timeLeftMixin],
	components: {
		FundraisingStatusMeter,
		KvFlag,
		KvLoadingPlaceholder,
		KvLoadingParagraph,
		LendButton,
		WhySpecial,
	},
	data() {
		return {
			loan: null,
			basketItems: null,
			isLoading: false,
		};
	},
	computed: {
		borrowerName() {
			return this.loan?.name || '';
		},
		countryISO() {
			return this.loan?.geocode?.country?.isoCode || '';
		},
		countryName() {
			return this.loan?.geocode?.country?.name || '';
		},
		imageRetinaUrl() {
			return this.loan?.image?.retina || '';
		},
		imageUrl() {
			return this.loan?.image?.default || '';
		},
		isInBasket() {
			if (!Array.isArray(this.basketItems)) {
				return false;
			}
			// eslint-disable-next-line no-underscore-dangle
			const loanItems = this.basketItems.filter(item => item.__typename === 'LoanReservation');
			return loanItems.indexOf(this.loanId) > -1;
		},
		isLentTo() {
			return this.loan?.userProperties?.lentTo;
		},
		sectorName() {
			return (this.loan?.sector?.name || '').toLowerCase();
		},
		whySpecial() {
			const text = this.loan?.whySpecial || '';
			return text.toString().charAt(0).toLowerCase() + text.toString().slice(1);
		},
	},
	methods: {
		fetchLoanData() {
			if (!this.loan) {
				this.isLoading = true;
			}
			this.apollo.query({
				variables: {
					loanId: this.loanId,
				},
				query: loanQuery,
			}).then(result => {
				this.isLoading = false;
				this.loan = result.data?.lend?.loan || null;
				this.basketItems = result.data?.shop?.basket?.items?.values || null;
			});
			// TODO: error handling
		},
	},
	serverPrefetch() {
		return this.fetchLoanData();
	},
	mounted() {
		this.fetchLoanData();
		// TODO: use a watch query to catch changes to loan data?
		// TODO: update variables for query when loan id changes?
	},
};
</script>

<style lang="scss">
@import 'settings';

%nested-column-flex {
	display: flex;
	flex-flow: column nowrap;
	flex-grow: 1;
}

$largest: rem-calc(1250);

.rec-loan-card {
	@extend %nested-column-flex;

	flex-shrink: 0;
	min-width: rem-calc(230);
	width: 230/320 * 100%;
	max-width: rem-calc(280);
	margin: 0 rem-calc(10);

	@include breakpoint(medium up) {
		width: 280/480 * 100%;
		max-width: rem-calc(357);
	}

	@include breakpoint(large up) {
		width: 357/680 * 100%;
		max-width: rem-calc(384);
	}

	@include breakpoint(xlarge up) {
		width: rem-calc(320);
		max-width: rem-calc(320);
	}

	@include breakpoint($largest up) {
		width: rem-calc(384);
		max-width: rem-calc(384);
	}

	&__sector {
		margin-left: 1rem;

		strong {
			color: $kiva-green;
			font-weight: $global-weight-normal;
		}

		&--loading {
			width: 60%;
			height: 1rem;
			margin: rem-calc(6) 1rem;
		}
	}

	&__card {
		@extend %nested-column-flex;

		border-radius: rem-calc(20);
		overflow: hidden;
		box-shadow: 0 rem-calc(8) rem-calc(30) 0 rgba(0, 0, 0, 0.15);
	}

	&__image-wrapper {
		position: relative;
		background-color: $kiva-bg-darkgray;
		width: 100%;
		padding-bottom: 200/320 * 100%;

		&--loading {
			flex-basis: 0;
		}
	}

	&__image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	&__image-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.7) 86%);

		.rec-loan-card__country-flag {
			position: absolute;
			top: 1rem;
			right: 1rem;
			width: 2rem;
			height: 2rem;
			border: none;
			border-radius: 50%;
			overflow: hidden;
		}
	}

	&__time-left {
		position: absolute;
		left: 1rem;
		bottom: rem-calc(8);
		color: $white;
	}

	&__amount-left {
		position: absolute;
		right: 1rem;
		bottom: rem-calc(8);
		color: $white;
		opacity: 0.6;
	}

	.fundraising-status-meter {
		height: rem-calc(6);
		border-radius: 0;

		.meter {
			border-radius: 0;
		}
	}

	&__summary {
		@extend %nested-column-flex;

		margin: rem-calc(16);
	}

	&__name {
		font-size: rem-calc(22);
		font-weight: $global-weight-bold;

		&--loading {
			height: rem-calc(22);
			width: 60%;
			margin-bottom: 1rem;
		}
	}

	&__loan-use {
		$line-height: rem-calc(22);

		flex-grow: 1;
		line-height: $line-height;

		&--loading {
			margin-bottom: 1rem;

			.loading-placeholder {
				margin-bottom: rem-calc(6);
			}
		}
	}

	&__learn-more {
		white-space: nowrap;
	}

	&__why-special--loading {
		flex-grow: 1;
		border-radius: rem-calc(10);
		overflow: hidden;
		height: 5rem;
		margin-bottom: 1rem;
	}

	&__button {
		$font-size: 1.25rem;
		$padding: 1.25rem;

		&.button {
			font-size: $font-size;
			padding: $padding;
			margin: 0;
			width: 100%;
		}

		&--loading {
			border-radius: rem-calc(10);
			overflow: hidden;
			height: $font-size + 2 * $padding;
			padding: 0;
		}
	}
}
</style>
