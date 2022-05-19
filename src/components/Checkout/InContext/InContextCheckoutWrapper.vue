<template>
	<div>
		<kv-lightbox
			:visible="checkoutVisible"
			@lightbox-closed="checkoutLightboxClosed"
			title="Checkout"
		>
			<template #header>
				{{ null }}
			</template>
			<kv-loading-spinner v-if="loadingCheckout" />
			<in-context-checkout
				v-else-if="!loadingCheckout"
				class="campaign-checkout"
				:is-actively-logged-in="isActivelyLoggedIn"
				:loans="loans"
				:disable-redirects="true"
				:donations="donations"
				:kiva-cards="kivaCards"
				:teams="teams"
				:totals="totals"
				:show-donation="false"
				:auto-redirect-to-thanks="false"
				:promo-fund="null"
				@transaction-complete="transactionComplete"
				@refresh-totals="refreshTotals"
				ref="inContextCheckoutRef"
			/>
		</kv-lightbox>

		<kv-lightbox
			title="Thanks!"
			:visible="showThanks"
			@lightbox-closed="thanksLightboxClosed"
		>
			<template #header>
				{{ null }}
			</template>
			<kv-loading-spinner v-if="loadingThanks" />
			<campaign-thanks
				v-if="transactionId"
				:transaction-id="transactionId"
				:partner-content="null"
			/>
		</kv-lightbox>
	</div>
</template>

<script>
import checkoutSettings from '@/graphql/query/checkout/checkoutSettings.graphql';
import initializeCheckout from '@/graphql/query/checkout/initializeCheckout.graphql';
import setupBasketForUserMutation from '@/graphql/mutation/shopSetupBasketForUser.graphql';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';
import validatePreCheckoutMutation from '@/graphql/mutation/shopValidatePreCheckout.graphql';
import CampaignThanks from '@/components/CorporateCampaign/CampaignThanks';
import InContextCheckout from '@/components/Checkout/InContext/InContextCheckout';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		CampaignThanks,
		InContextCheckout,
		KvLightbox,
		KvLoadingSpinner,
	},
	props: {
		showCheckout: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			activeLoginDuration: 3600,
			checkoutVisible: false,
			checkingOutAsGuest: false,
			currentTime: Date.now(),
			currentTimeInterval: null,
			donations: [],
			hasEverLoggedIn: false,
			isGuestCheckoutEnabled: false,
			kivaCards: [],
			lastActiveLogin: 0,
			loadingCheckout: true,
			loadingThanks: false,
			loans: [],
			myBalance: null,
			myId: null,
			redemption_credits: [],
			showThanks: false,
			teams: [],
			totals: () => {},
			transactionId: null,
		};
	},
	computed: {
		isActivelyLoggedIn() {
			const lastLogin = (parseInt(this.lastActiveLogin, 10)) || 0;
			if (lastLogin + (this.activeLoginDuration * 1000) > this.currentTime) {
				return true;
			}
			return false;
		},
	},
	mounted() {
		// update current time every second for reactivity
		this.currentTimeInterval = setInterval(() => {
			this.currentTime = Date.now();
		}, 1000);

		this.initializeCheckout();
	},
	watch: {
		showCheckout(next) {
			if (next) {
				this.refreshTotals();
				this.checkoutVisible = true;
			}
		}
	},
	methods: {
		checkoutLightboxClosed() {
			// noop
			this.checkoutVisible = false;
		},
		disableGuestCheckout() {
			// noop
		},
		initializeCheckout() {
			this.apollo.query({
				query: initializeCheckout
			}).then(response => {
				console.log(response);
				// using the prefetch function form allows us to act on data before the page loads
				this.apollo.mutate({
					mutation: setupBasketForUserMutation
				}).then(() => {
					return this.apollo.query({ query: checkoutSettings, fetchPolicy: 'network-only' });
				}).then(() => {
					return this.apollo.mutate({ mutation: validatePreCheckoutMutation });
				}).then(() => {
					return this.apollo.query({ query: initializeCheckout, fetchPolicy: 'network-only' });
				})
					.then(({ data }) => {
						console.log(data);
						// Checking if guest checkout feature is enabled in Admin settingsManager
						this.isGuestCheckoutEnabled = data?.general?.guestCheckoutEnabled?.value === 'true';
						// user data
						this.myBalance = data?.my?.userAccount?.balance;
						this.myId = data?.my?.userAccount?.id;
						this.teams = data?.my?.lender?.teams?.values;
						this.lastActiveLogin = data?.my?.lastLoginTimestamp ?? 0;
						this.hasEverLoggedIn = data?.hasEverLoggedIn ?? false;
						// basket data
						this.totals = data?.shop?.basket?.totals ?? {};
						this.loans = data?.shop?.basket?.items?.values.filter(
							// eslint-disable-next-line no-underscore-dangle
							item => item?.__typename === 'LoanReservation'
						);
						this.donations = data?.shop?.basket?.items?.values.filter(
							// eslint-disable-next-line no-underscore-dangle
							item => item?.__typename === 'Donation'
						);
						this.kivaCards = data?.shop?.basket?.items?.values.filter(
							// eslint-disable-next-line no-underscore-dangle
							item => item?.__typename === 'KivaCard'
						);
						this.redemption_credits = data?.shop?.basket?.items?.values.filter(
							// eslint-disable-next-line no-underscore-dangle
							item => item?.__typename === 'Credit' && item?.creditType === 'redemption_code'
						);
						this.hasFreeCredits = data?.shop?.basket?.hasFreeCredits;
						if (this.redemption_credits.length || this.hasFreeCredits !== false) {
							this.disableGuestCheckout();
						}

						// general data
						this.activeLoginDuration = parseInt(data?.general?.activeLoginDuration?.value, 10) || 3600;

						this.loadingCheckout = false;
					});
			});
		},
		refreshTotals(payload) {
			// noop
			console.log('refreshTotals payload', payload);
			// this.initializeCheckout();
			this.apollo.query({ query: shopBasketUpdate, fetchPolicy: 'network-only' });
		},
		thanksLightboxClosed() {
			// noop
		},
		transactionComplete(payload) {
			// noop
			console.log('transactionComplete payload', payload);
			this.transactionId = payload.transactionId;
			this.checkoutVisible = false;
			this.showThanks = true;
		}
	}
};
</script>
