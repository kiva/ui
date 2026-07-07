<template>
	<PortfolioShell>
		<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3">
			<!-- Loading the request summary -->
			<KvLoadingPlaceholder v-if="loading" style="height: 160px;" />

			<!-- Success / in-review -->
			<div v-else-if="outcome === withdrawalStatus.SUCCESS" data-testid="withdraw-success">
				<h1 class="tw-text-headline tw-mb-1">
					Withdrawal requested
				</h1>
				<p>{{ successMessage }}</p>
				<KvButton
					to="/portfolio"
					class="tw-mt-2"
					v-kv-track-event="['portfolio', 'click', 'Withdraw success back to portfolio']"
				>
					Back to My Portfolio
				</KvButton>
			</div>

			<!-- Blocked (queued for review) -->
			<div v-else-if="outcome === withdrawalStatus.BLOCKED" data-testid="withdraw-blocked">
				<h1 class="tw-text-headline tw-mb-1">
					Withdrawal in review
				</h1>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<p v-if="outcomeMessage" v-html="sanitizedOutcomeMessage"></p>
				<p class="tw-mt-1">
					We've added your withdrawal request to the queue and Kiva's Community team will reach
					out in 1-4 days to confirm your request. If you have any questions, please email
					<a href="mailto:contactus@kiva.org" class="tw-no-underline">contactus@kiva.org</a>.
				</p>
				<KvButton
					to="/portfolio"
					class="tw-mt-2"
					v-kv-track-event="['portfolio', 'click', 'Withdraw in review back to portfolio']"
				>
					Back to My Portfolio
				</KvButton>
			</div>

			<!-- Confirm summary -->
			<template v-else>
				<h1 class="tw-text-headline tw-mb-0.5">
					Confirm request
				</h1>
				<p class="tw-mb-3">
					Are you sure you want to complete this transaction?
				</p>

				<div class="tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-center tw-gap-2 tw-mb-3">
					<div class="tw-text-center">
						<span class="tw-text-display tw-font-bold" data-testid="withdraw-confirm-amount">
							{{ numeral(amount).format('$0,0.00') }}
						</span>
					</div>
					<div class="tw-flex tw-flex-col tw-items-center tw-text-small tw-text-secondary">
						<KvMaterialIcon :icon="mdiArrowRight" class="tw-w-3 tw-hidden md:tw-block" />
						<KvMaterialIcon :icon="mdiArrowDown" class="tw-w-3 md:tw-hidden" />
						<span>Review and processing *</span>
						<span>(1-2 weeks)</span>
					</div>
					<div class="tw-flex tw-flex-col tw-items-center tw-text-center data-hj-suppress">
						<KvUserAvatar
							:lender-name="lenderName"
							:lender-image-url="lenderImageUrl"
							class="tw-w-6 tw-h-6 tw-mb-1"
						/>
						<span class="tw-font-bold tw-break-words" data-testid="withdraw-confirm-email">
							{{ paypalEmail }}
						</span>
						<PaypalIcon class="tw-h-2 tw-mt-0.5" aria-label="PayPal" role="img" />
					</div>
				</div>

				<!-- Donation-on-top -->
				<div class="tw-border-t tw-border-tertiary tw-pt-2 tw-mb-2">
					<KvCheckbox
						id="withdraw-add-donation"
						v-model="addDonation"
						data-testid="withdraw-add-donation"
						@update:model-value="onToggleDonation"
					>
						Add a donation to Kiva to support our work
					</KvCheckbox>
					<div v-if="addDonation" class="tw-mt-1 tw-pl-3">
						<label for="withdraw-donation-amount" class="tw-block tw-font-medium tw-mb-0.5">
							Donation amount
						</label>
						<KvCurrencyInput
							id="withdraw-donation-amount"
							class="tw-w-full md:tw-w-1/3"
							:model-value="donationAmount"
							clear-zero-on-focus
							@input="onDonationInput"
						/>
						<p v-if="donationTouched && donationError" class="tw-text-danger tw-text-small tw-mt-0.5">
							{{ donationError }}
						</p>
					</div>
				</div>

				<!-- Submit error -->
				<!-- eslint-disable-next-line vue/no-v-html -->
				<p
					v-if="outcome === withdrawalStatus.ERROR && outcomeMessage"
					class="tw-text-danger tw-mb-2"
					data-testid="withdraw-error"
					v-html="sanitizedOutcomeMessage"
				></p>

				<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-2">
					<KvButton
						class="tw-w-full md:tw-w-auto tw-order-1 md:tw-order-2"
						:state="submitState"
						data-testid="withdraw-submit"
						@click="onSubmit"
						v-kv-track-event="['portfolio', 'click', 'Withdraw request withdrawal']"
					>
						Request withdrawal
					</KvButton>
					<KvButton
						variant="secondary"
						class="tw-w-full md:tw-w-auto tw-order-2 md:tw-order-1"
						:state="submitting ? 'disabled' : ''"
						data-testid="withdraw-cancel"
						@click="onCancel"
						v-kv-track-event="['portfolio', 'click', 'Withdraw cancel']"
					>
						Cancel
					</KvButton>
				</div>

				<p class="tw-text-small tw-text-secondary tw-mt-3">
					*Completing withdrawals via PayPal is a manual process, and as such, takes longer than
					accepting funds. Withdrawal requests are reviewed by Kiva's accounting team on a weekly
					basis and, once approved, sent to lenders' PayPal accounts. Given this process, lenders
					can expect to see their funds deposited into their PayPal account within 1-2 weeks of it
					being requested.
				</p>
			</template>
		</div>
	</PortfolioShell>
