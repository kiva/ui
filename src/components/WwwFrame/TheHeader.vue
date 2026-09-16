<template>
	<header
		class="tw-transition-all tw-duration-1000 tw-ease-in-out"
		:class="stickyHeader ? 'tw-sticky tw-top-0 tw-z-sticky' : ''"
	>
		<KvWwwHeaderBasic
			v-if="showBasicHeader"
			class="tw-bg-primary tw-border-b tw-border-tertiary tw-relative"
			ref="newExpHeader"
			:logged-in="!isVisitor"
			:basket-count="basketCount"
			:login-url="loginUrl"
			:balance="balance"
			:is-borrower="isBorrower"
			:is-trustee="isTrustee"
			:trustee-id="trusteeId"
			:most-recent-borrowed-loan-id="loanId"
			:user-id="userId"
			:is-mobile="isMobile"
			:lender-image-url="profilePic"
			:is-user-data-loading="isUserDataLoading"
			:is-basket-data-loading="isBasketLoading"
			:style="esiCssVarBridge"
			:countries-not-lent-to-url="COUNTRIES_NOT_LENT_TO_URL"
			:show-major-gifts-exp="isMajorGiftsHeaderExp"
			show-m-g-upsell-link
			use-esi-avatar
			@load-lend-menu-data="loadMenu"
			@load-search-data="loadSearchData"
			@search-submit="onSearchSubmit"
		/>
		<nav
			v-else
			aria-label="Primary navigation"
			class="tw-bg-primary tw-border-b tw-border-tertiary tw-relative"
		>
			<kv-page-container>
				<!-- minimal header -->
				<template v-if="minimal">
					<div class="tw-flex tw-justify-center">
						<a
							class="header__button tw-inline-flex"
							:href="homePagePath"
							data-testid="header-home"
							v-kv-track-event="['TopNav','click-Logo']"
						>
							<kiva-logo class="tw-w-6 tw-text-brand" style="transform: translateY(-0.1875rem);" />
							<span class="tw-sr-only">Kiva Home</span>
						</a>
					</div>
				</template>

				<!-- Corporate header for /cc pages -->
				<template v-else-if="corporate">
					<div
						class="
							tw-flex tw-gap-2.5 lg:tw-gap-6 tw-items-center align-middle"
					>
						<campaign-logo-group
							class="tw-h-2.5 lg:tw-h-3.5"
							:corporate-logo-url="corporateLogoUrl"
							:logo-height="logoHeight"
							:logo-classes="logoClasses"
						/>
						<div class="tw-flex-1"></div>
						<span
							@click="$emit('show-basket')"
							data-testid="header-basket"
							class="header__button header__basket tw-cursor-pointer"
							v-kv-track-event="['TopNav','click-Basket']"
							:style="isBasketLoading ? {
								display: 'var(--ui-data-corporate-basket-count-display, inline-flex)',
							} : {
								display: hasBasket ? 'inline-flex' : 'none'
							}"
						>
							<span class="tw-bg-secondary tw-rounded-xs tw-py-0.5 tw-px-1 tw-mr-1">
								<div v-if="isBasketLoading" class="tw-w-1 tw-h-3">
									<kv-loading-placeholder />
								</div>
								<template v-else>
									{{ basketCount - lcaLoanCount }}
								</template>
							</span>
							Basket
						</span>
						<my-kiva-button
							v-show="!isVisitor"
							:id="myKivaMenuId"
							class="header__button header__portfolio"
							:balance="balance"
							:is-user-data-loading="isUserDataLoading"
							:profile-pic="profilePic"
							:profile-pic-id="profilePicId"
						/>
						<kv-button
							variant="secondary"
							v-show="isVisitor"
							class="tw-bg-white tw-whitespace-nowrap"
							:to="loginUrl"
							data-testid="header-log-in"
							v-kv-track-event="['TopNav','click-Sign-in']"
						>
							Log in
						</kv-button>
					</div>
				</template>
			</kv-page-container>
		</nav>
		<promo-credit-banner v-if="!hidePromoCreditBanner" />
	</header>
</template>

