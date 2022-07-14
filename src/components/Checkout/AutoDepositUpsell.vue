<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
	<div
		v-if="experimentVisible"
		id="auto-deposit-upsell"
		class="tw-py-4 tw-px-2 md:tw-p-4 tw-bg-brand-50 tw-rounded tw-mx-auto tw-mb-8"
		style="max-width: 50rem;"
	>
		<div class="tw-flex tw-mb-4">
			<div class="tw-hidden md:tw-block tw-mr-3">
				<img :src="imageRequire(`./loan-re-cycle.svg`)" alt="loan to loan relending graphic">
			</div>
			<div class="tw-prose">
				<h3>Want to help even more people?</h3>
				<p>
					Do more good by setting aside money each month. It’s easy to set
					up and you get to choose who you help.
					<span class="tw-underline tw-cursor-pointer" @click="showLightbox">Learn more</span>.
				</p>
				<p v-if="adOptIn">
					🎉  We’ll get you set up once you finish checking out!
				</p>
			</div>
		</div>
		<div class="tw-text-right tw-align-bottom">
			<kv-switch class="kv-switch" v-model="adOptIn">
				<span>Activate auto-deposit</span>
			</kv-switch>
		</div>

		<kv-lightbox
			title="How Auto Deposit works"
			:visible="lightboxVisible"
			@lightbox-closed="closeLightbox"
			id="auto-deposit-upsell-lightbox"
		>
			<template #header class="tw-w-full">
				<div class="tw-hidden md:tw-block tw-mr-3 tw-ml-2.5">
					<img
						:src="imageRequire(`./loan-re-cycle.svg`)"
						class="tw-mx-auto"
						alt="loan to loan relending graphic"
					>
				</div>
				<div class="tw-text-center tw-mt-3 tw-mb-2 tw-ml-2.5">
					<h2 class="tw-mb-1">
						How it works
					</h2>
					<p>An easy way to help borrowers who inspire you the most. </p>
				</div>
			</template>
			<div class="tw-flex tw-flex-col md:tw-flex-row md:tw-flex-nowrap md:tw-flex-1">
				<div class="tw-flex tw-mx-auto md:tw-mx-4 tw-mb-3.5 md:tw-mb-2 md:tw-flex-1" style="max-width: 295px;">
					<img
						:src="imageRequire(`./emphasized-arrow.svg`)"
						class="tw-w-5 tw-h-5 tw-mr-1.5"
						alt="Arrow pointer icon"
					>
					<div>
						<h3 class="tw-pb-1">
							Easy
						</h3>
						<p>You choose the frequency, and set the amount.</p>
					</div>
				</div>
				<div class="tw-flex tw-mx-auto md:tw-mx-4 tw-mb-3.5 md:tw-mb-2 md:tw-flex-1" style="max-width: 295px;">
					<img
						:src="imageRequire(`./clock-illustration.svg`)"
						class="tw-w-5 tw-h-5 tw-mr-1.5"
						alt="Clock icon"
					>
					<div>
						<h3 class="tw-pb-1">
							Automatic
						</h3>
						<p>Each month, the amount you’ve set will automatically be added to your Kiva account.</p>
					</div>
				</div>
				<div class="tw-flex tw-mx-auto md:tw-mx-4 tw-mb-3.5 md:tw-mb-2 md:tw-flex-1" style="max-width: 295px;">
					<img
						:src="imageRequire(`./heart-icon-encircled.svg`)"
						class="tw-w-5 tw-h-5 tw-mr-1.5"
						alt="Arrow around a heart icon"
					>
					<div>
						<h3 class="tw-pb-1">
							Impactful
						</h3>
						<p>Once you have enough for a loan, we’ll send you an email reminder to pick a borrower.</p>
					</div>
				</div>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import logReadQueryError from '@/util/logReadQueryError';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvSwitch from '~/@kiva/kv-components/vue/KvSwitch';

const imageRequire = require.context('@/assets/images/kiva-classic-illustrations/', true);

const cookieName = 'kv-show-ad-signup';

const eligibilityCheckQuery = gql`query autoDepositEligibilityQuery {
	general {
		autoDepositUpsellSetting: uiExperimentSetting(key: "checkout_ad_upsell") {
			key
			value
		}
	}
	my {
		userAccount{
			id
		}
		autoDeposit {
			id
			isSubscriber
			isOnetime
		}
		subscriptions {
			values {
				id
			}
		}
	}
	mySubscriptions(includeDisabled: false) {
		values {
			id
			enabled
			category {
				id
				subscriptionType
			}
		}
	}
}`;

