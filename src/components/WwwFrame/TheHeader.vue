<template>
	<header class="top-nav">
		<div class="header-row row">
			<router-link class="header-logo header-button" :to="logoUrl">
				<kv-icon name="new-kiva-logo" />
			</router-link>
			<kv-dropdown-link name="lend-dropdown" :to="lendUrl" class="header-button">
				<span>Lend <kv-icon name="triangle" /></span>
			</kv-dropdown-link>
			<button class="search-toggler header-button"
				:class="{'show-for-large': isVisitor}"
				:aria-expanded="searchOpen"
				:aria-pressed="searchOpen"
				aria-controls="top-nav-search-area"
				@click="toggleSearch"
			>
				<kv-icon v-show="!searchOpen" class="search-icon" name="magnify-glass" />
				<kv-icon v-show="searchOpen" class="close-icon" name="x" />
			</button>
			<div class="flexible-center-area">
				<div id="top-nav-search-area" :aria-hidden="!searchOpen">
					<button class="close-search hide-for-large"
						:aria-expanded="searchOpen"
						:aria-pressed="searchOpen"
						aria-controls="top-nav-search-area"
						@click="toggleSearch"
					>
						<kv-icon class="close-icon" name="x" />
					</button>
					<search-bar/>
				</div>
			</div>
			<router-link :to="borrowUrl" class="header-button show-for-xlarge">
				<span>Borrow</span>
			</router-link>
			<kv-dropdown-link v-if="isVisitor" name="about-dropdown" :to="aboutUrl" class="header-button">
				<span>About <kv-icon name="triangle" /></span>
			</kv-dropdown-link>
			<router-link v-if="showBasket" :to="basketUrl" class="header-button show-for-large">
				<span class="amount">{{ basketCount }}</span> Basket
			</router-link>
			<router-link v-if="isVisitor" :to="loginUrl" class="header-button">
				<span>Sign in</span>
			</router-link>
			<kv-dropdown-link v-else name="my-kiva-dropdown" :to="portfolioUrl" class="header-button my-kiva">
				<span>
					<span class="amount">{{ balance | numeral('$0') }}</span>
					<img :src="profilePic">
				</span>
			</kv-dropdown-link>
		</div>
	</header>
</template>

<script>
import { mapState } from 'vuex';

import KvDropdownLink from '@/components/Kv/Dropdown/KvDropdownLink';
import KvIcon from '@/components/Kv/KvIcon';
import SearchBar from './SearchBar';

export default {
	components: {
		KvDropdownLink,
		KvIcon,
		SearchBar,
	},
	data() {
		return {
			isFreeTrial: false,
			basketCount: 0,
			logoUrl: '/',
			lendUrl: '/lend',
			borrowUrl: '/borrow',
			aboutUrl: '/about',
			basketUrl: '/basket',
			loginUrl: '/login',
			portfolioUrl: '/portfolio',
			searchOpen: false,
		};
	},
	computed: {
		...mapState({
			isVisitor: state => state.my.userAccount.id === null,
			balance: state => Math.floor(state.my.userAccount.balance),
			profilePic: state => state.my.lender.image.url,
		}),
		showBasket() {
			return this.basketCount > 0 && !this.isFreeTrial;
		},
	},
	methods: {
		toggleSearch() {
			this.searchOpen = !this.searchOpen;
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
		width: rem-calc(57);
		height: 100%;
		margin: rem-calc(-3) auto 0;
		fill: $text-color;
	}
}

.header-button {
	border-right: 1px solid $divider-color;
	text-align: center;
	white-space: nowrap;
	display: table;
	flex-grow: 2;
	height: 100%;

	& > * {
		display: table-cell;
		vertical-align: middle;
	}

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

.search-toggler {
	flex-grow: 1;
	height: 100%;

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

	@include breakpoint(large) {
		flex-grow: 0;
	}

	img {
		border-radius: 50%;
		height: $header-height * 0.8;
		margin: 0 0.25rem;

		@include breakpoint(large) {
			height: $header-height-large * 0.8;
		}
	}
}
</style>
