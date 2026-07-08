<template>
	<www-page
		id="borrower-profile"
		:data-testid="loanType"
	>
		<challenge-team-invite
			v-if="showChallengeCallout"
			class="tw-absolute tw-mx-auto tw-w-full tw-z-5"
			:share-lender="shareLender"
			:team-name="teamName"
			:team-public-id="teamPublicId"
			@close="hideChallengeCallout = true"
		/>
		<full-borrower-profile
			v-if="showFullView"
			:loan="loan"
			:lender="lender"
			:loading="isLoading"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:team-id="teamId"
			:team-name="teamName"
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
import { format, parseISO } from 'date-fns';
import { gql } from 'graphql-tag';
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
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import lenderPublicProfileQuery from '#src/graphql/query/lenderPublicProfile.graphql';
import teamBasicInfoQuery from '#src/graphql/query/teamBasicInfo.graphql';
import ChallengeTeamInvite from '#src/components/BorrowerProfile/ChallengeTeamInvite';
import { readAccountRailPreference, resolveRailPreference } from '#src/util/loanDetailsRailPreference';
import { getKivaImageUrl } from '@kiva/kv-components';

const getPublicId = route => route?.query?.utm_content ?? route?.query?.name ?? route?.query?.lender ?? '';

const EDUCATION_PLACEMENT_EXP = 'education_placement_bp';
const CHALLENGE_HEADER_EXP = 'filters_challenge_header';

// Mirrors monolith Kc_Loan_Psc::getAllPublicStatuses() — non-privileged viewers can only see these.
const PUBLIC_STATUSES = ['fundraising', 'funded', 'expired', 'raised', 'payingBack', 'refunded', 'ended', 'defaulted'];

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
	query borrowerProfileMeta(
		$loanId: Int!,
	) {
		lend {
			loan(id: $loanId) {
				id
				...on LoanPartner {
					partnerName
					partner {
						id
						countries {
							id
							name
						}
					}
				}
			}
		}
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
		ChallengeTeamInvite,
	},
	head() {
		const title = this.anonymizationLevel === 'full' ? undefined : this.pageTitle;
		const description = this.anonymizationLevel === 'full' ? undefined : this.pageDescription;
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
			// SSR-resolved rail preference (logged-in only); reconciled client-side in the component.
			initialShowDetailsInRail: false,
			inviterName: '',
			inviterIsGuestOrAnonymous: false,
			itemsInBasket: [],
			isLoading: true,
			// Experiment state
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
			// Challenge header
			enableChallengeHeader: false,
			teamId: null,
			teamName: '',
			teamPublicId: '',
			shareLender: undefined,
			hideChallengeCallout: false,
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

			return client.query({ query: routingQuery, variables })
				.then(({ data }) => {
					const loan = data?.lend?.loan;
					if (!loan) {
						return Promise.reject({ path: '/lend', query: route.query });
					}

					// Routing decision
					const unreservedAmount = Number(loan.unreservedAmount ?? 0);
					const minimalOverride = route.query?.minimal === 'false';
					const isPrivileged = loan.userProperties?.isPrivileged ?? false;

					// Anon goes to login (so a lender/trustee can authenticate in); logged-in non-priv goes to /lend.
					if (!PUBLIC_STATUSES.includes(loan.status) && !isPrivileged) {
						if (!kvAuth0?.getKivaId()) {
							return Promise.reject({
								path: '/ui-login',
								query: { doneUrl: route.fullPath },
							});
						}
						return Promise.reject({ path: '/lend', query: route.query });
					}

					const showFullView = (unreservedAmount > 0 && loan.status === 'fundraising')
						|| isPrivileged
						|| minimalOverride;

					const childQuery = showFullView ? fullProfileQuery : minimalProfileQuery;

					return Promise.all([
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
			// Prefer the enriched full-profile entry; minimal-view paths fall back to routingLoan below.
			let fullLoan = null;
			let fullMy = null;
			if (routingLoan.id) {
				try {
					const cached = this.apollo.readQuery({
						query: fullProfileQuery,
						variables: { loanId: routingLoan.id },
					});
					fullLoan = cached?.lend?.loan;
					fullMy = cached?.my;
				} catch {
					// Not in cache; fall back below.
				}
			}
			this.loan = fullLoan ?? routingLoan;
			this.routingLoan = routingLoan;
			this.inviterName = this.inviterIsGuestOrAnonymous
				? '' : result?.data?.community?.lender?.name ?? '';
			this.itemsInBasket = result?.data?.shop?.basket?.items?.values ?? [];
			this.loanRegion = this.routingLoan?.geocode?.country?.region ?? '';
			this.regionBelongsToExp = this.expRegionList.includes(this.loanRegion);

			// SSR initial rail state from the account preference (localStorage is reconciled
			// client-side in FullBorrowerProfile); null for anon, so this stays false.
			this.initialShowDetailsInRail = resolveRailPreference({
				accountPref: readAccountRailPreference(fullMy?.userPreferences),
				local: null,
			});
		},
	},
	async mounted() {
		// Async data fetch for MARS-317
		const { data } = await this.apollo.query({
			query: mountedQuery,
			variables: {
				loanId: this.loanId,
			},
		});
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

		const challengeHeaderExpData = this.apollo.readFragment({
			id: `Experiment:${CHALLENGE_HEADER_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};

		this.enableChallengeHeader = challengeHeaderExpData?.version === 'b';

		if (this.enableChallengeHeader) {
			const routeTeamPublicId = this.$route?.query?.team ?? '';
			if (routeTeamPublicId) {
				const teamResult = await this.apollo.query({
					query: teamBasicInfoQuery,
					variables: { teamPublicId: routeTeamPublicId },
				});
				const team = teamResult?.data?.community?.team;
				if (team?.id) {
					this.teamId = team.id;
					this.teamName = team.name ?? '';
					this.teamPublicId = team.teamPublicId ?? '';

					const publicId = getPublicId(this.$route);
					const lenderData = await this.apollo.query({
						query: lenderPublicProfileQuery,
						variables: { publicId },
					});
					this.shareLender = lenderData?.data?.community?.lender ?? {};
				}
			}
		}

		this.isLoading = false;
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
			// Fully-reserved fundraising loans (unreservedAmount === 0) show the minimal view
			// for non-privileged users since there's nothing left to lend.
			return (this.unreservedAmount > 0 && this.loan?.status === 'fundraising')
				|| this.isPrivileged
				|| this.$route.query.minimal === 'false';
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
		showChallengeCallout() {
			return this.enableChallengeHeader && this.teamId && !this.hideChallengeCallout;
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
