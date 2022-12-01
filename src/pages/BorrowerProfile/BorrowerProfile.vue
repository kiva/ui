<template>
	<www-page
		id="borrower-profile"
	>
		<article v-if="showFundraising" class="tw-relative tw-bg-secondary">
			<div class="tw-relative">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
					<hero-background />
				</div>

				<top-banner-pfp
					v-if="inPfp"
					class="tw-relative"
					:lenders-needed="pfpMinLenders"
					:borrower-name="name"
					:days-left="diffInDays"
				/>
				<content-container
					:class="inPfp ? 'lg:tw-pt-3' : 'lg:tw-pt-8'"
					class="md:tw-pt-6"
				>
					<summary-card
						data-testid="bp-summary"
						class="tw-relative lg:tw--mb-1.5"
						:show-urgency-exp="showUrgencyExp"
					>
						<template #sharebutton v-if="inPfp || shareButtonExpEnabled">
							<!-- Share button for PFP loans -->
							<share-button
								class="tw-block md:tw-hidden tw-mt-3"
								:loan="loan"
								:lender="lender"
								:campaign="inPfp ? 'social_share_bp_pfp' : 'social_share_bp'"
							/>
						</template>
					</summary-card>
				</content-container>
			</div>
			<div
				:class="inPfp ? 'lg:tw-pt-16' : 'lg:tw-pt-8'"
				class="lg:tw-absolute tw-pointer-events-none lg:tw-w-full lg:tw-h-full lg:tw-top-0 tw-z-docked"
			>
				<sidebar-container
					class="lg:tw-sticky lg:tw-mt-10 lg:tw-pb-8 lg:tw-top-12"
				>
					<lend-cta
						class="tw-pointer-events-auto"
						:loan-id="loanId"
						:require-deposits-matched-loans="requireDepositsMatchedLoans"
						:user-context-exp-variant="userContextExpVariant"
					>
						<template #sharebutton v-if="inPfp || shareButtonExpEnabled">
							<!-- Share button for PFP loans -->
							<share-button
								class="tw-hidden md:tw-block lg:tw-mb-1.5"
								:loan="loan"
								:lender="lender"
								:campaign="inPfp ? 'social_share_bp_pfp' : 'social_share_bp'"
							/>
						</template>
					</lend-cta>
				</sidebar-container>
			</div>
			<content-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-8">
				<loan-story
					id="loanStory"
					data-testid="bp-loan-story"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8 tw-z-1"
					:loan-id="loanId"
					:user-context-exp-variant="userContextExpVariant"
				/>
			</content-container>
			<div class="tw-bg-primary tw-mb-5 md:tw-mb-6 lg:tw-mb-8">
				<content-container>
					<why-special data-testid="bp-why-special" :loan-id="loanId" />
				</content-container>
			</div>
			<content-container>
				<div
					v-if="userContextExpVariant === 'a'"
					class="tw-rounded tw-bg-white tw-px-2 md:tw-px-4 tw-py-3 tw-mb-5 tw-flex tw-gap-2"
				>
					<div>
						<check-icon />
					</div>
					<div>
						<p class="tw-text-base">
							{{ vettedHeadline }}
						</p>
						<p class="tw-text-base tw-text-secondary">
							{{ vettedBody }}
						</p>
					</div>
				</div>
				<more-about-loan
					data-testid="bp-more-about"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
					:loan-id="loanId"
					:user-context-exp-variant="userContextExpVariant"
				/>
				<borrower-country data-testid="bp-country" class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8" :loan-id="loanId" />
				<lenders-and-teams
					v-if="showLenders"
					data-testid="bp-lenders"
					key="lenders"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
					:loan-id="loanId"
					display-type="lenders"
					@hide-section="showLenders = false"
				/>
				<lenders-and-teams
					v-if="showTeams"
					data-testid="bp-teams"
					key="teams"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
					:loan-id="loanId"
					display-type="teams"
					@hide-section="showTeams = false"
				/>
			</content-container>
			<div class="tw-bg-primary">
				<content-container>
					<details-tabs id="loanDetails" :loan-id="loanId" name="bp-details" />
				</content-container>
			</div>
		</article>
		<article v-else>
			<FundedBorrowerProfile
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
import { getKivaImageUrl } from '@/util/imageUtils';
import {
	format, parseISO, differenceInCalendarDays
} from 'date-fns';
import gql from 'graphql-tag';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';

