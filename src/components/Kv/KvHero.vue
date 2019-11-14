<template>
	<div class="hero">
		<div class="images">
			<div class="images-placeholder"></div>
			<div class="images-container">
				<slot name="images"></slot>
			</div>
		</div>
		<div class="headline" v-if="showHeadline">
			<div class="headline-mask">
				&nbsp;
			</div>
			<div class="headline-main">
				<div class="headline-background" :style="headlineBgStyles"></div>
				<div class="headline-title" v-if="hasHeadlineTitle">
					<slot name="headlineTitle"></slot>
				</div>
				<div class="headline-body" v-if="hasHeadlineBody">
					<slot name="headlineBody"></slot>
				</div>
				<div class="action" v-if="hasAction">
					<slot name="action"></slot>
				</div>
			</div>
			<div class="headline-mask">
				&nbsp;
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		headlineBgColor: {
			type: String,
			default: ''
		}
	},
	computed: {
		hasHeadlineTitle() {
			return !!this.$slots.headlineTitle;
		},
		hasHeadlineBody() {
			return !!this.$slots.headlineBody;
		},
		hasAction() {
			return !!this.$slots.action;
		},
		showHeadline() {
			return this.hasHeadlineTitle || this.hasHeadlineBody || this.hasAction;
		},
		headlineBgStyles() {
			return this.headlineBgColor ? `background-color: ${this.headlineBgColor}` : '';
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.hero {
	position: relative;
	width: 100%;
	margin-bottom: 5rem;

	@include breakpoint(medium) {
		margin-bottom: 6rem;
	}
}

.images {
	position: relative;
	overflow: hidden;

	img {
		width: 100%;
	}
}

.images-container {
	position: absolute;
	top: 0;
}

.images-placeholder {
	background-color: $kiva-bg-lightgray;
	width: 100%;
	padding-bottom: 600/480 * 100%;

	@include breakpoint(medium) {
		padding-bottom: 675/680 * 100%;
	}

	@include breakpoint(large) {
		padding-bottom: 545/1024 * 100%;
	}

	@include breakpoint(xga) {
		padding-bottom: 768/1440 * 100%;
	}

	@include breakpoint(wxga) {
		padding-bottom: 820/1920 * 100%;
	}
}

.headline {
	display: flex;
	position: absolute;
	bottom: 0;
	width: 100%;
}

.headline-main {
	position: relative;
	flex-grow: 1;
	max-width: rem-calc(750);
	padding: 1.125rem 0.5rem;
	color: $white;
	text-align: center;

	@include breakpoint(medium) {
		padding: 1.125rem 1.25rem;
	}
}

.headline-background {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: $kiva-green;
	opacity: 0.9;
}

.headline-title {
	position: relative;
	display: block;
	margin-bottom: 0;
	font-size: 1.75rem;
	line-height: 2rem;
	font-weight: 400;

	@include breakpoint(medium) {
		font-size: 2.25rem;
		line-height: 2.5rem;
	}

	@include breakpoint(large only) {
		font-size: 2.1rem;
	}
}

.headline-body {
	position: relative;
	font-size: 1.25rem;
	line-height: 1.5rem;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;

	@include breakpoint(medium) {
		font-size: 1.75rem;
		line-height: 2rem;
	}
}

.headline-mask {
	flex-grow: 1;
	transform: scaleY(0.51) translateY(50%);
	background-color: $white;
}

.action {
	position: relative;
	text-align: center;
	margin-top: 1rem;
	margin-bottom: -4rem;
}
</style>
