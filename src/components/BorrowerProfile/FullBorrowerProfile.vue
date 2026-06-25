<template>
	<article class="tw-relative tw-bg-secondary">
		<div class="tw-relative">
			<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
				<hero-background />
			</div>

			<top-banner-pfp
				v-if="inPfp"
				class="tw-relative"
				:lenders-needed="pfpMinLenders"
				:borrower-name="loanData.name"
				:days-left="diffInDays"
			/>
			<content-container
				:class="[inPfp ? 'lg:tw-pt-3' : 'lg:tw-pt-8']"
				class="md:tw-pt-6"
			>
				<summary-card
					data-testid="bp-summary"
					class="tw-relative lg:tw--mb-1.5"
					:loan="loanData"
					:is-logged-in="isLoggedIn"
				/>
			</content-container>
		</div>
		<div
			:class="inPfp ? 'lg:tw-pt-16' : 'lg:tw-pt-8'"
			class="lg:tw-absolute tw-pointer-events-none lg:tw-w-full lg:tw-h-full lg:tw-top-0 tw-z-docked"
		>
			<sidebar-container
				class="lg:tw-sticky lg:tw-mt-10 lg:tw-pb-8 lg:tw-top-12"
			>
				<div class="tw-flex tw-flex-col" style="max-height: calc(100vh - 7.5rem)">
					<lend-cta
						class="tw-pointer-events-auto"
						:loan-id="loanId"
						:loan-data="loanData"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:show-details-in-rail="showDetailsInRail"
						:team-id="teamId"
						:team-name="teamName"
					>
						<template #sharebutton>
							<!-- Share button -->
							<template v-if="loading">
								<kv-loading-placeholder style="height: 2rem; width: 100%;" />
							</template>
							<share-button
								v-else
								class="tw-block lg:tw-mb-1.5"
								:loan="loanData"
								:variant="shareBtnVariant"
								:lender="lender"
								:campaign="shareCampaign"
								:in-pfp="inPfp"
								:pfp-min-lenders="pfpMinLenders"
								:num-lenders="numLenders"
							/>
						</template>
					</lend-cta>
					<transition name="kvfastfade">
						<div
							v-if="showDetailsInRail"
							data-testid="bp-rail-details"
							class="tw-hidden lg:tw-block tw-pointer-events-auto
								tw-bg-primary tw-rounded tw-p-4
								tw-shrink tw-overflow-scroll"
						>
							<details-tabs
								name="bp-rail-details"
								:loan-id="loanId"
								:is-privileged="isPrivileged"
								condensed
							/>
						</div>
					</transition>
				</div>
			</sidebar-container>
		</div>
		<content-container class="tw-mt-4 md:tw-mt-3 lg:tw-mt-6">
			<loan-story
				id="loanStory"
				data-testid="bp-loan-story"
				class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8 tw-z-1"
				:loan="loanData"
			/>
		</content-container>
		<content-container>
			<journal-updates
				v-if="showUpdates"
				data-testid="bp-updates"
				class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
				:loan-id="loanId"
				@hide-section="showUpdates = false"
			/>
		</content-container>
		<div class="tw-bg-primary tw-mb-5 md:tw-mb-6 lg:tw-mb-8" id="bp-comments-jump-link">
			<content-container>
				<comments-and-why-special
					data-testid="bp-comments"
					:loan-id="loanId"
					:is-logged-in="isLoggedIn"
					@subscription-toggled="$emit('subscription-toggled', $event)"
				/>
			</content-container>
		</div>
		<content-container v-if="showEducationPlacementExp">
			<borrower-education-placement
				data-testid="bp-education"
				:loan-region="loanRegion"
			/>
		</content-container>
		<content-container>
			<more-about-loan
				data-testid="bp-more-about"
				class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
				:loan-id="loanId"
			/>
			<borrower-country data-testid="bp-country" class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8" :loan-id="loanId" />
			<contributing-partners
				data-testid="bp-contributing-partners"
				class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
				:loan-id="loanId"
			/>
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
		<div class="tw-bg-primary tw-py-4 md:tw-py-6 lg:tw-py-8">
			<content-container>
				<details-tabs id="loanDetails" :loan-id="loanId" name="bp-details" :is-privileged="isPrivileged" />
				<loan-details-rail-toggle class="tw-hidden lg:tw-flex tw-mt-6" v-model="showDetailsInRailModel" />
			</content-container>
		</div>
		<content-container>
			<loan-tags :loan-id="loanId" :is-logged-in="isLoggedIn" />
			<loan-comments
				class="tw-my-5 md:tw-my-6 lg:tw-my-8"
				:loan-id="loanId"
				:is-privileged="isPrivileged"
			/>
		</content-container>
		<definitions-lightbox ref="definitionsLightbox" />
	</article>
</template>

