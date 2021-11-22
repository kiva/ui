<template>
	<header
		class="top-nav"
		:class="{
			'top-nav--corporate': corporate,
			'top-nav--minimal': minimal
		}"
		:style="cssVars"
	>
		<nav aria-label="Primary navigation">
			<template v-if="minimal">
				<div class="header-row row align-center">
					<router-link class="header-logo header-button" to="/" v-kv-track-event="['TopNav','click-Logo']">
						<kiva-logo class="icon" />
						<span class="show-for-sr">Kiva Home</span>
					</router-link>
				</div>
			</template>
			<template v-else-if="corporate">
				<div class="header-row row">
					<campaign-logo-group
						class="header-logo-group"
						:corporate-logo-url="corporateLogoUrl"
					/>
					<div class="flexible-center-area"></div>
					<router-link
						v-show="showBasket"
						:to="addHashToRoute('show-basket')"
						class="header-button show-for-large"
						v-kv-track-event="['TopNav','click-Basket']"
					>
						<span>
							<span class="amount">{{ basketCount }}</span>
							Basket
						</span>
					</router-link>
					<router-link
						v-show="isVisitor"
						:to="loginUrl"
						class="header-button"
						:event="showPopupLogin ? '' : 'click'"
						@click.native="auth0Login"
						v-kv-track-event="[
							['TopNav','click-Sign-in'],
							['TopNav','EXP-GROW-282-Oct2020',redirectToLoginExperimentVersion]
						]"
					>
						<span>Sign in</span>
					</router-link>
					<router-link
						v-show="!isVisitor"
						:id="myKivaMenuId"
						to="/portfolio"
						target="_blank"
						class="header-button my-kiva"
						v-kv-track-event="['TopNav','click-Portfolio']"
					>
						<span>
							<span class="amount">{{ balance | numeral('$0') }}</span>
							<img
								:src="profilePic"
								alt="My portfolio"
								class="fs-mask tw-inline-block"
							>
						</span>
					</router-link>
				</div>
			</template>
			<template v-else>
				<div class="header-row row">
					<router-link class="header-logo header-button" to="/" v-kv-track-event="['TopNav','click-Logo']">
						<kiva-logo class="icon" />
						<span class="show-for-sr">Kiva Home</span>
					</router-link>
					<router-link
						:id="lendMenuId"
						to="/lend-by-category"
						class="header-button"
						v-kv-track-event="['TopNav','click-Lend']"
					>
						<span>Lend <kv-icon class="triangle-icon" name="triangle" :from-sprite="true" /></span>
					</router-link>
					<button class="search-toggler header-button"
						:class="{'show-for-large': isVisitor}"
						:aria-expanded="searchOpen ? 'true' : 'false'"
						:aria-pressed="searchOpen ? 'true' : 'false'"
						aria-controls="top-nav-search-area"
						v-show="!hideSearchInHeader"
						@click="toggleSearch"
						v-kv-track-event="['TopNav','click-search-toggle']"
					>
						<kv-icon
							v-show="!searchOpen"
							class="search-icon"
							name="magnify-glass"
							:from-sprite="true"
							title="Open Search"
						/>
						<kv-icon
							v-show="searchOpen"
							class="close-icon"
							name="x"
							:from-sprite="true"
							title="Close Search"
						/>
					</button>
					<div class="flexible-center-area">
						<div
							id="top-nav-search-area"
							v-if="!hideSearchInHeader"
							:aria-hidden="searchOpen ? 'false' : 'true'"
						>
							<button class="close-search hide-for-large"
								:aria-expanded="searchOpen ? 'true' : 'false'"
								:aria-pressed="searchOpen ? 'true' : 'false'"
								aria-controls="top-nav-search-area"
								@click="toggleSearch"
								v-kv-track-event="['TopNav','click-search-close-mobile']"
							>
								<kv-icon
									class="close-icon"
									name="x"
									:from-sprite="true"
									title="Close Search"
								/>
							</button>
							<search-bar ref="search" v-if="searchOpen" :aria-hidden="searchOpen ? 'false' : 'true'" />
						</div>
						<promo-banner-large :basket-state="basketState" />
					</div>
					<router-link
						v-show="isVisitor"
						to="/borrow"
						class="header-button show-for-xlarge"
						v-kv-track-event="['TopNav','click-Borrow']"
					>
						<span>Borrow</span>
					</router-link>
					<router-link
						:id="aboutMenuId"
						v-show="isVisitor"
						to="/about"
						class="header-button"
						v-kv-track-event="['TopNav','click-About']"
					>
						<span>About <kv-icon class="triangle-icon" name="triangle" :from-sprite="true" /></span>
					</router-link>
					<router-link
						v-show="showBasket"
						to="/basket"
						class="header-button show-for-large"
						v-kv-track-event="['TopNav','click-Basket']"
					>
						<span>
							<span class="amount">{{ basketCount }}</span>
							Basket
						</span>
					</router-link>
					<router-link
						v-show="isVisitor"
						:to="loginUrl"
						class="header-button"
						:event="showPopupLogin ? '' : 'click'"
						@click.native="auth0Login"
						v-kv-track-event="[
							['TopNav','click-Sign-in'],
							['TopNav','EXP-GROW-282-Oct2020',redirectToLoginExperimentVersion]
						]"
					>
						<span>Sign in</span>
					</router-link>
					<router-link
						v-show="!isVisitor"
						:id="myKivaMenuId"
						to="/portfolio"
						class="header-button my-kiva"
						v-kv-track-event="['TopNav','click-Portfolio']"
					>
						<span>
							<span class="amount">{{ balance | numeral('$0') }}</span>
							<img
								:src="profilePic"
								alt="My portfolio"
								class="fs-mask tw-inline-block"
							>
						</span>
					</router-link>
				</div>
				<promo-banner-small :basket-state="basketState" />
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
										v-kv-track-event="['TopNav','click-Portfolio-My public Trustee page']"
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
			</template>
		</nav>
	</header>
