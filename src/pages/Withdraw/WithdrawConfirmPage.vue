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
					<a
						href="mailto:contactus@kiva.org"
						class="tw-no-underline"
						v-kv-track-event="['portfolio', 'click', 'Withdraw in review contact us']"
					>contactus@kiva.org</a>.
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
	KvButton, KvLoadingPlaceholder, KvMaterialIcon, KvUserAvatar
} from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import PaypalIcon from '#src/assets/icons/inline/paypal.svg';
import logFormatter from '#src/util/logFormatter';
import withdrawReadModelQuery from '#src/graphql/query/withdraw/withdrawReadModel.graphql';
import requestPayPalWithdrawalMutation from '#src/graphql/mutation/withdraw/requestPayPalWithdrawal.graphql';
import { WITHDRAWAL_STATUS, WITHDRAW_ROUTE, WITHDRAW_STATE_KEY } from '#src/util/withdraw/withdrawConstants';

export default {
	name: 'WithdrawConfirmPage',
	components: {
		PortfolioShell,
		KvButton,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvUserAvatar,
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
			lenderName: '',
			lenderImageUrl: '',
		};
	},
	computed: {
		// Drives the submit button's look: 'loading' while the request is in flight,
		// otherwise interactive.
		submitState() {
			return this.submitting ? 'loading' : '';
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
			return `Your withdrawal request of ${numeral(this.amount).format('$0,0.00')} has been received. `
				+ "We'll email you when your funds are sent to PayPal.";
		},
	},
	methods: {
		async fetchSummaryData() {
			try {
				const response = await this.apollo.query({
					query: withdrawReadModelQuery,
					fetchPolicy: 'network-only',
				});
				this.lenderName = response?.data?.my?.lender?.name ?? '';
				this.lenderImageUrl = response?.data?.my?.lender?.image?.url ?? '';
			} catch (error) {
				logFormatter(`Error fetching withdraw confirm data: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
		async onSubmit() {
			this.submitting = true;
			this.outcome = null;
			this.outcomeMessage = '';
			try {
				const response = await this.apollo.mutate({
					mutation: requestPayPalWithdrawalMutation,
					variables: {
						amount: Number(this.amount),
						paypalEmail: this.paypalEmail,
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
