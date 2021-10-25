<template>
	<div name="tertiary" class="tertiary-nav columns tw-pt-2">
		<slot></slot>
	</div>
</template>

<style lang="scss" scoped>
@import 'settings';

.tertiary-nav {
	li {
		margin-bottom: 1rem;
	}

	a {
		font-weight: 400;
	}

	.router-link-exact-active {
		color: rgb(var(--text-tertiary));
	}
}
</style>