<script>
import { getTransactorFlagsFromCookies } from '@kiva/kv-analytics';
import {
	userHasLentBefore,
	userHasDepositBefore,
} from '#src/util/optimizelyUserMetrics';
import { setHotJarUserAttributes, fireNewUserHotJarEvent } from '#src/util/hotJarUtils';
import headerQueryPrivate from '#src/graphql/query/wwwHeaderPrivate.graphql';
import KivaLogo from '#src/assets/inline-svgs/logos/kiva-logo.svg';
import CampaignLogoGroup from '#src/components/CorporateCampaign/CampaignLogoGroup';
import _throttle from 'lodash/throttle';
import MyKivaButton from '#src/components/WwwFrame/Header/MyKivaButton';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import {
	KvButton, KvLoadingPlaceholder, KvPageContainer, KvWwwHeaderBasic
} from '@kiva/kv-components';
import { queryExperimentAssignment, trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import useMyKivaHome from '#src/composables/useMyKivaHome';
import { COUNTRIES_NOT_LENT_TO_URL } from '#src/util/headerUtils';
import PromoCreditBanner from './PromotionalBanner/Banners/PromoCreditBanner';

const COMMS_OPT_IN_EXP_KEY = 'opt_in_comms';
const MAJOR_GIFTS_HEADER_EXP_KEY = 'major_gifts_header';
const MAJOR_GIFTS_HEADER_EXP_ACTION = 'EXP-CIT-5148-Sept2026';

export default {
	name: 'TheHeader',
	components: {
		CampaignLogoGroup,
		KivaLogo,
		KvLoadingPlaceholder,
		KvPageContainer,
		MyKivaButton,
		PromoCreditBanner,
		KvButton,
		KvWwwHeaderBasic,
	},
	inject: {
		apollo: { default: null },
		cookieStore: { default: null },
		kvAuth0: { default: null },
	},
	data() {
		return {
			balance: 0,
			basketCount: 0,
			hasEverLoggedIn: false,
			isBasketLoading: false,
			isBorrower: false,
			isMajorGiftsHeaderExp: false,
			isMobile: false,
			isUserDataLoading: false,
			lcaLoanCount: 0,
			loanId: null,
			myKivaMenuId: 'my-kiva-header-dropdown',
			profilePic: '',
			profilePicId: null,
			trusteeId: null,
			userId: null,
			throttledDetermineIfMobile: null,
			COUNTRIES_NOT_LENT_TO_URL,
		};
	},
	emits: ['show-basket'],
	props: {
		hideSearchInHeader: {
			type: Boolean,
			default: false,
		},
		minimal: {
			type: Boolean,
			default: false
		},
		stickyHeader: {
			type: Boolean,
			default: false
		},
		corporate: {
			type: Boolean,
			default: false
		},
		corporateLogoUrl: {
			type: String,
			default: ''
		},
		logoHeight: {
			type: String,
			default: '28',
			required: false
		},
		logoClasses: {
			type: String,
			default: '',
			required: false
		},
	},
	setup() {
		const { homePagePath } = useMyKivaHome();

		return {
			homePagePath,
		};
	},
	computed: {
		// Bridge --ui-data-* CSS variables (set by ESI head) to the unprefixed names
		// KvWwwHeaderBasic/LinkBar expects. Only needed during CDN-cached loading state.
		// No fallback defaults here — let LinkBar's own fallbacks apply.
		// The basket loads on every cached page, so gating on user data alone would leave
		// --basket-display unreachable for the logged-out case it exists to cover.
		esiCssVarBridge() {
			if (!this.isUserDataLoading && !this.isBasketLoading) return undefined;
			return {
				'--basket-display': 'var(--ui-data-basket-count-display)',
				'--user-loading-display': 'var(--ui-data-user-loading-display)',
				'--user-avatar-display': 'var(--ui-data-user-avatar-display)',
				'--user-avatar-legacy-display': 'var(--ui-data-user-avatar-legacy-display)',
				'--user-avatar': 'var(--ui-data-user-avatar)',
			};
		},
		// The basic header is the default; the legacy <nav> serves only minimal and corporate.
		showBasicHeader() {
			return !this.minimal && !this.corporate;
		},
		isVisitor() {
			return !this.userId && !this.$renderConfig?.cdnNotedLoggedIn;
		},
		isTrustee() {
			return !!this.trusteeId;
		},
		hasBasket() {
			if (this.corporate) {
				return this.basketCount - this.lcaLoanCount > 0;
			}
			return this.basketCount > 0;
		},
		hidePromoCreditBanner() {
			// hide this banner on managed lending landing + checkout pages
			const routeExclusions = ['/cc', '/checkout'];
			const routePath = this.$route?.path;
			const matchedRoutes = routeExclusions.filter(item => {
				return routePath.indexOf(item) !== -1;
			});
			return matchedRoutes.length > 0;
		},
		loginUrl() {
			if (this.$route.path === '/') {
				return '/ui-login';
			}
			return `/ui-login?doneUrl=${encodeURIComponent(this.$route.fullPath)}`;
		},
	},
	apollo: [
		{
			query: headerQueryPrivate,
			preFetch: true,
			shouldPreFetch(config, { renderConfig }) {
				// Don't prefetch if using CDN caching
				return !renderConfig.useCDNCaching;
			},
			result({ data }) {
				this.isBasketLoading = false;
				this.isUserDataLoading = false;
				this.userId = data?.my?.userAccount?.id ?? null;
				this.isBorrower = data?.my?.isBorrower ?? false;
				this.loanId = data?.my?.mostRecentBorrowedLoan?.id ?? null;
				this.trusteeId = data?.my?.trustee?.id ?? null;
				this.basketCount = data?.shop?.nonTrivialItemCount ?? 0;
				this.balance = Math.floor(data?.my?.userAccount?.balance ?? 0);
				this.profilePic = data?.my?.lender?.image?.url ?? '';
				this.profilePicId = data?.my?.lender?.image?.id ?? null;
				this.hasEverLoggedIn = data?.hasEverLoggedIn;

				// Fire a Hotjar new_user event for brand-new visitors. Done here
				// (not in mounted) because hasEverLoggedIn is only authoritative once the
				// query resolves; firing earlier risks tagging a logged-in user as new.
				fireNewUserHotJarEvent(this.hasEverLoggedIn);
			},
		},
	],
	created() {
		this.isBasketLoading = this.$renderConfig?.useCDNCaching ?? false;
		this.isUserDataLoading = this.$renderConfig?.useCDNCaching && this.$renderConfig?.cdnNotedLoggedIn;
	},
	mounted() {
		// Assigned on the client rather than prefetched during SSR, so an unassigned visitor has no
		// version until this resolves. Assignment here buckets on the `uiv` visitor id, since the
		// `kvu` ticket a server-side assignment would hash is HTTP only.
		queryExperimentAssignment(this.apollo, this.$route, MAJOR_GIFTS_HEADER_EXP_KEY)
			.then(({ data }) => {
				this.isMajorGiftsHeaderExp = data?.experiment?.version === 'b';

				trackExperimentVersion(
					this.apollo,
					this.$kvTrackEvent,
					'event-tracking',
					MAJOR_GIFTS_HEADER_EXP_KEY,
					MAJOR_GIFTS_HEADER_EXP_ACTION,
				);
			})
			.catch(e => logReadQueryError(e, `TheHeader ${MAJOR_GIFTS_HEADER_EXP_KEY}`));

		const { version } = this.apollo.readFragment({
			id: `Experiment:${COMMS_OPT_IN_EXP_KEY}`,
			fragment: experimentVersionFragment,
		}) ?? {};

		if (version) {
			this.cookieStore.set(COMMS_OPT_IN_EXP_KEY, version, { path: '/' });
		}

		// MARS-194 User Metrics for Optimizely A/B experiment
		const { hasLentBefore, hasDepositBefore } = getTransactorFlagsFromCookies(
			name => this.cookieStore.get(name),
		);

		userHasLentBefore(hasLentBefore);
		userHasDepositBefore(hasDepositBefore);

		// MARS-246 Hotjar user attributes
		setHotJarUserAttributes({
			userId: this.userId,
			hasEverLoggedIn: this.hasEverLoggedIn,
			hasLentBefore,
			hasDepositBefore,
		});

		this.throttledDetermineIfMobile = _throttle(() => {
			this.determineIfMobile();
		}, 200);

		this.determineIfMobile();
		window.addEventListener('resize', this.throttledDetermineIfMobile);

		// Prefetch the basic header's search suggestions on mount.
		if (this.showBasicHeader) {
			this.loadSearchData();
		}
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.throttledDetermineIfMobile);
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
		loadMenu() {
			if (this.$refs.newExpHeader) {
				this.$refs.newExpHeader.loadMenuData(this.apollo);
			}
		},
		// loadSearchData delegates to the new header's exposed loadSearchSuggestions method so the
		// component fetches its own loan-search-suggestion dataset (mirrors loadMenu → loadMenuData).
		// onSearchSubmit still performs navigation since the header emits the search payload.
		loadSearchData() {
			if (this.$refs.newExpHeader) {
				this.$refs.newExpHeader.loadSearchSuggestions(this.apollo);
			}
		},
		onSearchSubmit(payload) {
			// KvWwwHeaderBasic emits a payload whose `url` is the origin + path only, with the
			// query params returned separately; recombine them before navigating.
			const href = payload.query
				? `${payload.url}?${new URLSearchParams(payload.query).toString()}`
				: payload.url;
			window.location.href = href;
		},
	},
	watch: {
		basketCount() {
			// update leftover credit allocation loan count when basket count is updated
			this.lcaLoanCount = this.cookieStore.get('lcaid') ? 1 : 0;
		}
	}
};
</script>

<style lang="postcss" scoped>
.header__button {
	@apply tw-items-center tw-flex-shrink-0;
	@apply tw-font-medium tw-text-primary hover:tw-text-action-highlight;
	@apply tw-no-underline hover:tw-no-underline focus:tw-no-underline;
	@apply tw-h-8 md:tw-h-9 tw-whitespace-nowrap tw-flex-shrink-0;
}
</style>
