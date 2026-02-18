<template>
	<aside class="credit-settings-sidebar tw-bg-primary tw-p-3">
		<div class="tw-flex tw-items-baseline tw-gap-1">
			<kv-loading-placeholder v-if="loading" style="width: 72px; height: 32px;" />
			<p v-else class="tw-text-h1 tw-text-action tw-mb-0">
				{{ $filters.numeral(availableBalance, '$0,0.00') }}
			</p>
		</div>

		<p class="tw-text-small tw-text-secondary tw-mt-0.5 tw-mb-2">
			AVAILABLE KIVA CREDIT
		</p>

		<nav class="tw-flex tw-flex-wrap tw-gap-1 tw-text-small">
			<router-link
				class="tw-text-link tw-font-medium"
				to="/portfolio/credit/deposit"
				@click="$kvTrackEvent('user-settings', 'click', 'add-credit')"
			>
				Add credit
			</router-link>
			<span class="tw-text-secondary">|</span>
			<router-link
				class="tw-text-link tw-font-medium"
				to="/donate/emailprocess"
				@click="$kvTrackEvent('user-settings', 'click', 'donate')"
			>
				Donate
			</router-link>
			<span class="tw-text-secondary">|</span>
			<router-link
				class="tw-text-link tw-font-medium"
				to="/gifts/kiva-cards"
				@click="$kvTrackEvent('user-settings', 'click', 'kiva-gifts')"
			>
				Kiva gifts
			</router-link>
			<span class="tw-text-secondary">|</span>
			<router-link
				class="tw-text-link tw-font-medium"
				to="/withdraw"
				@click="$kvTrackEvent('user-settings', 'click', 'withdraw')"
			>
				Withdraw
			</router-link>
		</nav>

		<hr class="tw-my-3 tw-border-secondary">

		<h3 class="tw-text-h4 tw-mb-1">
			Important note:
		</h3>
		<p class="tw-text-small tw-text-secondary tw-mb-2">
			If you haven’t set an inactivity preference or don’t provide a valid PayPal account,
			Kiva may be required to send your funds to a state government if your account becomes inactive.
			<button
				type="button"
				class="tw-text-link tw-font-medium tw-bg-transparent tw-border-0 tw-p-0"
				@click="
					$kvTrackEvent('user-settings', 'click', 'learn-more');
					showLearnMoreFaq = true
				"
			>
				Learn more
			</button>
		</p>

		<h3 class="tw-text-h4 tw-mb-1">
			FAQ
		</h3>
		<ul class="tw-text-small tw-mb-0">
			<li v-for="faq in faqItems" :key="faq.key">
				<button
					type="button"
					class="tw-text-link tw-font-medium tw-bg-transparent tw-border-0 tw-p-0"
					@click="
						$kvTrackEvent('user-settings', 'click', faq.value);
						openFaq(faq.key)
					"
				>
					{{ faq.label }}
				</button>
			</li>
		</ul>

		<kv-lightbox
			:visible="showDonationsFaq"
			title="How does Kiva use donations?"
			@lightbox-closed="
				$kvTrackEvent('user-settings', 'click', 'donations');
				closeFaq('showDonationsFaq')
			"
		>
			<div class="tw-space-y-3">
				<p>
					100% of every dollar you lend on Kiva goes directly to funding loans. We rely on small optional
					donations from you and others to keep Kiva running.
				</p>
				<p>
					Every $1 donated to Kiva makes $8 in loans possible around the world. Your donation will enable us
					to:
				</p>
				<ul class="tw-list-disc tw-pl-5 tw-space-y-1">
					<li>Send expert staff to over 60 countries to vet and monitor loans and partners.</li>
					<li>Build and maintain a website that facilitates over $1 million in loans each week.</li>
					<li>Provide comprehensive customer support to thousands of lenders worldwide.</li>
					<li>Train and support hundreds of volunteers -- 4 for every 1 staff member at Kiva.</li>
				</ul>
				<p>
					If you live in the United States, your donation is tax-deductible. Thank you for considering a
					donation to Kiva.
				</p>
			</div>
		</kv-lightbox>

		<kv-lightbox
			:visible="showLearnMoreFaq"
			title="Inactive credit and abandoned property laws"
			@lightbox-closed="
				$kvTrackEvent('user-settings', 'click', 'learn-more');
				closeFaq('showLearnMoreFaq')
			"
		>
			<div class="tw-space-y-3">
				<p>
					Organizations like Kiva are required by many state governments to turn over unclaimed property to
					the state for safekeeping after several years.
				</p>
				<p>
					If your account becomes inactive, Kiva will need instructions for what to do with any funds left in
					your account.
				</p>
				<p>
					Kiva accounts are considered inactive for purposes of unclaimed property laws if they have no
					activity for 24 consecutive months.
				</p>
				<p>
					“Activity” includes things like logins, loan purchases (even via autolending), repayments, and
					withdrawals.
				</p>
				<p>
					If you haven’t selected an option in your account settings for inactivity, or if you have asked us
					to return your remaining credit to you but you haven’t provided a valid PayPal account for
					withdrawals, Kiva will send your funds to your home state for safekeeping (or to the state of
					California if we do not know your location).
				</p>
			</div>
		</kv-lightbox>

		<kv-lightbox
			:visible="showInactiveWithdrawalFaq"
			title="What is inactive withdrawal?"
			@lightbox-closed="
				$kvTrackEvent('user-settings', 'click', 'inactive-withdrawal');
				closeFaq('showInactiveWithdrawalFaq')
			"
		>
			<div class="tw-space-y-3">
				<p>
					If your account becomes inactive, you can choose to have Kiva send your remaining Kiva credit to a
					PayPal account of your choosing. Just select “Return my Kiva credit to my PayPal account” and enter
					the email address you use on PayPal.
				</p>
				<p class="tw-font-medium">
					Remember, there are other options for your credit if your account becomes inactive:
				</p>
				<ul class="tw-list-disc tw-pl-5 tw-space-y-1">
					<li>You can automatically make a donation to Kiva’s operating expenses.</li>
					<li>
						You can enable auto lending.
						<a
							class="tw-text-link tw-font-medium"
							href="/settings/autolending"
							@click="
								$kvTrackEvent('user-settings', 'click', 'auto-lending-settings')
							"
						>
							Click here
						</a>
						to change your auto lending settings.
					</li>
				</ul>
				<p>
					If we are unable to send Kiva credit to your PayPal account (i.e. we have the wrong email address),
					automatic withdrawal may not be available to you. If you have questions about this, please contact
					Kiva’s Community Support team.
				</p>
			</div>
		</kv-lightbox>

		<kv-lightbox
			:visible="showAutoLendingFaq"
			title="How does auto-lending work?"
			@lightbox-closed="
				$kvTrackEvent('user-settings', 'click', 'auto-lending');
				closeFaq('showAutoLendingFaq')
			"
		>
			<div class="tw-space-y-3">
				<p>
					Kiva’s auto-lending tool enables you to make sure your funds are always active, even if you can’t
					make a loan yourself. Lenders can customize the feature so that auto-lending happens automatically
					after repayments reach $25, or lenders can set a window of time (up to 4 months) to make a loan
					manually before auto-lending takes effect.
				</p>
				<p>
					Auto-loan categories, as well as other details, can also be customized to match your lending
					preferences. Please note that the system gives precedence to active lending. The amount of loans
					being made through auto-lending depends on the supply of fundraising loans and demand from other
					lenders choosing loans manually. This also means that for popular or very specific kinds of loans,
					there's a chance those loans will be fully funded before auto-lending kicks in.
				</p>
				<p>
					Take this into account when customizing your loan preferences - if your criteria are too narrow, we
					may not be able to lend your funds.
				</p>
			</div>
		</kv-lightbox>

		<kv-lightbox
			:visible="showAutoDepositsFaq"
			title="Auto Deposits"
			@lightbox-closed="
				$kvTrackEvent('user-settings', 'click', 'auto-deposits');
				closeFaq('showAutoDepositsFaq')
			"
		>
			<div class="tw-space-y-3">
				<p>
					An auto deposit allows you to automatically add money to your Kiva account every month via PayPal,
					making it easier for you to lend to the borrowers that inspire you the most. When you set up an
					auto deposit you also have the option to make an automatic donation to Kiva with each new
					contribution.
				</p>
			</div>
		</kv-lightbox>
	</aside>
