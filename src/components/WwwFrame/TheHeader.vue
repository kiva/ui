<template>
	<header
		class="tw-transition-all tw-duration-1000 tw-ease-in-out"
		:class="isInExperimentPages & enableAddToBasketExp ? 'tw-sticky tw-top-0 tw-z-sticky' : ''"
	>
		<KvWwwHeader
			v-if="isNavUpdateExp"
			class="tw-bg-primary tw-border-b tw-border-tertiary tw-relative"
			ref="newExpHeader"
			:logged-in="!isVisitor"
			:basket-count="basketCount"
			:login-url="loginUrl"
			:balance="balance"
			:is-borrower="isBorrower"
			:is-trustee="isTrustee"
			:user-id="userId"
			:is-mobile="isMobile"
			:lender-image-url="profilePic"
			:countries-not-lent-to-url="countriesNotLentToUrl"
			show-m-g-upsell-link
			@load-lend-menu-data="loadMenu"
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

				<!-- Default Header -->
				<template v-else>
					<div
						class="header
							tw-grid xl:tw-gap-x-4 tw-items-center"
						:class="{
							'tw-gap-x-1 ': isMobile,
							'tw-gap-x-2.5': !isMobile,
							'header--mobile-open': searchOpen || isVisitor,
							'header--tablet-open': openTabletVariant,
						}"
					>
						<!-- Logo -->
						<div class="header__logo">
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

						<!-- Lend -->
						<router-link
							:id="lendMenuId"
							to="/lend-by-category"
							data-testid="header-lend"
							class="header__button header__lend tw-inline-flex"
							v-kv-track-event="['TopNav','click-Lend']"
							@pointerenter.stop="onLendLinkPointerEnter"
							@pointerleave.stop="onLendLinkPointerLeave"
							@pointerup.stop="onLendLinkPointerUp"
							@click.stop="onLendLinkClick"
						>
							<span class="tw-flex tw-items-center">Lend
								<kv-material-icon
									class="tw-w-3 tw-h-3 tw-transition-transform tw-duration-300"
									:icon="mdiChevronDown"
									:class="{'tw-rotate-180' : isLendMenuVisible}"
								/>
							</span>
						</router-link>

						<transition name="kvfastfade">
							<div
								v-show="isLendMenuVisible"
								class="
								tw-absolute tw-left-0 tw-right-0 tw-top-8 md:tw-top-9 tw-z-dropdown
								tw-bg-primary tw-border-b tw-border-tertiary"
								data-testid="header-lend-dropdown-list"
								style="margin-top: 1px;"
							>
								<kv-page-container>
									<the-lend-menu
										ref="lendMenu"
										@pointerenter="onLendMenuPointerEnter"
										@pointerleave="onLendMenuPointerLeave"
									/>
								</kv-page-container>
							</div>
						</transition>

						<!-- Search -->
						<div
							v-if="!hideSearchInHeader"
							data-testid="header-search-area"
							id="top-nav-search-area"
							class="
								header__search
								tw-py-1.5 md:py-0
								tw--mx-2.5 tw-px-2 md:tw-mx-0 md:tw-px-0
								tw-border-t tw-border-tertiary md:tw-border-t-0
								lg:tw-block
							"
							:class="{
								'tw-hidden': !searchOpen || isVisitor,
								'md:tw-hidden': hasBasket && isVisitor && !searchOpen || !searchOpen,
								'md:tw-block': searchOpen || !isVisitor,
								'md:!tw-block': searchOpen && hasBasket && balance || !hasBasket,
								'lg:tw-block': hasBasket,
							}"
						>
							<search-bar ref="search" />
						</div>

						<div
							class="header__right-side
						tw-flex tw-justify-end xl:tw-gap-4 align-middle"
							:class="{
								'tw-gap-1': isMobile,
								'tw-gap-2.5': !isMobile,
							}"
						>
							<!-- Mobile Search Toggle -->
							<button
								class="header__button header__search-icon tw-inline-flex"
								:class="{
									'!tw-hidden': isVisitor,
									'md:!tw-hidden': !hasBasket,
									'md:!tw-inline-flex lg:!tw-hidden': isVisitor && hasBasket,
									'lg:!tw-hidden': !isVisitor,
								}"
								v-show="!hideSearchInHeader"
								data-testid="header-mobile-search-toggle"
								:aria-expanded="searchOpen ? 'true' : 'false'"
								:aria-pressed="searchOpen ? 'true' : 'false'"
								aria-controls="top-nav-search-area"
								@click="toggleMobileSearch"
								v-kv-track-event="['TopNav','click-search-toggle']"
							>
								<kv-material-icon class="tw-w-3 tw-h-3" :icon="mdiMagnify" />
							</button>

							<!-- Borrow -->
							<router-link
								v-show="!isMobile"
								to="/borrow"
								data-testid="header-borrow"
								class="header__borrow"
								:class="{
									'tw-hidden': !isVisitor,
									'header__button !tw-hidden md:!tw-flex': isVisitor
								}"
								v-kv-track-event="['TopNav','click-Borrow']"
							>
								Borrow
							</router-link>

							<!-- Teams -->
							<teams-menu
								v-if="!isVisitor && teamsMenuEnabled"
								class="tw-hidden lg:tw-block"
								:teams="teams"
							/>

							<!-- About -->
							<div class="tw-group" :class="{ 'tw-hidden md:tw-block': !isVisitor }">
								<router-link
									:id="aboutMenuId"
									to="/about"
									data-testid="header-about"
									class="header__about header__button tw-inline-flex"
									v-kv-track-event="['TopNav','click-About']"
								>
									<span class="tw-flex">
										About
										<kv-material-icon
											class="tw-w-3 tw-h-3
											tw-transition-transform tw-duration-300 group-hover:tw-rotate-180"
											:icon="mdiChevronDown"
										/>
									</span>
								</router-link>
								<kv-dropdown
									:controller="aboutMenuId"
									class="dropdown-list"
									data-testid="header-about-dropdown-list"
								>
									<ul>
										<li>
											<router-link
												to="/about"
												v-kv-track-event="['TopNav','click-About-About us']"
											>
												About us
											</router-link>
										</li>
										<li>
											<a
												href="/about/partner-with-us"
												v-kv-track-event="['TopNav','click-About-Partner with us']"
											>
												Partner with us
											</a>
										</li>
										<li>
											<a
												href="/about/how"
												v-kv-track-event="['TopNav','click-About-How Kiva works']"
											>
												How Kiva works
											</a>
										</li>
										<li>
											<router-link
												to="/donate/supportus"
												v-kv-track-event="['TopNav', 'click-Support-Kiva']"
											>
												Support Kiva
											</router-link>
										</li>
										<li>
											<router-link
												to="/about/where-kiva-works"
												v-kv-track-event="['TopNav','click-About-Where Kiva works']"
											>
												Where Kiva works
											</router-link>
										</li>
										<li>
											<router-link
												to="/impact"
												v-kv-track-event="['TopNav','click-About-Impact']"
											>
												Impact
											</router-link>
										</li>
										<li>
											<router-link
												to="/about/leadership"
												v-kv-track-event="['TopNav','click-About-Leadership']"
											>
												Leadership
											</router-link>
										</li>
										<li>
											<router-link
												to="/about/finances"
												v-kv-track-event="['TopNav','click-About-Finances']"
											>
												Finances
											</router-link>
										</li>
										<li>
											<a
												href="/about/press-center"
												v-kv-track-event="['TopNav','click-About-Press']"
											>
												Press
											</a>
										</li>
										<li>
											<router-link
												to="/about/due-diligence"
												v-kv-track-event="['TopNav','click-About-Due diligence']"
											>
												Due diligence
											</router-link>
										</li>
									</ul>
								</kv-dropdown>
							</div>

							<!-- Basket -->
							<div
								:style="isBasketLoading ? {
									display: 'var(--ui-data-basket-count-display, flex)',
								} : {
									display: hasBasket ? 'flex' : 'none'
								}"
							>
								<router-link
									to="/basket"
									data-testid="header-basket"
									class="header__button header__basket"
									:class="{
										'tw-hidden md:tw-flex': !hasLargeBasket,
										'tw-flex': hasLargeBasket,
									}"
									v-kv-track-event="['TopNav','click-Basket']"
								>
									<span class="tw-bg-secondary tw-rounded-xs tw-py-0.5 tw-px-1 tw-mr-1">
										<div v-if="isBasketLoading" class="tw-w-1 tw-h-3">
											<kv-loading-placeholder />
										</div>
										<template v-else>
											{{ basketNumber }}
										</template>
									</span>
									<span class="tw-hidden md:tw-flex">Basket</span>
								</router-link>

								<!-- Mobile Basket -->
								<router-link
									to="/basket"
									data-testid="header-basket"
									class="tw-flex tw-items-center tw-relative md:tw-hidden tw-text-eco-green-4"
									v-kv-track-event="['TopNav','click-Basket']"
								>
									<span
										class="tw-absolute tw-w-4 tw-h-4 tw-pt-0.5
											tw-flex tw-items-center tw-justify-center
											tw-text-white tw-text-small tw-font-medium"
									>
										<div v-if="isBasketLoading" class="tw-w-1 tw-h-1.5">
											<kv-loading-placeholder />
										</div>
										<template v-else>
											{{ basketCount }}
										</template>
									</span>
									<kv-material-icon
										:icon="mdiBriefcase"
										class="tw-inline-block tw-w-4 tw-h-4"
									/>
								</router-link>
							</div>

							<!-- Log in Link -->
							<router-link
								v-show="isVisitor"
								class="header__button tw-bg-white tw-whitespace-nowrap tw-inline-flex"
								:to="loginUrl"
								data-testid="header-log-in"
								v-kv-track-event="['TopNav','click-Sign-in']"
							>
								Log in
							</router-link>

							<!-- Support Kiva -->
							<kv-button
								variant="secondary"
								v-show="!isMobile"
								class="tw-hidden md:tw-block tw-bg-white tw-whitespace-nowrap"
								href="/donate/supportus"
								data-testid="header-support-kiva"
								v-kv-track-event="['TopNav', 'click-Support-Kiva']"
							>
								Support Kiva
							</kv-button>

							<!-- Logged in Profile -->
							<my-kiva-button
								v-show="!isVisitor"
								:id="myKivaMenuId"
								class="header__button header__portfolio"
								:balance="balance"
								:is-user-data-loading="isUserDataLoading"
								:profile-pic="profilePic"
								:profile-pic-id="profilePicId"
							/>

							<kv-dropdown
								:controller="myKivaMenuId"
								v-show="!isVisitor"
								class="dropdown-list"
								data-testid="header-my-kiva-dropdown-list"
								id="my-kiva-dropdown"
								ref="userDropdown"
							>
								<ul>
									<template v-if="isBorrower">
										<li>
											<router-link
												to="/my/borrower"
												v-kv-track-event="['TopNav','click-Portfolio-My borrower dashboard']"
											>
												My borrower dashboard
											</router-link>
										</li>
										<template v-if="loanId !== null">
											<li>
												<router-link
													:to="`/lend/${loanId}`"
													v-kv-track-event="['TopNav','click-Portfolio-My loan page']"
												>
													My loan page
												</router-link>
											</li>
											<li>
												<router-link
													:to="`/lend-classic/${loanId}#loanComments`"
													v-kv-track-event="['TopNav','click-Portfolio-My Conversations']"
												>
													My conversations
												</router-link>
											</li>
										</template>
									</template>
									<template v-if="isTrustee">
										<template v-if="!isBorrower">
											<li>
												<router-link
													:to="trusteeLoansUrl"
													v-kv-track-event="['TopNav','click-Portfolio-My Trustee loans']"
												>
													My Trustee loans
												</router-link>
											</li>
											<li>
												<router-link
													:to="`/trustees/${trusteeId}`"
													v-kv-track-event="[
														'TopNav',
														'click-Portfolio-My public Trustee page'
													]"
												>
													My public Trustee page
												</router-link>
											</li>
										</template>
										<li>
											<router-link
												to="/my/trustee"
												v-kv-track-event="['TopNav','click-Portfolio-My Trustee dashboard']"
											>
												My Trustee dashboard
											</router-link>
										</li>
										<hr>
									</template>
									<li>
										<router-link
											to="/portfolio"
											v-kv-track-event="['TopNav','click-Portfolio-Portfolio']"
										>
											Portfolio
										</router-link>
									</li>
									<li>
										<router-link
											to="/teams/my-teams"
											v-kv-track-event="['TopNav','click-Portfolio-My teams']"
										>
											My teams
										</router-link>
									</li>
									<li>
										<router-link
											to="/portfolio/donations"
											v-kv-track-event="['TopNav','click-Portfolio-Donations']"
										>
											Donations
										</router-link>
									</li>
									<li>
										<router-link
											to="/settings"
											v-kv-track-event="['TopNav','click-Portfolio-Settings']"
										>
											Settings
										</router-link>
									</li>
									<li v-show="isMobile">
										<router-link
											to="/donate/supportus"
											v-kv-track-event="['TopNav','click-Support-Kiva']"
										>
											Support Kiva
										</router-link>
									</li>
									<hr>
									<li>
										<router-link
											to="/ui-logout"
											v-kv-track-event="['TopNav','click-Portfolio-Sign out']"
										>
											Sign out
										</router-link>
									</li>
								</ul>
							</kv-dropdown>
						</div>
					</div>
				</template>
			</kv-page-container>
		</nav>
		<promo-credit-banner v-if="!hidePromoCreditBanner" />
	</header>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import {
	hasLentBeforeCookie,
	hasDepositBeforeCookie,
	userHasLentBefore,
	userHasDepositBefore,
} from '#src/util/optimizelyUserMetrics';
import { setHotJarUserAttributes } from '#src/util/hotJarUtils';
import headerQueryPrivate from '#src/graphql/query/wwwHeaderPrivate.graphql';
import headerQueryPublic from '#src/graphql/query/wwwHeaderPublic.graphql';
import KivaLogo from '#src/assets/inline-svgs/logos/kiva-logo.svg';
import KvDropdown from '#src/components/Kv/KvDropdown';
import {
	mdiChevronDown,
	mdiMagnify,
	mdiBriefcase,
} from '@mdi/js';
import CampaignLogoGroup from '#src/components/CorporateCampaign/CampaignLogoGroup';
import _throttle from 'lodash/throttle';
import numeral from 'numeral';
import MyKivaButton from '#src/components/WwwFrame/Header/MyKivaButton';
import TeamsMenu from '#src/components/WwwFrame/Header/TeamsMenu';
import { readBoolSetting } from '#src/util/settingsUtils';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import addToBasketExpMixin from '#src/plugins/add-to-basket-exp-mixin';
import myKivaHomePageMixin from '#src/plugins/my-kiva-homepage-mixin';
import {
	KvButton, KvLoadingPlaceholder, KvMaterialIcon, KvPageContainer, KvWwwHeader
} from '@kiva/kv-components';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import countriesNotLentToExpMixin, { COUNTRIES_NOT_LENT_TO_EXP } from '#src/plugins/countries-not-lent-to-exp-mixin';
import SearchBar from './SearchBar';
import PromoCreditBanner from './PromotionalBanner/Banners/PromoCreditBanner';