export default {
	name: 'AutoDepositUpsell',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvLightbox,
		KvSwitch,
	},
	props: {
		myId: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			autoDepositUpsellExpVersion: null,
			adOptIn: false,
			imageRequire,
			lightboxVisible: false,
			userAccountId: null,
		};
	},
	computed: {
		experimentVisible() {
			if (this.autoDepositUpsellExpVersion === 'b') {
				return true;
			}
			return false;
		},
		userId() {
			if (this.myId !== 0) {
				return this.myId;
			}
			if (this.userAccountId !== null) {
				return this.userAccountId;
			}
			return null;
		}
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: eligibilityCheckQuery
			}).then(({ data }) => {
				const isLoggedIn = data?.my?.userAccountId?.id !== null;
				const hasAutoDeposit = data?.my?.autoDeposit !== null;
				const hasLegacySubs = data?.my?.subscriptions?.values?.length !== 0;
				const hasModernSub = data?.mySubscriptions?.values.length !== 0;
				const upsellEligible = isLoggedIn && !hasAutoDeposit && !hasLegacySubs && !hasModernSub;
				// if eligible run experiment query
				if (upsellEligible) {
					return client.query({ query: experimentAssignmentQuery, variables: { id: 'checkout_ad_upsell' } });
				}
				return upsellEligible;
			}).catch(errorResponse => {
				console.error(errorResponse);
			});
		}
	},
	watch: {
		adOptIn(newVal, oldVal) {
			// stop early if the value has not changed
			if (newVal === oldVal) {
				return;
			}

			// Set cookie for use on Thanks if true
			// -> Cookie will be deleted with first usage to show the the AD upsell on Thanks Page
			if (newVal === true) {
				try {
					this.cookieStore.set(cookieName, true);
				} catch (e) {
					// noop
				}
			}
			// Remove cookie if next is false
			if (newVal === false) {
				this.cookieStore.remove(cookieName);
			}

			this.$kvTrackEvent(
				'Checkout',
				'click-Activate-auto-deposit-toggle',
				newVal === true ? 'Activate auto-deposit' : 'De-Activate auto-deposit',
			);
		},
	},
	methods: {
		closeLightbox() {
			this.lightboxVisible = false;
		},
		showLightbox() {
			this.lightboxVisible = true;
		},
	},
	created() {
		let eligibilityCheck = {};
		try {
			eligibilityCheck = this.apollo.readQuery({
				query: eligibilityCheckQuery,
			});
		} catch (e) {
			logReadQueryError(e, 'Chckout adUpsell');
		}

		const isLoggedIn = eligibilityCheck?.my?.userAccountId?.id !== null;
		const hasAutoDeposit = eligibilityCheck?.my?.autoDeposit !== null;
		const hasLegacySubs = eligibilityCheck?.my?.subscriptions?.values?.length !== 0;
		const hasModernSub = eligibilityCheck?.mySubscriptions?.values.length !== 0;
		const upsellEligible = isLoggedIn && !hasAutoDeposit && !hasLegacySubs && !hasModernSub;

		if (upsellEligible) {
			// CORE-191 Checkout auto deposit upsell experiment
			const autoDepositUpsellExp = this.apollo.readFragment({
				id: 'Experiment:checkout_ad_upsell',
				fragment: experimentVersionFragment,
			}) || {};

			this.autoDepositUpsellExpVersion = autoDepositUpsellExp.version;
			if (this.autoDepositUpsellExpVersion) {
				this.$kvTrackEvent(
					'Checkout',
					'EXP-CORE-191-Jan-2022',
					this.autoDepositUpsellExpVersion,
				);
			}
		}
	},
	mounted() {
		// check for cookie and activate toggle if set to true
		const existingUpsellCookie = this.cookieStore.get(cookieName);
		if (existingUpsellCookie && existingUpsellCookie === 'true') {
			this.adOptIn = Boolean(true);
		}
	}
};
</script>

<style lang="scss">
/* Hack to force centered content of header area */
#auto-deposit-upsell-lightbox div[data-test="kv-lightbox"] > div > div {
	width: 100%;
}
</style>

<style lang="postcss" scoped>
/* Hack to remove spacing from empty div where a label might reside... */
.kv-switch >>> label {
	@apply tw-gap-0;
}
</style>