</template>

<script>
import { KvLightbox, KvLoadingPlaceholder } from '@kiva/kv-components';

const FAQ_ITEMS = [
	{ key: 'showDonationsFaq', label: 'How does Kiva use donations?', value: 'donations' },
	{ key: 'showInactiveWithdrawalFaq', label: 'What is inactive withdrawal?', value: 'inactive-withdrawal' },
	{ key: 'showAutoLendingFaq', label: 'What is auto lending?', value: 'auto-lending' },
	{ key: 'showAutoDepositsFaq', label: 'What are auto deposits?', value: 'auto-deposits' },
];

export default {
	name: 'CreditSettingsSidebar',
	components: { KvLightbox, KvLoadingPlaceholder },
	props: {
		balance: {
			type: Number,
			default: 0,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		promoBalance: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			showAutoDepositsFaq: false,
			showAutoLendingFaq: false,
			showDonationsFaq: false,
			showInactiveWithdrawalFaq: false,
			showLearnMoreFaq: false,
		};
	},
	computed: {
		availableBalance() {
			return (this.balance || 0) + (this.promoBalance || 0);
		},
		faqItems() {
			return FAQ_ITEMS;
		},
	},
	methods: {
		openFaq(key) {
			this[key] = true;
		},
		closeFaq(key) {
			this[key] = false;
		},
	},
};
</script>
