<template>
	<div class="system-page">
		<header class="system-page__header tw-bg-brand">
			<kiva-logo class="system-page__kiva-logo tw-text-white" />
		</header>
		<div class="system-page__content-wrapper tw-bg-secondary">
			<div
				class="system-page__content tw-bg-primary tw-border-tertiary tw-border tw-rounded-sm"
				:data-year="year"
			>
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';

export default {
	name: 'SystemPage',
	components: {
		KivaLogo,
	},
	data() {
		return {
			year: new Date().getFullYear(),
		};
	},
};
</script>

<style lang="scss">
@import 'settings';

.system-page {
	height: 100%;

	&__header {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	&__kiva-logo {
		display: block;
		width: rem-calc(57);
		height: rem-calc(45);
		margin: 0 auto;

		@include breakpoint(large) {
			width: rem-calc(72);
			height: rem-calc(64);
		}
	}

	&__content-wrapper {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		min-height: 100%;
		text-align: center;
	}

	&__content {
		position: relative;
		padding: 1rem;
		margin: 4rem 1rem 3rem;

		@include breakpoint(medium) {
			padding: 1.5rem;
			margin: 4.5rem 1.5rem 3rem;
		}

		@include breakpoint(large) {
			margin-top: 6.5rem;
		}

		&::after {
			content: "\00a9 " attr(data-year) " Kiva. All rights reserved.";
			color: rgb(var(--text-secondary));
			position: absolute;
			width: 100%;
			left: 0;
			bottom: -3rem;
		}
	}
}
</style>