const COMMS_OPT_IN_EXP_KEY = 'opt_in_comms';
const NAV_UPDATE_EXP_KEY = 'home_page'; // Key aligns with key used in Fastly experimentation for cached CPS pages

export default {
	name: 'TheHeader',
	components: {
		CampaignLogoGroup,
		KivaLogo,
		KvDropdown,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvPageContainer,
		MyKivaButton,
		PromoCreditBanner,
		SearchBar,
		KvButton,
		TheLendMenu: defineAsyncComponent(() => import('#src/components/WwwFrame/LendMenu/TheLendMenu')),
		TeamsMenu,
		KvWwwHeader,
	},
	inject: {
		apollo: { default: null },
		cookieStore: { default: null },
		kvAuth0: { default: null },
	},
	mixins: [addToBasketExpMixin, myKivaHomePageMixin, countriesNotLentToExpMixin],
	data() {
		return {
			aboutMenuId: 'about-header-dropdown',
			balance: 0,
			basketCount: 0,
			basketTotal: 0,
			hasEverLoggedIn: false,
			hideLendMenuTimeout: null,
			isBasketLoading: false,
			isBorrower: false,
			isLendMenuDesired: false,
			isLendMenuVisible: false,
			isMobile: false,
			isUserDataLoading: false,
			lcaLoanCount: 0,
			lendMenuId: 'lend-header-dropdown',
			loanId: null,
			mdiBriefcase,
			mdiChevronDown,
			mdiMagnify,
			myKivaMenuId: 'my-kiva-header-dropdown',
			profilePic: '',
			profilePicId: null,
			searchOpen: false,
			teams: null,
			teamsMenuEnabled: false,
			trusteeId: null,
			userId: null,
			isNavUpdateExp: false,
			isCountriesNotLentToExp: false,
			throttledDetermineIfMobile: null,
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
	computed: {
		isVisitor() {
			return !this.userId && !this.$renderConfig?.cdnNotedLoggedIn;
		},
		isTrustee() {
			return !!this.trusteeId;
		},
		trusteeLoansUrl() {
			return {
				path: '/lend',
				query: {
					trustee: this.trusteeId,
					status: 'fundraising',
					sortBy: 'newest',
				}
			};
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
		openTabletVariant() {
			return (this.hasBasket && this.isVisitor) || (this.hasBasket || this.balance);
		},
		hasLargeBasket() {
			return this.basketTotal > 500;
		},
		basketNumber() {
			// Show basket $ total if basket is over $500 total
			if (this.hasLargeBasket) {
				return numeral(this.basketTotal).format('$0,0');
			}
			return this.basketCount;
		},
	},
	apollo: [
		{
			query: headerQueryPublic,
			preFetch: true,
			result({ data }) {
				this.teamsMenuEnabled = readBoolSetting(data, 'general.teamsMenuEnabled.value');
			},
		},
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
				this.basketTotal = numeral(data.shop?.basket?.totals?.itemTotal).value() || 0;
				this.teams = data?.my?.teams ?? {};
			},
		},
		{
			query: experimentAssignmentQuery,
			preFetch(_, client) {
				return client.query({
					query: experimentAssignmentQuery,
					variables: {
						id: NAV_UPDATE_EXP_KEY,
					},
				});
			},
		},
	],
	created() {
		this.isBasketLoading = this.$renderConfig?.useCDNCaching ?? false;
		this.isUserDataLoading = this.$renderConfig?.useCDNCaching && this.$renderConfig?.cdnNotedLoggedIn;

		const navExperiment = trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'event-tracking',
			NAV_UPDATE_EXP_KEY,
			'EXP-MP-1696-Aug2025'
		);

		this.isNavUpdateExp = navExperiment?.version === 'b';
	},
	mounted() {
		const { version } = this.apollo.readFragment({
			id: `Experiment:${COMMS_OPT_IN_EXP_KEY}`,
			fragment: experimentVersionFragment,
		}) ?? {};

		if (version) {
			this.cookieStore.set(COMMS_OPT_IN_EXP_KEY, version, { path: '/' });
		}

		// MARS-194 User Metrics for Optimizely A/B experiment
		const hasLentBefore = this.cookieStore.get(hasLentBeforeCookie) === 'true';
		const hasDepositBefore = this.cookieStore.get(hasDepositBeforeCookie) === 'true';

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

		if (!this.isVisitor) {
			this.isCountriesNotLentToExp = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				COUNTRIES_NOT_LENT_TO_EXP,
				'EXP-MP-1824-Aug2025',
			)?.version === 'b';
		}
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.throttledDetermineIfMobile);
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
		toggleLendMenu(immediate = false) {
			const wasVisible = this.isLendMenuVisible;

			if (immediate) {
				// if touch, toggle immediately
				this.isLendMenuVisible = !this.isLendMenuVisible;
			} else if (!this.isLendMenuVisible) {
				// if mouse and menu is hidden, show immediately
				this.isLendMenuVisible = true;
			} else {
				// if mouse and menu is showing,
				// wait a half second to hide in case is was an accidental mouseout
				clearTimeout(this.hideLendMenuTimeout);
				this.hideLendMenuTimeout = setTimeout(() => {
					if (!this.isLendMenuDesired) {
						this.isLendMenuVisible = false;
					}
				}, 500);
			}

			// If the menu was previously hidden and is now visible, run onLoad
			if (!wasVisible && this.isLendMenuVisible) {
				this.$refs?.lendMenu?.onLoad?.();
			}
		},
		onLendLinkPointerEnter(e) {
			if (e.pointerType === 'touch') {
				return;
			}
			this.isLendMenuDesired = true;
			this.toggleLendMenu();
		},
		onLendLinkPointerLeave(e) {
			if (e.pointerType === 'touch') {
				return;
			}
			this.isLendMenuDesired = false;
			this.toggleLendMenu();
		},
		onLendLinkPointerUp(e) {
			if (e.pointerType === 'touch') {
				this.toggleLendMenu(true);
			} else {
				this.$router.push({
					path: '/lend-by-category'
				}).catch(() => {});
			}
		},
		onLendLinkClick(e) {
			if (e.pointerType === 'touch') {
				return;
			}
			this.$router.push({
				path: '/lend-by-category'
			}).catch(() => {});
		},
		onLendMenuPointerEnter(e) {
			if (e.pointerType === 'touch') {
				return;
			}
			this.isLendMenuDesired = true;
			this.toggleLendMenu();
		},
		onLendMenuPointerLeave(e) {
			if (e.pointerType === 'touch') {
				return;
			}
			this.isLendMenuDesired = false;
			this.toggleLendMenu();
		},
		onLendMenuShow() {
			this.$kvTrackEvent('TopNav', 'hover-Lend-menu', 'Lend');
		},
		onLendMenuHide() {
			if (this.$refs.lendMenu) {
				this.$refs.lendMenu.onClose();
			}
		},
		addHashToRoute(hash) {
			const route = { ...this.$route };
			route.hash = hash;
			return route;
		},
		loadLendInfo() {
			if (this.$refs.lendMenu) {
				this.$refs.lendMenu.onLoad();
			}
		},
		toggleMobileSearch() {
			this.searchOpen = !this.searchOpen;
			document.activeElement.blur();
			if (this.searchOpen) {
				// wait one tick, then focus search input
				this.$nextTick(() => {
					this.$refs.search.focus();
				});
			}
		},
		withinBoundaryCheck(event) {
			const target = this.$refs?.lendMenu?.$el ?? null; // TODO, make this an argument instead of hardcoded
			if (!target) return false;
			const withinBoundary = event.composedPath().includes(target);
			if (!withinBoundary) {
				this.toggleLendMenu(true);
			}
		},
		loadMenu() {
			if (this.$refs.newExpHeader) {
				this.$refs.newExpHeader.loadMenuData(this.apollo);
			}
		},
	},
	watch: {
		isVisitor(newVal, oldVal) {
			if (newVal !== oldVal && !newVal && this.$refs.userDropdown) {
				this.$nextTick(() => {
					this.$refs.userDropdown.remakeDropdown();
				});
			}
		},
		isLendMenuVisible() {
			setTimeout(() => {
				if (this.isLendMenuVisible === true) {
					this.onLendMenuShow();
					document.addEventListener('pointerup', this.withinBoundaryCheck);
				} else {
					this.onLendMenuHide();
					document.removeEventListener('pointerup', this.withinBoundaryCheck);
				}
			});
		},
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

.dropdown-list {
	@apply tw-px-2 tw-rounded-b;
}

.dropdown-list a {
	@apply tw-font-medium tw-text-primary tw-block tw-w-full tw-py-1;
	@apply tw-no-underline hover:tw-underline hover:tw-text-action active:tw-text-action-highlight;
}

/* CSS grid areas to manage position changes across breakpoints without markup duplication */
.header__logo { grid-area: logo; }
.header__lend { grid-area: lend; }
.header__search { grid-area: search; }
.header__right-side { grid-area: right-side; }

.header {
	grid-template-areas: "logo lend right-side";
	grid-template-columns: 1fr auto auto;
}

.header--mobile-open {
	grid-template-areas:
		"logo lend right-side"
		"search search search";
	grid-template-columns: 1fr auto auto;
}

@screen md {
	.header {
		grid-template-areas: "logo lend search right-side";
		grid-template-columns: auto auto 1fr auto;
	}

	.header.header--tablet-open {
		grid-template-areas:
			"logo lend right-side"
			"search search search";
		grid-template-columns: 1fr auto auto;
	}
}

@screen lg {
	.header.header--tablet-open {
		grid-template-areas: "logo lend search right-side";
		grid-template-columns: auto auto 1fr auto;
	}
}

.bubble-count {
	@apply tw-bottom-0 tw-right-0 tw-absolute tw-rounded-full tw-w-2.5 tw-h-2.5 tw-text-white
		tw-text-center tw-text-small tw-bg-brand tw-z-3 tw-mr-0.5 md:tw-mr-1 tw-cursor-pointer;
}

.user-avatar :deep(img),
.user-avatar :deep(.tw-bg-brand) {
	@apply tw-w-4 tw-h-4 md:tw-w-5 md:tw-h-5;
}

</style>
