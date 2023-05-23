<template>
	<www-page data-testid="thanks-page">
		<template v-if="isOnlyDonation">
			<thanks-page-donation-only
				:monthly-donation-amount="monthlyDonationAmount"
				:share-ask-copy-version="shareAskCopyVersion"
			/>
		</template>
		<template v-else>
			<div class="row page-content" v-if="receipt && !showFocusedShareAsk">
				<div class="small-12 columns thanks">
					<div class="thanks__header hide-for-print">
						<template v-if="receipt">
							<h1
								class="tw-mt-1 tw-mb-3"
							>
								Thank you!
							</h1>
							<p
								v-if="loans.length > 0"
								class="thanks__header-subhead tw-text-subhead tw-mb-2"
								data-testid="thanks-message"
							>
								Thanks for supporting
								<span class="data-hj-suppress">{{ borrowerSupport }}</span>.<br>
							</p>
							<p v-if="lender.email" class="hide-for-print">
								We've emailed your order confirmation to
								<strong class="data-hj-suppress ">{{ lender.email }}</strong>
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
					:show-mg-cta="!isMonthlyGoodSubscriber && !isGuest && !hasModernSub"
					:show-guest-upsell="isGuest"
					:show-share="loans.length > 0"
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
						/>
					</template>
					<template #guest>
						<guest-upsell
							:loans="loans"
						/>
					</template>
				</thanks-layout-v2>
			</div>
			<thanks-page-comment-and-share
				v-if="receipt && showFocusedShareAsk"
				:receipt="receipt"
				:lender="lender"
				:loan="selectedLoan"
				:share-ask-copy-version="shareAskCopyVersion"
				:is-guest="isGuest"
				@guest-create-account="createGuestAccount"
				:ask-for-comments="askForComments"
			/>
		</template>
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
import ThanksPageCommentAndShare from '@/components/Thanks/ThanksPageCommentAndShare';
import ThanksPageDonationOnly from '@/components/Thanks/ThanksPageDonationOnly';
import orderBy from 'lodash/orderBy';
import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { userHasLentBefore, userHasDepositBefore } from '@/util/optimizelyUserMetrics';
import { setHotJarUserAttributes } from '@/util/hotJarUtils';
import logFormatter from '@/util/logFormatter';
import { joinArray } from '@/util/joinArray';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

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
		ThanksPageCommentAndShare,
		ThanksPageDonationOnly
	},
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		return {
			title: 'Thank you!'
		};
	},
	data() {
		return {
			lender: {},
			loans: [],
			receipt: null,
			isMonthlyGoodSubscriber: false,
			hasModernSub: false,
			isGuest: false,
			pageData: {},
			shareAskCopyVersion: '',
			jumpToGuestUpsell: false,
			monthlyDonationAmount: ''
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
			}).then(() => {
				return Promise.all([
					client.query({ query: experimentAssignmentQuery, variables: { id: 'share_ask_copy' } }),
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
		isOnlyDonation() {
			return (this.receipt && this.receipt?.totals?.itemTotal === this.receipt?.totals?.donationTotal)
				|| this.monthlyDonationAmount?.length;
		},
		askForComments() {
			// comments ask should be displayed for logged in users checking out with a PFP loan.
			return this.hasPfpLoan && !this.isGuest;
		},
		selectedLoan() {
			// The selected loan should be any PFP loans, or if there are no PFP loans,
			// the first loan of loans sorted by unreservedAmount
			const orderedLoans = orderBy(this.loans, ['unreservedAmount'], ['desc']);
			if (this.hasPfpLoan) {
				return orderedLoans.find(loan => loan.inPfp);
			}
			return orderedLoans[0] || {};
		},
		hasPfpLoan() {
			return this.loans.some(loan => loan.inPfp);
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
		showFocusedShareAsk() {
			// if jumpToGuestUpsell is true, don't show focused share ask;
			if (this.jumpToGuestUpsell) {
				return false;
			}
			// Only show focused share ask for non-guest loan purchases or for only US loan purchases from guests
			return (this.selectedLoan.id && !this.isGuest) || this.isGuestUsCheckout;
		},
		isGuestUsCheckout() {
			// Is a guest checking out only with US loans?
			// eslint-disable-next-line no-underscore-dangle
			return this.isGuest && this.loans.every(loan => loan?.__typename === 'LoanDirect');
		}
	},
	created() {
		// Retrieve and apply Page level data + experiment state
		let data = {};
		const transactionId = this.$route.query?.kiva_transaction_id
			? numeral(this.$route.query?.kiva_transaction_id).value()
			: null;
		this.monthlyDonationAmount = this.$route.query?.monthly_donation_amount ?? null;

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
			publicName: data?.my?.lender?.name ?? '',
			teams: data?.my?.teams?.values?.map(value => value.team) ?? [],
		};

		this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;

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

		const totalLoans = data?.my?.loans?.totalCount ?? 0;
		const isFirstLoan = this.loans.length && totalLoans === this.loans.length;
		const hasDirectLoan = this.loans.findIndex(loan => loan.distributionModel === 'direct') > -1;
		const hasCoreLoan = this.loans.findIndex(loan => loan.distributionModel === 'fieldPartner') > -1;

		// MARS-246 Hotjar user attributes
		setHotJarUserAttributes({
			userId: data?.my?.userAccountId?.id,
			hasEverLoggedIn,
			hasLentBefore,
			hasDepositBefore,
			isFirstLoan,
			hasDirectLoan,
			hasCoreLoan
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
		const pageEntry = data?.contentful?.entries?.items?.[0] ?? null;
		this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;

		if (this.showFocusedShareAsk) {
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
		}
	},
	methods: {
		createGuestAccount() {
			// This is the only place this variable should be set.
			// When this is true, it will override all logic and show the thanks page v2
			this.jumpToGuestUpsell = true;
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
