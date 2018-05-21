<template>
	<header class="top-nav">
		<div class="header-row row">
			<router-link class="header-logo header-button" to="/" v-kv-track-event="'TopNav|click-Logo'">
				<kv-icon name="new-kiva-logo" />
			</router-link>
			<router-link
				:id="lendMenuId"
				to="/lend"
				class="header-button"
				v-kv-track-event="'TopNav|click-Lend'"
			>
				<span>Lend <kv-icon name="triangle" /></span>
			</router-link>
			<button class="search-toggler header-button"
				:class="{'show-for-large': isVisitor}"
				:aria-expanded="searchOpen ? 'true' : 'false'"
				:aria-pressed="searchOpen ? 'true' : 'false'"
				aria-controls="top-nav-search-area"
				@click="toggleSearch"
				v-kv-track-event="'TopNav|click-search-toggle'"
			>
				<kv-icon v-show="!searchOpen" class="search-icon" name="magnify-glass" />
				<kv-icon v-show="searchOpen" class="close-icon" name="x" />
			</button>
			<div class="flexible-center-area">
				<div id="top-nav-search-area" :aria-hidden="searchOpen ? 'false' : 'true'">
					<button class="close-search hide-for-large"
						:aria-expanded="searchOpen ? 'true' : 'false'"
						:aria-pressed="searchOpen ? 'true' : 'false'"
						aria-controls="top-nav-search-area"
						@click="toggleSearch"
						v-kv-track-event="'TopNav|click-search-close-mobile'"
					>
						<kv-icon class="close-icon" name="x" />
					</button>
					<search-bar ref="search" />
				</div>
				<!-- Large promo banner -->
				<div class="show-for-xxlarge header-promo-large">
					<a id="header-promo-content" href="#" >
						<kv-icon name="kiva-card" class="kiva-card-icon show-for-xxlarge"/>
						<div class="content">
							<div>Make spirits bright this holiday season.</div>
							<div class="call-to-action-text">Give a Kiva gift.</div>
						</div>
					</a>
				</div>
			</div>
			<router-link
				v-if="isVisitor"
				to="/borrow"
				class="header-button show-for-xlarge"
				v-kv-track-event="'TopNav|click-Borrow'"
			>
				<span>Borrow</span>
			</router-link>
			<router-link
				:id="aboutMenuId"
				v-if="isVisitor"
				to="/about"
				class="header-button"
				v-kv-track-event="'TopNav|click-About'"
			>
				<span>About <kv-icon name="triangle" /></span>
			</router-link>
			<router-link
				v-if="showBasket"
				to="/basket"
				class="header-button show-for-large"
				v-kv-track-event="'TopNav|click-Basket'"
			>
				<span>
					<span class="amount">{{ basketCount }}</span>
					Basket
				</span>
			</router-link>
			<router-link
				v-if="isVisitor"
				to="/login"
				class="header-button"
				v-kv-track-event="'TopNav|click-Sign-in'"
			>
				<span>Sign in</span>
			</router-link>
			<router-link
				v-else
				:id="myKivaMenuId"
				to="/portfolio"
				class="header-button my-kiva"
				v-kv-track-event="'TopNav|click-Portfolio'"
			>
				<span>
					<span class="amount">{{ balance | numeral('$0') }}</span>
					<img :src="profilePic">
				</span>
			</router-link>
		</div>
		<kv-dropdown :controller="lendMenuId" @show.once="loadLendInfo" @show="onLendMenuShow" @hide="onLendMenuHide">
			<the-lend-menu ref="lendMenu" />
		</kv-dropdown>
		<kv-dropdown :controller="aboutMenuId" v-if="isVisitor" class="dropdown-list">
			<ul>
				<li>
					<router-link
						to="/about"
						v-kv-track-event="'TopNav|click-About-About us'">
						About us
					</router-link>
				</li>
				<li>
					<router-link
						to="/about/how"
						v-kv-track-event="'TopNav|click-About-How Kiva works'">
						How Kiva works
					</router-link>
				</li>
				<li>
					<router-link
						to="/about/where-kiva-works"
						v-kv-track-event="'TopNav|click-About-Where Kiva works'">
						Where Kiva works
					</router-link>
				</li>
				<li>
					<router-link
						to="/about/impact"
						v-kv-track-event="'TopNav|click-About-Impact'">
						Impact
					</router-link>
				</li>
				<li>
					<router-link
						to="/about/leadership"
						v-kv-track-event="'TopNav|click-About-Leadership'">
						Leadership
					</router-link>
				</li>
				<li>
					<router-link
						to="/about/finances"
						v-kv-track-event="'TopNav|click-About-Finances'">
						Finances
					</router-link>
				</li>
				<li>
					<router-link
						to="/about/press-center"
						v-kv-track-event="'TopNav|click-About-Press'">
						Press
					</router-link>
				</li>
				<li>
					<router-link
						to="/about/due-diligence"
						v-kv-track-event="'TopNav|click-About-Due diligence'">
						Due diligence
					</router-link>
				</li>
			</ul>
		</kv-dropdown>
		<kv-dropdown :controller="myKivaMenuId" v-if="!isVisitor" class="dropdown-list">
			<ul>
				<template v-if="isBorrower">
					<li>
						<router-link
							to="/my/borrower"
							v-kv-track-event="'TopNav|click-Portfolio-My borrower dashboard'">
							My borrower dashboard
						</router-link>
					</li>
					<template v-if="loanId !== null">
						<li>
							<router-link
								:to="`/lend/${loanId}`"
								v-kv-track-event="'TopNav|click-Portfolio-My loan page'">
								My loan page
							</router-link>
						</li>
						<li>
							<router-link
								:to="`/lend/${loanId}#loanComments`"
								v-kv-track-event="'TopNav|click-Portfolio-My Conversations'">
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
								v-kv-track-event="'TopNav|click-Portfolio-My Trustee loans'">
								My Trustee loans
							</router-link>
						</li>
						<li>
							<router-link
								:to="`/trustees/${trusteeId}`"
								v-kv-track-event="'TopNav|click-Portfolio-My public Trustee page'">
								My public Trustee page
							</router-link>
						</li>
					</template>
					<li>
						<router-link
							to="/my/trustee"
							v-kv-track-event="'TopNav|click-Portfolio-My Trustee dashboard'">
							My Trustee dashboard
						</router-link>
					</li>
					<hr>
				</template>
				<li>
					<router-link
						to="/portfolio"
						v-kv-track-event="'TopNav|click-Portfolio-Portfolio'">
						Portfolio
					</router-link>
				</li>
				<li>
					<router-link
						to="/teams/my-teams"
						v-kv-track-event="'TopNav|click-Portfolio-My teams'">
						My teams
					</router-link>
				</li>
				<li>
					<router-link
						to="/portfolio/donations"
						v-kv-track-event="'TopNav|click-Portfolio-Donations'">
						Donations
					</router-link>
				</li>
				<li>
					<router-link
						to="/settings"
						v-kv-track-event="'TopNav|click-Portfolio-Settings'">
						Settings
					</router-link>
				</li>
				<hr>
				<li>
					<router-link
						to="/logout"
						v-kv-track-event="'TopNav|click-Portfolio-Sign out'">
						Sign out
					</router-link>
				</li>
			</ul>
		</kv-dropdown>
		<div class="hide-for-xxlarge header-promo-small">
			<a id="header-promo-content" href="#" >
				<kv-icon name="kiva-card" class="kiva-card-icon show-for-xxlarge"/>
				<div class="content">
					<span>Make spirits bright this holiday season.</span>
					<span class="call-to-action-text">Give a Kiva gift.</span>
				</div>
			</a>
		</div>
	</header>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import KvDropdown from '@/components/Kv/KvDropdown';
