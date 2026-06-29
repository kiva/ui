<template>
	<li>
		<!-- deposit incentive progress -->
		<h3 class="tw-mb-1">
			Earn your $25 Reward¹
		</h3>
		<p class="tw-w-full tw-mb-1 tw-text-small tw-inline-flex tw-items-center">
			<kv-icon name="present" id="present-icon" class="tw-h-2.5 tw-w-2.5 tw--rotate-12 tw-mr-0.5" />
			<span v-if="!loadingProgress">
				{{ amountLeftFormatted }} away! Don't miss out on your free lending credit.
			</span>
			<kv-loading-placeholder v-if="loadingProgress" class="tw-h-2.5 tw-max-w-xs" />
		</p>
		<kv-progress-bar
			v-if="!loadingProgress"
			class="tw-w-full tw-max-w-sm tw-mb-2"
			:label="'Percent progress towards lending reward'"
			:value="progressPercent"
		/>
		<kv-loading-placeholder v-if="loadingProgress" class="tw-h-1 tw-w-full tw-max-w-sm tw-mb-2" />
		<!-- slidable loan row -->
		<kv-carousel
			class="tw-w-full"
			:multiple-slides-visible="true"
			slides-to-scroll="visible"
			:embla-options="{ loop: false }"
		>
			<template v-for="(loan, index) in displayLoans" #[`slide${index+1}`] :key="loan.id || index">
				<div>
					<!-- loan image -->
					<div
						class="loan-slide-image tw-overflow-hidden tw-rounded tw-bg-secondary tw-mb-1"
					>
						<picture v-if="loan.id" class="tw-w-full tw-h-full tw-block">
							<source
								:srcset="`${loan.image.lgRetinaUrl} 2x, ${loan.image.lgUrl} 1x`"
								media="(min-width: 1024px)"
							>
							<source
								:srcset="`${loan.image.retinaUrl} 2x, ${loan.image.url} 1x`"
								media="(min-width: 0)"
							>
							<img
								class="tw-w-full tw-h-full tw-object-cover"
								:src="loan.image.lgUrl"
								:alt="'Photo of ' + loan.name"
								loading="lazy"
							>
						</picture>
						<kv-loading-placeholder v-if="!loan.id" style="height: 0; padding-bottom: 100%;" />
					</div>
					<!-- lend $[amount needed] to [name] in [location] -->
					<p class="loan-info tw-mb-1">
						<span v-if="loan.id">
							Lend {{ amountLeftFormatted }} to {{ loan.name }} in {{ loan.geocode.country.name }}
						</span>
						<kv-loading-placeholder v-if="!loan.id" class="tw-h-2.5 tw-w-10/12 tw-mb-1" />
						<kv-loading-placeholder v-if="!loan.id" class="tw-h-2.5 tw-w-1/2 lg:tw-hidden" />
					</p>
					<!-- add to basket button -->
					<kv-button
						@click="addToBasket(loan.id)"
						:state="loan.id ? '' : 'disabled'"
						variant="secondary"
						v-kv-track-event="['basket', 'click', 'incentive-upsell-add-to-basket', loan.id, amountLeft]"
					>
						Add to basket
					</kv-button>
				</div>
			</template>
		</kv-carousel>
	</li>
</template>

<script>
import * as Sentry from '@sentry/vue';
import { gql } from 'graphql-tag';
import numeral from 'numeral';
import updateLoanReservation from '#src/graphql/mutation/updateLoanReservation.graphql';
import KvIcon from '#src/components/Kv/KvIcon';
import {
	KvButton, KvCarousel, KvLoadingPlaceholder, KvProgressBar
} from '@kiva/kv-components';

const upsellLoansQuery = gql`query upsellLoansQuery(
	$maxLoans: Int!
	$minAmount: Float!
	$excludeLoanIds: [Int!]
) {
	fundraisingLoans(
		filters: [{
			amountLeft: {
				range: {
					gte: $minAmount
				}
			}
			loanIds: {
				none: $excludeLoanIds
			}
		}]
		limit: $maxLoans
	) {
		values {
			id
			image {
				id
				url(customSize: "w150,h138")
				retinaUrl: url(customSize: "w300,h276")
				lgUrl: url(customSize: "w244,h185")
				lgRetinaUrl: url(customSize: "w488,h370")
			}
			name
			geocode {
				country {
					id
					name
				}
			}
		}
	}
}`;

