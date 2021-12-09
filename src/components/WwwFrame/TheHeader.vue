<template>
	<header>
		<nav
			aria-label="Primary navigation"
			class="tw-bg-primary tw-border-b tw-border-tertiary"
		>
			<kv-page-container>
				<!-- minimal header -->
				<template v-if="minimal">
					<div class="tw-flex tw-justify-center">
						<router-link
							class="header__button"
							to="/"
							v-kv-track-event="['TopNav','click-Logo']"
						>
							<kiva-logo class="tw-w-5 tw-text-brand" />
							<span class="tw-sr-only">Kiva Home</span>
						</router-link>
					</div>
				</template>

				<!-- Corporate header for /cc pages -->
				<template v-else-if="corporate">
					<div class="
						tw-flex tw-gap-2.5 lg:tw-gap-4 tw-items-center"
					>
						<campaign-logo-group
							class="tw-h-2.5 lg:tw-h-3.5"
							:corporate-logo-url="corporateLogoUrl"
						/>
						<div class="tw-flex-1"></div>
						<router-link
							v-show="hasBasket"
							:to="addHashToRoute('show-basket')"
							class="header__button header__basket"
							v-kv-track-event="['TopNav','click-Basket']"
						>
							<span class="amount">{{ basketCount }}</span>
							Basket
						</router-link>
						<router-link
							v-show="!isVisitor"
							:id="myKivaMenuId"
							to="/portfolio"
							target="_blank"
							class="header__button header__portfolio"
							v-kv-track-event="['TopNav','click-Portfolio']"
						>
							<span>{{ balance | numeral('$0') }}</span>
							<img
								:src="profilePic"
								alt="My portfolio"
								class="fs-mask tw-inline-block tw-w-2.5 tw-h-2.5 tw-object-fill"
							>
						</router-link>
						<router-link
							:to="loginUrl"
							v-show="isVisitor"
							class="header__button header__log-in"
							:event="showPopupLogin ? '' : 'click'"
							@click.native="auth0Login"
							v-kv-track-event="[
								['TopNav','click-Sign-in'],
								['TopNav','EXP-GROW-282-Oct2020',redirectToLoginExperimentVersion]
							]"
						>
							Log in
						</router-link>
					</div>
				</template>

				<!-- default -->
				<template v-else>
					<div class="header
					tw-grid tw-gap-2.5 lg:tw-gap-4 tw-items-center"
					>
						<div class="header__left-side
						tw-contents tw-gap-2.5 lg:tw-gap-6 lg:tw-flex tw-justify-start tw-items-center"
						>
							<!-- logo -->
							<router-link
								class="header__logo header__button"
								to="/"
								v-kv-track-event="['TopNav','click-Logo']"
							>
								<kiva-logo class="tw-w-5 tw-text-brand" />
								<span class="tw-sr-only">Kiva Home</span>
							</router-link>

							<!-- links -->
							<router-link
								:id="lendMenuId"
								to="/lend-by-category"
								class="header__button header__lend"
								v-kv-track-event="['TopNav','click-Lend']"
							>
								<span class="tw-flex tw-items-center">Lend
									<kv-material-icon class="tw-w-3" :icon="mdiChevronDown" />
								</span>
							</router-link>
						</div>

						<div class="header__right-side
						tw-flex tw-justify-end tw-gap-2.5 lg:tw-gap-4"
						>
							<router-link
								v-show="isVisitor"
								to="/borrow"
								class="header__button header__borrow tw-hidden md:tw-block"
								v-kv-track-event="['TopNav','click-Borrow']"
							>
								Borrow
							</router-link>
							<router-link
								v-show="isVisitor"
								:id="aboutMenuId"
								to="/about"
								class="header__button header__about"
								v-kv-track-event="['TopNav','click-About']"
							>
								<span class="tw-flex">
									About
									<kv-material-icon class="tw-w-3" :icon="mdiChevronDown" />
								</span>
							</router-link>
							<button
								class="header__button header__search-icon md:!tw-hidden"
								:aria-expanded="searchOpen ? 'true' : 'false'"
								:aria-pressed="searchOpen ? 'true' : 'false'"
								aria-controls="top-nav-search-area"
								v-show="!hideSearchInHeader"
								@click="toggleSearch"
								v-kv-track-event="['TopNav','click-search-toggle']"
							>
								<kv-material-icon :icon="mdiMagnify" />
							</button>
							<router-link
								v-show="hasBasket"
								to="/basket"
								class="header__button header__basket"
								v-kv-track-event="['TopNav','click-Basket']"
							>
								<span class="amount">{{ basketCount }}</span>
								Basket
							</router-link>
							<router-link
								v-show="!isVisitor"
								:id="myKivaMenuId"
								to="/portfolio"
								class="header__button header__portfolio"
								v-kv-track-event="['TopNav','click-Portfolio']"
							>
								<span>{{ balance | numeral('$0') }}</span>
								<img
									:src="profilePic"
									alt="My portfolio"
									class="fs-mask tw-inline-block tw-w-2.5 tw-h-2.5 tw-object-fill"
								>
							</router-link>
							<router-link
								:to="loginUrl"
								v-show="isVisitor"
								class="header__button header__log-in"
								:event="showPopupLogin ? '' : 'click'"
								@click.native="auth0Login"
								v-kv-track-event="[
									['TopNav','click-Sign-in'],
									['TopNav','EXP-GROW-282-Oct2020',redirectToLoginExperimentVersion]
								]"
							>
								Log in
							</router-link>
						</div>

						<!-- desktop search container -->
						<div class="header__search tw-hidden md:tw-block">
							<search-bar
								v-if="!hideSearchInHeader"
								ref="search"
							/>
						</div>

						<!-- mobile search -->
						<div class="tw-hidden">
							<div
								id="top-nav-search-area"
								v-if="!hideSearchInHeader"
								:aria-hidden="searchOpen ? 'false' : 'true'"
							>
								<search-bar
									ref="search"
									v-if="searchOpen"
									:aria-hidden="searchOpen ? 'false' : 'true'"
								/>
							</div>
						</div>

						<!-- dropdowns -->
						<div class="tw-contents">
							<kv-dropdown
								v-if="mgHighlightInNavVersion === 'shown'"
								:controller="lendMenuId"
								@show.once="loadLendInfo"
								@show="onLendMenuShow"
							>
								<monthly-good-exp-menu-wrapper ref="mgExpWrapper" />
							</kv-dropdown>
							<kv-dropdown
								v-if="mgHighlightInNavVersion !== 'shown'"
								:controller="lendMenuId"
								@show.once="loadLendInfo"
								@show="onLendMenuShow"
								@hide="onLendMenuHide"
							>
								<the-lend-menu ref="lendMenu" />
							</kv-dropdown>
							<kv-dropdown
								:controller="aboutMenuId"
								v-show="isVisitor"
								class="dropdown-list"
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
							<kv-dropdown
								:controller="myKivaMenuId"
								v-show="!isVisitor"
								class="dropdown-list"
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
													:to="`/lend/${loanId}#loanComments`"
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

		<!-- promo banner: TODO consolidate these -->
		<promo-banner-large :basket-state="basketState" />
		<promo-banner-small :basket-state="basketState" />
	</header>
