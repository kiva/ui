<template>
	<header class="top-nav">
		<div class="header-row row">
			<router-link class="header-logo header-button" :to="logoUrl">
				<kv-icon name="new-kiva-logo" />
			</router-link>
			<kv-dropdown-link name="lend-dropdown" :to="lendUrl" class="header-button">
				<span>Lend <kv-icon name="triangle" /></span>
			</kv-dropdown-link>
			<button class="search-toggler header-button" :class="{'show-for-large': isVisitor}">
				<kv-icon class="search-icon" name="magnify-glass" />
			</button>
			<div class="search-area">
			</div>
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

export default {
	components: {
		KvDropdownLink,
		KvIcon,
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
			profilePic: state => state.my.lender.image.url,
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

$header-height: rem-calc(45);
$header-height-large: rem-calc(64);
$header-color: $kiva-green;
$text-color: $white;
$hover-color: $kiva-navdivider-green;
$divider-color: $kiva-navdivider-green;

.top-nav {
	background-color: $header-color;
}

.header-row {
	display: flex;
	align-items: stretch;
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

.search-area {
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

.search-toggler {
	flex-grow: 1;
	// height: 100%;
	// width: 100%;
	// min-width: 2rem;
	// max-width: $header-height-large;
	//
	// &:focus {
	// 	outline: none;
	// }
	//
	// &:hover {
	// 	background-color: $hover-color;
	// }

	@include breakpoint(large) {
		flex-grow: 0;
	}

	.icon {
		fill: $text-color;
		height: 1.125rem;
		width: 1.125rem;
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
