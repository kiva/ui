<template>
	<www-page
		id="borrower-profile"
		:data-testid="loanType"
	>
		<full-borrower-profile
			v-if="showFullView"
			:loan="loan"
			:lender="lender"
			:loading="isLoading"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:show-education-placement-exp="showEducationPlacementExp"
			:loan-region="loanRegion"
			:initial-show-details-in-rail="initialShowDetailsInRail"
		/>
		<article v-else>
			<minimal-borrower-profile
				:loan="loan"
				:items-in-basket="itemsInBasket"
				:inviter-name="inviterName"
			/>
		</article>
		<!-- <aside>Similar loans</aside> -->
	</www-page>
</template>

<script>
import { computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { gql } from 'graphql-tag';
import hasEverLoggedInQuery from '#src/graphql/query/shared/hasEverLoggedIn.graphql';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '#src/plugins/five-dollars-test-mixin';
import guestComment from '#src/plugins/guest-comment-mixin';
import {
	trackExperimentVersion
} from '#src/util/experiment/experimentUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MinimalBorrowerProfile, { minimalProfileQuery } from '#src/components/BorrowerProfile/MinimalBorrowerProfile';
import FullBorrowerProfile, { fullProfileQuery } from '#src/components/BorrowerProfile/FullBorrowerProfile';
import { shareButtonFragment } from '#src/components/BorrowerProfile/ShareButton';
import { fireHotJarEvent } from '#src/util/hotJarUtils';
import { readAccountRailPreference, resolveRailPreference } from '#src/util/loanDetailsRailPreference';
import { isPublicLoanStatus, showFullView } from '#src/util/loanUtils';
import {
	NEW_USER_BP_EXP_KEY,
	NEW_USER_BP_EXP_EVENT_ACTION,
	NEW_USER_BP_EXP_INJECT_KEY,
	isNewUserBpExpEligible,
	readNewUserBpExpVersion,
} from '#src/util/newUserBorrowerProfileExp';
import { getKivaImageUrl } from '@kiva/kv-components';

const getPublicId = route => route?.query?.utm_content ?? route?.query?.name ?? route?.query?.lender ?? '';

const EDUCATION_PLACEMENT_EXP = 'education_placement_bp';

// Fields for showFullView routing logic
const routingFragment = gql`fragment bpRoutingFields on LoanBasic {
	id
	status
	loanAmount
	loanFundraisingInfo {
		id
		fundedAmount
		reservedAmount
	}
	unreservedAmount @client
	userProperties {
		isPrivileged
	}
}`;

// Fields for head() meta tags, OG/Twitter share, and page title
const shareMetaFragment = gql`
	${shareButtonFragment}
	fragment bpShareMetaFields on LoanBasic {
		id
		use
		borrowerCount
		fullLoanUse @client
		plannedExpirationDate
		lenders {
			totalCount
		}
		image {
			id
			hash
		}
		geocode {
			city
			country {
				id
				name
				isoCode
				region
			}
		}
		... on LoanDirect {
			businessName
		}
		...shareButtonFields
	}
`;

// Phase 1: routing decision + share meta + basket
const routingQuery = gql`
	${routingFragment}
	${shareMetaFragment}
	query borrowerProfileRouting(
		$loanId: Int!,
		$publicId: String!,
		$getInviter: Boolean!,
		$basketId: String,
		$imgDefaultSize: String = "w480h360",
		$imgRetinaSize: String = "w960h720"
	) {
		lend {
			loan(id: $loanId) {
				id
				...bpRoutingFields
				...bpShareMetaFields
				image {
					id
					default: url(customSize: $imgDefaultSize)
					retina: url(customSize: $imgRetinaSize)
					hash
				}
			}
		}
		community @include(if: $getInviter) {
			lender(publicId: $publicId) {
				id
				name
			}
		}
		my {
			id
			userAccount {
				id
				volunteerId
			}
		}
		shop(basketId: $basketId) {
			id
			basket {
				id
				items {
					values {
						id
					}
				}
			}
		}
	}
`;

const mountedQuery = gql`
	query borrowerProfileMeta {
		my {
			id
			userAccount {
				id
				inviterName
				public
			}
		}
	}
`;

export default {
	name: 'BorrowerProfile',
	inject: ['apollo', 'cookieStore'],
	components: {
		FullBorrowerProfile,
		MinimalBorrowerProfile,
		WwwPage,
	},
	provide() {
		return {
			// 'a', 'b', or null when the visitor isn't in the experiment
			[NEW_USER_BP_EXP_INJECT_KEY]: computed(() => this.newUserBpExpVersion),
		};
	},
	head() {
		const title = this.routingLoan?.anonymizationLevel === 'full' ? undefined : this.pageTitle;
		const description = this.routingLoan?.anonymizationLevel === 'full' ? undefined : this.pageDescription;
		const isSclePresent = this.$route.query?.utm_campaign?.includes('scle');

		return {
			title,
			meta: [
				{ property: 'og:title', vmid: 'og:title', content: this.shareTitle },
				{ property: 'og:description', vmid: 'og:description', content: this.shareDescription },
				{ property: 'og:type', vmid: 'og:type', content: 'kivadotorg:loan' },
				{
					property: 'og:image',
					vmid: 'og:image',
					content: this.imageShareUrl
				},
				{
					vmid: 'description',
					name: 'description',
					content: description,
				}
			].concat(this.$appConfig.enableFB ? [
				{
					vmid: 'facebook_label',
					name: 'facebook_label',
					content: this.facebookPageLabel
				},
			] : []).concat([
				// Twitter Tags
				{ name: 'twitter:title', vmid: 'twitter:title', content: this.shareTitle },
				{
					name: 'twitter:image',
					vmid: 'twitter:image',
					content: this.imageShareUrl
				},
				{
					name: 'twitter:label1',
					vmid: 'twitter:label1',
					content: 'Supporters'
				},
				{
					name: 'twitter:data1',
					vmid: 'twitter:data1',
					content: this.numLenders
				},
				{
					name: 'twitter:label2',
					vmid: 'twitter:label2',
					content: 'End Date'
				},
				{
					name: 'twitter:data2',
					vmid: 'twitter:data2',
					content: this.endDate
				},
				{
					name: 'twitter:description',
					vmid: 'twitter:description',
					content: this.shareDescription
				},
			]).concat(isSclePresent ? [
				{
					vmid: 'robots',
					name: 'robots',
					content: 'noindex',
				},
			] : []),
			link: (isSclePresent ? [
				{
					vmid: 'canonical',
					rel: 'canonical',
					href: `https://${this.$appConfig.host}${this.$route.fullPath}`,
				},
			] : []),
		};
	},
	data() {
		return {
			loan: {},
			routingLoan: {},
			lender: {},
			isVolunteer: false,
			// SSR-resolved rail preference (logged-in only); reconciled client-side in the component.
			initialShowDetailsInRail: false,
			inviterName: '',
			inviterIsGuestOrAnonymous: false,
			itemsInBasket: [],
			isLoading: true,
			// Experiment state
			newUserBpExpVersion: null,
			newUserBpExpTrackedLoanId: null,
			isMounted: false,
			regionBelongsToExp: false,
			showEducationPlacementExp: false,
			loanRegion: '',
			expRegionList: [
				'North America',
				'Central America',
				'South America',
				'Africa',
				'Asia',
				'Europe'
			],
		};
	},
	mixins: [fiveDollarsTest, guestComment],
	apollo: {
		query: routingQuery,
		preFetch(_config, client, { route, cookieStore, kvAuth0 }) {
			const loanId = Number(route?.params?.id ?? 0);
			const publicId = getPublicId(route);

			const variables = {
				loanId,
				publicId,
				getInviter: !!publicId,
				basketId: cookieStore?.get('kvbskt'),
			};

			return Promise.all([
				client.query({ query: routingQuery, variables }),
				client.query({ query: hasEverLoggedInQuery }),
			])
				.then(([{ data }, { data: hasEverLoggedInData }]) => {
					const loan = data?.lend?.loan;
					if (!loan) {
						return Promise.reject({ path: '/lend', query: route.query });
					}

					// Routing decision
					const unreservedAmount = Number(loan.unreservedAmount ?? 0);
					const isPrivileged = loan.userProperties?.isPrivileged ?? false;
					const isVolunteer = !!data?.my?.userAccount?.volunteerId;

					// Anon goes to login (so a lender/trustee can authenticate in); logged-in non-priv goes to /lend.
					if (!isPublicLoanStatus(loan.status) && !isPrivileged && !isVolunteer) {
						if (!kvAuth0?.getKivaId()) {
							return Promise.reject({
								path: '/ui-login',
								query: { doneUrl: route.fullPath },
							});
						}
						return Promise.reject({ path: '/lend', query: route.query });
					}

					const isFullView = showFullView(
						loan.status,
						unreservedAmount,
						isPrivileged,
						isVolunteer,
						route.query,
					);
					const childQuery = isFullView ? fullProfileQuery : minimalProfileQuery;

					// Only assign the new user experiment to visitors in it, so everyone else has no version
					const isNewUserBpExp = isNewUserBpExpEligible({
						loanStatus: loan.status,
						isFullView,
						isLoggedIn: !!kvAuth0?.getKivaId() || !!data?.my?.id,
						hasEverLoggedIn: hasEverLoggedInData?.hasEverLoggedIn,
						cookieStore,
					});

					return Promise.all([
						...(isNewUserBpExp ? [client.query({
							query: experimentAssignmentQuery,
							variables: { id: NEW_USER_BP_EXP_KEY },
						})] : []),
						client.query({
							query: experimentAssignmentQuery,
							variables: { id: FIVE_DOLLARS_NOTES_EXP },
						}),
						client.query({
							query: experimentAssignmentQuery,
							variables: { id: EDUCATION_PLACEMENT_EXP },
						}),
						client.query({
							query: childQuery,
							variables: { loanId },
						}),
					]);
				});
		},
		preFetchVariables({ route, cookieStore }) {
			const publicId = getPublicId(route);
			return {
				loanId: Number(route?.params?.id ?? 0),
				publicId,
				getInviter: !!publicId,
				basketId: cookieStore?.get('kvbskt'),
			};
		},
		variables() {
			const publicId = getPublicId(this.$route);
			return {
				loanId: Number(this.$route?.params?.id ?? 0),
				publicId,
				getInviter: !!publicId,
				basketId: this.cookieStore.get('kvbskt'),
			};
		},
		result(result) {
			const routingLoan = result?.data?.lend?.loan ?? {};
			const isVolunteer = !!result?.data?.my?.userAccount?.volunteerId;
			// Read back whichever child query preFetch ran.
			const isFullView = showFullView(
				routingLoan.status,
				Number(routingLoan.unreservedAmount ?? 0),
				routingLoan.userProperties?.isPrivileged ?? false,
				isVolunteer,
				this.$route?.query,
			);
			const childQuery = isFullView ? fullProfileQuery : minimalProfileQuery;
			let childLoan = null;
			let childMy = null;
			if (routingLoan.id) {
				try {
					const cached = this.apollo.readQuery({
						query: childQuery,
						variables: { loanId: routingLoan.id },
					});
					childLoan = cached?.lend?.loan;
					childMy = cached?.my;
				} catch {
					// Not in cache; fall back below.
				}
			}
			this.loan = childLoan ?? routingLoan;
			this.routingLoan = routingLoan;
			this.isVolunteer = isVolunteer;
			this.inviterName = this.inviterIsGuestOrAnonymous
				? '' : result?.data?.community?.lender?.name ?? '';
			this.itemsInBasket = result?.data?.shop?.basket?.items?.values ?? [];
			this.loanRegion = this.routingLoan?.geocode?.country?.region ?? '';
			this.regionBelongsToExp = this.expRegionList.includes(this.loanRegion);

			// SSR initial rail state from the account preference (localStorage is reconciled
			// client-side in FullBorrowerProfile); null for anon, so this stays false.
			this.initialShowDetailsInRail = resolveRailPreference({
				accountPref: readAccountRailPreference(childMy?.userPreferences),
				local: null,
			});

			// Resolved here (not mounted) so SSR renders the assigned version with no flash of a
			let hasEverLoggedIn;
			try {
				hasEverLoggedIn = this.apollo.readQuery({ query: hasEverLoggedInQuery })?.hasEverLoggedIn;
			} catch {
				// Not in cache; leaves the visitor outside the experiment.
			}
			const isNewUserBpExp = isNewUserBpExpEligible({
				loanStatus: routingLoan.status,
				isFullView,
				isLoggedIn: !!result?.data?.my?.id,
				hasEverLoggedIn,
				cookieStore: this.cookieStore,
			});
			this.newUserBpExpVersion = isNewUserBpExp ? readNewUserBpExpVersion(this.apollo) : null;
			// Client-side navigation to another loan reuses this component, so track that page view here
			if (this.isMounted) {
				this.trackNewUserBpExp();
			}
		},
	},
	async mounted() {
		// Async data fetch for MARS-317
		const { data } = await this.apollo.query({ query: mountedQuery });
		this.lender = data?.my?.userAccount ?? {};

		if (this.regionBelongsToExp) {
			const educationExpData = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'borrower-profile',
				EDUCATION_PLACEMENT_EXP,
				'EXP-MARS-514-DEC2023 ',
			);
			if (educationExpData.version === 'b') {
				this.showEducationPlacementExp = true;
			}
		}

		this.isMounted = true;
		this.trackNewUserBpExp();

		this.isLoading = false;
	},
	methods: {
		trackNewUserBpExp() {
			const loanId = this.routingLoan?.id;
			// Once per page view: result() also runs on cache updates for the same loan
			if (!this.newUserBpExpVersion || !loanId || loanId === this.newUserBpExpTrackedLoanId) {
				return;
			}
			this.newUserBpExpTrackedLoanId = loanId;
			this.$kvTrackEvent('event-tracking', NEW_USER_BP_EXP_EVENT_ACTION, this.newUserBpExpVersion);
		},
	},
	computed: {
		loanId() {
			return Number(this.$route.params.id || 0);
		},
		name() {
			return this.routingLoan?.name ?? '';
		},
		countryName() {
			return this.routingLoan?.geocode?.country?.name ?? '';
		},
		hash() {
			return this.routingLoan?.image?.hash ?? '';
		},
		unreservedAmount() {
			return Number(this.loan?.unreservedAmount ?? 0);
		},
		isPrivileged() {
			return this.loan?.userProperties?.isPrivileged ?? false;
		},
		showFullView() {
			return showFullView(
				this.loan?.status,
				this.unreservedAmount,
				this.isPrivileged,
				this.isVolunteer,
				this.$route.query,
			);
		},
		loanType() {
			// eslint-disable-next-line no-underscore-dangle
			if (this.loan?.__typename === 'LoanDirect') {
				return 'direct-loan';
			}
			return 'partner-loan';
		},
		// Meta / share computeds
		imageShareUrl() {
			if (!this.hash) return '';
			return getKivaImageUrl({
				height: 630,
				width: 1200,
				base: this.$appConfig.photoPath,
				hash: this.hash,
			});
		},
		facebookPageLabel() {
			return `Kiva - ${this.facebookPageTitle}`;
		},
		facebookPageTitle() {
			let displayName = this.name;
			if (this.routingLoan?.businessName) {
				displayName = `${displayName}, ${this.routingLoan.businessName}`;
			}
			return `${displayName} - ${this.countryName}`;
		},
		pageTitle() {
			return `Lend to ${this.name} in ${this.countryName}`;
		},
		pageDescription() {
			return this.routingLoan?.fullLoanUse ?? '';
		},
		shareTitle() {
			if (this.routingLoan?.anonymizationLevel === 'full') {
				return 'Can you help support this loan?';
			}
			if (this.inviterName === '' || this.$route.query.share === 'true') {
				return `Can you help support ${this.name}?`;
			}
			return `Can you help ${this.inviterName} support ${this.name}?`;
		},
		shareDescription() {
			// eslint-disable-next-line max-len
			return 'Kiva is a loan, not a donation. With Kiva you can lend as little as $25 and make a big change in someone\'s life.';
		},
		numLenders() {
			return this.routingLoan?.lenders?.totalCount ?? 0;
		},
		endDate() {
			const d = this.routingLoan?.plannedExpirationDate;
			return d ? format(parseISO(d), 'M/d') : '';
		},
	},
	created() {
		const publicId = getPublicId(this.$route);
		this.inviterIsGuestOrAnonymous = publicId === 'anonymous' || publicId === 'guest';

		this.initializeFiveDollarsNotes();

		// If loanType is direct fire hotjar event
		if (this.loanType === 'direct-loan') {
			fireHotJarEvent('us_borrower_profile');
		}
	},
};
</script>
