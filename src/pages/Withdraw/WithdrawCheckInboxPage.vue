<template>
	<PortfolioShell>
		<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3" data-testid="withdraw-check-inbox">
			<h1 class="tw-text-headline tw-mb-1">
				Check your inbox
			</h1>
			<p>
				For security purposes, we've sent an email
				<template v-if="email">
					to <span class="tw-font-medium data-hj-suppress">{{ email }}</span>
				</template>
				with a link to confirm your withdrawal request.
			</p>
			<p class="tw-mt-1">
				You'll need to click the confirmation link in this email in order for your withdrawal to be
				submitted and your funds sent to PayPal.
			</p>
			<p class="tw-mt-1">
				If you have any questions, please
				<a
					href="/help/contact-us"
					class="tw-no-underline"
					v-kv-track-event="['portfolio', 'click', 'Withdraw check inbox contact us']"
				>contact us</a>.
			</p>
			<KvButton
				to="/portfolio"
				class="tw-mt-2"
				v-kv-track-event="['portfolio', 'click', 'Withdraw check inbox back to portfolio']"
			>
				Back to My Portfolio
			</KvButton>
		</div>
	</PortfolioShell>
</template>

<script>
import { KvButton } from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import { WITHDRAW_STATE_KEY } from '#src/util/withdraw/withdrawConstants';

export default {
	name: 'WithdrawCheckInboxPage',
	components: {
		PortfolioShell,
		KvButton,
	},
	data() {
		return {
			// Read from history state (set by WithdrawConfirmPage) to keep PII out of the URL.
			email: '',
		};
	},
	mounted() {
		this.email = window.history.state?.[WITHDRAW_STATE_KEY.EMAIL] || '';
	},
};
</script>
