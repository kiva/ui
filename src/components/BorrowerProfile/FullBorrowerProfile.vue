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
					ref="summaryCard"
					data-testid="bp-summary"
					class="tw-relative lg:tw--mb-1.5"
					:class="{
						'tw-bg-primary tw--mx-2.5 tw-px-2.5 md:tw-mx-0': isNewUserBpVariant,
					}"
					:loan="loanData"
					:is-logged-in="isLoggedIn"
					:show-actions="isNewUserBpVariant"
					@share="openShareLightbox"
					@loan-details="scrollToLoanDetails"
				>
					<!-- Below desktop there is no separate lend box, so these show in the top card -->
					<template v-if="isNewUserBpVariant" #footer>
						<div class="lg:tw-hidden">
							<hr class="tw-border-tertiary tw-mt-3">
							<nonprofit-trust-row class="tw-py-2" />
							<loan-supporters-row
								v-if="loanData.id"
								class="tw--mx-2.5 tw-px-2.5 md:tw--mx-3 md:tw-px-3 md:last:tw--mb-2.5 tw-text-small"
								:loan="loanData"
							/>
							<loan-matching-info
								class="tw-py-1"
								:loan="loanData"
								tooltip-id="top-card-matching-tooltip"
							/>
						</div>
					</template>
				</summary-card>
				<!-- New user version: the share lightbox opens from the top card, so its own trigger is hidden.
					Lives outside the lend box because that slot is dropped while the lend box is sticky;
					rendered only once the loan has loaded, as today. -->
				<share-button
					v-if="isNewUserBpVariant && !loading"
					v-bind="shareButtonProps"
					variant="hidden"
					data-testid="bp-summary-share-lightbox"
					:open-lightbox="isShareLightboxOpen"
					@lightbox-closed="isShareLightboxOpen = false"
				/>
			</content-container>
		</div>
		<!-- Bare page container: the band spans the full content width, not the story column -->
		<kv-page-container
			v-if="isNewUserBpVariant"
			ref="whyLoansDesktop"
			class="tw-hidden lg:tw-block lg:tw-mt-5.5"
			:style="{ paddingTop: `${whyLoansExtraSpace}px` }"
			data-testid="bp-why-loans-desktop"
		>
			<why-loans-banner :loan="loanData" @how-it-works="showHowKivaWorks = true" />
		</kv-page-container>
		<div
			ref="sidebarColumn"
			:class="inPfp ? 'lg:tw-pt-16 lg:tw-mt-8' : 'lg:tw-pt-8'"
			class="lg:tw-absolute tw-pointer-events-none lg:tw-w-full lg:tw-h-full lg:tw-top-0 tw-z-docked"
		>
			<sidebar-container
				class="lg:tw-sticky lg:tw-pb-8 lg:tw-top-12"
				:class="isNewUserBpVariant ? 'lg:tw-mt-1' : 'lg:tw-mt-10'"
			>
				<div class="tw-flex tw-flex-col" style="max-height: calc(100vh - 7.5rem)">
					<lend-cta
						ref="lendCta"
						class="tw-pointer-events-auto"
						:loan-id="loanId"
						:loan-data="loanData"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:show-details-in-rail="showDetailsInRail"
						:hide-jump-links="isNewUserBpVariant"
						:new-user-bp-enabled="isNewUserBpVariant"
					>
						<!-- Share button; the new user version shows it in the top card instead -->
						<template v-if="!isNewUserBpVariant" #sharebutton>
							<template v-if="loading">
								<kv-loading-placeholder style="height: 2rem; width: 100%;" />
							</template>
							<share-button
								v-else
								v-bind="shareButtonProps"
								class="tw-block lg:tw-mb-1.5"
								:variant="shareBtnVariant"
							/>
						</template>
					</lend-cta>
					<transition name="kvfastfade">
						<div
							v-if="showDetailsInRail"
							data-testid="bp-rail-details"
							class="tw-hidden lg:tw-block tw-pointer-events-auto
								tw-bg-primary tw-rounded tw-p-4
								tw-shrink tw-overflow-y-auto"
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
			<div
				v-if="isNewUserBpVariant"
				class="lg:tw-hidden tw-mb-5 md:tw-mb-6"
				data-testid="bp-why-loans-mobile"
			>
				<why-loans-banner :loan="loanData" @how-it-works="showHowKivaWorks = true" />
			</div>
		</content-container>
		<content-container>
			<journal-updates
				v-if="showUpdatesSection"
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
				:collapsible="isNewUserBpVariant"
				:class="isNewUserBpVariant ? 'tw-mb-4' : 'tw-mb-5 md:tw-mb-6 lg:tw-mb-8'"
				:loan-id="loanId"
			/>
			<borrower-country data-testid="bp-country" class="tw-mb-4" :loan-id="loanId" />
			<contributing-partners
				data-testid="bp-contributing-partners"
				:collapsible="isNewUserBpVariant"
				:class="isNewUserBpVariant ? 'tw-mb-2' : 'tw-mb-4'"
				:loan-id="loanId"
			/>
			<lenders-and-teams
				v-if="showLenders"
				data-testid="bp-lenders"
				key="lenders"
				:class="isNewUserBpVariant ? 'tw-mb-2' : 'tw-mb-4'"
				:loan-id="loanId"
				display-type="lenders"
				:collapsible="isNewUserBpVariant"
				@hide-section="showLenders = false"
			/>
			<lenders-and-teams
				v-if="showTeams"
				data-testid="bp-teams"
				key="teams"
				class="tw-mb-4"
				:loan-id="loanId"
				display-type="teams"
				:collapsible="isNewUserBpVariant"
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
			<loan-tags
				v-if="showTags"
				class="tw-my-5 md:tw-my-6 lg:tw-my-8"
				:loan-id="loanId"
				:is-logged-in="isLoggedIn"
				@hide-section="showTags = false"
			/>
			<loan-comments
				v-if="showAddCommentsSection"
				class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
				:loan-id="loanId"
			/>
		</content-container>
		<definitions-lightbox ref="definitionsLightbox" />
		<how-kiva-works-lightbox
			:visible="showHowKivaWorks"
			@lightbox-closed="showHowKivaWorks = false"
		/>
	</article>