import WwwPage from '@/components/WwwFrame/WwwPage';
import ContentContainer from '@/components/BorrowerProfile/ContentContainer';
import SidebarContainer from '@/components/BorrowerProfile/SidebarContainer';
import HeroBackground from '@/components/BorrowerProfile/HeroBackground';
import SummaryCard from '@/components/BorrowerProfile/SummaryCard';
import LendCta from '@/components/BorrowerProfile/LendCta';
import LoanStory from '@/components/BorrowerProfile/LoanStory';
import FundedBorrowerProfile from '@/components/BorrowerProfile/FundedBorrowerProfile';
import DetailsTabs from '@/components/BorrowerProfile/DetailsTabs';
import BorrowerCountry from '@/components/BorrowerProfile/BorrowerCountry';
import LendersAndTeams from '@/components/BorrowerProfile/LendersAndTeams';
import MoreAboutLoan from '@/components/BorrowerProfile/MoreAboutLoan';
import WhySpecial from '@/components/BorrowerProfile/WhySpecial';
import TopBannerPfp from '@/components/BorrowerProfile/TopBannerPfp';
import ShareButton from '@/components/BorrowerProfile/ShareButton';
import logReadQueryError from '@/util/logReadQueryError';

import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experimentUtils';
import loanUseFilter from '@/plugins/loan-use-filter';
import CheckIcon from '@/assets/icons/inline/check-with-bg.svg';

const shareButtonExpKey = 'share_button_bp';
const userContextExpKey = 'new_users_context';

