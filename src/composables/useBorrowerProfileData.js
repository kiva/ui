import { ref, computed } from 'vue';
import logFormatter from '#src/util/logFormatter';
import { watchLoanData } from '#src/util/loanUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import borrowerProfileSideSheetQuery from '#src/graphql/query/borrowerProfileSideSheet.graphql';

/**
 * Vue composable for loading borrower profile data
 *
 * @param {Object} apolloClient - Apollo Client instance
 * @param {Object} cookieStore - Cookie store instance
 * @returns Badge data and utilities
 */
export default function useBorrowerProfileData(apolloClient, cookieStore) {
	if (!apolloClient) throw new Error('ApolloClient is required');
	if (!cookieStore) throw new Error('CookieStore is required');

	const bpData = ref();
	const achievementsData = ref();
	const currentLoanId = ref(null);
	const subscription = ref();

	// Loading state and computed properties
	const loading = computed(() => !bpData.value);

	const isGuest = computed(() => !bpData.value?.my);
	const loan = computed(() => bpData.value?.lend?.loan);
	const loanId = computed(() => loan.value?.id ?? 0);

	const anonymizationLevel = computed(() => loan.value?.anonymizationLevel ?? '');
	const borrowerCount = computed(() => loan.value?.borrowerCount ?? 0);
	const borrowers = computed(() => loan.value?.borrowers ?? null);
	const businessName = computed(() => (loan.value && 'businessName' in loan.value ? loan.value.businessName : ''));
	const country = computed(() => loan.value?.geocode?.country?.name ?? '');
	const description = computed(() => loan.value?.description ?? '');
	const descriptionInOriginalLanguage = computed(() => loan.value?.descriptionInOriginalLanguage ?? '');
	const hash = computed(() => loan.value?.image?.hash ?? '');
	const loanGeocode = computed(() => loan.value?.geocode ?? null);
	const loanPartner = computed(() => (loan.value && 'partner' in loan.value ? loan.value.partner : null));
	const loanStatus = computed(() => loan.value?.status ?? '');
	const loanTrustee = computed(() => (loan.value && 'trustee' in loan.value ? loan.value.trustee : null));
	const loanUse = computed(() => loan.value?.use ?? '');
	const loanWhySpecial = computed(() => loan.value?.whySpecial ?? '');
	const name = computed(() => loan.value?.name ?? '');
	const originalLanguage = computed(() => loan.value?.originalLanguage ?? null);
	const partnerName = computed(() => (loan.value && 'partnerName' in loan.value ? loan.value.partnerName : ''));
	const previousLoanId = computed(() => loan.value?.previousLoanId ?? 0);
	const reviewer = computed(() => (loan.value && 'reviewer' in loan.value ? loan.value.reviewer : null));
	const userBalance = computed(() => bpData.value?.my?.userAccount?.balance);
	const userProperties = computed(() => loan.value?.userProperties ?? null);
	const video = computed(() => loan.value?.video ?? null);
	const businessDescription = computed(() => (
		loan.value && 'businessDescription' in loan.value ? loan.value.businessDescription : ''
	));
	const dualStatementNote = computed(() => (
		loan.value && 'dualStatementNote' in loan.value ? loan.value.dualStatementNote : ''
	));
	const moreInfoAboutLoan = computed(() => (
		loan.value && 'moreInfoAboutLoan' in loan.value ? loan.value.moreInfoAboutLoan : ''
	));
	const purpose = computed(() => (loan.value && 'purpose' in loan.value ? loan.value.purpose : ''));
	const sector = computed(() => loan.value?.sector ?? null);
	const yearsInBusiness = computed(() => (
		loan.value && 'yearsInBusiness' in loan.value ? loan.value.yearsInBusiness : ''
	));
	const socialLinks = computed(() => (loan.value && 'socialLinks' in loan.value ? loan.value.socialLinks : null));

	const unreservedAmount = computed(() => loan.value?.unreservedAmount);
	const fundraisingPercent = computed(() => loan.value?.fundraisingPercent ?? 0);
	const timeLeft = computed(() => loan.value?.fundraisingTimeLeft ?? '');

	const comments = computed(() => loan.value?.comments?.values ?? []);
	const disbursalDate = computed(() => loan.value?.disbursalDate ?? '');
	const endorsement = computed(() => (loan.value && 'endorsement' in loan.value ? loan.value.endorsement : ''));
	const inPfp = computed(() => loan.value?.inPfp ?? false);
	const lenderCount = computed(() => loan.value?.lenders?.totalCount);
	const lenders = computed(() => loan.value?.lenders ?? null);
	const loanAmount = computed(() => loan.value?.loanAmount || 0);
	const loanLenderRepaymentTerm = computed(() => loan.value?.lenderRepaymentTerm ?? 0);
	const loanTermLenderRepaymentTerm = computed(() => loan.value?.terms?.lenderRepaymentTerm ?? 0);
	const paidAmount = computed(() => loan.value?.paidAmount || 0);
	const pfpMinLenders = computed(() => loan.value?.pfpMinLenders ?? 0);
	const repaymentInterval = computed(() => loan.value?.repaymentInterval ?? '');
	const teamCount = computed(() => loan.value?.teams?.totalCount);
	const terms = computed(() => loan.value?.terms ?? null);

	const loadBPData = loanDataId => {
		if (!loanDataId || typeof loanDataId !== 'number') return;
		// Store the current loan ID for filtering
		currentLoanId.value = loanDataId;
		try {
			// Watch borrower profile side sheet query
			const watchedQuery = watchLoanData({
				apollo: apolloClient,
				cookieStore,
				loanId: loanDataId,
				loanQuery: borrowerProfileSideSheetQuery,
				callback: result => {
					if (!result.error) {
						bpData.value = result.data;
					}
				},
			});
			subscription.value = watchedQuery.subscription;
			// Query post-checkout achievements
			apolloClient.query({
				query: postCheckoutAchievementsQuery,
				variables: { loanIds: [loanDataId] },
			}).then(result => {
				achievementsData.value = result;
			});
		} catch (e) {
			subscription.value?.unsubscribe();
			logFormatter(e, 'error');
		}
	};

	const clearBPData = () => {
		subscription.value?.unsubscribe();
		bpData.value = undefined;
		achievementsData.value = undefined;
		currentLoanId.value = null;
	};

	return {
		achievementsData,
		anonymizationLevel,
		borrowerCount,
		borrowers,
		businessDescription,
		businessName,
		clearBPData,
		comments,
		country,
		description,
		descriptionInOriginalLanguage,
		disbursalDate,
		dualStatementNote,
		endorsement,
		fundraisingPercent,
		hash,
		inPfp,
		isGuest,
		lenderCount,
		lenders,
		loadBPData,
		loading,
		loan,
		loanAmount,
		loanGeocode,
		loanId,
		loanLenderRepaymentTerm,
		loanPartner,
		loanStatus,
		loanTermLenderRepaymentTerm,
		loanTrustee,
		loanUse,
		loanWhySpecial,
		moreInfoAboutLoan,
		name,
		originalLanguage,
		paidAmount,
		partnerName,
		pfpMinLenders,
		previousLoanId,
		purpose,
		repaymentInterval,
		reviewer,
		sector,
		socialLinks,
		teamCount,
		terms,
		timeLeft,
		unreservedAmount,
		userBalance,
		userProperties,
		video,
		yearsInBusiness,
	};
}
