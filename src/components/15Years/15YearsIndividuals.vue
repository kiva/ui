<template>
	<div class="individuals section">
		<div class="row">
			<div class="columns individuals__wrapper">
				<fifteen-years-popcorn class="individuals__popcorn" />
				<fifteen-years-section-header class="individuals__header">
					<template #header>
						The World <br class="lo xlo"> of Kiva
					</template>
					<template #subhead>
						The people who<br class="smo"><br class="xxlu"> make it happen
					</template>
				</fifteen-years-section-header>

				<div class="individuals__profile-nav-wrap">
					<div class="individuals__nav">
						<ul class="individuals__nav-names name-nav">
							<li
								class="name-nav__li"
								v-for="(person, index) in people"
								:key="person.name"
							>
								<button
									class="name-nav__btn"
									:class="index === currentIndex ? 'name-nav__btn--selected' : ''"
									@click="showPerson(index)"
									@mouseenter="preloadPortrait(index)"
									v-kv-track-event="[
										'Kiva15',
										'click-world-of-kiva-name',
										`${doubleDigit(index)} ${person.name}`
									]"
								>
									<span class="name-nav__index">{{ doubleDigit(index) }}</span>
									<span class="name-nav__name">{{ person.name }}</span>
								</button>
							</li>
						</ul>

						<div class="prevnext prevnext--odd-desktop">
							<button
								class="prevnext__btn prevnext__btn--prev"
								@click="showPerson(previousIndex)"
								v-kv-track-event="[
									'Kiva15',
									'click-world-of-kiva-CTA',
									'Previous Story'
								]"
							>
								<kv-icon
									class="prevnext__btn-icon"
									name="fat-chevron"
									:from-sprite="true"
								/>
								<span class="prevnext__btn-text">
									Prev
								</span>
							</button>

							<span class="prevnext__indicator">
								{{ currentIndex + 1 }} of {{ people.length }}
							</span>

							<button
								class="prevnext__btn prevnext__btn--next"
								@click="showPerson(nextIndex)"
								v-kv-track-event="[
									'Kiva15',
									'click-world-of-kiva-CTA',
									'Next Story'
								]"
							>
								<span class="prevnext__btn-text">
									Next
								</span>
								<kv-icon
									class="prevnext__btn-icon"
									name="fat-chevron"
									:from-sprite="true"
								/>
							</button>
						</div>
					</div>

					<div class="individuals__profile">
						<!-- TODO: hide from screenreaders while lightbox is open -->
						<fifteen-years-individuals-profile
							ref="profile1"
							class="individuals__profile"
							@show-next-person="showPerson(nextIndex)"
							@show-full-profile="isShowingFullProfile = true"
						/>
					</div>
				</div>
			</div>
		</div>

		<fifteen-years-lightbox
			:visible="isShowingFullProfile"
			title="The World of Kiva"
			ref="lightbox"
			@lightbox-closed="isShowingFullProfile = false"
		>
			<fifteen-years-individuals-profile
				ref="profile2"
				:expanded="true"
			/>

			<template #controls>
				<div class="prevnext">
					<button
						class="prevnext__btn prevnext__btn--prev"
						@click="showPerson(previousIndex)"
						v-kv-track-event="[
							'Kiva15',
							'click-world-of-kiva-CTA',
							'Previous Story'
						]"
					>
						<kv-icon
							class="prevnext__btn-icon"
							name="fat-chevron"
							:from-sprite="true"
						/>
						<span class="prevnext__btn-text">
							Prev
						</span>
					</button>

					<span class="prevnext__indicator">
						{{ currentIndex + 1 }} of {{ people.length }}
					</span>

					<button
						class="prevnext__btn prevnext__btn--next"
						@click="showPerson(nextIndex)"
						v-kv-track-event="[
							'Kiva15',
							'click-world-of-kiva-CTA',
							'Next Story'
						]"
					>
						<span class="prevnext__btn-text">
							Next
						</span>
						<kv-icon
							class="prevnext__btn-icon"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</button>
				</div>
			</template>
		</fifteen-years-lightbox>
	</div>
</template>

<script>
import { checkWebpSupport, checkAvifSupport, preloadImage } from '@/util/imageUtils';

import KvIcon from '@/components/Kv/KvIcon';
import FifteenYearsIndividualsProfile from './15YearsIndividualsProfile';
import FifteenYearsLightbox from './15YearsLightbox';
import FifteenYearsPopcorn from './15YearsPopcorn';
import FifteenYearsSectionHeader from './15YearsSectionHeader';

import peopleData from './15YearsIndividualsData';

const imageRequire = require.context('@/assets/images/15-years/profiles', true);

