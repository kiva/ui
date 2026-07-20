<template>
	<PortfolioShell>
		<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3">
			<h1 class="tw-mb-1">
				Add credit
			</h1>

			<!-- Loading -->
			<KvLoadingPlaceholder
				v-if="loading"
				style="height: 120px;"
			/>

			<!-- Error loading the read model -->
			<div v-else-if="loadError" data-testid="deposit-load-error">
				<p>An error occurred. Please try again.</p>
				<KvButton
					class="tw-mt-2"
					@click="fetchDepositData"
					v-kv-track-event="['portfolio', 'click', 'Deposit retry load']"
				>
					Try again
				</KvButton>
			</div>

			<!-- Not an existing lender (canDeposit === false) -->
			<div v-else-if="!canDeposit" data-testid="deposit-forbidden">
				<p>
					Add Credit is only available to existing lenders who have already made a loan.
					Please make a loan and checkout in order to deposit to Kiva.
				</p>
				<KvButton
					:to="LEND_ROUTE"
					class="tw-mt-2"
					v-kv-track-event="['portfolio', 'click', 'Deposit not eligible lend']"
				>
					Find a borrower to support
				</KvButton>
			</div>

			<!-- Thanks (successful deposit) -->
			<div v-else-if="depositComplete" data-testid="deposit-thanks">
				<h2 class="tw-text-title tw-mb-1">
					Thanks for adding to your Kiva account!
				</h2>
				<p>
					We're currently processing your deposit and you should see
					<router-link
						to="/portfolio"
						class="tw-no-underline"
						v-kv-track-event="['portfolio', 'click', 'Deposit thanks to portfolio']"
					>
						your portfolio
					</router-link>
					balance update by
					<strong class="tw-text-eco-green" data-testid="deposit-amount-paid">
						{{ numeral(depositedAmount).format('$0,0.00') }}
					</strong> momentarily.
				</p>
			</div>

			<!-- Add-credit form -->
			<template v-else>
				<p>
					Add funds to your Kiva balance, making it easier to lend when you find borrowers
					you want to support.
				</p>

				<div class="tw-mt-3 tw-mb-2">
					<p class="tw-text-small tw-text-tertiary tw-font-medium tw-text-upper">
						Current Kiva balance
					</p>
					<p class="tw-text-headline tw-text-eco-green" data-testid="deposit-current-balance">
						{{ numeral(currentBalance).format('$0,0.00') }}
					</p>
				</div>

				<div class="tw-mb-2" @focusin="trackAmountFocus">
					<label for="deposit-amount" class="tw-block tw-font-medium tw-mb-0.5">
						Amount to deposit
					</label>
					<KvCurrencyInput
						id="deposit-amount"
						class="tw-w-full md:tw-w-1/2"
						:model-value="amount"
						:disabled="processing"
						clear-zero-on-focus
						@input="onAmountInput"
					/>
					<ul v-if="v$.amount.$error" class="tw-text-danger tw-text-small tw-mt-0.5">
						<li v-for="error in v$.amount.$errors" :key="error.$uid">
							{{ error.$message }}
						</li>
					</ul>
				</div>

				<p class="tw-mb-2">
					<router-link
						:to="AUTO_DEPOSIT_ROUTE"
						class="tw-no-underline"
						v-kv-track-event="['portfolio', 'click', 'Deposit make monthly deposit']"
					>
						Make a monthly deposit
					</router-link>
				</p>

				<DepositDropInPaymentWrapper
					:amount="amount"
					:disabled="v$.$invalid"
					@processing="processing = $event"
					@complete-transaction="onDepositComplete"
				/>
			</template>
		</div>
	</PortfolioShell>
</template>

<script>
import numeral from 'numeral';
import { useVuelidate } from '@vuelidate/core';
import {
	required, minValue, maxValue, helpers,
} from '@vuelidate/validators';
import { KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';
import DepositDropInPaymentWrapper from '#src/components/Deposit/DepositDropInPaymentWrapper';
import logFormatter from '#src/util/logFormatter';
import depositReadModelQuery from '#src/graphql/query/deposit/depositReadModel.graphql';
import {
	DEPOSIT_MIN_AMOUNT,
	DEPOSIT_MAX_AMOUNT,
	AUTO_DEPOSIT_ROUTE,
	LEND_ROUTE,
} from '#src/util/deposit/depositConstants';

export default {
	name: 'DepositPage',
	components: {
		PortfolioShell,
		KvButton,
		KvLoadingPlaceholder,
		KvCurrencyInput,
		DepositDropInPaymentWrapper,
	},
	inject: ['apollo'],
	setup() {
		return { v$: useVuelidate() };
	},
	data() {
		return {
			numeral,
			AUTO_DEPOSIT_ROUTE,
			LEND_ROUTE,
			loading: true,
			loadError: false,
			canDeposit: false,
			currentBalance: 0,
			maxDepositAmount: DEPOSIT_MAX_AMOUNT,
			amount: 0,
			processing: false,
			depositComplete: false,
			depositedAmount: 0,
		};
	},
	validations() {
		return {
			amount: {
				required: helpers.withMessage('Please enter a valid amount in USD.', required),
				minValue: helpers.withMessage(
					'Please enter a valid amount in USD.',
					minValue(DEPOSIT_MIN_AMOUNT),
				),
				maxValue: helpers.withMessage(
					'Deposits must be a valid amount in USD and are limited to '
						+ `${numeral(this.maxDepositAmount).format('$0,0')}. `
						+ "If you'd like to add more, please do so in separate deposits.",
					maxValue(this.maxDepositAmount),
				),
			},
		};
	},
	methods: {
		async fetchDepositData() {
			this.loading = true;
			this.loadError = false;
			try {
				const response = await this.apollo.query({
					query: depositReadModelQuery,
					fetchPolicy: 'network-only',
				});
				const userAccount = response?.data?.my?.userAccount;
				const deposit = userAccount?.deposit;
				if (!deposit) {
					this.loadError = true;
					return;
				}
				this.canDeposit = deposit.canDeposit;
				this.currentBalance = userAccount.balance ?? 0;
				this.maxDepositAmount = deposit.maxDepositAmount ?? DEPOSIT_MAX_AMOUNT;
			} catch (error) {
				this.loadError = true;
				logFormatter(`Error fetching deposit data: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
		onAmountInput(value) {
			this.amount = value;
			this.v$.amount.$touch();
		},
		trackAmountFocus() {
			this.$kvTrackEvent('portfolio', 'click', 'Deposit amount field');
		},
		onDepositComplete({ amount }) {
			// Use the amount the wrapper actually charged (snapshotted at submit), not the live input.
			this.depositedAmount = amount;
			this.depositComplete = true;
		},
	},
	mounted() {
		this.fetchDepositData();
	},
};
</script>
