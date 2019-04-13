<template>
	<div class="styleguide-wrap">
		<header class="top-nav">
			<div class="header-row row">
				<router-link class="header-logo header-button" to="/" v-kv-track-event="['TopNav','click-Logo']">
					<kv-icon name="new-kiva-logo" />
				</router-link>
				<a href="/lend" id="lend-header-dropdown" class="header-button"><span>Lend</span></a>
			</div>
		</header>
		<div class="page-content">
			<div class="row">
				<div class="columns small-12">
					<h1>UI Styleguide</h1>
				</div>
			</div>
			<div class="row">
				<div class="columns small-12 large-3">
					<ul>
						<li>
							<router-link to="/styleguide">Intro</router-link>
						</li>
						<li>
							<router-link to="/styleguide/typography">Typography</router-link>
						</li>
						<li>
							<router-link to="/styleguide/copy">Copy</router-link>
						</li>
						<li>
							<router-link to="/styleguide/buttons">Buttons</router-link>
						</li>
						<li>
							<router-link to="/styleguide/colors">Colors</router-link>
						</li>
						<li>
							<router-link to="/styleguide/forms">Forms</router-link>
						</li>
						<li>
							<router-link to="/styleguide/images">Images</router-link>
						</li>
						<li>
							<router-link to="/styleguide/icons">Icons</router-link>
						</li>
					</ul>
				</div>
				<div class="small-12 large-9 columns">
					<router-view />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

$text-color: $white;
$hover-color: $kiva-navdivider-green;
$divider-color: $kiva-navdivider-green;
$top-nav-font-size: 1.125rem;
$header-color: $kiva-green;
$header-height: rem-calc(45);
$header-height-large: rem-calc(64);

.styleguide-wrap .top-nav {
	background-color: $header-color;
	font-size: $top-nav-font-size;
	font-weight: $global-weight-highlight;

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
		align-items: center;

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
	}

	.header-button:hover {
		background-color: $hover-color;
		color: $text-color;
	}
}

.styleguide-wrap .elem-desc {
	border-bottom: 1px solid #eee;
	color: #888;
	font-size: 80%;
}

</style>