import KvIcon from '@/components/Kv/KvIcon';
import SearchBar from './SearchBar';

export default {
	components: {
		KvDropdown,
		KvIcon,
		SearchBar,
		TheLendMenu: () => import('./LendMenu/TheLendMenu'),
	},
	data() {
		return {
			isFreeTrial: false,
			aboutMenuId: 'about-header-dropdown',
			lendMenuId: 'lend-header-dropdown',
			myKivaMenuId: 'my-kiva-header-dropdown',
			searchOpen: false,
		};
	},
	computed: {
		...mapState({
			isVisitor: state => state.my.userAccount.id === null,
			isBorrower: state => state.my.isBorrower,
			basketCount: state => state.shop.headerItemCount,
			balance: state => Math.floor(state.my.userAccount.balance),
			profilePic: state => state.my.lender.image.url,
			loanId: state => state.my.mostRecentBorrowedLoan.id,
			trusteeId: state => state.my.trustee.id,
		}),
		...mapGetters([
			'isTrustee'
		]),
		trusteeLoansUrl() {
			return {
				path: '/lend',
				query: {
					trustee: this.trusteeId,
					status: 'fundRaising',
					sortBy: 'newest',
				}
			};
		},
		showBasket() {
			return this.basketCount > 0 && !this.isFreeTrial;
		},
	},
	methods: {
		onLendMenuShow() {
			this.$refs.lendMenu.onOpen();
		},
		onLendMenuHide() {
			this.$refs.lendMenu.onClose();
		},
		loadLendInfo() {
			this.$refs.lendMenu.onLoad();
		},
		toggleSearch() {
			this.searchOpen = !this.searchOpen;
			if (this.searchOpen) {
				this.$refs.search.focus();
			}
		}
	},
	asyncData({ store }) {
		return store.dispatch('getMyKivaInfo');
	},
};
</script>