</template>

<script>
import _get from 'lodash/get';
import headerQuery from '@/graphql/query/wwwHeader.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import KvDropdown from '@/components/Kv/KvDropdown';
import KvIcon from '@/components/Kv/KvIcon';
import { preFetchAll } from '@/util/apolloPreFetch';
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';
import CampaignLogoGroup from '@/components/CorporateCampaign/CampaignLogoGroup';
import MonthlyGoodExpMenuWrapper from '@/components/WwwFrame/LendMenu/MonthlyGoodExpMenuWrapper';

import SearchBar from './SearchBar';
import PromoBannerLarge from './PromotionalBanner/PromoBannerLarge';
import PromoBannerSmall from './PromotionalBanner/PromoBannerSmall';

export default {
	components: {
		CampaignLogoGroup,
		KivaLogo,
		KvDropdown,
		KvIcon,
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
		theme: {
			type: Object,
			default: () => {}
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
		showBasket() {
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
		cssVars() {
			if (this.theme) {
				return {
					'--kv-header-background-color': this.theme.backgroundColor || '',
					'--kv-header-text-color': this.theme.textColor || '',
					'--kv-header-logo-color': this.theme.logoColor || '',
					'--kv-header-link-color': this.theme.linkColor || '',
					'--kv-header-link-hover-color': this.theme.linkHoverColor || '',
					'--kv-header-separator-color': this.theme.separatorColor || '',
					'--kv-header-shadow': this.theme.shadow || '',
				};
			}
			return {};
		}
	},
	apollo: {
		query: headerQuery,
		preFetch: true,
		result({ data }) {
			this.isVisitor = !_get(data, 'my.userAccount.id');
			this.isBorrower = _get(data, 'my.isBorrower');
			this.loanId = _get(data, 'my.mostRecentBorrowedLoan.id');
			this.trusteeId = _get(data, 'my.trustee.id');
			this.basketCount = _get(data, 'shop.nonTrivialItemCount');
			this.balance = Math.floor(_get(data, 'my.userAccount.balance'));
			this.profilePic = _get(data, 'my.lender.image.url');
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

<style lang="scss">
@import 'settings';

$top-nav-font-size: 1.125rem;
$header-height: rem-calc(45);
$header-height-large: rem-calc(64);
$header-background-color: $white;
$header-text-color: $link-gray;
$header-logo-color: $kiva-green;
$header-link-color: $link-gray;
$header-link-hover-color: $platinum;
$header-separator-color: $white;
$form-padding: 0.32rem;
$form-padding-large: 0.6rem;
$close-search-button-size: 2.5rem;

.top-nav {
	background: $header-background-color; // IE11 fallback
	background: var(--kv-header-background-color, $header-background-color);
	color: $header-text-color; // IE11 fallback
	color: var(--kv-header-text-color, $header-text-color);
	font-size: $top-nav-font-size;
	font-weight: $global-weight-highlight;
	box-shadow: var(--kv-header-shadow, $navbar-shadow);
	z-index: 1000;

	.amount {
		@include breakpoint(large) {
			color: $header-background-color; // IE11 fallback
			color: var(--kv-header-background-color, $header-background-color);
			background: $header-link-color; // IE11 fallback
			background: var(--kv-header-link-color, $header-link-color);
			padding: rem-calc(1) rem-calc(7);
		}
	}

	.dropdown-pane {
		border-top: none;
		font-size: 1rem;

		ul {
			margin: 0;
		}

		li {
			list-style: none;
		}

		@include breakpoint(medium down) {
			width: 100%;
			left: 0 !important;

			button,
			a,
			li > span {
				display: block;
				width: 100%;
				padding: 0.5rem 1rem;
				border-bottom: 1px solid $kiva-stroke-gray;
			}
		}
	}

	.dropdown-list {
		a {
			display: block;
			width: 100%;
			padding: 0.5rem 1rem;
			white-space: nowrap;
			border-bottom: 1px solid $kiva-stroke-gray;

			@include breakpoint(large) {
				border-bottom: none;
			}
		}

		hr {
			display: none;
			margin: 0 1rem;

			@include breakpoint(large) {
				display: block;
			}
		}
	}
}

.header-row {
	position: relative;
	display: flex;
	align-items: stretch;
	flex-wrap: nowrap;
	height: $header-height;

	@include breakpoint(large) {
		height: $header-height-large;
	}

	@media print {
		// Hide all children besides the first (the kiva logo)
		:nth-child(n+2) {
			display: none;
		}
	}
}

.header-logo {
	.icon {
		display: unset;
		width: rem-calc(71);
		height: 100%;
		margin: rem-calc(-3) auto 0;
		color: $header-logo-color; // IE11 fallback
		color: var(--kv-header-logo-color, $header-logo-color);
		max-height: $header-height;

		@include breakpoint(large) {
			max-height: $header-height-large;
		}
	}

	@media print {
		// Center the logo in the page
		width: 100%;

		// Hide the contextual link information
		&::after {
			display: none;
		}

		// Make the logo green and make it bigger
		.icon {
			fill: $kiva-green;
			width: 6rem;
			height: 4rem;
		}
	}
}

.header-button {
	border-right: 1px solid $header-separator-color; // IE11 fallback
	border-right: 1px solid var(--kv-header-separator-color, $header-separator-color);
	text-align: center;
	white-space: nowrap;
	flex-grow: 2;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: $header-link-color; // IE11 fallback
	color: var(--kv-header-link-color, $header-link-color);

	&:last-child {
		border-right: none;
	}

	&:hover {
		background-color: $header-link-hover-color; // IE11 fallback
		background-color: var(--kv-header-link-hover-color, $header-link-hover-color);
		text-decoration: none;
		color: $header-link-color; // IE11 fallback
		color: var(--kv-header-link-color, $header-link-color);
	}

	&:visited,
	&:active {
		color: $header-link-color; // IE11 fallback
		color: var(--kv-header-link-color, $header-link-color);
	}

	@include breakpoint(large) {
		flex-grow: 0;
		padding: 0 1rem;
	}

	.triangle-icon {
		fill: $header-link-color; // IE11 fallback
		fill: var(--kv-header-link-color, $header-link-color);
		width: 0.5rem;
		height: 0.5rem;
		transition: transform 400ms ease;
		transform: rotate(180deg);

		@include breakpoint(medium) {
			width: 0.75rem;
			height: 0.75rem;
		}
	}

	&[aria-expanded="true"] {
		.triangle-icon {
			transform: rotate(0);
		}
	}

	@media print {
		border: none;
	}
}

.search-toggler {
	flex-grow: 1;
	height: 100%;
	flex-direction: unset;

	@include breakpoint(large) {
		flex-grow: 0;
	}

	.search-icon,
	.close-icon {
		height: 1.125rem;
		width: 1.125rem;
		fill: $header-link-color; // IE11 fallback
		fill: var(--kv-header-link-color, $header-link-color);
	}
}

.flexible-center-area {
	flex-grow: 0;
	order: -1;
	height: 100%;
	border-right: 1px solid $header-separator-color; // IE11 fallback
	border-right: 1px solid var(--kv-header-separator-color, $header-separator-color);
	text-align: center;

	@include breakpoint(large) {
		flex-grow: 1;
		order: 0;
	}

	.promo-banner-large {
		top: -$header-height-large;
	}
}

#top-nav-search-area {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: calc(100% + 1px);
	border-right: 1px solid $header-separator-color; // IE11 fallback
	border-right: var(--kv-header-separator-color, $header-separator-color);
	transition: width 0.5s ease;
	display: flex;

	&[aria-hidden="true"] {
		width: 0;
		overflow: hidden;
	}

	@include breakpoint(large) {
		position: static;
	}
}

#top-nav-search-area form {
	width: calc(100% - #{$close-search-button-size});
	float: left;
	padding: $form-padding $form-padding $form-padding 0;
	z-index: 1;

	@include breakpoint(large) {
		padding: $form-padding-large $form-padding-large $form-padding-large 0;
		width: 100%;
	}

	input[type="search"] {
		padding-left: $top-nav-font-size * 1.5;
	}

	.icon {
		width: $top-nav-font-size;
		height: $header-height - (2 * $form-padding);

		@include breakpoint(large) {
			height: $header-height-large - (2 * $form-padding-large);
		}
	}
}

#top-nav-search-area .close-search {
	float: left;
	width: $close-search-button-size;
	height: 100%;
	background-color: $kiva-green;

	.icon {
		width: $top-nav-font-size;
		height: $header-height;
		fill: $kiva-darkgreen;
	}
}

.my-kiva {
	text-align: right;
	flex-grow: 3;

	img {
		border-radius: 50%;
		height: $header-height * 0.8;
		margin: 0 0.25rem;
	}

	@include breakpoint(large) {
		flex-grow: 0;

		.amount {
			margin-right: 0.25rem;
		}

		img {
			height: $header-height-large * 0.8;
		}
	}
}

.top-nav--corporate {
	.flexible-center-area {
		flex: 1;
		order: 0;
	}

	.header-logo {
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: $header-link-color; // IE11 fallback
		color: var(--kv-header-link-color, $header-link-color);

		@include breakpoint(large) {
			padding: 0 1rem;
		}
	}
}

.header-logo-group {
	--logo-color: var(--kv-header-logo-color, $header-logo-color);

	padding-left: 1rem;
	height: rem-calc(20);

	@include breakpoint(large) {
		height: rem-calc(28);
	}
}

</style>