const getPublicId = route => route?.query?.utm_content ?? route?.query?.name ?? '';
const pageQuery = gql`
	query borrowerProfileMeta(
		$loanId: Int!,
		$publicId: String!,
		$getInviter: Boolean!,
		$basketId: String,
		$imgDefaultSize: String = "w480h360",
		$imgRetinaSize: String = "w960h720"
	) {
		general {
			lendUrgency: uiExperimentSetting(key: "lend_urgency") {
				key
				value
			}
			requireDepositsMatchedLoans: uiExperimentSetting(key: "require_deposits_matched_loans") {
				key
				value
			}
			shareButton: uiExperimentSetting(key: "share_button_bp") {
				key
				value
			}
		}
		lend {
			loan(id: $loanId) {
				id
				borrowerCount
				name
				... on LoanDirect {
					businessName
				}
				geocode {
					city
					state
					country {
						name
						isoCode
					}
				}
				image {
					id
					default: url(customSize: $imgDefaultSize)
					retina: url(customSize: $imgRetinaSize)
					hash
				}
				plannedExpirationDate
				lenders {
					totalCount
				}
				anonymizationLevel
				loanAmount
				status
				use
				description
				loanFundraisingInfo{
					fundedAmount
					isExpiringSoon
					reservedAmount
				}
				inPfp
				pfpMinLenders
				gender
				sector {
					id
					name
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
			userAccount {
				id
				inviterName
				public
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

export default {
	name: 'BorrowerProfile',
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerCountry,
		ContentContainer,
		DetailsTabs,
		HeroBackground,
		FundedBorrowerProfile,
		LendCta,
		LendersAndTeams,
		LoanStory,
		MoreAboutLoan,
		SidebarContainer,
		ShareButton,
		SummaryCard,
		TopBannerPfp,
		WhySpecial,
		WwwPage,
		CheckIcon
	},
	metaInfo() {
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
			businessName: null,
			countryName: '',
			loanId: Number(this.$route.params.id || 0),
			showLenders: true,
			showTeams: true,
			isUrgencyExpVersionShown: false,
			hasThreeDaysOrLessLeft: false,
			// meta fields
			endDate: '',
			numLenders: 0,
			name: '',
			hash: '',
			borrowerCount: 0,
			anonymizationLevel: 'none',
			loanAmount: '0',
			status: '',
			use: '',
			description: '',
			loanFundraisingInfo: {},
			requireDepositsMatchedLoans: false,
			shareCardLanguageVersion: '',
			inviterName: '',
			inviterIsGuestOrAnonymous: false,
			inPfp: false,
			itemsInBasket: [],
			pfpMinLenders: 0,
			diffInDays: 0,
			lender: {},
			loan: {},
			shareButtonExpEnabled: false,
			userContextExpVariant: 'c',
			partnerName: '',
			partnerCountry: '',
			isoCode: ''
		};
	},
	apollo: {
		query: pageQuery,
		preFetch(config, client, { route, cookieStore }) {
			const publicId = getPublicId(route);
			return client
				.query({
					query: pageQuery,
					variables: {
						loanId: Number(route.params?.id ?? 0),
						publicId,
						getInviter: !!publicId,
						basketId: cookieStore.get('kvbskt')
					},
				})
				.then(({ data }) => {
					const expCookieSignifier = cookieStore.get('kvlendborrowerbeta');
					if (expCookieSignifier === 'a' || expCookieSignifier === 'c') {
						const { query } = route;
						return Promise.reject({
							path: `/lend-classic/${route.params.id}`,
							query,
						});
					}

					const loan = data?.lend?.loan;
					if (loan === null || loan === 'undefined') {
						// redirect to legacy borrower profile
						const { query = {} } = route;
						query.minimal = false;
						return Promise.reject({
							path: `/lend-classic/${Number(route.params?.id ?? 0)}`,
							query,
						});
					}

					return Promise.all([
						client.query({ query: experimentQuery, variables: { id: 'require_deposits_matched_loans' } }),
						client.query({ query: experimentQuery, variables: { id: shareButtonExpKey } })
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
			const loan = result?.data?.lend?.loan;
			this.loan = loan;
			this.inPfp = loan?.inPfp ?? false;
			this.pfpMinLenders = loan?.pfpMinLenders ?? 0;
			this.businessName = loan?.businessName ?? '';
			this.name = loan?.name ?? '';
			this.countryName = loan?.geocode?.country?.name ?? '';
			this.hash = loan?.image?.hash ?? '';
			this.numLenders = loan?.lenders?.totalCount ?? 0;
			this.endDate = loan?.plannedExpirationDate ? format(parseISO(loan?.plannedExpirationDate), 'M/d') : '';
			this.borrowerCount = loan?.borrowerCount ?? 0;
			this.anonymizationLevel = loan?.anonymizationLevel ?? 'none';
			this.loanAmount = loan?.loanAmount ?? '0';
			this.status = loan?.status ?? '';
			this.use = loan?.use ?? '';
			this.description = loan?.description ?? '';
			this.loanFundraisingInfo = loan?.loanFundraisingInfo ?? {};
			this.inviterName = this.inviterIsGuestOrAnonymous ? '' : result?.data?.community?.lender?.name ?? '';
			this.itemsInBasket = result?.data?.shop?.basket?.items?.values ?? [];

			this.diffInDays = differenceInCalendarDays(parseISO(loan?.plannedExpirationDate), new Date());
			this.hasThreeDaysOrLessLeft = this.diffInDays <= 3;
			this.lender = result?.data?.my?.userAccount ?? {};

			this.isoCode = loan?.geocode?.country?.isoCode ?? '';
		},
	},
	mounted() {
		// EXP-GROW-655-Aug2021
		// This is cookie is set during the redirect and signifies the exp is active when landing on this page
		const expCookieSignifier = this.cookieStore.get('kvlendborrowerbeta');
		if (expCookieSignifier === 'b') {
			this.$kvTrackEvent('Borrower Profile', 'EXP-GROW-655-Aug2021', expCookieSignifier);
		}

		const shareButtonExpData = getExperimentSettingCached(this.apollo, shareButtonExpKey);
		if (shareButtonExpData?.enabled) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Borrower Profile',
				shareButtonExpKey,
				'EXP-ACK-451-Oct2022'
			);
			if (version === 'b') {
				this.shareButtonExpEnabled = true;
			}
		}

		const query = gql`query borrowerProfileMeta(
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
								name
							}
						}
					}
				}
			}
		}`;

		try {
			const data = this.apollo.readQuery({
				query,
				variables: {
					loanId: this.loanId,
				},
			});
			const loan = data?.lend?.loan;
			this.partnerName = loan?.partnerName ?? '';
			this.partnerCountry = loan?.partner?.countries[0]?.name ?? '';
		} catch (e) {
			logReadQueryError(e, 'BorrowerProfile userContextExperiment');
		}
	},
	computed: {
		vettedHeadline() {
			if (this.isoCode === 'US') {
				return `${this.name} was approved by Kiva`;
			}
			return `${this.name} was vetted by ${this.partnerName}, a lending partner in ${this.partnerCountry}`;
		},
		vettedBody() {
			if (this.isoCode === 'US') {
			// eslint-disable-next-line max-len
				return 'Body text: Kiva reviews all US-based borrowers to ensure they meet the proper eligibility criteria';
			}
			// eslint-disable-next-line max-len
			return 'Lending partners are local organizations that vet borrowers and provide services like financial education training and business development skills';
		},
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
			// eslint-disable-next-line prefer-destructuring
			let name = this.name;
			if (this.businessName) {
				name = `${name}, ${this.businessName}`;
			}
			return `${name} - ${this.countryName}`;
		},
		showUrgencyExp() {
			return this.hasThreeDaysOrLessLeft && this.isUrgencyExpVersionShown;
		},
		amountLeft() {
			return this.loanAmount - this.loanFundraisingInfo.fundedAmount;
		},
		pageTitle() {
			return `Lend to ${this.name} in ${this.countryName}`;
		},
		pageDescription() {
			return loanUseFilter(this.use, this.name, this.status, this.loanAmount, this.borrowerCount,
				this.loanUseMaxLength, this.anonymizationLevel);
		},
		shareTitle() {
			if (this.anonymizationLevel === 'full') {
				return 'Can you help support this loan?';
			}
			/** if inviterName is blank or share query param (used for sharing your own loan)
			 * is set to true, then we don't want to use the inviter name in the share title
			 */
			if (this.inviterName === '' || this.$route.query.share === 'true') {
				return `Can you help support ${this.name}?`;
			}
			return `Can you help ${this.inviterName} support ${this.name}?`;
		},
		shareDescription() {
			// eslint-disable-next-line max-len
			return 'Kiva is a loan, not a donation. With Kiva you can lend as little as $25 and make a big change in someone\'s life.';
		},
		showFundraising() {
			return this.amountLeft && this.status === 'fundraising';
		}
	},
	created() {
		// this experiment is assigned in experimentPreFetch.js
		const urgencyExperiment = this.apollo.readFragment({
			id: 'Experiment:lend_urgency',
			fragment: experimentVersionFragment,
		}) || {};

		this.isUrgencyExpVersionShown = urgencyExperiment.version === 'shown';

		if (this.hasThreeDaysOrLessLeft) {
			// Fire Event for Exp ACK-291 Urgency Experiment
			if (urgencyExperiment.version && urgencyExperiment.version !== 'unassigned') {
				this.$kvTrackEvent(
					'Lending',
					'EXP-ACK-291-May2022',
					this.isUrgencyExpVersionShown ? 'b' : 'a'
				);
			}
		}

		const matchedLoansExperiment = this.apollo.readFragment({
			id: 'Experiment:require_deposits_matched_loans',
			fragment: experimentVersionFragment,
		}) || {};
		this.requireDepositsMatchedLoans = matchedLoansExperiment.version === 'b';
		if (matchedLoansExperiment.version) {
			this.$kvTrackEvent(
				'Basket',
				'EXP-CORE-615-May-2022',
				matchedLoansExperiment.version
			);
		}

		if (this.$route.query?.utm_campaign?.includes('scle')) {
			// EXP-MARS-143-Jul2022
			// Extract exp version from utm_campaign
			this.shareCardLanguageVersion = this.$route.query?.utm_campaign?.split('_')?.pop()?.replace('-normal', '');
			this.$kvTrackEvent(
				'Thanks',
				'EXP-MARS-143-Jul2022',
				this.shareCardLanguageVersion.replace('-normal', '')
			);
		}

		const publicId = getPublicId(this.$route);
		this.inviterIsGuestOrAnonymous = publicId === 'anonymous' || publicId === 'guest';

		const contextExpEnabled = getExperimentSettingCached(this.apollo, userContextExpKey)?.enabled;
		const userContextExpData = this.apollo.readFragment({
			id: `Experiment:${userContextExpKey}`,
			fragment: experimentVersionFragment,
		}) || {};

		this.userContextExpVariant = userContextExpData?.version;
		if (contextExpEnabled && userContextExpData?.version) {
			this.$kvTrackEvent(
				'Borrower Profile',
				'EXP-MARS-317-Nov2022',
				this.userContextExpVariant,
			);
		}
	},
};
</script>
