<template>
	<async-portfolio-section @visible="fetchAsyncData" data-testid="lending-insights">
		<h2 class="tw-mb-3 md:tw-mb-2">
			Your lending insights
		</h2>
		<kv-grid as="dl" class="tw-grid-cols-12">
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 4rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ countryCount }}
				</dt>
				<dd class="stat-def">
					Countries supported
				</dd>
				<router-link
					to="/portfolio/lending-stats"
					v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
				>
					Details
				</router-link>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 4rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ inviteeLoanCount }}
				</dt>
				<dd class="stat-def">
					Loans by your invitees
				</dd>
				<router-link
					to="/portfolio/invites#myInviteActivity"
					v-kv-track-event="['portfolio', 'click', 'invitee-loans-details']"
				>
					Details
				</router-link>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 10rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ averageDonation }}
				</dt>
				<dd class="stat-def">
					Average donation per $25 lent
				</dd>
				<button
					class="tw-text-link"
					@click="donationLightboxVisible = true"
					v-kv-track-event="['portfolio', 'click', 'avg-donation-details']"
				>
					Details
				</button>
				<kv-lightbox
					:visible="donationLightboxVisible"
					title="Average donation per $25 lent"
					@lightbox-closed="donationLightboxVisible = false"
				>
					<p class="tw-mb-1">
						100% of every dollar lent on Kiva is used to fund loans. Kiva doesn't take a cut of the loans
						made on our website or charge interest to our Lending Partners. Instead, we rely on donations
						from our lender community to cover our operations and expand access to microfinance around the
						globe. This is why we ask for an optional  donation each time you make a loan.
					</p>
					<p class="tw-mb-1">
						Whether you are depositing funds to make a loan or relending money that a borrower has paid
						back, please remember that Kiva can't exist without your support.
					</p>
					<template #controls>
						<kv-button
							to="/donate/supportus"
							v-kv-track-event="['portfolio', 'click', 'avg-donation-lightbox-donate']"
						>
							Donate
						</kv-button>
					</template>
				</kv-lightbox>
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 10rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ amountLent }}
				</dt>
				<dd class="stat-def">
					Total amount lent
				</dd>
				<router-link
					to="/portfolio/loans"
					v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
				>
					Details
				</router-link>
				<!-- <button
					class="tw-text-link"
					@click="loanLightboxVisible = true"
					v-kv-track-event="['portfolio', 'click', 'total-amount-lent-details']"
				>
					Details
				</button>
				<kv-lightbox
					:visible="loanLightboxVisible"
					title="Loan count"
					@lightbox-closed="loanLightboxVisible = false"
				>
					<loan-count-over-time-figure />
				</kv-lightbox> -->
			</div>
			<div class="tw-col-span-12 md:tw-col-span-6">
				<kv-loading-placeholder v-if="loading" class="stat-placeholder" style="width: 7rem;" />
				<dt v-show="!loading" class="stat-value">
					{{ percentile }}
				</dt>
				<dd class="stat-def">
					Lending percentile on Kiva
				</dd>
			</div>
		</kv-grid>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import AsyncPortfolioSection from './AsyncPortfolioSection';
// import LoanCountOverTimeFigure from './LoanCountOverTimeFigure';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'LendingInsights',
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvButton,
		KvGrid,
		KvLightbox,
		KvLoadingPlaceholder,
		// LoanCountOverTimeFigure,
	},
	data() {
		return {
			loading: true,
			donationLightboxVisible: false,
			// loanLightboxVisible: false,
			countryCount: 0,
			inviteeLoanCount: 0,
			averageDonation: 0,
			amountLent: 0,
			percentile: 0,
		};
	},
	methods: {
		fetchAsyncData() {
			if (this.loading) {
				this.apollo.query({
					query: gql`query lendingInsights {
						my {
							id
							lendingStats {
								id
								amountLentPercentile
								lentTo {
									countries {
										totalCount
									}
								}
							}
							userStats {
								amount_donated
								amount_of_loans
								number_of_loans_by_invitees
							}
						}
					}`
				}).then(({ data }) => {
					this.loading = false;
					this.countryCount = data?.my?.lendingStats?.lentTo?.countries?.totalCount ?? 0;
					this.percentile = numeral(data?.my?.lendingStats?.amountLentPercentile ?? 0).format('0o');
					this.inviteeLoanCount = data?.my?.userStats?.number_of_loans_by_invitees ?? 0;

					const amountOfLoans = numeral(data?.my?.userStats?.amount_of_loans ?? 0);
					const donation = numeral(data?.my?.userStats?.amount_donated ?? 0);
					if (amountOfLoans.value() > 0) {
						donation.multiply(1 / amountOfLoans.value()).multiply(25);
					}

					this.averageDonation = donation.format('$0,0[.]00');
					this.amountLent = amountOfLoans.format('$0,0[.]00');
				});
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.stat-placeholder {
	margin-bottom: 6px;
	@apply tw-mt-1 tw-h-4.5;
}

.stat-value {
	@apply tw-text-h1 tw-text-brand;
}

.stat-def {
	@apply tw-text-h3 tw-mb-0.5;
}

@screen md {
	.stat-placeholder {
		height: 44px;
		margin-bottom: 10.5px;
	}
}

@screen lg {
	.stat-placeholder {
		margin-bottom: 11.5px;
		@apply tw-h-6;
	}
}
</style>
