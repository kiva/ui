<template>
	<div class="card" :style="cssProps">
		<a
			class="card__link"
			:href="href"
			@click.prevent="onClickCardLink(href)"
		>
			<div class="row align-justify">
				<div class="small-3 card__img">
					<img :src="imgSrc">
				</div>
				<div class="column card__content">
					<h4 class="card__title">{{ title }}</h4>
					<p class="card__text">{{ subtitle }}</p>
				</div>
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
	padding: 0;

	@include breakpoint(large) {
		padding: 0;
	}

	img {
		transition: transform 0.15s ease-in-out;
		transform: var(--image-tilt);
	}

	&__link {
		display: block;
		text-decoration: none;
		white-space: normal;

		&:hover,
		&:focus {
			img {
				transform: rotate(0deg);
			}
		}
	}

	&__content {
		padding-right: 0;
	}

	&__img {
		max-width: rem-calc(90);
		margin-left: 1.25rem;
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
