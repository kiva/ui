<template>
	<PortfolioShell>
		<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3">
			<!-- Processing the token -->
			<div v-if="processing" class="tw-text-center tw-py-4" data-testid="withdraw-authorize-processing">
				<KvLoadingSpinner class="tw-m-auto" />
				<p class="tw-mt-2">
					Confirming your withdrawal request…
				</p>
			</div>

			<!-- Success -->
			<div v-else-if="outcome === withdrawalStatus.SUCCESS" data-testid="withdraw-authorize-success">
				<h1 class="tw-text-headline tw-mb-1">
					Withdrawal confirmed
				</h1>
				<p>
					You're now authorized to withdraw funds to your PayPal account.
					Your withdrawal request has been received. We'll email you when your
					funds are sent to PayPal.
				</p>
				<KvButton
					to="/portfolio"
					class="tw-mt-2"
					v-kv-track-event="['portfolio', 'click', 'Withdraw authorized back to portfolio']"
				>
					Back to My Portfolio
				</KvButton>
			</div>

			<!-- Error / expired token -->
			<div v-else data-testid="withdraw-authorize-error">
				<h1 class="tw-text-headline tw-mb-1">
					Authorization link invalid
				</h1>
				<p>{{ errorMessage }}</p>
				<KvButton
					:to="withdrawRoute.BASE"
					class="tw-mt-2"
					v-kv-track-event="['portfolio', 'click', 'Withdraw authorize retry']"
				>
					Start a new withdrawal
				</KvButton>
			</div>
		</div>
	</PortfolioShell>
</template>

<script>
import { KvButton, KvLoadingSpinner } from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import logFormatter from '#src/util/logFormatter';
import authorizePayPalWithdrawalMutation from '#src/graphql/mutation/withdraw/authorizePayPalWithdrawal.graphql';
import { WITHDRAWAL_STATUS, WITHDRAW_ROUTE } from '#src/util/withdraw/withdrawConstants';

const DEFAULT_ERROR = 'Your authorization link is invalid or has expired. '
	+ 'Please submit a new withdrawal request.';

export default {
	name: 'WithdrawAuthorizePage',
	components: {
		PortfolioShell,
		KvButton,
		KvLoadingSpinner,
	},
	inject: ['apollo'],
	props: {
		token: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			withdrawalStatus: WITHDRAWAL_STATUS,
			withdrawRoute: WITHDRAW_ROUTE,
			processing: true,
			outcome: null,
			errorMessage: DEFAULT_ERROR,
		};
	},
	methods: {
		async authorize() {
			if (!this.token) {
				this.outcome = WITHDRAWAL_STATUS.ERROR;
				this.errorMessage = DEFAULT_ERROR;
				this.processing = false;
				return;
			}
			try {
				const response = await this.apollo.mutate({
					mutation: authorizePayPalWithdrawalMutation,
					variables: { token: this.token },
				});
				const result = response?.data?.my?.authorizePayPalWithdrawal;
				if (result?.status === WITHDRAWAL_STATUS.SUCCESS) {
					this.outcome = WITHDRAWAL_STATUS.SUCCESS;
				} else {
					this.outcome = WITHDRAWAL_STATUS.ERROR;
					this.errorMessage = result?.message || DEFAULT_ERROR;
				}
			} catch (error) {
				this.outcome = WITHDRAWAL_STATUS.ERROR;
				this.errorMessage = DEFAULT_ERROR;
				logFormatter(`Error authorizing withdrawal: ${error}`, 'error');
			} finally {
				this.processing = false;
			}
		},
	},
	mounted() {
		this.authorize();
	},
};
</script>
