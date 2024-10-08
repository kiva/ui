<template>
	<www-page
		data-testid="thanks-page"
		:class="{
			'tw-bg-eco-green-1 !tw-h-auto': showNewTYPage && !isOnlyDonation,
			'relative-container': badgesCustomExpEnabled
		}"
	>
		<template v-if="isOnlyDonation">
			<thanks-page-donation-only
				:monthly-donation-amount="monthlyDonationAmount"
				:show-daf-thanks="showDafThanks"
			/>
		</template>
		<template v-else-if="badgesCustomExpEnabled">
			<badges-customization
				:selected-loan="selectedLoan"
				:loans="loans"
				:receipt="receipt"
				:lender="lender"
				:is-guest="isGuest"
			/>
		</template>
		<template v-else-if="showNewTYPage">
			<what-is-next-template
				:selected-loan="selectedLoan"
				:loans="loans"
				:receipt="receipt"
				:lender="lender"
				:is-guest="isGuest"
				:opted-in="optedIn"
			/>
		</template>
		<template v-else>
			<div v-if="!showMayChallengeHeader && showChallengeHeader && teamPublicId" class="tw-bg-secondary">
				<challenge-header :goal="goal" :team-public-id="teamPublicId" />
			</div>
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
					</div>
				</div>
				<thanks-layout-v2
					v-if="receipt"
					:show-mg-cta="!isMonthlyGoodSubscriber && !isGuest && !hasModernSub"
					:show-guest-upsell="isGuest"
					:show-share="loans.length > 0"
					:show-receipt="printableKivaCards.length > 0"
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
			<template v-else-if="!receipt">
				<div class="page-content tw-flex tw-flex-col tw-items-center tw-text-center">
					<h2 class="tw-m-4">
						Please log in to see your receipt.
					</h2>
					<kv-button
						:href="`/ui-login?force=true&doneUrl=${
							($route.query.kiva_transaction_id && $route.query.kiva_transaction_id !== null)
								? encodeURIComponent($route.fullPath)
								: encodeURIComponent('/portfolio')
						}`"
					>
						Log in to continue
					</kv-button>
				</div>
			</template>
			<template v-if="showMayChallengeHeader">
				<div
					v-if="loans.length > 0"
					class="hide-for-print tw-text-center tw-bg-eco-green-1 tw-py-1 tw-text-small"
				>
					<template v-if="receipt">
						Thanks for supporting
						<span class="data-hj-suppress">{{ borrowerSupport }}</span>!
						We've emailed your order confirmation to
						<strong v-if="lender.email" class="data-hj-suppress ">{{ lender.email }}.</strong>
						<span v-else>you.</span>
					</template>
					<template v-else>
						Please log in to see your receipt.
						<kv-button
							:href="`/ui-login?force=true&doneUrl=${encodeURIComponent($route.fullPath)}`"
							class="tw-ml-1"
						>
							Log in to continue
						</kv-button>
					</template>
				</div>
				<share-challenge
					v-if="teamPublicId"
					:goal="goal"
					:loan="challengeLoan"
					:team-public-id="teamPublicId"
					:lender="lender"
					:is-guest="isGuest"
					:team-name="teamName"
				/>
			</template>
			<thanks-page-comment-and-share
				v-if="receipt && showFocusedShareAsk"
				:receipt="receipt"
				:lender="lender"
				:loan="selectedLoan"
				:is-guest="isGuest"
				:is-first-loan="showFtdMessage"
				:ftd-credit-amount="ftdCreditAmount"
				@guest-create-account="createGuestAccount"
				:ask-for-comments="askForComments"
			/>
		</template>
	</www-page>
</template>

<script>
import numeral from 'numeral';
import { readBoolSetting } from '#src/util/settingsUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import GuestUpsell from '#src/components/Checkout/GuestUpsell';
import AutoDepositCTA from '#src/components/Checkout/AutoDepositCTA';
import MonthlyGoodCTA from '#src/components/Checkout/MonthlyGoodCTA';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import ThanksLayoutV2 from '#src/components/Thanks/ThanksLayoutV2';
import ThanksPageCommentAndShare from '#src/components/Thanks/ThanksPageCommentAndShare';
import ThanksPageDonationOnly from '#src/components/Thanks/ThanksPageDonationOnly';
import orderBy from 'lodash/orderBy';
import thanksPageQuery from '#src/graphql/query/thanksPage.graphql';
import { processPageContentFlat } from '#src/util/contentfulUtils';
import { userHasLentBefore, userHasDepositBefore } from '#src/util/optimizelyUserMetrics';
import { setHotJarUserAttributes } from '#src/util/hotJarUtils';
import logFormatter from '#src/util/logFormatter';
import { joinArray } from '#src/util/joinArray';
import ChallengeHeader from '#src/components/Thanks/ChallengeHeader';
import ShareChallenge from '#src/components/Thanks/ShareChallenge';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import WhatIsNextTemplate from '#src/components/Thanks/WhatIsNextTemplate';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import BadgesCustomization from '#src/components/Thanks/BadgesCustomization';
import KvButton from '@kiva/kv-components/vue/KvButton';
import { fetchGoals } from '#src/util/teamsUtil';
import teamsGoalsQuery from '#src/graphql/query/teamsGoals.graphql';

const hasLentBeforeCookie = 'kvu_lb';
const hasDepositBeforeCookie = 'kvu_db';
const CHALLENGE_HEADER_EXP = 'filters_challenge_header';
const THANKS_BADGES_EXP = 'thanks_badges';

const getLoans = receipt => {
	const loansResponse = receipt?.items?.values ?? [];
	const loans = loansResponse
		.filter(item => item.basketItemType === 'loan_reservation')
		.map(item => {
			return {
				...item.loan,
				team: item.team,
			};
		});

	return loans;
};

const getTeamId = loans => {
	const teamsIds = loans.filter(loan => !!loan?.team?.id)
		.map(loan => loan.team.id) ?? [];
	return teamsIds?.[0] ?? null;
};

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
		ThanksPageDonationOnly,
		ChallengeHeader,
		ShareChallenge,
		WhatIsNextTemplate,
		BadgesCustomization,
	},
	inject: ['apollo', 'cookieStore'],
	head() {
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
			jumpToGuestUpsell: false,
			monthlyDonationAmount: '',
			isFirstLoan: false,
			isFtdMessageEnable: false,
			ftdCreditAmount: '',
			goal: null,
			showChallengeHeader: false,
			enableMayChallengeHeader: false,
			optedIn: false,
			badgesCustomExpEnabled: false,
		};
	},
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
			const currentRoute = route.value ?? route ?? {};
			const transactionId = currentRoute.query?.kiva_transaction_id
				? numeral(currentRoute.query.kiva_transaction_id).value()
				: null;

			// Check if transactionId is null, resolve the promise if missing
			if (!transactionId) {
				logFormatter(
					'Thanks page preFetch skipped due to missing transaction_id.',
					'warning',
				);
				return Promise.resolve();
			}

			return client.query({
				query: thanksPageQuery,
				variables: {
					checkoutId: transactionId,
					visitorId: cookieStore.get('uiv') || null,
				}
			}).then(({ data }) => {
				// Get teamId from receipt
				let teamId = null;
				const receipt = data?.shop?.receipt ?? null;
				const loans = getLoans(receipt);
				teamId = getTeamId(loans);

				const filters = {
					teamId,
				};
				const limit = 1;

				return Promise.all([
					client.query({ query: experimentAssignmentQuery, variables: { id: 'share_ask_copy' } }),
					teamId ? fetchGoals(client, limit, filters) : null,
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
		showDafThanks() {
			return !!this.$route?.query?.show_daf_thanks;
		},
		isOnlyDonation() {
			return this.showDafThanks
				|| (this.receipt && this.receipt?.totals?.itemTotal === this.receipt?.totals?.donationTotal)
				|| this.monthlyDonationAmount?.length;
		},
		askForComments() {
			// comments ask should be displayed for logged in users
			// checking out with a PFP loan or a loan that is attributed to a team.
			return this.hasPfpLoan || this.hasTeamAttributedPartnerLoan;
		},
		selectedLoan() {
			/**  We should select a loan if we are going to ask for comments for it.
			* The priority order is:
			* 1. PFP loan
			* 2. Partner loan With Team Attribution
			* 3. Loan with the highest unreservedAmount
			* loans should be sorted by unreservedAmount.
			*/
			const orderedLoans = orderBy(this.loans, ['unreservedAmount'], ['desc']);
			if (this.hasPfpLoan) {
				return orderedLoans.find(loan => loan.inPfp);
			}
			if (this.hasTeamAttributedPartnerLoan) {
				return orderedLoans.find(loan => loan?.team?.name);
			}
			return orderedLoans[0] || {};
		},
		hasPfpLoan() {
			return this.loans.some(loan => loan.inPfp);
		},
		hasTeamAttributedPartnerLoan() {
			return this.loans.some(loan => loan?.distributionModel === 'fieldPartner' && loan?.team?.name);
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
			// if jumpToGuestUpsell is true or there's print-it-yourself card don't show focused share ask;
			if (this.jumpToGuestUpsell || this.printableKivaCards.length) {
				return false;
			}
			// Only show focused share ask for non-guest loan purchases or for only US loan purchases from guests
			return (this.selectedLoan.id && !this.isGuest) || this.isGuestUsCheckout;
		},
		isGuestUsCheckout() {
			// Is a guest checking out only with US loans?
			// eslint-disable-next-line no-underscore-dangle
			return this.isGuest && this.loans.every(loan => loan?.__typename === 'LoanDirect');
		},
		showFtdMessage() {
			return this.isFirstLoan && this.isFtdMessageEnable && this.ftdCreditAmount;
		},
		teamId() {
			return getTeamId(this.loans);
		},
		teamPublicId() {
			return this.loans?.[0]?.team?.teamPublicId;
		},
		challengeLoan() {
			return (this.loans?.filter(l => l?.team?.id === this.goal?.teamId) ?? [])?.[0];
		},
		showMayChallengeHeader() {
			return this.challengeLoan && this.enableMayChallengeHeader;
		},
		teamName() {
			return this.loans?.[0]?.team?.name ?? '';
		},
		landedOnUSLoan() {
			const bpPattern = /^\/lend\/(\d+)/;

			if (bpPattern.test(this.$appConfig.firstPage)) {
				const url = this.$appConfig.firstPage?.split('/');
				const firstVisitloanId = url?.[2] ?? null;
				const landedLoan = this.loans.find(loan => loan.id === Number(firstVisitloanId));
				return landedLoan?.geocode?.country?.isoCode === 'US';
			}
			return false;
		},
		showNewTYPage() {
			return !this.landedOnUSLoan && !this.optedIn && this.loans.length > 0;
		},
		receiptValues() {
			return this.receipt?.items?.values ?? [];
		},
		kivaCards() {
			if (!this.receiptValues.length) return [];
			return this.receipt.items.values.filter(item => item.basketItemType === 'kiva_card');
		},
		printableKivaCards() {
			if (!this.kivaCards.length) return [];
			return this.kivaCards.filter(card => card.kivaCardObject.deliveryType === 'print');
		},
	},
	created() {
		// Retrieve and apply Page level data + experiment state
		let data = {};
		const transactionId = this.$route.query?.kiva_transaction_id
			? numeral(this.$route.query?.kiva_transaction_id).value()
			: null;

		// Check if transactionId is null, exit if missing
		if (!transactionId) {
			logFormatter(
				'Thanks page readQuery skipped due to missing transaction_id.',
				'warning',
			);
			return false;
		}

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
			imageUrl: data?.my?.lender?.image?.url ?? '',
			publicId: data?.my?.lender?.publicId ?? '',
		};

		this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;

		// The default empty object and the v-if will prevent the
		// receipt from rendering in the rare cases this query fails.
		// But it will not throw a server error.
		this.receipt = data?.shop?.receipt ?? null;
		this.isGuest = this.receipt && !data?.my?.userAccount;

		// Enable FTDs message from settings
		this.isFtdMessageEnable = readBoolSetting(data, 'general.ftd_message_enable.value');
		// Credit amount for FTD message from settings
		const ftdCreditAmountData = data?.general?.ftd_message_amount ?? null;
		this.ftdCreditAmount = ftdCreditAmountData ? ftdCreditAmountData.value : '';

		this.loans = getLoans(this.receipt);

		// Fetch Goal Information
		try {
			if (this.teamId) {
				const filters = {
					teamId: this.teamId,
				};
				const limit = 1;

				const response = this.apollo.readQuery({
					query: teamsGoalsQuery,
					variables: { ...filters, limit },
				});

				this.goal = response.goals?.values.length ? response?.goals?.values[0] : null;

				const loansIds = this.loans.map(loan => loan.id) ?? [];
				this.showChallengeHeader = this.goal && this.goal?.targets?.values
					.findIndex(target => loansIds.includes(target.loanId)) !== -1;
			}
		} catch (e) {
			logReadQueryError(e, `Teams Goal readQuery failed: (team_id: ${this.teamId})`);
		}

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
		this.isFirstLoan = isFirstLoan;
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

		// Check for May challenge header experiment
		const shareChallengeExpData = this.apollo.readFragment({
			id: `Experiment:${CHALLENGE_HEADER_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};
		this.enableMayChallengeHeader = shareChallengeExpData?.version === 'b';

		this.optedIn = data?.my?.communicationSettings?.lenderNews || this.$route.query?.optedIn === 'true';
		// Thanks Badges Experiment
		const enableExperiment = this.optedIn && !this.printableKivaCards.length && (isFirstLoan || this.isGuest);
		if (enableExperiment) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'thanks',
				THANKS_BADGES_EXP,
				'EXP-MP-608-Aug2024',
			);
			if (version === 'b') {
				this.badgesCustomExpEnabled = true;
			}
		}
	},
	methods: {
		createGuestAccount() {
			// This is the only place this variable should be set.
			// When this is true, it will override all logic and show the thanks page v2
			this.jumpToGuestUpsell = true;
		},
	}
};

</script>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';

.page-content {
	padding: 1.625rem 0 0;

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

<style lang="postcss" scoped>

.relative-container >>> main {
	@apply tw-relative;
}

</style>