</template>

<script>
import headerQuery from '@/graphql/query/wwwHeader.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';

import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';
import MonthlyGoodExpMenuWrapper from '@/components/WwwFrame/LendMenu/MonthlyGoodExpMenuWrapper';
import KvDropdown from '@/components/Kv/KvDropdown';
import { mdiMagnify, mdiChevronDown } from '@mdi/js';
import CampaignLogoGroup from '@/components/CorporateCampaign/CampaignLogoGroup';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import SearchBar from './SearchBar';
import PromoBannerLarge from './PromotionalBanner/PromoBannerLarge';
import PromoBannerSmall from './PromotionalBanner/PromoBannerSmall';

export default {
	components: {
		CampaignLogoGroup,
		KivaLogo,
		KvDropdown,
		KvMaterialIcon,
		KvPageContainer,
		MonthlyGoodExpMenuWrapper,
		PromoBannerLarge,
		PromoBannerSmall,
		SearchBar,
		TheLendMenu: () => import('@/components/WwwFrame/LendMenu/TheLendMenu'),
	},
	inject: ['apollo', 'cookieStore', 'kvAuth0'],
	data() {
		return {
			isVisitor: true,
			isBorrower: false,
			loanId: null,
			trusteeId: null,
			isFreeTrial: false,
			basketCount: 0,
			balance: 0,
			profilePic: '',
			aboutMenuId: 'about-header-dropdown',
			lendMenuId: 'lend-header-dropdown',
			myKivaMenuId: 'my-kiva-header-dropdown',
			searchOpen: false,
			redirectToLoginExperimentVersion: null,
			basketState: {},
			mgHighlightInNavVersion: null,
			mdiMagnify,
			mdiChevronDown
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
	created() {
		// EXP SUBS-680 present main nav options for subscription or individual lending
		const mgHighlightInNav = this.apollo.readFragment({
			id: 'Experiment:mg_highlight_in_nav',
			fragment: experimentVersionFragment,
		}) || {};
		this.mgHighlightInNavVersion = mgHighlightInNav.version;

		// Fire Event for EXP SUBS-680
		this.$kvTrackEvent(
			'TopNav',
			'EXP-SUBS-680-Apr2021',
			this.mgHighlightInNavVersion === 'shown' ? 'b' : 'a'
		);
	},
	computed: {
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
			return this.basketCount > 0 && !this.isFreeTrial;
		},
		showPopupLogin() {
			return this.kvAuth0.enabled
				&& this.$route.fullPath !== '/'
				&& this.redirectToLoginExperimentVersion !== 'b';
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
		preFetch: true,
		result({ data }) {
			this.isVisitor = !data?.my?.userAccount?.id ?? false;
			this.isBorrower = data?.my?.isBorrower ?? false;
			this.loanId = data?.my?.mostRecentBorrowedLoan?.id ?? null;
			this.trusteeId = data?.my?.trustee?.id ?? null;
			this.basketCount = data?.shop?.nonTrivialItemCount ?? 0;
			this.balance = Math.floor(data?.my?.userAccount?.balance ?? 0);
			this.profilePic = data?.my?.lender?.image?.url ?? '';
			this.basketState = data || {};

			// GROW-280 redirect to login instead of popup login experiment
			const redirectToLoginExperiment = this.apollo.readFragment({
				id: 'Experiment:redirect_to_login',
				fragment: experimentVersionFragment,
			}) || {};
			this.redirectToLoginExperimentVersion = redirectToLoginExperiment.version;
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
	methods: {
		auth0Login() {
			if (this.showPopupLogin) {
				this.kvAuth0.popupLogin().then(result => {
					// Only refetch data if login was successful
					if (result) {
						// Refetch the queries for all the components in this route. All the components that use
						// the default options for the apollo plugin or that setup their own query observer will update
						// @todo maybe show a loding state until this completes?
						const matched = this.$router.getMatchedComponents(this.$route);
						return preFetchAll(matched, this.apollo, {
							route: this.$route,
							kvAuth0: this.kvAuth0,
						}).catch(error => {
							if (error.path) {
								this.$router.push(error);
							}
						});
					}
				});
			}
		},
		onLendMenuShow() {
			if (this.mgHighlightInNavVersion !== 'shown') {
				this.$refs?.lendMenu?.onOpen?.();
			}
			this.$kvTrackEvent('TopNav', 'hover-Lend-menu', 'Lend');
		},
		onLendMenuHide() {
			this.$refs.lendMenu.onClose();
		},
		addHashToRoute(hash) {
			const route = { ...this.$route };
			route.hash = hash;
			return route;
		},
		loadLendInfo() {
			if (this.mgHighlightInNavVersion === 'shown') {
				this.$refs.mgExpWrapper.onLoad();
			} else {
				this.$refs.lendMenu.onLoad();
			}
		},
		toggleSearch() {
			this.searchOpen = !this.searchOpen;
			document.activeElement.blur();
			if (this.searchOpen) {
				// wait one tick, then focus search input
				this.$nextTick(() => {
					this.$refs.search.focus();
				});
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
		}
	}
};
</script>

<style lang="postcss" scoped>
.header__button {
	@apply tw-flex tw-items-center tw-flex-shrink-0;
	@apply tw-text-primary hover:tw-text-action-highlight hover:tw-no-underline focus:tw-no-underline;
	@apply tw-h-8 md:tw-h-9 tw-whitespace-nowrap tw-flex-shrink-0;
}

/* CSS grid areas to manage position changes across breakpoints without markup duplication */
.header__logo { grid-area: logo; }
.header__lend { grid-area: lend; }
.header__search { grid-area: search; }
.header__left-side { grid-area: left-side; }
.header__right-side { grid-area: right-side; }

.header {
	grid-template-areas: "logo lend right-side";
	grid-template-columns: 1fr auto auto;
}

@screen md {
	.header {
		grid-template-areas: "logo lend search right-side";
		grid-template-columns: auto auto 1fr auto;
	}
}

@screen lg {
	.header {
		grid-template-areas: "left-side search right-side";
		grid-template-columns: 33% 1fr minmax(max-content, 33%);
	}
}
</style>
