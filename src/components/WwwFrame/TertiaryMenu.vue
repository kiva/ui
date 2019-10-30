<template>
	<div name="tertiary" class="tertiary-nav columns">
		<slot></slot>
	</div>
</template>

<style lang="scss">
@import 'settings';

.tertiary-nav {
	ul {
		list-style-type: none;
		margin: 0;

		li {
			margin-bottom: 0.875rem;
			line-height: $small-text-line-height;

			a {
				font-weight: normal;
				color: $kiva-accent-blue;
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}

				&:visited {
					color: $kiva-accent-blue;
				}

				&.router-link-exact-active {
					color: $kiva-stroke-gray;
				}
			}
		}
	}
}
</style>