<style lang="scss">
@import 'settings';

$top-nav-font-size: 1.125rem;
$header-height: rem-calc(45);
$header-height-large: rem-calc(64);
$header-color: $kiva-green;
$text-color: $white;
$hover-color: $kiva-navdivider-green;
$divider-color: $kiva-navdivider-green;
$form-padding: 0.32rem;
$form-padding-large: 0.6rem;
$close-search-button-size: 2.5rem;

.top-nav {
	background-color: $header-color;
	font-size: $top-nav-font-size;
	font-weight: 400;

	.amount {
		@include breakpoint(large) {
			color: $header-color;
			background-color: $text-color;
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
}

.header-logo {
	.icon {
		display: unset;
		width: rem-calc(57);
		height: 100%;
		margin: rem-calc(-3) auto 0;
		fill: $text-color;
		max-height: $header-height;

		@include breakpoint(large) {
			max-height: $header-height-large;
		}
	}
}

.header-button {
	border-right: 1px solid $divider-color;
	text-align: center;
	white-space: nowrap;
	flex-grow: 2;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;

	&:last-child {
		border-right: none;
	}

	&:link,
	&:visited,
	&:active {
		color: white;
		text-decoration: none;
	}

	@include breakpoint(large) {
		flex-grow: 0;
		padding: 0 1rem;
	}

	.icon-triangle {
		fill: $text-color;
		width: 0.5rem;
		height: 0.5rem;
		transition: transform 400ms ease;
		transform: rotate(180deg);

		@include breakpoint(medium) {
			width: 0.75rem;
			height: 0.75rem;
		}
	}
}

.header-button:hover {
	background-color: $hover-color;
	color: $text-color;
}

.header-button[aria-expanded="true"] .icon-triangle {
	transform: rotate(0);
}

.search-toggler {
	flex-grow: 1;
	height: 100%;
	flex-direction: unset;

	&:focus {
		outline: none;
	}

	@include breakpoint(large) {
		flex-grow: 0;
		border-right: none;
	}

	.icon {
		height: 1.125rem;
		width: 1.125rem;
		margin: 0 auto;
	}

	.search-icon {
		fill: $text-color;
	}

	.close-icon {
		stroke: $text-color;
	}
}

.flexible-center-area {
	flex-grow: 0;
	order: -1;
	height: 100%;
	border-right: 1px solid $divider-color;
	text-align: center;

	@include breakpoint(large) {
		flex-grow: 1;
		order: 0;
	}

	.header-promo-large {
		position: relative;
		top: rem-calc(-66);
		margin-top: .6875rem;

		a {
			text-decoration: none;
			color: $light-green;
		}

		.kiva-card-icon {
			height: rem-calc(45);
			width: rem-calc(45);
			transform: rotate(-10deg);
			float: left;
			margin-left: rem-calc(50);
		}

		.content {
			font-size: $small-font-size;
			font-weight: bold;
			color: $dark-green;
			text-align: center;
			line-height: 1.357rem; // I want to use $small-line-height here
			max-width: 95%;
		}
	}
}
// These are good
.header-promo-small {
	text-align: center;
	background: $dark-green;
	font-size: $small-font-size;

	a {
		color: $kiva-accent-green;
	}
}

#top-nav-search-area {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: calc(100% + 1px);
	background-color: $header-color;
	border-right: solid 1px $divider-color;
	transition: width 0.5s ease;

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

	.icon {
		width: $top-nav-font-size;
		height: $header-height;
		stroke: $text-color;
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
</style>
