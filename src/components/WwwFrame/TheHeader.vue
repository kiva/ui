<template>
	<header>
		<nav
			aria-label="Primary navigation"
			class="tw-bg-primary tw-border-b tw-border-tertiary tw-relative"
		>
			<kv-page-container>
				<!-- minimal header -->
				<template v-if="minimal">
					<div class="tw-flex tw-justify-center">
						<router-link
							class="header__button"
							to="/"
							data-testid="header-home"
							v-kv-track-event="['TopNav','click-Logo']"
						>
							<kiva-logo class="tw-w-6 tw-text-brand" style="transform: translateY(-0.1875rem);" />
							<span class="tw-sr-only">Kiva Home</span>
						</router-link>
					</div>
				</template>

				<!-- Corporate header for /cc pages -->
				<template v-else-if="corporate">
					<div
						class="
						tw-flex tw-gap-2.5 lg:tw-gap-6 tw-items-center"
					>
						<campaign-logo-group
							class="tw-h-2.5 lg:tw-h-3.5"
							:corporate-logo-url="corporateLogoUrl"
						/>
						<div class="tw-flex-1"></div>
						<router-link
							v-show="hasBasket"
							:to="addHashToRoute('show-basket')"
							data-testid="header-basket"
							class="header__button header__basket"
							v-kv-track-event="['TopNav','click-Basket']"
						>
							<span class="tw-bg-secondary tw-rounded-sm tw-py-0.5 tw-px-1 tw-mr-1">
								{{ basketCount }}
							</span>
							Basket
						</router-link>
						<router-link
							v-show="!isVisitor"
							:id="myKivaMenuId"
							to="/portfolio"
							data-testid="header-portfolio"
							target="_blank"
							class="header__button header__portfolio"
							v-kv-track-event="['TopNav','click-Portfolio']"
						>
							<span class="tw-bg-secondary tw-rounded-sm tw-py-0.5 tw-px-1 tw-mr-1">
								{{ balance | numeral('$0') }}
							</span>
							<template v-if="isDefaultProfilePic">
								<span class="tw-sr-only">My Portfolio</span>
								<kv-material-icon
									:icon="mdiAccountCircle"
									class="tw-inline-block tw-w-2.5 tw-h-2.5 md:tw-w-3.5 md:tw-h-3.5"
								/>
							</template>
							<img
								v-else
								:src="profilePic"
								alt="My portfolio"
								class="fs-mask tw-inline-block
									tw-w-2.5 tw-h-2.5 md:tw-w-3.5 md:tw-h-3.5
									tw-rounded-full tw-overflow-hidden tw-object-fill"
							>
						</router-link>
						<kv-button
							variant="secondary"
							v-show="isVisitor"
							class="header__login__button"
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
							tw-grid tw-gap-x-2.5 lg:tw-gap-x-4 tw-items-center"
						:class="{'header--mobile-open': searchOpen}"
					>
						<!-- Logo -->
						<div class="header__logo">
							<router-link
								class="header__button"
								to="/"
								data-testid="header-home"
								v-kv-track-event="['TopNav','click-Logo']"
							>
								<kiva-logo class="tw-w-6 tw-text-brand" style="transform: translateY(-0.1875rem);" />
								<span class="tw-sr-only">Kiva Home</span>
							</router-link>
						</div>

						<!-- Lend -->
						<router-link
							:id="lendMenuId"
							to="/lend-by-category"
							data-testid="header-lend"
							class="header__button header__lend"
							v-kv-track-event="['TopNav','click-Lend']"
							@pointerenter.native.stop="onLendLinkPointerEnter"
							@pointerleave.native.stop="onLendLinkPointerLeave"
							@pointerup.native.stop="onLendLinkPointerUp"
							@click.native.stop="onLendLinkClick"
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
										@pointerenter.native="onLendMenuPointerEnter"
										@pointerleave.native="onLendMenuPointerLeave"
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
								tw--mx-2.5 tw-px-2.5 md:tw-mx-0 md:tw-px-0
								tw-border-t tw-border-tertiary md:tw-border-t-0
							"
							:class="{'tw-hidden md:tw-block': !searchOpen}"
						>
							<search-bar ref="search" />
						</div>

						<div
							class="header__right-side
						tw-flex tw-justify-end tw-gap-2.5 lg:tw-gap-4"
						>
							<!-- Borrow -->
							<router-link
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

							<!-- About -->
							<div class="tw-group">
								<router-link
									:id="aboutMenuId"
									to="/about"
									data-testid="header-about"
									class="header__about"
									:class="{
										'tw-hidden': !isVisitor,
										'header__button': isVisitor
									}"
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
									v-show="isVisitor"
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
											<router-link
												to="/about/how"
												v-kv-track-event="['TopNav','click-About-How Kiva works']"
											>
												How Kiva works
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
												to="/about/impact"
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
											<router-link
												to="/about/press-center"
												v-kv-track-event="['TopNav','click-About-Press']"
											>
												Press
											</router-link>
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

							<!-- Mobile Search Toggle -->
							<button
								class="header__button header__search-icon md:!tw-hidden"
								v-show="!hideSearchInHeader && !isVisitor"
								data-testid="header-mobile-search-toggle"
								:aria-expanded="searchOpen ? 'true' : 'false'"
								:aria-pressed="searchOpen ? 'true' : 'false'"
								aria-controls="top-nav-search-area"
								@click="toggleMobileSearch"
								v-kv-track-event="['TopNav','click-search-toggle']"
							>
								<kv-material-icon class="tw-w-3 tw-h-3" :icon="mdiMagnify" />
							</button>

							<!-- Basket -->
							<router-link
								to="/basket"
								data-testid="header-basket"
								:class="{
									'tw-hidden': !hasBasket,
									'header__button header__basket !tw-hidden md:!tw-flex': hasBasket
								}"
								v-kv-track-event="['TopNav','click-Basket']"
							>
								<span class="tw-bg-secondary tw-rounded-sm tw-py-0.5 tw-px-1 tw-mr-1">
									{{ basketCount }}
								</span>
								Basket
							</router-link>

							<!-- Log in Link -->
							<kv-button
								variant="secondary"
								v-show="isVisitor"
								class="header__login__button"
								:to="loginUrl"
								data-testid="header-log-in"
								v-kv-track-event="['TopNav','click-Sign-in']"
							>
								Log in
							</kv-button>

							<!-- Logged in Profile -->
							<router-link
								v-show="!isVisitor"
								:id="myKivaMenuId"
								data-testid="header-portfolio"
								to="/portfolio"
								class="header__button header__portfolio"
								v-kv-track-event="['TopNav','click-Portfolio']"
							>
								<span class="tw-bg-secondary tw-rounded-sm tw-py-0.5 tw-px-1 tw-mr-1">
									{{ balance | numeral('$0') }}
								</span>
								<template v-if="isDefaultProfilePic">
									<span class="tw-sr-only">My Portfolio</span>
									<kv-material-icon
										:icon="mdiAccountCircle"
										class="tw-inline-block tw-w-2.5 tw-h-2.5 md:tw-w-3.5 md:tw-h-3.5"
									/>
								</template>
								<img
									v-else
									:src="profilePic"
									alt="My portfolio"
									class="fs-mask tw-inline-block
										tw-w-2.5 tw-h-2.5 md:tw-w-3.5 md:tw-h-3.5
										tw-rounded-full tw-overflow-hidden tw-object-fill"
								>
							</router-link>

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
		<promo-credit-banner v-if="!hidePromoCreditBanner" :basket-state="basketState" />
	</header>
