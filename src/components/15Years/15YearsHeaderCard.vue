<template>
	<div class="card" :style="cssProps">
		<a
			class="card__link"
			:href="href"
			@click.prevent="onClickCardLink(href)"
		>
			<div class="card__img">
				<img :src="imgSrc" alt="">
			</div>
			<div class="card__content">
				<h4 class="card__title">{{ title }}</h4>
				<p class="card__text">{{ subtitle }}</p>
			</div>
		</a>
	</div>
</template>

<script>
export default {
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
				'--image-tilt': `rotate(${this.imgTilt}deg)`,
			};
		}
	},
	methods: {
		onClickCardLink(href) {
			this.$emit('card-clicked', href);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/15-years/15-years";

.card {
	position: relative;

	img {
		transition: transform 0.2s cubic-bezier(0.24, 0.015, 0.25, 1.355);
		transform: var(--image-tilt);
	}

	&__link {
		display: flex;
		text-decoration: none;
		white-space: normal;

		&:hover,
		&:focus {
			img {
				transform: rotate(0deg);
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
			font-size: rem-calc(24);
		}
	}

	&__text {
		@include link();

		white-space: normal;
	}
}

</style>