</template>

<script>
import { gql } from 'graphql-tag';
import useIsMobile from '#src/composables/useIsMobile';
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
import NonprofitTrustRow from '#src/components/BorrowerProfile/NonprofitTrustRow';
import LoanMatchingInfo from '#src/components/BorrowerProfile/LoanMatchingInfo';
import LoanSupportersRow from '#src/components/BorrowerProfile/LoanSupportersRow';
import smoothScrollMixin from '#src/plugins/smooth-scroll-mixin';
import HowKivaWorksLightbox from '#src/components/BorrowerProfile/HowKivaWorksLightbox';
import WhyLoansBanner from '#src/components/BorrowerProfile/WhyLoansBanner';
import {
	getLocalRailPreference,
	readAccountRailPreference,
	resolveRailPreference,
	persistRailPreference,
} from '#src/util/loanDetailsRailPreference';
import { isActivelyInPfp } from '#src/util/loanUtils';
import { NEW_USER_BP_EXP_INJECT_KEY } from '#src/util/newUserBorrowerProfileExp';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { KvLoadingPlaceholder, KvPageContainer } from '@kiva/kv-components';

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

export const fullProfileQuery = gql`
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
		NonprofitTrustRow,
		LoanMatchingInfo,
		LoanSupportersRow,
		HowKivaWorksLightbox,
		WhyLoansBanner,
		KvPageContainer,
	},
	mixins: [smoothScrollMixin],
	inject: {
		apollo: { from: 'apollo' },
		cookieStore: { from: 'cookieStore' },
		// Provided by the page; false wherever the page does not provide it (Storybook, specs)
		isNewUserBpVariant: { from: NEW_USER_BP_EXP_INJECT_KEY, default: false },
	},
	provide() {
		return {
			// One definitions lightbox for the BP page; children call this with their cid/sfid.
			openDefinition: payload => this.$refs.definitionsLightbox?.open(payload),
		};
	},
	setup() {
		const { isMobile } = useIsMobile();
		return { isMobile };
	},
	apollo: {
		query: fullProfileQuery,
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
			loanData: this.loan?.id ? { ...this.loan } : {},
			showUpdates: true,
			showLenders: true,
			showTeams: true,
			showTags: true,
			// Initialize from the SSR-resolved prop so logged-in opted-in renders without flash.
			showDetailsInRail: this.initialShowDetailsInRail,
			userPreferences: null,
			isShareLightboxOpen: false,
			showHowKivaWorks: false,
			whyLoansExtraSpace: 0,
			cardsObserver: null,
		};
	},
	mounted() {
		if (this.isNewUserBpVariant && typeof ResizeObserver !== 'undefined') {
			this.cardsObserver = new ResizeObserver(() => this.updateWhyLoansSpace());
			this.cardsObserver.observe(this.$refs.summaryCard.$el);
			this.cardsObserver.observe(this.$refs.lendCta.$el);
		}
	},
	beforeUnmount() {
		this.cardsObserver?.disconnect();
	},
	methods: {
		// Adds space above the "Why loans" band when the sticky lend box ends lower than the top card
		updateWhyLoansSpace() {
			const column = this.$refs.sidebarColumn;
			// Measured from its column, since the sticky lend box moves on scroll
			const lendBoxBottom = column.getBoundingClientRect().top
				+ parseFloat(getComputedStyle(column).paddingTop)
				+ parseFloat(getComputedStyle(column.firstElementChild).marginTop)
				+ this.$refs.lendCta.$el.offsetHeight;
			const bandTop = this.$refs.whyLoansDesktop.$el.getBoundingClientRect().top;
			this.whyLoansExtraSpace = Math.max(0, Math.ceil(lendBoxBottom + 32 - bandTop));
		},
		openShareLightbox() {
			this.isShareLightboxOpen = true;
			// The hidden share button has no trigger to fire this itself
			this.$kvTrackEvent('borrower-profile', 'show', 'share-lightbox', this.shareCampaign);
		},
		scrollToLoanDetails() {
			// Same target and timing as the lend box jump link; the rail toggle is left untouched
			const section = document.querySelector('#loanDetails');
			this.smoothScrollTo({ yPosition: section?.offsetTop ?? 0, millisecondsToAnimate: 750 });
			this.$kvTrackEvent('Borrower profile', 'click-jump-link', 'Loan details');
		},
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
		isAnonymized() {
			const level = this.loanData?.anonymizationLevel;
			return level === 'full' || level === 'pii';
		},
		showAddCommentsSection() {
			// Only privileged users (e.g. lenders on this loan) can see the comment
			// section, and only while the loan is not anonymized (full/pii).
			return this.isPrivileged && !this.isAnonymized;
		},
		showUpdatesSection() {
			// Hide the journal updates section entirely for PII-anonymized loans: their
			// single-loan journal bodies are stripped during PII anonymization, so any
			// remaining entries render empty. Scoped to 'pii' specifically — 'full' (refunded)
			// loans keep their journal content and are already excluded server-side by the
			// borrower-privacy rules.
			return this.showUpdates && this.loanData?.anonymizationLevel !== 'pii';
		},
		shareCampaign() {
			return this.inPfp ? 'social_share_bp_pfp' : 'social_share_bp';
		},
		shareBtnVariant() {
			return this.isMobile ? 'secondary' : 'caution';
		},
		// Bound to the share button wherever it renders (lend box in the control, hidden in the new user version)
		shareButtonProps() {
			return {
				loan: this.loanData,
				lender: this.lender,
				campaign: this.shareCampaign,
				inPfp: this.inPfp,
				pfpMinLenders: this.pfpMinLenders,
				numLenders: this.numLenders,
			};
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
};
</script>