</template>

<script>
import logReadQueryError from '@/util/logReadQueryError';
import { userHasLentBefore, userHasDepositBefore } from '@/util/optimizelyUserMetrics';
import setHotJarUserAttributes from '@/util/hotJarUserAttributes';
import headerQuery from '@/graphql/query/wwwHeader.graphql';
import gql from 'graphql-tag';
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';
import KvDropdown from '@/components/Kv/KvDropdown';
import { mdiAccountCircle, mdiChevronDown, mdiMagnify } from '@mdi/js';
import CampaignLogoGroup from '@/components/CorporateCampaign/CampaignLogoGroup';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

import SearchBar from './SearchBar';
import PromoCreditBanner from './PromotionalBanner/Banners/PromoCreditBanner';

const hasLentBeforeCookie = 'kvu_lb';
const hasDepositBeforeCookie = 'kvu_db';

const optimizelyUserDataQuery = gql`query optimizelyUserDataQuery {
  	my {
    	loans(limit:1) {
      		totalCount
    	}
    	transactions(limit:1, filter:{category:deposit}) {
      		totalCount
   		}
	}
}`;

export default {
	name: 'TheHeader',
	components: {
		CampaignLogoGroup,
		KivaLogo,
		KvDropdown,
		KvMaterialIcon,
		KvPageContainer,
		PromoCreditBanner,
		SearchBar,
		KvButton,
		TheLendMenu: () => import('@/components/WwwFrame/LendMenu/TheLendMenu'),
	},
	inject: ['apollo', 'cookieStore', 'kvAuth0'],
	data() {
		return {
			isVisitor: true,
			isBorrower: false,
			isLendMenuDesired: false,
			isLendMenuVisible: false,
			hideLendMenuTimeout: null,
			loanId: null,
			trusteeId: null,
			isFreeTrial: false,
			basketCount: 0,
			balance: 0,
			profilePic: '',
			profilePicId: null,
			aboutMenuId: 'about-header-dropdown',
			lendMenuId: 'lend-header-dropdown',
			myKivaMenuId: 'my-kiva-header-dropdown',
			searchOpen: false,
			basketState: {},
			mdiAccountCircle,
			mdiChevronDown,
			mdiMagnify,
			userId: null,
			hasEverLoggedIn: false
		};
	},
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
	},
	computed: {
		isTrustee() {
			return !!this.trusteeId;
		},
		isDefaultProfilePic() {
			if (!this.profilePicId) {
				return true;
			}
			const defaultProfileIds = [726677, 315726];
			return defaultProfileIds.some(id => id === this.profilePicId);
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
			return this.basketCount > 0 && !this.isFreeTrial;
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
	apollo: {
		query: headerQuery,
		preFetch(config, client, { cookieStore }) {
			return client.query({
				query: headerQuery,
			}).then(({ data }) => {
				const hasLentBeforeValue = cookieStore.get(hasLentBeforeCookie);
				const hasDepositBeforeValue = cookieStore.get(hasDepositBeforeCookie);

				return data?.my?.userAccount?.id && (hasLentBeforeValue === undefined || hasDepositBeforeValue === undefined) // eslint-disable-line max-len
					? client.query({ query: optimizelyUserDataQuery }) : Promise.resolve();
			});
		},
		result({ data }) {
			this.userId = data?.my?.userAccount?.id ?? null;
			this.isVisitor = !data?.my?.userAccount?.id;
			this.isBorrower = data?.my?.isBorrower ?? false;
			this.loanId = data?.my?.mostRecentBorrowedLoan?.id ?? null;
			this.trusteeId = data?.my?.trustee?.id ?? null;
			this.basketCount = data?.shop?.nonTrivialItemCount ?? 0;
			this.balance = Math.floor(data?.my?.userAccount?.balance ?? 0);
			this.profilePic = data?.my?.lender?.image?.url ?? '';
			this.profilePicId = data?.my?.lender?.image?.id ?? null;
			this.basketState = data || {};
			this.hasEverLoggedIn = data?.hasEverLoggedIn;
		},
		errorHandlers: {
			'shop.invalidBasketId': ({ cookieStore, route }) => {
				cookieStore.remove('kvbskt', { path: '/', secure: true });
				// on server, reject with url to trigger redirect
				if (typeof window === 'undefined') {
					return Promise.reject(route);
				}
				// otherwise on client refresh the page
				window.location = route.fullPath;
			}
		}
	},
	created() {
		// MARS-194 User Metrics for Optimizely A/B experiment
		let hasLentBefore = this.cookieStore.get(hasLentBeforeCookie);
		let hasDepositBefore = this.cookieStore.get(hasDepositBeforeCookie);

		if (hasLentBefore === undefined || hasDepositBefore === undefined) {
			try {
				let userData = {};
				userData = this.apollo.readQuery({
					query: optimizelyUserDataQuery,
				});

				hasLentBefore = userData?.my?.loans?.totalCount > 0;
				hasDepositBefore = userData?.my?.transactions?.totalCount > 0;

				this.cookieStore.set(hasLentBeforeCookie, hasLentBefore, { path: '/' });
				this.cookieStore.set(hasDepositBeforeCookie, hasDepositBefore, { path: '/' });

				userHasLentBefore(hasLentBefore);
				userHasDepositBefore(hasDepositBefore);
			} catch (e) {
				logReadQueryError(e, 'User Data For Optimizely Metrics');
			}
		}
	},
	mounted() {
		// MARS-246 Hotjar user attributes
		setHotJarUserAttributes({
			userId: this.userId,
			hasEverLoggedIn: this.hasEverLoggedIn,
			hasLentBefore: Boolean(this.cookieStore.get(hasLentBeforeCookie)),
			hasDepositBefore: Boolean(this.cookieStore.get(hasDepositBeforeCookie)),
		});
	},
	methods: {
		toggleLendMenu(immediate = false) {
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
			if (this.isLendMenuVisible) {
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
		}
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
		}
	}
};
</script>

<style lang="postcss" scoped>
.header__button {
	@apply tw-inline-flex tw-items-center tw-flex-shrink-0;
	@apply tw-font-medium tw-text-primary hover:tw-text-action-highlight hover:tw-no-underline focus:tw-no-underline;
	@apply tw-h-8 md:tw-h-9 tw-whitespace-nowrap tw-flex-shrink-0;
}

.header__login__button {
	background-color: #fff;
	margin-top: 13px;
}

.dropdown-list {
	@apply tw-px-2 tw-rounded-b;
}

.dropdown-list a {
	@apply tw-font-medium tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1;
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
}

@media screen and (max-width: 734px) {
	.header__login__button {
		margin-top: 9px;
	}
}
</style>
