<template>
	<www-page
		id="borrower-profile"
		:data-testid="loanType"
	>
		<challenge-team-invite
			v-if="showChallengeCallout"
			class="tw-absolute tw-mx-auto tw-w-full tw-z-5"
			:share-lender="shareLender"
			:team-name="teamData.name"
			:team-id="teamData.teamPublicId"
			@close="hideChallengeCallout = true"
		/>
		<full-borrower-profile
			v-if="showFullView"
			:loan="loan"
			:lender="lender"
			:loading="isLoading"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:team-data="teamData"
			:show-education-placement-exp="showEducationPlacementExp"
			:loan-region="loanRegion"
		/>
		<article v-else>
			<MinimalBorrowerProfile
				:loan="loan"
				:hash="hash"
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
import MinimalBorrowerProfile from '#src/components/BorrowerProfile/MinimalBorrowerProfile';
import FullBorrowerProfile from '#src/components/BorrowerProfile/FullBorrowerProfile';
import { fireHotJarEvent } from '#src/util/hotJarUtils';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import lenderPublicProfileQuery from '#src/graphql/query/lenderPublicProfile.graphql';
import TeamInfoFromId from '#src/graphql/query/teamInfoFromId.graphql';
import ChallengeTeamInvite from '#src/components/BorrowerProfile/ChallengeTeamInvite';
import { summaryCardFragment } from '#src/components/BorrowerProfile/SummaryCard';
import { loanStoryFragment } from '#src/components/BorrowerProfile/LoanStory';
import { getKivaImageUrl } from '@kiva/kv-components';

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
		reservedAmount
	}
	userProperties {
		lentTo
		isPrivileged
		isAdmin
		subscribed
	}
}`;

// Fields for head() meta tags, OG/Twitter share, and page title
const shareMetaFragment = gql`fragment bpShareMetaFields on LoanBasic {
	id
	name
	anonymizationLevel
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
}`;

// Fields passed to FullBorrowerProfile via loan prop
const fullProfileFragment = gql`fragment bpFullProfileFields on LoanBasic {
	id
	inPfp
	pfpMinLenders
	gender
	fundraisingPercent @client
	sector {
		id
		name
	}
	paidAmount
	expiredDate
	refundedDate
	defaultedDate
	endedDate
}`;

const preFetchQuery = gql`
	${summaryCardFragment}
	${loanStoryFragment}
	${routingFragment}
	${shareMetaFragment}
	${fullProfileFragment}
	query borrowerProfileMeta(
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
				...summaryCardFields
				...loanStoryFields
				...bpRoutingFields
				...bpShareMetaFields
				...bpFullProfileFields
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
			teamData: {},
			shareLender: undefined,
			hideChallengeCallout: false,
		};
	},
	mixins: [fiveDollarsTest, guestComment],
	apollo: {
		query: preFetchQuery,
		preFetch(_config, client, { route, cookieStore }) {
			const publicId = getPublicId(route);
			return client
				.query({
					query: preFetchQuery,
					variables: {
						loanId: Number(route?.params?.id ?? 0),
						publicId,
						getInviter: !!publicId,
						basketId: cookieStore.get('kvbskt')
					},
				})
				.then(({ data }) => {
					// Check loan exists
					const loan = data?.lend?.loan;
					if (!loan) {
						return Promise.reject({ path: '/lend', query: route.query });
					}

					return Promise.all([
						client.query({ query: experimentAssignmentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } }),
						client.query({ query: experimentAssignmentQuery, variables: { id: EDUCATION_PLACEMENT_EXP } }),
					]);
				});
		},
		preFetchVariables({ route, cookieStore }) {
			const publicId = getPublicId(route);
			return {
				loanId: Number(route?.params?.id ?? 0),
				publicId,
				getInviter: !!publicId,
				basketId: cookieStore.get('kvbskt'),
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
			this.loan = result?.data?.lend?.loan ?? {};
			this.inviterName = this.inviterIsGuestOrAnonymous ? '' : result?.data?.community?.lender?.name ?? '';
			this.itemsInBasket = result?.data?.shop?.basket?.items?.values ?? [];
			this.loanRegion = this.loan?.geocode?.country?.region ?? '';
			this.regionBelongsToExp = this.expRegionList.includes(this.loanRegion);
		},
	},
	async mounted() {
		// EXP-GROW-655-Aug2021
		// This is cookie is set during the redirect and signifies the exp is active when landing on this page
		const expCookieSignifier = this.cookieStore.get('kvlendborrowerbeta');
		if (expCookieSignifier === 'b') {
			this.$kvTrackEvent('Borrower Profile', 'EXP-GROW-655-Aug2021', expCookieSignifier);
		}

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
			const teamPublicId = this.$route?.query?.team ?? '';
			let teamId = null;
			if (teamPublicId) {
				const teamInfo = await this.apollo.query({ query: TeamInfoFromId, variables: { team_public_id: teamPublicId } }); // eslint-disable-line max-len
				teamId = teamInfo?.data?.community?.team?.id ?? null;
			}

			if (teamId) {
				const teamData = await this.apollo.query({ query: TeamInfoFromId, variables: { team_id: teamId } });
				this.teamData = teamData?.data?.community?.team || {};
				const publicId = getPublicId(this.$route);

				const lenderData = await this.apollo.query({
					query: lenderPublicProfileQuery,
					variables: {
						publicId,
					}
				});
				this.shareLender = lenderData?.data?.community?.lender ?? {};
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
			return this.enableChallengeHeader && Object.keys(this.teamData).length && !this.hideChallengeCallout;
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
