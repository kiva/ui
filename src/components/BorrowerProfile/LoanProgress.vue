<template>
	<figure>
		<kv-progress-bar
			v-if="loanStatus === 'pfp'"
			class="tw-mb-1.5 lg:tw-mb-1"
			aria-label="Percent completion of private fundraising"
			:value="pfpProgressPercent"
		/>
		<kv-progress-bar
			v-else
			class="tw-mb-1.5 lg:tw-mb-1"
			aria-label="Percent the loan has funded"
			:value="progressPercent * 100"
		/>
		<figcaption class="tw-flex">
			<div v-if="loanStatus === 'funded' || loanStatus === 'raised'">
				<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-amount-to-go">
					This loan is fully funded!
				</p>
				<div class="md:tw-flex tw-gap-2">
					<p class="tw-text-h4 tw-text-secondary tw-block">
						100% funded
					</p>
					<p class="tw-text-h4 tw-text-action tw-block">
						<router-link
							:to="`/lend-classic/${$route.params.id}?minimal=false`"
							v-kv-track-event="['Lending', 'full-borrower-profile-exit-link']"
						>
							View the full borrower profile
						</router-link>
					</p>
				</div>
			</div>
			<div v-else-if="loanStatus === 'expired'">
				<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-amount-to-go">
					This loan has expired
				</p>
				<div class="md:tw-flex tw-gap-2">
					<p class="tw-text-h4 tw-text-secondary tw-block" data-testid="bp-summary-percent-funded">
						{{ progressPercent | numeral('0%') }} funded
					</p>
					<p class="tw-text-h4 tw-text-action tw-block">
						<router-link
							:to="`/lend-classic/${$route.params.id}?minimal=false`"
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
						{{ progressPercent | numeral('0%') }} funded
					</p>
					<p class="tw-text-h4 tw-text-action tw-block">
						<router-link
							:to="`/lend-classic/${$route.params.id}?minimal=false`"
							v-kv-track-event="['Lending', 'full-borrower-profile-exit-link']"
						>
							View the full borrower profile
						</router-link>
					</p>
				</div>
			</div>
			<template v-else-if="loanStatus === 'pfp'">
				<p class="tw-flex-auto" data-testid="bp-summary-timeleft">
					<span class="tw-text-h3 tw-block tw-m-0">
						{{ timeLeft }}
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
						{{ moneyLeft | numeral('$0,0[.]00') }} to go
					</p>
				</div>
			</template>
			<template v-else>
				<p class="tw-flex-auto" data-testid="bp-summary-timeleft">
					<countdown-timer
						v-if="urgency"
						:time="msLeft"
						class="tw-text-brand tw-text-h3"
					/>
					<span v-else class="tw-text-h3 tw-block tw-m-0">
						{{ timeLeft }}
					</span>

					<span class="tw-text-h4 tw-text-secondary tw-block">
						remaining
					</span>
				</p>
				<div class="tw-flex-auto tw-text-right">
					<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-amount-to-go">
						{{ moneyLeft | numeral('$0,0[.]00') }} to go
					</p>
					<p class="tw-text-h4 tw-text-secondary" data-testid="bp-summary-percent-funded">
						{{ progressPercent | numeral('0%') }} funded
					</p>
				</div>
			</template>
		</figcaption>
	</figure>
</template>

<script>
import CountdownTimer from '@/components/BorrowerProfile/CountdownTimer';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	name: 'LoanProgress',
	components: {
		CountdownTimer,
		KvProgressBar,
	},
	props: {
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
		urgency: {
			type: Boolean,
			default: false,
		},
		msLeft: {
			type: Number,
			default: 0,
		},
		loanStatus: {
			type: String,
			default: 'fundraising',
			validator: value => {
				// Uncomment loan statuses as they become supported
				return [
					// 'defaulted',
					// 'deleted',
					// 'ended',
					'expired',
					'funded',
					'fundraising',
					'inactive',
					// 'inactiveExpired',
					// 'issue',
					// 'payingBack',
					'pfp',
					'raised',
					// 'refunded',
					// 'reviewed'
				].indexOf(value) !== -1;
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
	},
	computed: {
		pfpProgressPercent() {
			if (this.pfpMinLenders === 0) {
				return 0;
			}
			return (this.numberOfLenders / this.pfpMinLenders) * 100;
		}
	},
};
</script>
