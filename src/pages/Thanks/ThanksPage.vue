<template>
	<www-page
		:gray-background="true"
	>
		<div class="row page-content" v-if="receipt && !showFocusedShareAsk">
			<div class="small-12 columns thanks">
				<div class="thanks__header hide-for-print">
					<template v-if="receipt">
						<div
							v-if="!isAutoDepositSubscriber && showAutoDepositUpsell"
							class="thanks_header-image tw-hidden md:tw-block tw-mb-3"
						>
							<img :src="imageRequire(`./high-five.svg`)" class="tw-mx-auto" alt="high fiving hands">
						</div>
						<h1
							class="thanks__header-h1 tw-mt-1 tw-mb-3"
							:class="{
								'tw-text-h2': showAutoDepositUpsell
							}"
						>
							Thank you!
						</h1>
						<p
							v-if="loans.length > 0"
							class="thanks__header-subhead"
							:class="{
								'tw-text-base tw-mb-0': showAutoDepositUpsell,
								'tw-text-subhead tw-mb-2': !showAutoDepositUpsell
							}"
						>
							Thanks for supporting <span class="fs-mask">{{ borrowerSupport }}</span>.<br>
						</p>
						<p v-if="lender.email" class="hide-for-print">
							We've emailed your order confirmation to
							<strong class="fs-exclude">{{ lender.email }}</strong>
						</p>
						<p v-else class="hide-for-print">
							We've emailed your order confirmation to you.
						</p>
					</template>

					<template v-else>
						<h1 class="tw-mb-4">
							Please log in to see your receipt.
						</h1>
						<kv-button
							:href="`/ui-login?force=true&doneUrl=${encodeURIComponent(this.$route.fullPath)}`"
						>
							Log in to continue
						</kv-button>
					</template>
				</div>
			</div>
			<thanks-layout-v2
				v-if="receipt"
				:show-mg-cta="!isMonthlyGoodSubscriber && !isGuest && !showAutoDepositUpsell && !hasModernSub"
				:show-auto-deposit-upsell="!isAutoDepositSubscriber && showAutoDepositUpsell && !hasModernSub"
				:show-guest-upsell="isGuest"
				:show-share="loans.length > 0"
				:thanks-social-share-version="simpleSocialShareVersion"
				:class="{
					'tw-mt-4': showAutoDepositUpsell
				}"
			>
				<template #receipt>
					<checkout-receipt
						v-if="receipt"
						:lender="lender"
						:receipt="receipt"
					/>
				</template>
				<template #ad>
					<auto-deposit-c-t-a />
				</template>
				<template #mg>
					<monthly-good-c-t-a
						:headline="ctaHeadline"
						:body-copy="ctaBodyCopy"
						:button-text="ctaButtonText"
					/>
				</template>
				<template #share>
					<social-share-v2
						v-if="receipt"
						class="thanks__social-share"
						:lender="lender"
						:loans="loans"
						:share-card-language-version="shareCardLanguageVersion"
					/>
				</template>
				<template #guest>
					<guest-upsell
						:loans="loans"
					/>
				</template>
			</thanks-layout-v2>
		</div>
		<thanks-page-share
			v-if="receipt && showFocusedShareAsk"
			:receipt="receipt"
			:lender="lender"
			:loan="selectedLoan"
			:simple-social-share-version="simpleSocialShareVersion"
			:share-card-language-version="shareCardLanguageVersion"
			:share-ask-copy-version="shareAskCopyVersion"
			:category-share-version="categoryShareVersion"
		/>
	</www-page>
</template>

<script>
import numeral from 'numeral';
import logReadQueryError from '@/util/logReadQueryError';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import GuestUpsell from '@/components/Checkout/GuestUpsell';
import AutoDepositCTA from '@/components/Checkout/AutoDepositCTA';
import MonthlyGoodCTA from '@/components/Checkout/MonthlyGoodCTA';
import SocialShareV2 from '@/components/Checkout/SocialShareV2';
import WwwPage from '@/components/WwwFrame/WwwPage';
import ThanksLayoutV2 from '@/components/Thanks/ThanksLayoutV2';
import ThanksPageShare from '@/components/Thanks/ThanksPageShare';
import orderBy from 'lodash/orderBy';
import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { userHasLentBefore, userHasDepositBefore } from '@/util/optimizelyUserMetrics';
import setHotJarUserAttributes from '@/util/hotJarUserAttributes';
import logFormatter from '@/util/logFormatter';
import { joinArray } from '@/util/joinArray';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const imageRequire = require.context('@/assets/images/kiva-classic-illustrations/', true);

const hasLentBeforeCookie = 'kvu_lb';
const hasDepositBeforeCookie = 'kvu_db';

