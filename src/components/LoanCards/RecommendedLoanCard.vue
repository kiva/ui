<template>
	<div class="rec-loan-card" :id="`${loanId}-loan-card`">
		<kv-loading-placeholder
			class="rec-loan-card__sector rec-loan-card__sector--loading"
			v-if="isLoading"
		/>
		<div class="rec-loan-card__sector" v-show="!isLoading">
			A loan for <strong class="tw-text-brand tw-font-book">{{ sectorName }}</strong>
			in <strong class="tw-text-brand tw-font-book">{{ countryName }}</strong>
		</div>
		<div class="rec-loan-card__card">
			<kv-loading-placeholder
				class="rec-loan-card__image-wrapper tw-bg-tertiary rec-loan-card__image-wrapper--loading"
				v-if="isLoading"
			/>
			<div class="rec-loan-card__image-wrapper" v-show="!isLoading">
				<img
					class="rec-loan-card__image"
					v-if="imageUrl"
					:srcset="imageRetinaUrl + ' 2x'"
					:src="imageUrl"
					:alt="'photo of ' + borrowerName"
					loading="lazy"
				>
				<div class="rec-loan-card__image-overlay">
					<kv-flag
						class="rec-loan-card__country-flag"
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
					class="rec-loan-card__name tw-text-h3 rec-loan-card__name--loading"
					v-if="isLoading"
				/>
				<h2 class="rec-loan-card__name tw-text-h3 tw-mb-1" v-show="!isLoading">
					{{ borrowerName }}
				</h2>
				<kv-loading-paragraph
					class="rec-loan-card__loan-use rec-loan-card__loan-use--loading"
					v-if="isLoading"
				/>
				<p class="rec-loan-card__loan-use tw-mb-1.5" v-show="!isLoading">
					{{ loanUse }}
					<router-link
						class="rec-loan-card__learn-more"
						:to="`/lend/${loanId}`"
						v-kv-track-event="['Lending', 'click-Read more', 'loan-use-learn-more', loanId, loanId]"
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
				<lend-button
					class="rec-loan-card__button rounded"
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
import { gql } from '@apollo/client';
import * as Sentry from '@sentry/vue';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';
import KvFlag from '@/components/Kv/KvFlag';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import LendButton from '@/components/LoanCards/Buttons/LendButton2';
import WhySpecial from '@/components/LoanCards/WhySpecial';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

