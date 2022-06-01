<template>
	<div name="secondary" class="secondary-nav exact-path">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'SecondaryMenu',
};
</script>

<style lang="scss" scoped>
@import 'settings';

.secondary-nav {
	background-color: $kiva-darkgreen;

	ul {
		display: block;
		list-style: none;
		margin: 0 auto;
		line-height: $lead-lineheight;

		li {
			display: inline-block;

			a {
				display: block;
				color: $white;
				font-weight: normal;
				padding: 0.075rem 0;
				margin: 0.675rem 1rem;
				border-bottom: 2px solid $kiva-darkgreen;
				text-decoration: none;

				&:hover {
					@extend .basic-secondary-menu-active;
				}

				&.router-link-exact-active,
				&.router-link-active {
					@extend .basic-secondary-menu-active;

					text-shadow: 0.5px 0 $kiva-accent-green;
				}
			}
		}
	}
}

.basic-secondary-menu-active {
	color: $kiva-accent-green;
	border-bottom: 2px solid $kiva-accent-green;
}
</style>
