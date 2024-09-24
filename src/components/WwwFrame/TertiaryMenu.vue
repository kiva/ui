<template>
	<div name="tertiary" class="tertiary-nav columns tw-pt-2">
		<slot></slot>
	</div>
</template>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';

.tertiary-nav {
	:deep(li) {
		margin-bottom: 1rem;
	}

	:deep(a) {
		font-weight: 400;
	}

	:deep(.router-link-exact-active) {
		color: rgb(var(--text-tertiary));
	}
}
</style>
