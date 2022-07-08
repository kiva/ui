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
						ref="portraitImg"
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
						viewBox="0 0 381 357"
					>
						<path
							ref="portraitBlob"
							d="M203.32 15.27c44.68 6.37 84.82 25.8 113.5 60.6 29.34 35.61 46.43 79.75
							39.73 125.39-7.44 50.65-31.99 98.92-76.42
							124.41-48.35 27.73-109.78 37.24-158.63
							10.4-46.7-25.67-54.94-83.98-68.87-135.4-15.1-55.73-48.7-119.37-12.26-164.2
							36.33-44.7 105.9-29.33 162.95-21.2z"
						/>
					</svg>
				</div>
			</div>
		</div>

		<div
			class="profile__body-wrapper-wrapper"
			ref="profileBodyWrapperWrapper"
		>
			<div
				class="profile__body-wrapper"
				ref="profileBodyWrapper"
			>
				<div class="profile__body">
					<h3>{{ person.name }}</h3>
					<h4>
						{{ person.title }}<br>
						{{ person.location }}
					</h4>

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
					v-kv-track-event="[
						'Kiva15',
						'click-world-of-kiva-CTA',
						cta
					]"
				>
					{{ cta }}
				</fifteen-years-button>
			</div>

			<fifteen-years-button
				v-if="!expanded"
				class="profile__learn-more-btn"
				variant="white"
				@click="$emit('show-full-profile')"
				v-kv-track-event="[
					'Kiva15',
					'click-world-of-kiva-CTA',
					'Learn More'
				]"
			>
				Learn More
			</fifteen-years-button>

			<fifteen-years-button
				class="profile__next-person-btn"
				variant="white"
				@click="$emit('show-next-person')"
				v-kv-track-event="[
					'Kiva15',
					'click-world-of-kiva-CTA',
					'Next Story'
				]"
			>
				Next Story
			</fifteen-years-button>
		</div>
	</div>
</template>

<script>
import gsap from 'gsap';
import * as MorphSVGPlugin from '../../util/animation/MorphSVGPlugin';
import FifteenYearsButton from './15YearsButton';

const imageRequire = require.context('@/assets/images/15-years/profiles', true);