<script>
import { gql } from 'graphql-tag';
import _throttle from 'lodash/throttle';
import ContentContainer from '#src/components/BorrowerProfile/ContentContainer';
import SidebarContainer from '#src/components/BorrowerProfile/SidebarContainer';
import HeroBackground from '#src/components/BorrowerProfile/HeroBackground';
import SummaryCard, { summaryCardFragment } from '#src/components/BorrowerProfile/SummaryCard';
import LendCta, { lendCtaFragment } from '#src/components/BorrowerProfile/LendCta';
import LoanStory, { loanStoryFragment } from '#src/components/BorrowerProfile/LoanStory';
import DetailsTabs from '#src/components/BorrowerProfile/DetailsTabs';
import BorrowerCountry from '#src/components/BorrowerProfile/BorrowerCountry';
import ContributingPartners from '#src/components/BorrowerProfile/ContributingPartners';
import LendersAndTeams from '#src/components/BorrowerProfile/LendersAndTeams';
import MoreAboutLoan from '#src/components/BorrowerProfile/MoreAboutLoan';
import CommentsAndWhySpecial from '#src/components/BorrowerProfile/CommentsAndWhySpecial';
import TopBannerPfp from '#src/components/BorrowerProfile/TopBannerPfp';
import ShareButton from '#src/components/BorrowerProfile/ShareButton';
import JournalUpdates from '#src/components/BorrowerProfile/JournalUpdates';
import BorrowerEducationPlacement from '#src/components/BorrowerProfile/BorrowerEducationPlacement';
import LoanTags from '#src/components/BorrowerProfile/LoanTags';
import LoanComments from '#src/components/BorrowerProfile/LoanComments';
import LoanDetailsRailToggle from '#src/components/BorrowerProfile/LoanDetailsRailToggle';
import DefinitionsLightbox from '#src/components/BorrowerProfile/DefinitionsLightbox';
import {
	getLocalRailPreference,
	readAccountRailPreference,
	resolveRailPreference,
	persistRailPreference,
} from '#src/util/loanDetailsRailPreference';
import { isActivelyInPfp } from '#src/util/loanUtils';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { KvLoadingPlaceholder } from '@kiva/kv-components';

export const fullProfileFragment = gql`
	${summaryCardFragment}
	${loanStoryFragment}
	${lendCtaFragment}
	fragment bpFullProfileFields on LoanBasic {
		id
		inPfp
		pfpMinLenders
		plannedExpirationDate
		minNoteSize
		lenders {
			totalCount
		}
		userProperties {
			isPrivileged
		}
		...summaryCardFields
		...loanStoryFields
		...lendCtaFields
	}
`;

export default {
	name: 'FullBorrowerProfile',
	components: {
		ContentContainer,
		SidebarContainer,
		HeroBackground,
		SummaryCard,
		LendCta,
		LoanStory,
		DetailsTabs,
		BorrowerCountry,
		ContributingPartners,
		LendersAndTeams,
		MoreAboutLoan,
		CommentsAndWhySpecial,
		TopBannerPfp,
		ShareButton,
		JournalUpdates,
		BorrowerEducationPlacement,
		LoanTags,
		LoanComments,
		LoanDetailsRailToggle,
		KvLoadingPlaceholder,
		DefinitionsLightbox,
	},
	inject: ['apollo', 'cookieStore'],
	provide() {
		return {
			// One definitions lightbox for the BP page; children call this with their cid/sfid.
			openDefinition: payload => this.$refs.definitionsLightbox?.open(payload),
		};
	},
	apollo: {
		query: gql`
			${fullProfileFragment}
			query fullBorrowerProfileData($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						...bpFullProfileFields
					}
				}
				my {
					id
					userPreferences {
						id
						preferences
					}
				}
			}
		`,
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result({ data }) {
			this.loanData = data?.lend?.loan ?? {};
			this.userPreferences = data?.my?.userPreferences ?? null;
			// Reconcile with localStorage (client-only); account preference still wins.
			this.showDetailsInRail = resolveRailPreference({
				accountPref: readAccountRailPreference(this.userPreferences),
				local: getLocalRailPreference(),
			});
		},
	},
	emits: ['subscription-toggled'],
	props: {
		loan: {
			type: Object,
			default: () => ({}),
		},
		lender: {
			type: Object,
			default: () => ({}),
		},
		loading: {
			type: Boolean,
			default: true,
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false,
		},
		teamId: {
			type: Number,
			default: null,
		},
		teamName: {
			type: String,
			default: '',
		},
		showEducationPlacementExp: {
			type: Boolean,
			default: false,
		},
		loanRegion: {
			type: String,
			default: '',
		},
		initialShowDetailsInRail: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			// Initialize from loan prop so SSR renders real content.
			// The watch query will refresh with latest data client-side.
			loanData: this.loan?.id ? { ...this.loan } : {},
			showUpdates: true,
			showLenders: true,
			showTeams: true,
			isMobile: false,
			// Initialize from the SSR-resolved prop so logged-in opted-in renders without flash.
			showDetailsInRail: this.initialShowDetailsInRail,
			userPreferences: null,
		};
	},
	computed: {
		loanId() {
			return Number(this.$route?.params?.id ?? 0);
		},
		inPfp() {
			return isActivelyInPfp(this.loanData);
		},
		pfpMinLenders() {
			return this.loanData?.pfpMinLenders ?? 0;
		},
		numLenders() {
			return this.loanData?.lenders?.totalCount ?? 0;
		},
		diffInDays() {
			const expDate = this.loanData?.plannedExpirationDate;
			if (!expDate) return 0;
			return differenceInCalendarDays(parseISO(expDate), new Date());
		},
		isLoggedIn() {
			return !!this.lender?.id;
		},
		isPrivileged() {
			return this.loanData?.userProperties?.isPrivileged ?? false;
		},
		shareCampaign() {
			return this.inPfp ? 'social_share_bp_pfp' : 'social_share_bp';
		},
		shareBtnVariant() {
			return this.isMobile ? 'secondary' : 'caution';
		},
		showDetailsInRailModel: {
			get() {
				return this.showDetailsInRail;
			},
			set(value) {
				this.showDetailsInRail = value;
				this.$kvTrackEvent(
					'borrower-profile',
					'toggle',
					'loan-details-sidebar',
					value ? 'on' : 'off',
					this.loanId,
				);
				persistRailPreference(this.apollo, {
					value,
					userPreferences: this.userPreferences,
					isLoggedIn: this.isLoggedIn,
				});
			},
		},
	},
	mounted() {
		this.determineIfMobile();
		window.addEventListener('resize', this.throttledResize);
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
		throttledResize: _throttle(function throttledResize() {
			this.determineIfMobile();
		}, 200),
	},
};
</script>