export default {
	name: 'ThanksPage',
	components: {
		AutoDepositCTA,
		CheckoutReceipt,
		GuestUpsell,
		KvButton,
		MonthlyGoodCTA,
		SocialShareV2,
		ThanksLayoutV2,
		WwwPage,
		ThanksPageShare
	},
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		return {
			title: 'Thank you!'
		};
	},
	data() {
		return {
			autoDepositUpsellCookie: null,
			autoDepositUpsellExpVersion: null,
			imageRequire,
			lender: {},
			loans: [],
			receipt: null,
			isAutoDepositSubscriber: false,
			isMonthlyGoodSubscriber: false,
			hasModernSub: false,
			isGuest: false,
			pageData: {},
			shareCardLanguageVersion: '',
			simpleSocialShareVersion: '',
			shareAskCopyVersion: '',
			categoryShareVersion: '',
		};
	},
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
			const transactionId = route.query?.kiva_transaction_id
				? numeral(route.query?.kiva_transaction_id).value()
				: null;

			return client.query({
				query: thanksPageQuery,
				variables: {
					checkoutId: transactionId,
					visitorId: cookieStore.get('uiv') || null,
				}
			}).then(({ data }) => {
				const isLoggedIn = data?.my?.userAccountId?.id !== null;
				const hasAutoDeposit = data?.my?.autoDeposit !== null;
				const hasLegacySubs = data?.my?.subscriptions?.values?.length !== 0;
				const modernSubscriptions = data?.mySubscriptions?.values ?? [];
				const hasModernSub = modernSubscriptions.length !== 0;
				const upsellEligible = isLoggedIn && !hasAutoDeposit && !hasLegacySubs && !hasModernSub;

				return Promise.all([
					client.query({ query: experimentAssignmentQuery, variables: { id: 'thanks_share_module' } }),
					client.query({ query: experimentAssignmentQuery, variables: { id: 'share_card_language' } }),
					client.query({ query: experimentAssignmentQuery, variables: { id: 'share_ask_copy' } }),
					upsellEligible ? client.query({ query: experimentAssignmentQuery, variables: { id: 'thanks_ad_upsell' } }) : Promise.resolve() // eslint-disable-line max-len
				]);
			}).catch(errorResponse => {
				logFormatter(
					`Thanks page preFetch failed: (transaction_id: ${transactionId})`,
					'error',
					{ errorResponse }
				);
			});
		}
	},
	computed: {
		selectedLoan() {
			if (this.categoryShareVersion === 'a' || this.categoryShareVersion === 'b') {
				const loans = [...this.loans];
				loans.sort((a, b) => {
					const aSector = a?.sector?.name?.toLowerCase();
					const bSector = b?.sector?.name?.toLowerCase();
					if (a?.gender?.toLowerCase() === 'female') return -1;
					if (b?.gender?.toLowerCase() === 'female') return 1;
					if (aSector === 'education') return -1;
					if (bSector === 'education') return 1;
					if (aSector === 'agriculture') return -1;
					if (bSector === 'agriculture') return 1;
					return 0;
				});

				const firstLoan = loans[0];
				if (firstLoan?.gender === 'female'
					|| ['agriculture', 'education'].includes(firstLoan?.sector?.name.toLowerCase())) {
					return firstLoan;
				}
			}
			const orderedLoans = orderBy(this.loans, ['unreservedAmount'], ['desc']);
			return orderedLoans[0] || {};
		},
		borrowerSupport() {
			const loanNames = this.loans.map(loan => loan.name);
			if (loanNames.length > 3) {
				return `these ${loanNames.length} borrowers`;
			}
			return joinArray(loanNames, 'and');
		},
		ctaContentGroup() {
			return this.pageData?.page?.contentGroups?.thanksMgCtaJan_2021;
		},
		ctaContentBlock() {
			// eslint-disable-next-line max-len
			return this.ctaContentGroup?.contents?.find(contentItem => contentItem.key === 'thanks-mg-cta');
		},
		ctaHeadline() {
			return this.ctaContentBlock?.headline;
		},
		ctaBodyCopy() {
			return this.ctaContentBlock?.subHeadline;
		},
		ctaButtonText() {
			return this.ctaContentBlock?.primaryCtaText;
		},
		showAutoDepositUpsell() {
			// Check cookie and eligibility before showing
			if (!this.isGuest && this.autoDepositUpsellExpVersion === 'b') {
				return true;
			}
			return false;
		},
		showFocusedShareAsk() {
			// Only show focused share ask for non-guest loan purchases
			return !this.isGuest && this.selectedLoan.id;
		}
	},
	created() {
		// Retrieve and apply Page level data + experiment state
		let data = {};
		const transactionId = this.$route.query?.kiva_transaction_id
			? numeral(this.$route.query?.kiva_transaction_id).value()
			: null;
		try {
			data = this.apollo.readQuery({
				query: thanksPageQuery,
				variables: {
					checkoutId: transactionId,
					visitorId: this.cookieStore.get('uiv') || null,
				}
			});
		} catch (e) {
			logReadQueryError(e, `Thanks page readQuery failed: (transaction_id: ${transactionId})`);
		}

		const hasEverLoggedIn = data?.hasEverLoggedIn;
		const modernSubscriptions = data?.mySubscriptions?.values ?? [];
		this.hasModernSub = modernSubscriptions.length !== 0;
		this.lender = {
			...(data?.my?.userAccount ?? {}),
			teams: data?.my?.teams?.values?.map(value => value.team) ?? [],
		};

		this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
		const hasAutoDeposit = data?.my?.autoDeposit?.id ?? false;
		this.isAutoDepositSubscriber = !!(hasAutoDeposit && !this.isMonthlyGoodSubscriber);

		const isLoggedIn = data?.my?.userAccountId?.id !== null;
		const hasLegacySubs = data?.my?.subscriptions?.values?.length !== 0;
		const upsellEligible = isLoggedIn && !hasAutoDeposit && !hasLegacySubs && !this.hasModernSub;

		// The default empty object and the v-if will prevent the
		// receipt from rendering in the rare cases this query fails.
		// But it will not throw a server error.
		this.receipt = data?.shop?.receipt ?? null;
		this.isGuest = this.receipt && !data?.my?.userAccount;

		const loansResponse = this.receipt?.items?.values ?? [];
		this.loans = loansResponse
			.filter(item => item.basketItemType === 'loan_reservation')
			.map(item => item.loan);

		// MARS-194-User metrics A/B Optimizely experiment
		const depositTotal = this.receipt?.totals?.depositTotals?.depositTotal;

		const hasLentBefore = this.loans.length > 0;
		const hasDepositBefore = parseFloat(depositTotal) > 0;

		this.cookieStore.set(hasLentBeforeCookie, hasLentBefore, { path: '/' });
		this.cookieStore.set(hasDepositBeforeCookie, hasDepositBefore, { path: '/' });

		userHasLentBefore(hasLentBefore);
		userHasDepositBefore(hasDepositBefore);

		// MARS-246 Hotjar user attributes
		setHotJarUserAttributes({
			userId: data?.my?.userAccountId?.id,
			hasEverLoggedIn,
			hasLentBefore,
			hasDepositBefore,
		});

		if (!this.isGuest && !data?.my?.userAccount) {
			logFormatter(
				`Failed to get lender for transaction id: ${transactionId}`,
				'info',
				{ data }
			);
		}
		if (!this.receipt) {
			logFormatter(
				`Failed to get receipt for transaction id: ${transactionId}`,
				'info',
				{ data }
			);
		}

		// Check for contentful content
		const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
		this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;

		// Check for upsell eligibility and experiment state
		if (upsellEligible) {
			// CORE-427 Thanks auto deposit upsell experiment
			const autoDepositUpsellExp = this.apollo.readFragment({
				id: 'Experiment:thanks_ad_upsell',
				fragment: experimentVersionFragment,
			}) || {};

			this.autoDepositUpsellExpVersion = autoDepositUpsellExp.version;
			if (this.autoDepositUpsellExpVersion) {
				this.$kvTrackEvent(
					'Thanks',
					'EXP-CORE-427-Feb-2022',
					this.autoDepositUpsellExpVersion,
				);
			}
		}

		if (this.showFocusedShareAsk) {
			const shareCardLanguage = this.apollo.readFragment({
				id: 'Experiment:share_card_language',
				fragment: experimentVersionFragment,
			}) || {};

			this.shareCardLanguageVersion = shareCardLanguage.version;
			if (this.shareCardLanguageVersion) {
				this.$kvTrackEvent(
					'Thanks',
					'EXP-MARS-143-Jul2022-inviter',
					this.shareCardLanguageVersion,
				);
			}

			// MARS-202 Share copy ask experiment
			const shareAskCopyResult = this.apollo.readFragment({
				id: 'Experiment:share_ask_copy',
				fragment: experimentVersionFragment,
			}) || {};

			this.shareAskCopyVersion = shareAskCopyResult.version;
			if (this.shareAskCopyVersion) {
				this.$kvTrackEvent(
					'Thanks',
					'EXP-MARS-202-Aug2022',
					this.shareAskCopyVersion,
				);
			}

			// MARS-310 Category Share on Thanks page
			const categoryShareResult = this.apollo.readFragment({
				id: 'Experiment:category_share',
				fragment: experimentVersionFragment,
			}) || {};

			this.categoryShareVersion = categoryShareResult?.version;
			if (this.categoryShareVersion && (this.selectedLoan?.gender?.toLowerCase() === 'female'
				|| ['women', 'education', 'agriculture'].includes(this.selectedLoan?.sector?.name?.toLowerCase()))) {
				this.$kvTrackEvent(
					'Thanks',
					'EXP-MARS-310-Nov2022',
					this.categoryShareVersion,
				);
			}
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0 0 0;

	@media print {
		padding: 0;
	}

	&:last-child {
		padding-bottom: 5rem;
	}
}

.thanks {
	&__header {
		text-align: left;
		margin-bottom: 2.5rem;

		@include breakpoint(medium) {
			text-align: center;
		}
	}

	&__social-share {
		margin-bottom: 0.5rem;
	}
}
</style>
