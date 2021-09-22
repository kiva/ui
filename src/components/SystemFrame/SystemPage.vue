<template>
	<div class="system-page">
		<header class="system-page__header">
			<kiva-logo class="system-page__kiva-logo" />
		</header>
		<div class="system-page__content-wrapper">
			<div class="system-page__content" :data-year="year">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';

export default {
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
		background-color: $kiva-green;
	}

	&__kiva-logo {
		display: block;
		width: rem-calc(57);
		height: rem-calc(45);
		margin: 0 auto;
		color: $white;

		@include breakpoint(large) {
			width: rem-calc(72);
			height: rem-calc(64);
		}
	}

	&__content-wrapper {
		background-color: $kiva-bg-lightgray;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		min-height: 100%;
		text-align: center;
	}

	&__content {
		position: relative;
		background-color: $white;
		border: 1px solid $kiva-stroke-gray;
		border-radius: rem-calc(3);
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
			color: $kiva-text-light;
			position: absolute;
			width: 100%;
			left: 0;
			bottom: -3rem;
		}
	}
}
</style>
