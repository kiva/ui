<template>
	<header class="top-nav">
		<div class="row header-row">
			<div class="small-3 large-2 xxlarge-2 columns header-column logo-area">
				<router-link class="header-button" :to="logoUrl">
					<svg-icon name="new-kiva-logo" />
				</router-link>
			</div>
			<div class="small-3 large-2 xxlarge-1 columns header-column">
				<dropdown-link name="lend-dropdown" :to="lendUrl" class="header-button">
					Lend <svg-icon name="triangle" />
				</dropdown-link>
			</div>
			<div class="small-1-8th large-1 xxlarge-1 columns" :class="{ 'show-for-large-up': isVisitor }">
				<search-toggle controls="header-search-form"
					@toggle="open => searchOpen = open"
					class="header-button" />
			</div>
			<div class="columns header-column right-side"
				:class="[ isVisitor ? 'small-6 xx-large-3' : 'small-3-8ths xx-large-2' ]"
			>
				<div v-if="isVisitor" class="small-6 large-4 columns">
					<dropdown-link name="about-dropdown" :to="aboutUrl" class="header-button">
						About <svg-icon name="triangle" />
					</dropdown-link>
				</div>
				<div v-if="showBasket"
					id="top-basket-button"
					class="show-for-large-up"
					:class="[ isVisitor ? 'large-4' : 'large-6' ]"
				>
					<router-link class="header-button" :to="basketUrl">
						<span class="amount">{{ basketCount }}</span> Basket
					</router-link>
				</div>
				<div class="columns" :class="[ isVisitor ? 'small-6 large-4' : 'small-12 large-6' ]">
					<router-link v-if="isVisitor" :to="loginUrl" class="header-button">Sign in</router-link>
					<dropdown-link v-else name="my-kiva-dropdown" :to="portfolioUrl" class="header-button my-kiva">
						<span class="amount">{{ balance | numeral('$0') }}</span>
						<span class="circle-avatar" :style="profileStyle"></span>
					</dropdown-link>
				</div>
			</div>
			<div class="search-container" :class="{ 'show-for-large-up': isVisitor }">
				<search-form name="header-search-form" :open="searchOpen" />
			</div>
		</div>
		<lend-menu-dropdown />
		<dropdown-menu name="about-dropdown">
			<li v-for="item in aboutItems" :key="item.label">
				<router-link :to="item.url">{{ item.label }}</router-link>
			</li>
		</dropdown-menu>
		<dropdown-menu name="my-kiva-dropdown">
			<li v-for="item in myKivaItems" :key="item.label">
				<router-link :to="item.url">{{ item.label }}</router-link>
			</li>
		</dropdown-menu>
	</header>
</template>

<script>
// import numeral from 'numeral';
import { mapState } from 'vuex';

import DropdownLink from '@/components/DropdownLink';
import DropdownMenu from '@/components/DropdownMenu';
import LendMenuDropdown from '@/components/LendMenuDropdown';
import SearchForm from '@/components/SearchForm';
import SearchToggle from '@/components/SearchToggle';
import SvgIcon from '@/components/SvgIcon';

export default {
	components: {
		DropdownLink,
		DropdownMenu,
		LendMenuDropdown,
		SearchForm,
		SearchToggle,
		SvgIcon,
	},
	data() {
		return {
			isFreeTrial: false,
			basketCount: 0,
			logoUrl: '/',
			lendUrl: '/lend',
			aboutUrl: '/about',
			basketUrl: '/basket',
			loginUrl: '/login',
			portfolioUrl: '/portfolio',
			aboutItems: [
				{ label: 'About us', url: '/about' },
				{ label: 'How Kiva works', url: '/about' },
				{ label: 'Where Kiva works', url: '/about' },
				{ label: 'Impact', url: '/about' },
				{ label: 'Leadership', url: '/about' },
				{ label: 'Finances', url: '/about' },
				{ label: 'Press', url: '/about' },
				{ label: 'Due diligence', url: '/about' },
			],
			myKivaItems: [
				{ label: 'Portfolio', url: '/portfolio' },
				{ label: 'My teams', url: '/portfolio' },
				{ label: 'Donations', url: '/portfolio' },
				{ label: 'Settings', url: '/portfolio' },
				{ label: 'Sign out', url: '/portfolio' },
			],
			searchOpen: false,
		};
	},
	computed: {
		...mapState({
			isVisitor: state => state.my.userAccount.id === null,
			balance: state => Math.floor(state.my.userAccount.balance),
			profileStyle: state => ({ backgroundImage: `url(${state.my.lender.image.url})` }),
		}),
		showBasket() {
			return this.basketCount > 0 && !this.isFreeTrial;
		},
	},
	asyncData({ store }) {
		return store.dispatch('getMyKivaInfo');
	},
};
</script>

