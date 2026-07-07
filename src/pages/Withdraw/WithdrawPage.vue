<template>
	<PortfolioShell>
		<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3">
			<h1 class="tw-text-headline tw-mb-1">
				Withdraw credit
			</h1>

			<!-- Loading -->
			<KvLoadingPlaceholder
				v-if="loading"
				style="height: 120px;"
			/>

			<!-- Error loading the read model -->
			<div v-else-if="loadError" data-testid="withdraw-load-error">
				<p>An error occurred. Please try again.</p>
				<KvButton
					class="tw-mt-2"
					@click="fetchWithdrawData"
					v-kv-track-event="['portfolio', 'click', 'Withdraw retry load']"
				>
					Try again
				</KvButton>
			</div>

			<!-- Non-withdrawable account (canWithdraw === false) -->
			<div v-else-if="!canWithdraw && emailAllowed" data-testid="withdraw-forbidden">
				<h2 class="tw-text-title tw-mb-1">
					Withdrawals are not allowed from this account
				</h2>
				<p>
					This account is tagged as non-withdrawable. This has legal implications, and no
					withdrawals are allowed from this type of account.
				</p>
				<KvButton
					to="/portfolio"
					class="tw-mt-2"
					v-kv-track-event="['portfolio', 'click', 'Withdraw not allowed back to portfolio']"
				>
					Back to My Portfolio
				</KvButton>
			</div>

			<!-- Email not verified / denylisted (emailAllowed === false) -->
			<div v-else-if="!emailAllowed" data-testid="withdraw-not-verified">
				<h2 class="tw-text-title tw-mb-1">
					Verify your email address
				</h2>
				<p>
					Your email address (<span class="data-hj-suppress">{{ accountEmail }}</span>) hasn't been
					verified. In order to withdraw funds from your Kiva account, you'll need to verify your
					email address.
				</p>
				<p class="tw-mt-1">
					If your email address is incorrect, please change it first.
				</p>
				<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-2 tw-mt-2">
					<KvButton
						variant="secondary"
						to="/settings/account"
						v-kv-track-event="['portfolio', 'click', 'Withdraw change email']"
					>
						Change email address
					</KvButton>
					<KvButton
						:to="verifyEmailUrl"
						v-kv-track-event="['portfolio', 'click', 'Withdraw verify email']"
					>
						Verify email address
					</KvButton>
				</div>
			</div>

			<!-- Not enough credit to withdraw -->
			<div v-else-if="withdrawableBalance <= 0" data-testid="withdraw-no-credit">
				<p>You do not have enough Kiva credit to request a withdrawal.</p>
				<KvButton
					to="/portfolio"
					class="tw-mt-2"
					v-kv-track-event="['portfolio', 'click', 'Withdraw no credit back to portfolio']"
				>
					Back to My Portfolio
				</KvButton>
			</div>

			<!-- Withdrawal form -->
			<template v-else>
				<p>
					Enter the amount you'd like to withdraw to your PayPal account in US dollars.
					Withdrawals typically take 1-2 weeks to process. Please note: Kiva's
					<a href="/legal/terms" class="tw-no-underline">Terms of Use</a> require that all funds
					be used to make a loan before they can be withdrawn.
				</p>

				<div class="tw-mt-3 tw-mb-2">
					<p class="tw-text-small tw-text-tertiary tw-font-medium tw-text-upper">
						Available Kiva credit
					</p>
					<p class="tw-text-headline tw-text-eco-green" data-testid="withdraw-available-credit">
						{{ numeral(withdrawableBalance).format('$0,0.00') }}
					</p>
				</div>

				<!-- Withdrawals in review -->
				<div v-if="hasPendingRequests" class="tw-mb-3" data-testid="withdraw-in-review">
					<h2 class="tw-text-title tw-mb-1">
						Withdrawals in review
					</h2>
					<ul>
						<li
							v-for="request in pendingRequests"
							:key="request.id"
							class="tw-border-b tw-border-tertiary tw-py-1"
						>
							{{ numeral(request.price).format('$0,0.00') }} -
							{{ formatRequestedAt(request.requestedAt) }}
						</li>
					</ul>
				</div>

				<form novalidate @submit.prevent="onContinue">
					<div class="tw-mb-2">
						<label for="withdrawal-amount" class="tw-block tw-font-medium tw-mb-0.5">
							Amount to withdraw
						</label>
						<KvCurrencyInput
							id="withdrawal-amount"
							class="tw-w-full md:tw-w-1/2"
							:model-value="amount"
							clear-zero-on-focus
							@input="onAmountInput"
						/>
						<ul v-if="v$.amount.$error" class="tw-text-danger tw-text-small tw-mt-0.5">
							<li v-for="error in v$.amount.$errors" :key="error.$uid">
								{{ error.$message }}
							</li>
						</ul>
					</div>

					<div class="tw-mb-2">
						<label for="paypal-email" class="tw-block tw-font-medium tw-mb-0.5">
							Your PayPal account email
						</label>
						<KvTextInput
							id="paypal-email"
							type="email"
							class="tw-w-full md:tw-w-1/2 data-hj-suppress"
							:model-value="paypalEmail"
							@update:model-value="onEmailInput"
						/>
						<ul v-if="v$.paypalEmail.$error" class="tw-text-danger tw-text-small tw-mt-0.5">
							<li v-for="error in v$.paypalEmail.$errors" :key="error.$uid">
								{{ error.$message }}
							</li>
						</ul>
					</div>

					<div class="tw-mb-2">
						<label for="paypal-email-confirm" class="tw-block tw-font-medium tw-mb-0.5">
							Confirm PayPal account email
						</label>
						<KvTextInput
							id="paypal-email-confirm"
							type="email"
							class="tw-w-full md:tw-w-1/2 data-hj-suppress"
							:model-value="paypalEmailConfirm"
							@update:model-value="onEmailConfirmInput"
						/>
						<ul v-if="v$.paypalEmailConfirm.$error" class="tw-text-danger tw-text-small tw-mt-0.5">
							<li v-for="error in v$.paypalEmailConfirm.$errors" :key="error.$uid">
								{{ error.$message }}
							</li>
						</ul>
					</div>

					<KvButton
						type="submit"
						class="tw-mt-1"
						:state="v$.$invalid ? 'disabled' : ''"
						data-testid="withdraw-continue"
						v-kv-track-event="['portfolio', 'click', 'Withdraw continue']"
					>
						Continue
					</KvButton>
				</form>

				<div class="tw-text-small tw-text-secondary tw-mt-3">
					<p>
						Currently, all withdrawals from Kiva must be sent to a PayPal account, and cannot be
						transferred directly to a bank account. If you don't have a PayPal account, you can
						create one at paypal.com.
					</p>
					<p class="tw-mt-1">
						Have questions about your withdrawal? Email us at
						<a href="mailto:contactus@kiva.org" class="tw-no-underline">contactus@kiva.org</a>.
					</p>
				</div>
			</template>
		</div>
	</PortfolioShell>
