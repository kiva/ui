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
import MinimalBorrowerProfile, { minimalProfileFragment } from '#src/components/BorrowerProfile/MinimalBorrowerProfile';
import FullBorrowerProfile, { fullProfileFragment } from '#src/components/BorrowerProfile/FullBorrowerProfile';
import { shareButtonFragment } from '#src/components/BorrowerProfile/ShareButton';
import { fireHotJarEvent } from '#src/util/hotJarUtils';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import lenderPublicProfileQuery from '#src/graphql/query/lenderPublicProfile.graphql';
import teamBasicInfoQuery from '#src/graphql/query/teamBasicInfo.graphql';
import ChallengeTeamInvite from '#src/components/BorrowerProfile/ChallengeTeamInvite';
import { getKivaImageUrl } from '@kiva/kv-components';
import useCDNHeaders from '#src/composables/useCDNHeaders';

const getPublicId = route => route?.query?.utm_content ?? route?.query?.name ?? route?.query?.lender ?? '';

const EDUCATION_PLACEMENT_EXP = 'education_placement_bp';
const CHALLENGE_HEADER_EXP = 'filters_challenge_header';

// Fields for showFullView routing logic
const routingFragment = gql`fragment bpRoutingFields on LoanBasic {
	id
	status
	loanAmount
	loanFundraisingInfo {
		id
		fundedAmount
	}
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

// Phase 2: full profile data (when showFullView is true)
const fullProfileQuery = gql`
	${fullProfileFragment}
	query fullBorrowerProfileData($loanId: Int!) {
		lend {
			loan(id: $loanId) {
				id
				...bpFullProfileFields
			}
		}
	}
`;

// Phase 2: minimal profile data (when showFullView is false)
const minimalProfileQuery = gql`
	${minimalProfileFragment}
	query minimalBorrowerProfileData($loanId: Int!) {
		lend {
			loan(id: $loanId) {
				id
				...minimalProfileFields
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
			lender: {},
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
		preFetch(_config, client, { route, cookieStore, renderConfig }) {
			const loanId = Number(route?.params?.id ?? 0);
			const publicId = getPublicId(route);
			const cdnNotedLoggedIn = renderConfig?.cdnNotedLoggedIn ?? false;
			const useCDNCaching = renderConfig?.useCDNCaching ?? false;

			// Use the same routingQuery on both paths so the apollo plugin's
			// readQuery in created() matches the preFetch cache entry.
			// On the cached path, basketId is null (cookieStore is null),
			// so shop/userProperties return nulls — that's fine.
			const isCachedPath = useCDNCaching;
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
					const loanAmount = Number(loan.loanAmount ?? 0);
					const fundedAmount = Number(loan.loanFundraisingInfo?.fundedAmount ?? 0);
					const amountLeft = loanAmount - fundedAmount;
					const minimalOverride = route.query?.minimal === 'false';
					const isPrivileged = isCachedPath
						? false : (loan.userProperties?.isPrivileged ?? false);
					const showFullView = (amountLeft && loan.status === 'fundraising')
						|| isPrivileged
						|| minimalOverride;

					const promises = [
						client.query({
							query: experimentAssignmentQuery,
							variables: { id: FIVE_DOLLARS_NOTES_EXP },
						}),
						client.query({
							query: experimentAssignmentQuery,
							variables: { id: EDUCATION_PLACEMENT_EXP },
						}),
					];

					// Cached path: set cache headers and warm child query cache
					if (isCachedPath) {
						const isCacheable = !cdnNotedLoggedIn
							|| loan.status === 'fundraising';
						if (isCacheable) {
							useCDNHeaders(helper => {
								helper
									.setNumeric('maxAge', 60 * 5)
									.setNumeric('staleWhileRevalidate', 60 * 60)
									.setNumeric('staleIfError', 60 * 60 * 24);
							});
						}

						const childQuery = showFullView
							? fullProfileQuery : minimalProfileQuery;
						promises.push(client.query({
							query: childQuery,
							variables: { loanId },
						}));
					}

					return Promise.all(promises);
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
			// Enrich with full profile data from phase 2 cache if available.
			// On the cached path, preFetch warms the child query cache, so
			// readQuery returns the complete loan with all child fragment fields.
			// On the uncached path, readQuery returns null and we use routing data.
			let fullLoan = null;
			if (routingLoan.id) {
				try {
					const cached = this.apollo.readQuery({
						query: fullProfileQuery,
						variables: { loanId: routingLoan.id },
					});
					fullLoan = cached?.lend?.loan;
				} catch {
					// Query not in cache (uncached path)
				}
			}
			this.loan = fullLoan ?? routingLoan;
			this.inviterName = this.inviterIsGuestOrAnonymous
				? '' : result?.data?.community?.lender?.name ?? '';
			this.itemsInBasket = result?.data?.shop?.basket?.items?.values ?? [];
			this.loanRegion = this.loan?.geocode?.country?.region ?? '';
			this.regionBelongsToExp = this.expRegionList.includes(this.loanRegion);
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
			return this.loan?.name ?? '';
		},
		countryName() {
			return this.loan?.geocode?.country?.name ?? '';
		},
		hash() {
			return this.loan?.image?.hash ?? '';
		},
		amountLeft() {
			const loanAmount = this.loan?.loanAmount ?? '0';
			const fundedAmount = this.loan?.loanFundraisingInfo?.fundedAmount ?? '0';
			return Number(loanAmount) - Number(fundedAmount);
		},
		isPrivileged() {
			return this.loan?.userProperties?.isPrivileged ?? false;
		},
		showFullView() {
			// Fully-reserved fundraising loans (amountLeft === 0) show the minimal view
			// for non-privileged users since there's nothing left to lend.
			return (this.amountLeft && this.loan?.status === 'fundraising')
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
			if (this.loan?.businessName) {
				displayName = `${displayName}, ${this.loan.businessName}`;
			}
			return `${displayName} - ${this.countryName}`;
		},
		pageTitle() {
			return `Lend to ${this.name} in ${this.countryName}`;
		},
		pageDescription() {
			return this.loan?.fullLoanUse ?? '';
		},
		shareTitle() {
			if (this.loan?.anonymizationLevel === 'full') {
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
			return this.loan?.lenders?.totalCount ?? 0;
		},
		endDate() {
			const d = this.loan?.plannedExpirationDate;
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