export default {
	name: '15YearsIndividuals',
	components: {
		FifteenYearsIndividualsProfile,
		FifteenYearsLightbox,
		FifteenYearsPopcorn,
		FifteenYearsSectionHeader,
		KvIcon
	},
	data() {
		return {
			people: peopleData,
			currentIndex: 0,
			isShowingFullProfile: false,
		};
	},
	computed: {
		nextIndex() {
			const nextIndex = this.currentIndex + 1;
			if (nextIndex < this.people.length) {
				return nextIndex;
			}
			return 0;
		},
		previousIndex() {
			const previousIndex = this.currentIndex - 1;
			if (previousIndex >= 0) {
				return previousIndex;
			}
			return this.people.length - 1;
		},
		selectedPerson() {
			return this.people[this.currentIndex];
		},
	},
	watch: {
		selectedPerson() {
			if (this.selectedPerson) {
				// we call a method instead of setting prop so we can fine-tune animation timing.
				this.$refs.profile1.setPerson(this.selectedPerson);
				this.$refs.profile2.setPerson(this.selectedPerson);
			}
		}
	},
	methods: {
		showPerson(index) {
			this.currentIndex = index;
			this.$refs.lightbox.resetContentScroll();

			this.preloadPortrait(this.previousIndex);
			this.preloadPortrait(this.nextIndex);
		},
		doubleDigit(num) {
			return num < 10 ? `0${num}` : num;
		},
		preloadPortrait(personIndex) {
			const personImg = this.people[personIndex].img;

			if (this.browserSupportsAvif) {
				preloadImage(imageRequire(`./${personImg}.avif`));
			} else if (this.browserSupportsWebp) {
				preloadImage(imageRequire(`./${personImg}.webp`));
			} else {
				preloadImage(imageRequire(`./${personImg}.png`));
			}
		}
	},
	async mounted() {
		this.browserSupportsWebp = await checkWebpSupport();
		this.browserSupportsAvif = await checkAvifSupport();

		this.$refs.profile1.setPerson(this.selectedPerson);
		this.$refs.profile2.setPerson(this.selectedPerson);

		this.preloadPortrait(this.previousIndex);
		this.preloadPortrait(this.nextIndex);
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.individuals {
	background: $tomato;
	color: #fff;
	overflow: hidden;

	@include breakpoint('xxlarge') {
		padding-bottom: 0 !important; // make sure the outer css doesn't win
	}

	&__wrapper {
		position: relative;
	}

	&__header {
		margin-bottom: 1rem;

		@include breakpoint('xxlarge') {
			margin-bottom: 4rem;
		}
	}

	&__profile-nav-wrap {
		@include breakpoint('xxlarge') {
			display: flex;
		}
	}

	&__profile {
		flex: 1 1 0; // IE11;
	}

	&__learn-more-btn {
		@include breakpoint('xxlarge') {
			display: none;
		}
	}

	&__next-story-btn {
		display: none;

		@include breakpoint('xxlarge') {
			display: inline-block;
			margin-left: auto;
		}
	}

	&__nav {
		@include breakpoint('xxlarge') {
			flex-shrink: 0;
			margin-right: 2rem;
			margin-bottom: 5.5rem;
		}
	}

	&__nav-names {
		display: none;

		@include breakpoint('xxlarge') {
			display: block;
			padding-bottom: 1.5rem;
			border-bottom: 1px solid $offwhite;
			margin-bottom: 1.5rem;
		}
	}

	&__popcorn {
		display: none;

		@include breakpoint('large') {
			display: block;
			width: 12.5rem;
			position: absolute;
			right: -10%;
			top: 1rem;
		}

		@include breakpoint('xxlarge') {
			right: -20%;
			top: 5rem;
		}
	}
}

/* begin prevnext: TODO dedupe */
.prevnext {
	@include h5();

	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	z-index: 2;

	&__btn-text {
		border-radius: rem-calc(16);
		padding: rem-calc(2) rem-calc(8);
		border: rem-calc(2) solid transparent;
	}

	&__btn-icon {
		width: rem-calc(20);
		height: rem-calc(11);
	}

	&__btn {
		@include h5();

		display: flex;
		justify-content: center;
		align-items: center;
		fill: $offwhite;
		color: $offwhite;

		&--prev {
			.prevnext__btn-icon {
				transform: rotate(90deg);
			}
		}

		&--next {
			.prevnext__btn-icon {
				transform: rotate(-90deg);
			}
		}

		&:hover {
			.prevnext__btn-text {
				background: #000;
				color: $offwhite;
				border: rem-calc(2) solid #fff;
			}

			.prevnext__btn-icon {
				fill: $mint;
			}
		}

		&:focus {
			outline: 0;

			.prevnext__btn-text {
				border: rem-calc(2) solid $mint;
			}
		}

		&[disabled] {
			visibility: hidden;
		}
	}

	&--odd-desktop {
		@include breakpoint('xxlarge') {
			justify-content: space-evenly;

			.prevnext__btn-text,
			.prevnext__indicator {
				@include visually-hidden();
			}

			.prevnext__btn--next .prevnext__btn-icon {
				transform: rotate(0deg);
			}

			.prevnext__btn--prev .prevnext__btn-icon {
				transform: rotate(180deg);
			}
		}
	}
}

.name-nav {
	list-style: none;

	&__li {
		margin: 0 0 0.675rem 0;

		&:last-child {
			margin: 0;
		}
	}

	&__btn {
		color: #fff;
		opacity: 0.5;
		display: flex;
		transition: opacity 0.25s ease-in;

		&:hover,
		&:focus {
			opacity: 1;
			transition: opacity 0s ease-in;
			outline: 0;
		}

		&:focus {
			text-decoration: underline;
		}

		&--selected {
			opacity: 1;
		}
	}

	&__index {
		font-variant-numeric: tabular-nums;
		margin-right: 1rem;
	}

	&__name {
		flex: auto; // IE11;
	}

	&__1of {
		@include breakpoint('xxlarge') {
			display: none;
		}
	}
}
</style>
