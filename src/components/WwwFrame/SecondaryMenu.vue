<template>
	<div name="secondary" class="secondary-nav">
		<slot></slot>
	</div>
</template>

<style lang="scss">
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

				&:hover,
				&.router-link-exact-active {
					color: $kiva-accent-green;
					border-bottom: 2px solid $kiva-accent-green;
				}

				&.router-link-exact-active {
					font-weight: bold;
				}
			}
		}
	}
}
</style>