</template>

<script>
import numeral from 'numeral';
import DOMPurify from 'dompurify';
import { mdiArrowRight, mdiArrowDown } from '@mdi/js';
import {
	KvButton, KvCheckbox, KvLoadingPlaceholder, KvMaterialIcon, KvUserAvatar
} from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';
import PaypalIcon from '#src/assets/icons/inline/paypal.svg';
import logFormatter from '#src/util/logFormatter';
import withdrawReadModelQuery from '#src/graphql/query/withdraw/withdrawReadModel.graphql';
import requestPayPalWithdrawalMutation from '#src/graphql/mutation/withdraw/requestPayPalWithdrawal.graphql';
import { WITHDRAWAL_STATUS, WITHDRAW_ROUTE, WITHDRAW_STATE_KEY } from './withdrawConstants';

export default {
	name: 'WithdrawConfirmPage',
	components: {
		PortfolioShell,
		KvButton,
		KvCheckbox,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvUserAvatar,
		KvCurrencyInput,
		PaypalIcon,
	},
	inject: ['apollo'],
	data() {
		return {
			numeral,
			mdiArrowRight,
			mdiArrowDown,
			withdrawalStatus: WITHDRAWAL_STATUS,
			// Read from history state (set by WithdrawPage) so PII stays out of the URL.
			amount: 0,
			paypalEmail: '',
			loading: true,
			submitting: false,
			outcome: null,
			outcomeMessage: '',
			addDonation: false,
			donationAmount: 0,
			// Track whether the user has edited the donation field so the validation
			// message only shows after a change, not when the field first appears.
			donationTouched: false,
			withdrawableBalance: 0,
			lenderName: '',
			lenderImageUrl: '',
		};
	},
	computed: {
		effectiveDonation() {
			return this.addDonation ? Number(this.donationAmount) || 0 : 0;
		},
		// Drives the submit button's look + disabled state the same way the withdraw
		// form's Continue button does: 'loading' while the request is in flight,
		// 'disabled' when the donation amount is invalid, otherwise interactive.
		submitState() {
			if (this.submitting) {
				return 'loading';
			}
			if (this.donationError) {
				return 'disabled';
			}
			return '';
		},
		donationError() {
			if (!this.addDonation) {
				return '';
			}
			const donation = Number(this.donationAmount) || 0;
			if (donation <= 0) {
				return 'Please enter a valid donation amount in USD.';
			}
			if (donation >= Number(this.amount)) {
				return 'Your donation amount cannot be greater or equal to your withdrawal amount.';
			}
			if (Number(this.amount) + donation > Number(this.withdrawableBalance)) {
				return 'You do not have enough Kiva credit to complete this withdrawal.';
			}
			return '';
		},
		// Backend outcome messages can contain links (e.g. the PayPal verification
		// prompt), so render them as sanitized HTML rather than escaped text.
		sanitizedOutcomeMessage() {
			if (!this.outcomeMessage) {
				return '';
			}
			return DOMPurify.sanitize(this.outcomeMessage, {
				ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'],
			});
		},
		successMessage() {
			if (this.effectiveDonation > 0) {
				return 'Thank you for your donation! Your withdrawal request of '
					+ `${numeral(this.amount).format('$0,0.00')} will be processed in 1 to 2 weeks.`;
			}
			return `Your withdrawal request of ${numeral(this.amount).format('$0,0.00')} has been received. `
				+ "We'll email you when your funds are sent to PayPal.";
		},
	},
	methods: {
		onDonationInput(value) {
			this.donationAmount = value;
			this.donationTouched = true;
		},
		onToggleDonation(value) {
			// Reset the touched flag so re-opening the field starts without an error.
			this.donationTouched = false;
			this.$kvTrackEvent('portfolio', 'click', 'Withdraw donation toggle', value ? 1 : 0);
		},
		async fetchSummaryData() {
			try {
				const response = await this.apollo.query({
					query: withdrawReadModelQuery,
					fetchPolicy: 'network-only',
				});
				this.lenderName = response?.data?.my?.lender?.name ?? '';
				this.lenderImageUrl = response?.data?.my?.lender?.image?.url ?? '';
				this.withdrawableBalance = response?.data?.my?.userAccount?.withdrawal?.withdrawableBalance ?? 0;
			} catch (error) {
				logFormatter(`Error fetching withdraw confirm data: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
		async onSubmit() {
			if (this.donationError) {
				return;
			}
			this.submitting = true;
			this.outcome = null;
			this.outcomeMessage = '';
			try {
				const response = await this.apollo.mutate({
					mutation: requestPayPalWithdrawalMutation,
					variables: {
						amount: Number(this.amount),
						paypalEmail: this.paypalEmail,
						donationAmount: this.effectiveDonation > 0 ? this.effectiveDonation : null,
					},
				});
				const result = response?.data?.my?.requestPayPalWithdrawal;
				const status = result?.status;
				this.outcomeMessage = result?.message ?? '';

				if (status === WITHDRAWAL_STATUS.SUCCESS) {
					this.outcome = WITHDRAWAL_STATUS.SUCCESS;
				} else if (status === WITHDRAWAL_STATUS.AUTHORIZATION_REQUIRED) {
					this.$router.push({
						path: WITHDRAW_ROUTE.CHECK_INBOX,
						state: { [WITHDRAW_STATE_KEY.EMAIL]: this.paypalEmail },
					});
				} else if (status === WITHDRAWAL_STATUS.BLOCKED) {
					this.outcome = WITHDRAWAL_STATUS.BLOCKED;
				} else {
					this.outcome = WITHDRAWAL_STATUS.ERROR;
					if (!this.outcomeMessage) {
						this.outcomeMessage = 'An error occurred. Please try again.';
					}
				}
			} catch (error) {
				this.outcome = WITHDRAWAL_STATUS.ERROR;
				this.outcomeMessage = 'An error occurred. Please try again.';
				logFormatter(`Error submitting withdrawal: ${error}`, 'error');
			} finally {
				this.submitting = false;
			}
		},
		onCancel() {
			this.$router.push({ path: WITHDRAW_ROUTE.BASE });
		},
	},
	mounted() {
		// The request is passed via history state (not the URL) to keep PII out of
		// query strings/logs. A refresh or direct hit has no state, so we fall back
		// to the form — the same way the legacy page handled a missing session request.
		const state = window.history.state ?? {};
		this.amount = Number(state[WITHDRAW_STATE_KEY.AMOUNT]) || 0;
		this.paypalEmail = state[WITHDRAW_STATE_KEY.PAYPAL_EMAIL] || '';

		if (!this.amount || this.amount <= 0 || !this.paypalEmail) {
			this.$router.replace({ path: WITHDRAW_ROUTE.BASE });
			return;
		}
		this.fetchSummaryData();
	},
};
</script>