export default {
	name: 'DepositIncentiveUpsell',
	inject: ['apollo'],
	emits: ['adding-loan', 'done-adding'],
	props: {
		maxLoans: {
			type: Number,
			default: 4,
		},
		goal: {
			type: Number,
			default: 0,
		},
		progress: {
			type: Number,
			default: 0,
		},
		excludeLoanIds: {
			type: Array,
			default: () => [],
		},
	},
	components: {
		KvButton,
		KvCarousel,
		KvIcon,
		KvLoadingPlaceholder,
		KvProgressBar,
	},
	data() {
		return {
			loadingLoans: true,
			loans: [],
		};
	},
	computed: {
		amountLeft() {
			return this.goal - this.progress;
		},
		amountLeftFormatted() {
			// Format amount left as currency with optional cents
			return numeral(this.amountLeft).format('$0,0[.]00');
		},
		loadingProgress() {
			// If we don't have a goal yet, we're still loading
			return this.goal === 0;
		},
		progressPercent() {
			// Avoid division by zero
			if (this.goal === 0) {
				return 0;
			}
			// Calculate progress percentage, but cap it at 100%
			return Math.min(100, (this.progress / this.goal) * 100);
		},
		displayLoans() {
			// If we're still loading loans, show placeholders
			if (this.loadingLoans || this.loadingProgress || !this.loans.length) {
				return new Array(this.maxLoans).fill({ id: 0 });
			}
			// Otherwise, show the loans
			return this.loans;
		}
	},
	methods: {
		addToBasket(loanId) {
			this.$emit('adding-loan');
			const amount = this.amountLeft;
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanId,
					price: numeral(amount).format('0.00'),
				},
			}).then(({ errors }) => {
				// Indicate that we're done adding so the parent can update totals
				this.$emit('done-adding');

				// Handle errors from adding to basket
				if (errors?.[0]) {
					const error = errors[0];
					// If no shares were added, get new loans and inform the user
					if (error.extensions?.code === 'no_shares_added_regular_xb') {
						this.$kvTrackEvent(
							'basket',
							'fail',
							'incentive-upsell-add-to-basket',
							`loan ${loanId} reserved`,
							amount
						);
						// eslint-disable-next-line max-len
						this.$showTipMsg('Looks like that loan was reserved by someone else! Try one of these instead.', 'info');
						this.fetchLoans();
					} else {
						// Otherwise, just show the error message
						this.$showTipMsg(error.message, 'error');
						try {
							this.$kvTrackEvent(
								'basket',
								'fail',
								'incentive-upsell-add-to-basket',
								`loan ${loanId}: ${error.message.substring(0, 40)}...`,
								amount
							);
							Sentry.captureMessage(`Add to Basket: ${error.message}`);
						} catch (e) {
						// no-op
						}
					}
				} else {
					// If no errors, track success
					this.$kvTrackEvent('basket', 'add-to-basket', 'incentive-upsell-add-to-basket', loanId, amount);
				}
			}).catch(error => {
				this.$emit('done-adding');
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
				this.$kvTrackEvent(
					'basket',
					'fail',
					'incentive-upsell-add-to-basket',
					`loan ${loanId}: ${error.toString().substring(0, 40)}...`,
					amount
				);
				Sentry.captureException(error);
			});
		},
		fetchLoans() {
			this.loadingLoans = true;
			this.apollo.query({
				query: upsellLoansQuery,
				variables: {
					// How many loans to fetch
					maxLoans: this.maxLoans,
					// Ensure loans have at least this amount left available
					minAmount: this.amountLeft,
					// Exclude loans already in the basket
					excludeLoanIds: this.excludeLoanIds,
				},
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				this.loans = data?.fundraisingLoans?.values ?? [];
				this.loadingLoans = false;
				// Track loans shown
				this.loans.forEach(loan => {
					this.$kvTrackEvent('basket', 'show', 'incentive-upsell-loan', loan.id, this.amountLeft);
				});
			});
		},
	},
	watch: {
		// Fetch new loans when progress changes
		progress: {
			immediate: true,
			handler(newVal, oldVal) {
				if (Number.isFinite(newVal) && newVal !== oldVal) {
					this.fetchLoans();
				}
			},
		},
	},
};
</script>

<style lang="postcss" scoped>
.loan-slide-image {
	width: 150px;
	height: 138px;
}

.loan-info {
	max-width: 150px;
}

@screen lg {
	.loan-slide-image {
		width: 244px;
		height: 185px;
	}

	.loan-info {
		max-width: 244px;
	}
}

#present-icon :deep(g) {
	@apply tw-fill-brand;
}
</style>
