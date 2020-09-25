<template>
	<div
		class="profile"
		:class="[
			expanded ? 'profile--expanded': '',
			person.videoId ? 'profile--has-video': ''
		]"
	>
		<div class="profile__portrait">
			<div class="profile__portrait-wrapper">
				<picture class="profile__portrait-picture">
					<source
						type="image/avif"
						:srcset="portraitSrc.avif"
					>
					<source
						type="image/webp"
						:srcset="portraitSrc.webp"
					>
					<img
						class="profile__portrait-img"
						:src="portraitSrc.png"
						:alt="`Portrait of ${person.name}`"
						width="923"
						height="1000"
					>
				</picture>

				<div class="profile__portrait-background">
					<svg
						class="profile__portrait-blob"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 182 188"
					>
						<path
							d="M97.71 5.04c24.35 3.46 46.22 14.01 61.85 32.93 15.99 19.35 25.3 43.33
							21.65 68.12-4.05 27.53-17.43 53.76-41.64 67.6-26.35 15.07-59.82 20.24-86.44
							5.65-25.45-13.94-29.94-45.63-37.53-73.56C7.38 75.49-10.93 40.9 8.92 16.56
							28.72-7.73 66.62.62 97.72 5.04z"
							fill="#F8F8F8"
						/>
					</svg>
				</div>
			</div>
		</div>

		<div class="profile__body-wrapper-wrapper">
			<div class="profile__body-wrapper" ref="profilebody">
				<div class="profile__body">
					<h3>{{ person.name }}</h3>
					<h4>{{ person.title }}</h4>

					<template v-if="person.videoId">
						<div class="profile__video">
							<iframe
								:src="`https://player.vimeo.com/video/${person.videoId}?title=0&byline=0&portrait=0`"
								style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
								frameborder="0"
								allow="autoplay; fullscreen"
								allowfullscreen
							></iframe>
						</div>
					</template>

					<div
						v-html="person.body"
					></div>
				</div>

				<fifteen-years-button
					class="profile__cta"
					:to="link"
				>
					{{ cta }}
				</fifteen-years-button>
			</div>

			<fifteen-years-button
				v-if="!expanded"
				class="profile__learn-more-btn"
				variant="white"
				@click="$emit('show-full-profile')"
			>
				Learn More
			</fifteen-years-button>

			<fifteen-years-button
				class="profile__next-person-btn"
				variant="white"
				@click="$emit('show-next-person')"
			>
				Next Story
			</fifteen-years-button>
		</div>
	</div>
</template>

<script>
import FifteenYearsButton from './15YearsButton';

const imageRequire = require.context('@/assets/images/15-years/profiles', true);

export default {
	components: {
		FifteenYearsButton,
	},
	props: {
		person: {
			type: Object,
			default() { return {}; }
		},
		expanded: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		person() {
			this.$refs.profilebody.scrollTop = 0;
		}
	},
	computed: {
		cta() {
			return this.person.cta1; // We'll likely have an experiment will return cta1 or cta2
		},
		link() {
			return this.person.link1; // We'll likely have an experiment will return link1 or link2
		},
		portraitSrc() {
			return {
				avif: imageRequire(`./${this.person.img}.avif`),
				png: imageRequire(`./${this.person.img}.png`),
				webp: imageRequire(`./${this.person.img}.webp`),
			};
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

/* stylelint-disable no-descending-specificity */
.profile {
	display: flex;
	flex-direction: column;

	@include breakpoint(xxlarge) {
		flex-direction: row;
	}

	&--expanded {
		.profile__portrait-wrapper {
			background: linear-gradient(to bottom, #FFF 0%, rgba(255, 255, 255, 0.7) 100%);
			overflow: hidden;
		}

		.profile__portrait-blob {
			display: none;
		}

		.profile__body-wrapper {
			height: 100%;
		}
	}

	&--has-video {

	}

	&__portrait-wrapper {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: 0 rem-calc(-23);
		border-bottom: 1px solid $offwhite;

		@include breakpoint('large') {
			margin: 0 rem-calc(-71);
		}

		@include breakpoint('xxlarge') {
			border-bottom: 0;
			margin: 0;
		}
	}

	&__video,
	&__portrait {
		height: 0;
		padding-bottom: 56.25%; // 16:9
		position: relative;
		margin-bottom: 2rem;
	}

	&__portrait {
		@include breakpoint(xxlarge) {
			width: rem-calc(430);
			height: rem-calc(540);
			flex-shrink: 0;
			margin-bottom: 0;
			padding-bottom: 0;
		}
	}

	&__portrait-img {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		display: block;
		width: auto;
		max-height: calc(100% - 1rem);
		margin: 1rem auto 0;
	}

	&__portrait-background {
		position: absolute;
		z-index: 0;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
	}

	&__portrait-blob {
		flex: 1;
		margin: 1rem 3rem;

		@include breakpoint('xxlarge') {
			align-self: flex-start;
		}
	}

	&__body-wrapper-wrapper { // lol
		flex: 1;
	}

	&__body-wrapper {
		height: rem-calc(190);
		overflow: hidden;
		position: relative;

		&::after {
			content: '';
			display: block;
			position: sticky;
			height: rem-calc(50);
			bottom: 0;
			width: 100%;
			background: linear-gradient(to bottom, rgba($tomato, 0), rgba($tomato, 1));
			pointer-events: none;
		}

		@include breakpoint(xxlarge) {
			height: rem-calc(380);
			overflow-y: auto;
			margin: 0 0 2rem 2rem;
		}
	}

	// &__cta {
	// }

	&__learn-more-btn {
		width: 100%;
		margin-bottom: 1rem;

		@include breakpoint(xxlarge) {
			display: none;
		}
	}

	&__next-person-btn {
		display: none;

		@include breakpoint(xxlarge) {
			display: block;
			margin-left: auto;
		}
	}
}
</style>
