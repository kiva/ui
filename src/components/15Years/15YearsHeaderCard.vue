<template>
	<div class="card" :style="cssProps">
		<router-link
			class="card__link"
			:to="href"
			v-kv-track-event="['Kiva15', 'click-hero-secondary-CTA', title]"
		>
			<div class="card__img">
				<img :src="imgSrc" alt="">
			</div>
			<div class="card__content">
				<h4 class="card__title">
					{{ title }}
				</h4>
				<p class="card__text">
					{{ subtitle }}
				</p>
			</div>
		</router-link>
	</div>
</template>

<script>
export default {
	name: '15YearsHeaderCard',
	props: {
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		href: {
			type: String,
			required: true,
		},
		imgSrc: {
			type: String,
			required: true,
		},
		imgTilt: {
			type: Number,
			required: true,
		},
	},
	computed: {
		cssProps() {
			return {
				'--image-tilt': `rotate3d(0,0,1,${this.imgTilt}deg)`,
			};
		}
	},
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/15-years/15-years";

.card {
	position: relative;

	img {
		transition: transform 1s cubic-bezier(0.05, 2.5, 0.52, 0.5);
		transform: var(--image-tilt);
	}

	&__link {
		display: flex;
		text-decoration: none;
		white-space: normal;

		&:hover,
		&:focus {
			img {
				transform: rotate3d(0, 0, 0.1, 1deg);
			}
		}

		@include breakpoint(large) {
			padding: rem-calc(24) 0;
		}
	}

	&__content {
		padding-right: 0;
	}

	&__img {
		max-width: rem-calc(81);
		margin-right: rem-calc(16);
		display: none;

		// Desktop
		@include breakpoint(xxlarge) {
			display: block;
		}
	}

	&__title {
		@include h4();

		text-transform: none;

		@include breakpoint(large) {
			font-size: rem-calc(18);
		}
	}

	&__text {
		@include link();

		white-space: normal;

		@include breakpoint(large) {
			font-size: rem-calc(11);
			margin: 0;
		}
	}
}

</style>
