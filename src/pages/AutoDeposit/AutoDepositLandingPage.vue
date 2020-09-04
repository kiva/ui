<template>
	<www-page>
		<!-- Auto Deposit Text -->
		<div class="auto-deposit-setup">
			<div class="row">
				<div class="small-12 columns">
					<h2 class="impact-text">
						Set up an Auto Deposit
					</h2>
				</div>
				<div class="small-12 large-8 columns">
					<p class="auto-deposit-setup__subhead">
						<!-- eslint-disable-next-line max-len -->
						Automatically add money to your Kiva account every month so it'll be available for you to lend to the borrowers that inspire you the most.
					</p>
				</div>
			</div>
		</div>

		<!-- Auto Deposit Form -->
		<div class="auto-deposit-form" v-if="canDisplayForm">
			<div class="row column">
				<auto-deposit-sign-up-form />
			</div>
		</div>

		<!-- Already Subscribed Notice -->
		<div class="row" v-if="hasAutoDeposits || hasLegacySubscription">
			<div class="small-12 large-6 columns">
				<div class="already-subscribed-msg-wrapper">
					<h3>
						You already have an existing auto deposit.
						Changes can be made in your
						<a href="/settings/subscriptions">subscription settings</a>.
					</h3>
				</div>
			</div>
		</div>

		<!-- Monthly Good Notice -->
		<div class="row" v-if="isMonthlyGoodSubscriber">
			<div class="small-12 large-6 columns">
				<div class="already-subscribed-msg-wrapper">
					<h3>
						Auto Deposit is not available to Monthly Good subscribers.
						Changes can be made in your
						<a href="/settings/subscriptions">subscription settings</a>.
					</h3>
				</div>
			</div>
		</div>

		<!-- Auto Deposit What To Expect -->
		<div class="auto-deposit-what-to-expect">
			<div class="row">
				<h2 class="column small-12 text-center">
					What to expect with Auto Deposit
				</h2>

				<div class="small-12 large-4 column text-center">
					<icon-auto-deposit-alternate class="auto-deposit-what-to-expect__icon" />
					<h3>Never Forget</h3>
					<div class="auto-deposit-what-to-expect__text">
						<!-- eslint-disable-next-line max-len -->
						<p>You choose the frequency, then don't have to think about it. Money is automatically added to your account and available for you to lend.</p>
					</div>
				</div>
				<div class="small-12 large-4 column text-center">
					<icon-lend class="auto-deposit-what-to-expect__icon" />
					<h3>Achieve Your Goals</h3>
					<div class="auto-deposit-what-to-expect__text">
						<!-- eslint-disable-next-line max-len -->
						<p>Whether you want to make a loan every month or a hundred loans in a lifetime, auto deposit makes it easy to have that impact.</p>
					</div>
				</div>
				<div class="small-12 large-4 column text-center">
					<icon-updates-alternate class="auto-deposit-what-to-expect__icon" />
					<h3>Regular Updates</h3>
					<div class="auto-deposit-what-to-expect__text">
						<!-- eslint-disable-next-line max-len -->
						<p>We'll email after each deposit is made, with a reminder to lend those funds (or turn on auto lending and have it lent automatically).</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Auto Deposit Frequently Asked Questions -->
		<frequently-asked-questions />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import WwwPage from '@/components/WwwFrame/WwwPage';
import FrequentlyAskedQuestions from '@/components/AutoDeposit/FrequentlyAskedQuestions';
import AutoDepositSignUpForm from '@/components/AutoDeposit/AutoDepositSignUpForm';

import IconAutoDepositAlternate from '@/assets/icons/inline/auto-deposit-alternate.svg';
import IconLend from '@/assets/icons/inline/lend.svg';
import IconUpdatesAlternate from '@/assets/icons/inline/updates-alternate.svg';

const pageQuery = gql`query autoDepositLandingPage {
	my {
		subscriptions {
			values {
				subscrId
			}
		}
		autoDeposit {
			isSubscriber
		}
	}
}`;

export default {
	metaInfo: {
		title: 'Auto Deposit',
	},
	components: {
		AutoDepositSignUpForm,
		FrequentlyAskedQuestions,
		IconAutoDepositAlternate,
		IconLend,
		IconUpdatesAlternate,
		WwwPage,
	},
	data() {
		return {
			isMonthlyGoodSubscriber: false,
			hasAutoDeposits: false,
			hasLegacySubscription: false,
		};
	},
	inject: ['apollo'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			this.hasAutoDeposits = !!_get(data, 'my.autoDeposit') && !this.isMonthlyGoodSubscriber;
			const legacySubs = _get(data, 'my.subscriptions.values', []);
			this.hasLegacySubscription = legacySubs.length > 0;
		},
	},
	computed: {
		canDisplayForm() {
			return !this.isMonthlyGoodSubscriber && !this.hasAutoDeposits && !this.hasLegacySubscription;
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.auto-deposit-setup {
	padding: 4rem 0 0;

	h2 {
		margin-bottom: 3rem;
	}

	&__subhead {
		@include medium-text();

		@include breakpoint(xlarge) {
			@include featured-text();
		}
	}
}

.auto-deposit-what-to-expect {
	background-color: $ghost;
	margin: 2rem 0 3rem;
	padding: 1rem 0 3.5rem;

	h2 {
		color: $kiva-green;
		padding: 2rem 0;
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	h3 {
		color: $kiva-green;
		margin-bottom: 1rem;
		font-weight: bold;

		@include breakpoint(large) {
			@include featured-text();
		}
	}

	&__text {
		margin: 0 auto;
		line-height: 1.4;
		p { margin: 1em 0; }
	}

	&__icon {
		fill: $white;
		width: 4.5rem;
		display: block;
		margin: 0 auto 1rem auto;
		color: $kiva-green;
	}
}

.already-subscribed-msg-wrapper {
	background-color: $vivid-yellow;
	padding: 1rem;
	margin-top: 1.25rem;
}
</style>
