<template>
	<div class="globe-cta">
		{{ action }} to explore the world of Kiva
		<radial-icon />
	</div>
</template>

<script>
import usingTouchQuery from '@/graphql/query/shared/usingTouchClient.graphql';
import RadialIcon from '@/components/15Years/RadialIcon';

export default {
	name: '15YearsGlobeCTA',
	inject: ['apollo', 'cookieStore'],
	components: {
		RadialIcon,
	},
	data() {
		return {
			usingTouch: false,
		};
	},
	computed: {
		action() {
			return this.usingTouch ? 'Tap' : 'Click';
		}
	},
	apollo: {
		query: usingTouchQuery,
		preFetch: true,
		result(result) {
			this.usingTouch = result?.data?.usingTouch;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.globe-cta {
	position: absolute;
	z-index: 3;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 1rem;
	border-radius: 1rem;
	background-color: $offwhite;
	color: $twilight;
	font-size: 0.75rem;
	font-family: $font-family-monospace;
	white-space: nowrap;
	pointer-events: none;

	@include breakpoint(large) {
		top: 60%;
		left: calc(100% - #{rem-calc(170)});
	}

	@include breakpoint(xxlarge) {
		font-size: 0.875rem;
		top: 46%;
		left: 69.5%;
	}

	::v-deep .radial-icon {
		margin: 0 0.5rem;
	}
}
</style>