const loanQuery = gql`query recLoanCard($basketId: String, $loanId: Int!) {
	shop (basketId: $basketId) {
		id
		basket {
			id
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
				id
				default: url(customSize: "w480h300")
				retina: url(customSize: "w960h600")
			}
			name
			sector {
				id
				name
			}
			whySpecial

			# for isLentTo
			userProperties {
				lentTo
			}

			# for fullLoanUse
			anonymizationLevel
			borrowerCount
			loanAmount
			status
			use
			fullLoanUse(maxLength: 100) @client

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
	name: 'RecommendedLoanCard',
	props: {
		loanId: {
			type: Number,
			required: true,
		}
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [percentRaisedMixin, timeLeftMixin],
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
			queryObserver: null,
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
			const loanIds = loanItems.map(loan => loan.id);
			return loanIds.indexOf(this.loanId) > -1;
		},
		isLentTo() {
			return this.loan?.userProperties?.lentTo;
		},
		loanUse() {
			return this.loan?.fullLoanUse ?? '';
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
		prefetchLoanData() {
			if (!this.loan) {
				this.isLoading = true;
			}
			return this.apollo.query({
				variables: {
					loanId: this.loanId,
				},
				query: loanQuery,
			}).then(result => {
				this.processQueryResult(result);
			});
		},
		readLoanData() {
			// Read loan data from the cache (synchronus)
			try {
				const data = this.apollo.readQuery({
					query: loanQuery,
					variables: {
						basketId: this.cookieStore.get('kvbskt'),
						loanId: this.loanId,
					},
				});
				if (data.lend) {
					this.processQueryResult({ data });
				} else {
					// Show loading state while watchQuery completes
					this.isLoading = true;
				}
			} catch (e) {
				// if there's an error it means there's no loan data in the cache yet, which means the page
				// was not server rendered, so just show a loading state and wait for the watchQuery to complete
				this.isLoading = true;
			}
		},
		watchQueryLoanData() {
			// Setup query observer to watch for changes to the loan data (async)
			this.queryObserver = this.apollo.watchQuery({
				query: loanQuery,
				variables: {
					basketId: this.cookieStore.get('kvbskt'),
					loanId: this.loanId,
				},
			});

			// Subscribe to the observer to see each result
			this.queryObserver.subscribe({
				next: result => this.processQueryResult(result),
				error: error => this.processQueryResult({ error }),
			});
		},
		processQueryResult(result) {
			if (result.error) {
				console.error(result.error);
				this.$showTipMsg('There was a problem loading your loan recommendations', 'error');
				try {
					Sentry.withScope(scope => {
						scope.setTag('wizard_stage', 'results');
						scope.setTag('loan_id', this.loanId);
						Sentry.captureException(result.error);
					});
				} catch (e) {
					// no-op
				}
			}

			this.isLoading = false;
			this.loan = result.data?.lend?.loan || null;
			this.basketItems = result.data?.shop?.basket?.items?.values || null;
		}
	},
	serverPrefetch() {
		return this.prefetchLoanData();
	},
	created() {
		if (!this.$isServer) {
			this.readLoanData();
			this.watchQueryLoanData();
		}
	},
	watch: {
		// When loan id changes, update watch query variables
		loanId(loanId) {
			if (this.queryObserver) {
				this.queryObserver.setVariables({
					basketId: this.cookieStore.get('kvbskt'),
					loanId,
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

%nested-column-flex {
	display: flex;
	flex-flow: column nowrap;
	flex-grow: 1;
}

.rec-loan-card {
	@extend %nested-column-flex;

	flex-shrink: 0;
	min-width: rem-calc(246);
	width: 100%;

	&__sector {
		margin-left: 1rem;

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
			top: rem-calc(12);
			right: rem-calc(12);
			width: rem-calc(24);
			height: rem-calc(24);
			border: none;
			border-radius: 50%;
			overflow: hidden;

			@include breakpoint(medium up) {
				top: rem-calc(14);
				right: rem-calc(14);
				width: rem-calc(28);
				height: rem-calc(28);
			}

			@include breakpoint(large up) {
				top: rem-calc(16);
				right: rem-calc(16);
				width: rem-calc(32);
				height: rem-calc(32);
			}
		}
	}

	&__time-left {
		position: absolute;
		left: rem-calc(10);
		bottom: rem-calc(5);
		color: $white;

		@include breakpoint(medium up) {
			left: rem-calc(12);
			bottom: rem-calc(6);
		}

		@include breakpoint(large up) {
			left: rem-calc(16);
			bottom: rem-calc(8);
		}
	}

	&__amount-left {
		position: absolute;
		right: rem-calc(10);
		bottom: rem-calc(8);
		color: $white;
		opacity: 0.6;

		@include breakpoint(medium up) {
			right: rem-calc(12);
			bottom: rem-calc(6);
		}

		@include breakpoint(large up) {
			right: rem-calc(16);
			bottom: rem-calc(8);
		}
	}

	& ::v-deep .fundraising-status-meter {
		height: rem-calc(6);
		border-radius: 0;

		.meter {
			border-radius: 0;
		}
	}

	&__summary {
		@extend %nested-column-flex;

		margin: rem-calc(10);

		@include breakpoint(medium up) {
			margin: rem-calc(12);
		}

		@include breakpoint(large up) {
			margin: rem-calc(16);
		}
	}

	&__name {
		&--loading {
			height: 1em;
			width: 60%;
			margin-bottom: 1rem;
		}
	}

	&__loan-use {
		flex-grow: 1;
		line-height: (22 / 16);

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
		$padding: 1.25rem;

		&.button {
			padding: $padding;
			margin: 0;
			width: 100%;
		}

		&--loading {
			border-radius: rem-calc(10);
			overflow: hidden;
			height: 1 + 2 * $padding;
			padding: 0;
		}
	}
}
</style>
