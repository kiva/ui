<template>
	<div class="individuals section">
		<div class="row">
			<div class="columns">
				<fifteen-years-section-header>
					<template v-slot:header>
						The World of Kiva
					</template>
					<template v-slot:subhead>
						The people who<br class="smo"><br class="xxlu"> make it happen
					</template>
				</fifteen-years-section-header>

				<div class="individuals__profile-nav-wrap">
					<!-- TODO: hide from screenreaders while lightbox is open -->
					<fifteen-years-individuals-profile
						:person="selectedPerson"
						class="individuals__profile"
					/>
					<fifteen-years-lightbox
						:visible="isShowingFullProfile"
						title="The World of Kiva"
						@lightbox-closed="isShowingFullProfile = false"
					>
						<fifteen-years-individuals-profile
							:person="selectedPerson"
							:expanded="true"
						/>

						<template v-slot:controls>
							<fifteen-years-button
								@click="showPerson(previousIndex)"
								variant="white"
							>
								Prev
							</fifteen-years-button>

							<span>
								{{ currentIndex + 1 }} of {{ people.length }}
							</span>

							<fifteen-years-button
								@click="showPerson(nextIndex)"
								variant="white"
							>
								Next
							</fifteen-years-button>
						</template>
					</fifteen-years-lightbox>

					<fifteen-years-button
						class="individuals__read-more-btn"
						@click="isShowingFullProfile = true"
					>
						Read More
					</fifteen-years-button>

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
								>
									<span class="name-nav__index">{{ doubleDigit(index) }}</span>
									<span>{{ person.name }}</span>
								</button>
							</li>
						</ul>

						<fifteen-years-button
							@click="showPerson(previousIndex)"
							variant="white"
						>
							Prev
						</fifteen-years-button>

						<span class="name-nav__1of">
							{{ currentIndex + 1 }} of {{ people.length }}
						</span>

						<fifteen-years-button
							@click="showPerson(nextIndex)"
							variant="white"
						>
							Next
						</fifteen-years-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsButton from './15YearsButton';
import FifteenYearsIndividualsProfile from './15YearsIndividualsProfile';
import FifteenYearsLightbox from './15YearsLightbox';
import FifteenYearsSectionHeader from './15YearsSectionHeader';

import peopleData from './15YearsIndividualsData';

export default {
	components: {
		FifteenYearsButton,
		FifteenYearsIndividualsProfile,
		FifteenYearsLightbox,
		FifteenYearsSectionHeader,
	},
	data() {
		return {
			people: peopleData,
			currentIndex: 0,
			isShowingFullProfile: false
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
	methods: {
		showPerson(index) {
			this.currentIndex = index;
		},
		doubleDigit(num) {
			return num < 10 ? `0${num}` : num;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.individuals {
	background: $tomato;
	color: #fff;

	&__profile-nav-wrap {
		@include breakpoint('xxlarge') {
			display: flex;
		}
	}

	&__profile {
		max-height: 20rem;
		overflow: hidden;

		@include breakpoint('xxlarge') {
			max-height: auto;
			flex: 1;
		}
	}

	&__read-more-btn {
		@include breakpoint('xxlarge') {
			display: none;
		}
	}

	&__nav {
		@include breakpoint('xxlarge') {
			flex-shrink: 0;
			order: -1;
			margin-right: 1rem;
		}
	}

	&__nav-names {
		display: none;

		@include breakpoint('xxlarge') {
			display: block;
		}
	}
}

.name-nav {
	&__li {
		margin: 0 0 1rem 0;
	}

	&__btn {
		color: #fff;
		opacity: 0.5;
		display: flex;

		&:hover,
		&:focus {
			opacity: 1;
		}

		&--selected {
			opacity: 1;
		}
	}

	&__index {
		display: inline-block;
		font-variant-numeric: tabular-nums;
		margin-right: 1rem;
	}

	&__1of {
		@include breakpoint('xxlarge') {
			display: none;
		}
	}
}
</style>