</template>

<script>
import numeral from 'numeral';
import { useVuelidate } from '@vuelidate/core';
import {
	required, email, sameAs, minValue, maxValue, helpers,
} from '@vuelidate/validators';
import { KvButton, KvLoadingPlaceholder, KvTextInput } from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';
import logFormatter from '#src/util/logFormatter';
import withdrawReadModelQuery from '#src/graphql/query/withdraw/withdrawReadModel.graphql';
import { WITHDRAW_ROUTE, WITHDRAW_STATE_KEY, WITHDRAW_PROCESS } from './withdrawConstants';

// Mirrors API_Withdrawal::MAX_WITHDRAWAL_AMOUNT
const MAX_WITHDRAWAL_AMOUNT = 10000;
// Client-side floor mirrors the legacy form's data-min-amount
const MIN_WITHDRAWAL_AMOUNT = 0.01;

export default {
	name: 'WithdrawPage',
	components: {
		PortfolioShell,
		KvButton,
		KvLoadingPlaceholder,
		KvTextInput,
		KvCurrencyInput,
	},
	inject: ['apollo'],
	setup() {
		return { v$: useVuelidate() };
	},
	data() {
		return {
			numeral,
			loading: true,
			loadError: false,
			canWithdraw: false,
			emailAllowed: false,
			withdrawableBalance: 0,
			maxWithdrawalAmount: MAX_WITHDRAWAL_AMOUNT,
			accountEmail: '',
			pendingRequests: [],
			amount: 0,
			paypalEmail: '',
			paypalEmailConfirm: '',
		};
	},
	validations() {
		return {
			amount: {
				required: helpers.withMessage('Please enter a valid amount in USD.', required),
				minValue: helpers.withMessage(
					'Please enter a valid amount in USD.',
					minValue(MIN_WITHDRAWAL_AMOUNT),
				),
				withinBalance: helpers.withMessage(
					'You do not have enough Kiva credit to make this withdrawal.',
					value => Number(value) <= Number(this.withdrawableBalance),
				),
				maxValue: helpers.withMessage(
					"Withdrawals are limited to $10,000.00. If you'd like to add more, "
						+ 'please do so in separate withdrawals.',
					maxValue(this.maxWithdrawalAmount),
				),
			},
			paypalEmail: {
				required: helpers.withMessage('Invalid email address', required),
				email: helpers.withMessage('Invalid email address', email),
			},
			paypalEmailConfirm: {
				required: helpers.withMessage('Email addresses do not match.', required),
				sameAsEmail: helpers.withMessage(
					'Email addresses do not match.',
					sameAs(this.paypalEmail),
				),
			},
		};
	},
	computed: {
		hasPendingRequests() {
			return this.pendingRequests?.length > 0;
		},
		// Reuses the same constants as the route meta so the process label and return
		// route have a single source of truth instead of duplicated literals.
		verifyEmailUrl() {
			return `/start-verification?process=${encodeURIComponent(WITHDRAW_PROCESS)}`
				+ `&doneUrl=${WITHDRAW_ROUTE.BASE}`;
		},
	},
	methods: {
		async fetchWithdrawData() {
			this.loading = true;
			this.loadError = false;
			try {
				const response = await this.apollo.query({
					query: withdrawReadModelQuery,
					fetchPolicy: 'network-only',
				});
				const withdrawal = response?.data?.my?.userAccount?.withdrawal;
				this.accountEmail = response?.data?.my?.userAccount?.email ?? '';
				if (!withdrawal) {
					this.loadError = true;
					return;
				}
				this.canWithdraw = withdrawal.canWithdraw;
				this.emailAllowed = withdrawal.emailAllowed;
				this.withdrawableBalance = withdrawal.withdrawableBalance ?? 0;
				this.maxWithdrawalAmount = withdrawal.maxWithdrawalAmount ?? MAX_WITHDRAWAL_AMOUNT;
				this.pendingRequests = withdrawal.pendingRequests ?? [];
			} catch (error) {
				this.loadError = true;
				logFormatter(`Error fetching withdraw data: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
		onAmountInput(value) {
			this.amount = value;
			this.v$.amount.$touch();
		},
		onEmailInput(value) {
			this.paypalEmail = value;
			this.v$.paypalEmail.$touch();
		},
		onEmailConfirmInput(value) {
			this.paypalEmailConfirm = value;
			this.v$.paypalEmailConfirm.$touch();
		},
		formatRequestedAt(requestedAt) {
			if (!requestedAt) {
				return '';
			}
			// Date scalar may serialize as an ISO string or a unix timestamp (seconds)
			const numeric = Number(requestedAt);
			const date = Number.isNaN(numeric)
				? new Date(requestedAt)
				: new Date(numeric * 1000);
			if (Number.isNaN(date.getTime())) {
				return '';
			}
			return date.toLocaleString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				timeZoneName: 'short',
			});
		},
		async onContinue() {
			const valid = await this.v$.$validate();
			if (!valid) {
				return;
			}
			// Carry the in-flight request in history state (not the URL) so the PayPal
			// email and amount never appear in query strings, referrers, or server logs.
			// A hard refresh/direct hit drops the state and WithdrawConfirmPage redirects
			// back here — mirroring the legacy server-session behaviour.
			this.$router.push({
				path: WITHDRAW_ROUTE.CONFIRM,
				state: {
					[WITHDRAW_STATE_KEY.AMOUNT]: this.amount,
					[WITHDRAW_STATE_KEY.PAYPAL_EMAIL]: this.paypalEmail,
				},
			});
		},
	},
	mounted() {
		this.fetchWithdrawData();
	},
};
</script>