const getRandomInt = (minimum, maximum) => {
	const min = Math.ceil(minimum);
	const max = Math.floor(maximum);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default {
	name: '15YearsIndividualsProfile',
	components: {
		FifteenYearsButton,
	},
	props: {
		expanded: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			person: {
				name: null,
				title: null,
				img: 'zaaqi',
				body: null,
				videoId: null,
				cta1: null,
				cta2: null,
				link1: null,
				link2: null,
			},
			/* eslint-disable max-len */
			blobShapes: [
				'M203.32 15.27c44.68 6.37 84.82 25.8 113.5 60.6 29.34 35.61 46.43 79.75 39.73 125.39-7.44 50.65-31.99 98.92-76.42 124.41-48.35 27.73-109.78 37.24-158.63 10.4-46.7-25.67-54.94-83.98-68.87-135.4-15.1-55.73-48.7-119.37-12.26-164.2 36.33-44.7 105.9-29.33 162.95-21.2z',
				'M202.78 7.58c-42.07 2.5-86.43.22-118.45 27.65-34.06 29.19-47.54 73.88-52.13 118.5-5.23 50.95-8.11 106.6 25 145.66 34.92 41.2 92.38 64.87 145.58 55.62 48.58-8.45 75.04-57.77 102.49-98.75 20.73-30.94 27.48-65.59 32.32-102.52 6.01-45.86 29.96-99.48-1.4-133.47-31.49-34.14-87.05-15.45-133.4-12.7z',
				'M201.44 10.98c57.6.74 125-10.17 160.46 35.14 35.28 45.09 14.57 109.4-5.35 163.05-16.25 43.77-50.52 74.1-91.23 97.06-45.75 25.81-95.73 53.72-145.33 36.4C64.86 323.4 26.3 273.46 10.57 217.32-6.21 157.48-6.52 87.58 35.7 41.92c40.11-43.35 106.6-31.7 165.73-30.94z',
				'M199.96 8.23c30.67 4.96 56 23.24 80.32 42.54 23.26 18.46 43.1 39.53 56.5 66.01 15.52 30.7 37.46 64.8 26.06 97.25-11.4 32.41-54.8 37.41-81.14 59.5-29.41 24.64-44.32 68.39-81.74 77-39.6 9.11-81.53-8.22-114.6-31.82-33.24-23.72-58.85-58.54-67.81-98.34-8.53-37.87 5.91-75.75 20.48-111.74 13.6-33.58 29.33-68.25 60.15-87.36C127.97 2.8 165.35 2.62 199.96 8.23z',
			],
			/* eslint-enable max-len */
			blobIndex: 0,
		};
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
	mounted() {
		gsap.registerPlugin(MorphSVGPlugin);
	},
	methods: {
		async setPerson(personObj) {
			if (!this.person.name) { // if this is the initial load, don't animate
				this.person = personObj;
			} else {
				const {
					profileBodyWrapper,
					profileBodyWrapperWrapper,
					portraitImg,
					portraitBlob
				} = this.$refs;

				// blob animation
				const currentBlobIndex = this.blobIndex;
				this.blobIndex = getRandomInt(0, 3);
				while (currentBlobIndex === this.blobIndex) { // ensure we always have a different blob
					this.blobIndex = getRandomInt(0, 3);
				}
				gsap.fromTo(
					portraitBlob,
					{
						morphSVG: { shape: this.blobShapes[currentBlobIndex] }
					},
					{
						morphSVG: { shape: this.blobShapes[this.blobIndex] },
						ease: 'back.in',
						duration: 0.75
					}
				);

				// people and content animations
				const timeline = gsap.timeline({ defaults: { ease: 'power2.in' } });
				const animateOut = async () => {
					portraitImg.style.filter = 'blur(100px)'; // gsap doesnt do blur without a plugin, using css instead
					profileBodyWrapperWrapper.style.filter = 'blur(100px)';

					timeline.fromTo(profileBodyWrapperWrapper, { opacity: 1 }, { opacity: 0, duration: 0.25 });
					timeline.fromTo(portraitImg, { opacity: 1, y: 0 }, { opacity: 0, y: 5, duration: 0.25 });
					await timeline.play();
				};

				const animateIn = async () => {
					portraitImg.style.filter = 'blur(0)';
					profileBodyWrapperWrapper.style.filter = 'blur(0)';
					await timeline.reverse();
				};

				// animate the old person out
				await animateOut(timeline);

				// swap the person data
				this.person = personObj;
				await this.$nextTick();

				// reset the scroll container
				profileBodyWrapper.scrollTop = 0;

				// animate the new person in once their image is loaded
				if (portraitImg.complete) {
					animateIn(timeline);
				} else {
					portraitImg.addEventListener('load', async () => {
						animateIn(timeline);
					});
				}
			}
		}
	}
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

		.profile__portrait {
			padding-bottom: 56.25%; // 16:9
		}
	}

	// &--has-video {

	// }

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
		padding-bottom: 100%; // 1:1
		position: relative;
		margin-bottom: 2rem;
		margin-top: -1.5rem;

		@include breakpoint(large) {
			padding-bottom: 56.25%; // 16:9
			margin-top: 0;
		}
	}

	&__video {
		padding-bottom: 56.25%; // 16:9
		margin-top: 1rem;
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
		filter: blur(0);
		transition: filter 0.25s ease-in;
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
		flex: 1 0 auto; // IE11;
		margin: 1rem 3rem;
		fill: $offwhite;
		overflow: visible;

		@include breakpoint('xxlarge') {
			align-self: flex-start;
		}
	}

	&__body-wrapper-wrapper { // lol
		flex: 1 1 auto; // IE11;
		filter: blur(0);
		transition: filter 0.25s ease-in;
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

	&__body {
		&::v-deep {
			a {
				color: $mint;
			}
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

// Firefox looks like crap when animating blurs + transforms
// https://bugzilla.mozilla.org/show_bug.cgi?id=925025
@-moz-document url-prefix() {
	.profile__portrait-img,
	.profile__body-wrapper-wrapper {
		filter: blur(0) !important;
	}
}
</style>
