<template>
	<figure>
		<kv-progress-bar
			v-if="loanStatus === 'pfp'"
			class="tw-mb-1.5 lg:tw-mb-1"
			label="Percent completion of private fundraising"
			:value="pfpProgressPercent"
			:bg-variant="'tertiary'"
		/>
		<kv-progress-bar
			v-else
			class="tw-mb-1.5 lg:tw-mb-1"
			label="Percent the loan has funded"
			:value="progressPercent * 100"
			:bg-variant="'tertiary'"
		/>
		<figcaption class="tw-flex">
			<div
				v-if="loanStatus === 'funded' || loanStatus === 'raised'"
				class="tw-w-full"
			>
				<div
					v-if="loading"
					class="tw-flex tw-justify-between"
				>
					<KvLoadingPlaceholder style="height: 2rem; width: 100px" />
					<KvLoadingPlaceholder style="height: 2rem; width: 100px" class="tw-text-right" />
				</div>
				<div v-else>
					<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-amount-to-go">
						This loan is fully funded!
					</p>
					<div class="md:tw-flex tw-gap-2">
						<p class="tw-text-h4 tw-text-secondary tw-block">
							100% funded
						</p>
						<p v-if="!hideViewProfileLinks" class="tw-text-h4 tw-text-action tw-block">
							<router-link
								:to="`/lend-classic/${routeId}?minimal=false`"
								v-kv-track-event="['Lending', 'full-borrower-profile-exit-link']"
							>
								View the full borrower profile
							</router-link>
						</p>
					</div>
				</div>
			</div>
			<div v-else-if="loanStatus === 'expired'">
				<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-amount-to-go">
					This loan has expired
				</p>
				<div class="md:tw-flex tw-gap-2">
					<p class="tw-text-h4 tw-text-secondary tw-block" data-testid="bp-summary-percent-funded">
						{{ progressPercentRounded }} funded
					</p>
					<p v-if="!hideViewProfileLinks" class="tw-text-h4 tw-text-action tw-block">
						<router-link
							:to="`/lend-classic/${routeId}?minimal=false`"
							v-kv-track-event="['Lending', 'full-borrower-profile-exit-link']"
						>
							View the full borrower profile
						</router-link>
					</p>
				</div>
			</div>
			<div v-else-if="loanStatus === 'inactive'">
				<p class="tw-text-h3 tw-m-0">
					This loan is inactive
				</p>
				<div class="md:tw-flex tw-gap-2">
					<p class="tw-text-h4 tw-text-secondary tw-block" data-testid="bp-summary-percent-funded">
						{{ progressPercentRounded }} funded
					</p>
					<p v-if="!hideViewProfileLinks" class="tw-text-h4 tw-text-action tw-block">
						<router-link
							:to="`/lend-classic/${routeId}?minimal=false`"
							v-kv-track-event="['Lending', 'full-borrower-profile-exit-link']"
						>
							View the full borrower profile
						</router-link>
					</p>
				</div>
			</div>
			<template v-else-if="loanStatus === 'pfp'">
				<div v-if="loading">
					<KvLoadingPlaceholder style="height: 2rem; width: 100px" />
					<KvLoadingPlaceholder style="height: 2rem; width: 100px" class="tw-text-right" />
				</div>
				<div v-else class="tw-flex tw-flex-auto">
					<p class="tw-flex-auto" data-testid="bp-summary-timeleft">
						<span class="tw-text-h3 tw-block tw-m-0">
							{{ timeLeft }} left
						</span>
						<span class="tw-text-h4 tw-text-secondary tw-block">
							in private fundraising
						</span>
					</p>
					<div class="tw-flex-auto tw-text-right">
						<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-lenders-to-go">
							{{ numberOfLenders }}/{{ pfpMinLenders }} lenders
						</p>
						<p class="tw-text-h4 tw-text-secondary" data-testid="bp-summary-amount-to-go">
							{{ $filters.numeral(moneyLeft, '$0,0[.]00') }} to go
						</p>
					</div>
				</div>
			</template>
			<template v-else>
				<div v-if="loading" class="tw-flex tw-flex-auto tw-justify-between">
					<KvLoadingPlaceholder style="height: 2rem; width: 100px" />
					<KvLoadingPlaceholder style="height: 2rem; width: 100px" class="tw-text-right" />
				</div>
				<div v-else class="tw-flex tw-flex-auto">
					<p class="tw-flex-auto" data-testid="bp-summary-timeleft">
						<span class="tw-text-h3 tw-block tw-m-0">
							{{ timeLeft }}
						</span>
						<span class="tw-text-h4 tw-text-secondary tw-block">
							remaining
						</span>
					</p>
					<div class="tw-flex-auto tw-text-right">
						<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-amount-to-go">
							{{ $filters.numeral(moneyLeft, '$0,0[.]00') }} to go
						</p>
						<p class="tw-text-h4 tw-text-secondary" data-testid="bp-summary-percent-funded">
							{{ progressPercentRounded }} funded
						</p>
					</div>
				</div>
			</template>
		</figcaption>
	</figure>
</template>

<script>
import { ALLOWED_LOAN_STATUSES } from '#src/util/loanUtils';
import numeral from 'numeral';
import { KvProgressBar, KvLoadingPlaceholder } from '@kiva/kv-components';

export default {
	name: 'LoanProgress',
	components: {
		KvProgressBar,
		KvLoadingPlaceholder
	},
	props: {
		loading: {
			type: Boolean,
			default: true
		},
		moneyLeft: {
			type: String,
			default: '0.00',
		},
		progressPercent: {
			type: Number,
			default: 0,
		},
		timeLeft: {
			type: String,
			default: '',
		},
		loanStatus: {
			type: String,
			default: 'fundraising',
			validator: value => {
				// Uncomment loan statuses as they become supported
				return ALLOWED_LOAN_STATUSES.indexOf(value) !== -1;
			}
		},
		numberOfLenders: {
			type: Number,
			default: 0,
		},
		pfpMinLenders: {
			type: Number,
			default: 0,
		},
		loanId: {
			type: Number,
			default: 0
		},
		hideViewProfileLinks: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		pfpProgressPercent() {
			if (this.pfpMinLenders === 0) {
				return 0;
			}
			return (this.numberOfLenders / this.pfpMinLenders) * 100;
		},
		progressPercentRounded() {
			const rounded = numeral(this.progressPercent).format('0%');

			// Ensure loans with 99.x% don't get rounded up to 100%
			if (rounded === '100%' && this.progressPercent < 1) {
				return '99%';
			}

			return rounded;
		},
		routeId() {
			return this.loanId ? this.loanId : this.$route.params.id;
		}
	},
};
</script>
