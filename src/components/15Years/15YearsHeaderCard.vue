<template>
	<div class="card" :style="cssProps">
		<a class="header__card-link" :href="href"> </a>
		<div class="row header__card-content align-justify">
			<div class="small-3 header__card-img">
				<img :src="imgSrc">
			</div>
			<div class="column header__card-text">
				<h4>{{ title }}</h4>
				<p>{{ subtitle }}</p>
			</div>
		</div>
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
	}
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/15-years/15-years";

a {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 3;
}

.card {
	@include link();
	position: relative;
	padding: 0 rem-calc(16);

	@include breakpoint(large) {
		padding: 0;
	}

	img {
		transition: transform 0.15s ease-in-out;
	}

	p {
		text-decoration: underline;
	}

	h4 {
		text-decoration: none;
		font-style: normal;
		font-weight: bold;
		text-transform: none;
	}

	img {
		transform: var(--image-tilt);
	}

	&:hover {
		text-decoration: none;
		p {
			text-decoration: none;
		}

		img {
			transform: rotate(0deg);
		}
	}
}

.header {
	&__card-content {
		padding: 0;

		@include breakpoint(xxlarge) {
			padding: 0 rem-calc(48);
		}
	}

	&__card-img {
		max-width: 90px;
		display: block;
		margin-left: auto;
		margin-right: auto;

		// Phones
		@include breakpoint(small) {
			display: none;
		}

		// Desktop
		@include breakpoint(xxlarge) {
			display: block;
		}
	}

	&__card-text {

		h4 {
			@include breakpoint(small) {
				font-size: calc(18px / 320 * 100vw);
			}

			@include breakpoint(large) {
				font-size: calc(14px / 1000 * 100vw);
			}

			@include breakpoint(xxlarge) {
				font-size: calc(24px / 1440 * 100vw);
			}
		}

		p {
			@include breakpoint(small) {
				font-size: calc(11px / 320 * 100vw);
			}

			@include breakpoint(large) {
				font-size: calc(11px / 1000 * 100vw);
			}

			@include breakpoint(xxlarge) {
				font-size: calc(14px / 1440 * 100vw);
			}
		}
	}
}

</style>