<style lang="scss">
@import 'settings';

// $search-form-height: $header-height;
// $search-form-height-small: $header-height-small;
// $search-form-transition: width 0.5s ease;
//
// $search-margin: 0.6rem;
// $search-margin-small: 0.4rem;
// $search-centering-margin: 0.65rem;
// $search-centering-margin-small: 0.32rem;
// $search-button-size-small: 2.5rem;
// $search-icon-size: $top-nav-font-size - $top-nav-font-reduction;
//
// $search-input-width-small: calc(100% - #{$search-margin-small});
// $search-input-width: calc(100% - #{$search-margin});
// $search-input-padding: $search-margin;
// $search-input-padding-s: $search-margin-small;
//
// .top-nav {
// 	background-color: $kiva-green;
// 	position: relative;
//
// 	.columns {
// 		padding: 0;
//
// 		@media #{$large-up} {
// 			padding: 0;
// 			width: auto;
// 		}
//
// 		.kv-dropdown {
// 			position: inherit;
// 		}
// 	}
//
// 	.header-row {
// 		position: relative;
// 	}
//
// 	.header-column > a {
// 		border-right: 1px solid $kiva-navdivider-green;
// 	}
//
// 	.header-column:last-child > a {
// 		border-right: none;
// 	}
//
// 	.logo-area .header-button {
// 		$vertical-offset: rem-calc(3);
//
// 		line-height: 0;
// 		padding: 0 0.3rem $vertical-offset;
//
// 		@media #{$large-up} {
// 			padding: 0 rem-calc(16) $vertical-offset;
// 		}
//
// 		.icon {
// 			width: rem-calc(57);
// 			height: $header-height-small;
// 			margin-top: -$vertical-offset;
//
// 			@media #{$large-up} {
// 				height: $header-height;
// 			}
// 		}
// 	}
//
// 	.amount {
// 		color: inherit;
// 		background: none;
// 		padding: 0;
//
// 		@media #{$large-up} {
// 			color: $kiva-green;
// 			background: $white;
// 			padding: rem-calc(1) rem-calc(7);
// 		}
// 	}
//
// 	.promo-space.columns {
// 		position: absolute;
// 		text-align: center;
// 		line-height: rem-calc(20);
// 		width: 100%;
// 		font-size: 0.8rem;
// 		font-weight: bold;
// 		margin-top: rem-calc(11);
// 		color: $kiva-darkgreen;
//
// 		.amount {
// 			background-color: $kiva-darkgreen;
// 		}
// 	}
//
// 	.right-side.columns {
// 		float: right;
// 		border: none;
//
// 		@media #{$large-up} {
// 			width: auto;
// 		}
//
// 		.columns > a {
// 			border-left: 1px solid $kiva-navdivider-green;
// 		}
// 	}
//
// 	.f-dropdown {
// 		background-color: $level-one-background;
// 		outline: none;
// 		width: auto;
// 		max-width: none;
// 		margin-top: 0;
// 		border-top: none;
// 		z-index: 1112;
//
// 		&::after {
// 			display: none;
// 		}
//
// 		&.content {
// 			padding: 0;
// 		}
// 	}
//
// 	.pronus {
// 		font-size: 0.8rem;
// 		text-align: center;
// 		background-color: $kiva-green;
// 		border-top: 1px solid $kiva-navdivider-green;
// 		height: rem-calc(45);
// 		line-height: rem-calc(45);
// 		color: $dark-green;
// 		width: 100%;
// 		display: block;
//
// 		@media #{$small-only} {
// 			line-height: rem-calc(21);
// 		}
// 	}
// }
//
// .header-button {
// 	display: block;
// 	padding: 0;
// 	line-height: $header-height-small;
// 	background-color: $kiva-green;
// 	white-space: nowrap;
// 	text-align: center;
//
// 	@media #{$large-up} {
// 		padding: 0 $header-height/4;
// 		line-height: $header-height;
// 	}
//
// 	&:link,
// 	&:visited,
// 	&:hover,
// 	&:active {
// 		color: $white;
// 		text-decoration: none;
//
// 		.icon {
// 			fill: $white;
// 		}
// 	}
//
// 	&[data-dropdown] .icon {
// 		width: 0.5rem;
// 		height: 0.5rem;
// 		transition: transform 400ms ease;
// 		transform: rotate(180deg);
//
// 		@media #{$medium-up} {
// 			width: 0.75rem;
// 			height: 0.75rem;
// 		}
// 	}
//
// 	&[aria-expanded="true"] {
// 		color: $kiva-darkgreen;
//
// 		.icon {
// 			fill: $kiva-darkgreen;
// 			transform: rotate(0deg);
// 		}
// 	}
//
// 	.icon {
// 		width: $top-nav-font-size - $top-nav-font-reduction;
// 		height: $top-nav-line-height - $top-nav-font-reduction;
//
// 		@media #{$large-up} {
// 			width: $top-nav-font-size;
// 			height: $top-nav-line-height;
// 		}
// 	}
//
// 	img,
// 	.circle-avatar {
// 		margin-top: -$header-height-small/16;
//
// 		@media #{$large-up} {
// 			margin-top: -$header-height/16;
// 		}
// 	}
//
// 	&.hidden {
// 		display: none;
// 	}
// }
//
// .no-touch {
// 	.top-nav .header-button:hover {
// 		background-color: $kiva-icon-green;
// 	}
// }
//
// .header-button.search-toggle {
// 	border-right: none;
// 	line-height: 0;
//
// 	.icon {
// 		fill: $white;
// 		height: $header-height-small;
//
// 		@media #{$large-up} {
// 			height: $header-height;
// 		}
// 	}
//
// 	.close-icon {
// 		fill: none;
// 		stroke: $white;
// 	}
//
// 	&[aria-expanded="true"] .close-icon {
// 		stroke: $kiva-darkgreen;
// 	}
// }
//
// .search-container {
// 	width: 100%;
// 	height: 0;
// 	position: absolute;
// 	z-index: 1;
//
// 	@media #{$large-up} {
// 		position: static;
// 	}
// }
//
// #header-search-form {
// 	display: block;
// 	overflow: hidden;
// 	width: 100%;
// 	background-color: $kiva-green;
// 	transition: $search-form-transition;
//
// 	@media #{$large-up} {
// 		width: auto;
// 	}
//
// 	&[aria-hidden="true"] {
// 		width: 0;
//
// 		@media #{$large-up} {
// 			width: auto;
// 		}
//
// 		div {
// 			width: 0;
// 		}
// 	}
//
// 	div {
// 		width: calc(100% + #{rem-calc(1)});
// 		overflow: hidden;
// 		position: relative;
// 		vertical-align: middle;
// 		height: $search-form-height-small;
// 		border-right: 1px solid $kiva-navdivider-green;
// 		transition: $search-form-transition;
//
// 		@media #{$large-up} {
// 			height: $search-form-height;
// 		}
// 	}
//
// 	span.twitter-typeahead {
// 		width: calc(100% - #{$search-button-size-small});
//
// 		@media #{$large-up} {
// 			position: static !important;
// 			width: 100%;
// 		}
//
// 		pre {
// 			top: 0;
// 		}
// 	}
//
// 	.search-icon {
// 		position: absolute;
// 		left: 0.4rem + $search-button-size-small;
// 		z-index: 100;
// 		width: $search-icon-size;
// 		height: $header-height-small;
//
// 		@media #{$large-up} {
// 			left: 0.4rem;
// 			height: $header-height;
// 		}
// 	}
//
// 	#search-box {
// 		z-index: 1;
// 	}
//
// 	input {
// 		$search-input-padding: 0.6rem;
//
// 		width: $search-input-width-small;
// 		padding: $search-input-padding-s $search-input-padding-s $search-input-padding-s ($top-nav-font-size * 1.5);
// 		margin: $search-centering-margin-small 0;
// 		display: inline-block;
// 		height: auto;
//
// 		@media #{$large-up} {
// 			width: $search-input-width;
// 			margin: $search-centering-margin 0;
// 			padding: $search-input-padding $search-input-padding $search-input-padding ($top-nav-font-size * 1.5);
// 		}
// 	}
//
// 	.tt-hint {
// 		color: $iron;
// 	}
// }
//
// #close-search {
// 	float: left;
// 	width: $search-button-size-small;
// 	line-height: 0;
// 	text-align: center;
//
// 	.close-icon {
// 		width: $top-nav-font-size - $top-nav-font-reduction;
// 		height: $search-button-size-small;
// 		fill: none;
// 		stroke: $kiva-darkgreen;
// 	}
// }
//
// .top-nav-search-menu {
// 	padding: $search-margin-small;
// }
//
// @media #{$large-up} {
// 	.search-button-container {
// 		width: auto;
// 	}
// }
//
// .basket-bar {
// 	position: fixed;
// 	bottom: 0;
// 	height: rem-calc(66);
// 	width: 100%;
// 	z-index: 1111;
// 	box-shadow: 0 -1px 3px 0 rgba(51, 51, 51, 0.3);
// 	transition: bottom 500ms ease;
//
// 	a {
// 		font-size: 1.1666666667rem !important;
// 		width: 100%;
// 		display: block;
//
// 		&.button {
// 			height: rem-calc(66);
// 			line-height: rem-calc(66);
// 		}
// 	}
// }
//
// .basket-bar.hide-for-large-up.off-screen {
// 	bottom: rem-calc(-67);
// }
//
// @media #{$small-only}, #{$medium-only} {
// 	.top-nav {
// 		.small-1-8th {
// 			width: grid-calc(1, 8);
// 		}
//
// 		.small-3-8ths {
// 			width: grid-calc(3, 8);
// 		}
//
// 		.columns {
// 			padding: 0;
// 		}
//
// 		.right-side {
// 			padding: 0;
//
// 			.columns:first-child a {
// 				border-left: none;
// 			}
// 		}
//
// 		.f-dropdown {
// 			border: none;
//
// 			// !important to override foundation inline styles applied by js
// 			left: 0 !important;
// 			width: 100% !important;
//
// 			&::before,
// 			&::after {
// 				display: none;
// 			}
// 		}
// 	}
// }
//
// .my-kiva.header-button {
// 	text-align: right;
// }
//
// .circle-avatar {
// 	width: 0.78125 * $header-height-small;
// 	height: 0.78125 * $header-height-small;
// 	margin-left: 0.3rem;
// 	margin-right: 0.3rem;
// 	display: inline-block;
// 	border-radius: 50%;
// 	background-position-y: center;
// 	background-position-x: center;
// 	background-repeat: no-repeat;
// 	background-size: cover;
// 	vertical-align: middle;
// }
//
// @media #{$large-up} {
// 	.circle-avatar {
// 		width: 0.78125 * $header-height;
// 		height: 0.78125 * $header-height;
// 		margin-left: 0.5rem;
// 		margin-right: 0;
// 	}
// }
</style>
