<template>
	<div class="edit-preferences">
		<h2 class="edit-preferences__header">
			Looking for different loans?
		</h2>
		<p class="edit-preferences__sub-header">
			Change your preferences and find more borrowers to support.
		</p>
		<div class="row">
			<div class="small-12 large-6 columns">
				<!-- Causes Card -->
				<div class="edit-preferences__card" v-if="causes.length > 0">
					<div class="edit-preferences__icon-wrapper">
						<span class="edit-preferences__icon-background">
							<kv-icon
								class="edit-preferences__check-icon"
								name="checkmark"
							/>
						</span>
					</div>
					<div class="edit-preferences__content-wrapper">
						<div class="row collapse text-left align-middle">
							<div class="small-6 large-7 xlarge-6 columns">
								<h2 class="edit-preferences__content-wrapper--title">
									Your {{ causes.length }} causes
								</h2>
								<router-link
									class="smallest"
									to="/get-started"
								>
									Change causes &#8594;
								</router-link>
							</div>
							<div class="small-6 large-5 xlarge-6 columns">
								<ul class="edit-preferences__list">
									<li
										class="edit-preferences__list-item"
										v-for="(cause, index) in causesTrimmed"
										:key="index"
									>
										<kv-cause-selector
											:cause="cause.name"
											:as-icon="true"
										/>
									</li>
									<li v-if="causes.length > 3" class="edit-preferences__list-item--counter">
										<strong>+{{ causes.length - 2 }}</strong>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="edit-preferences__card" v-if="causes.length === 0">
					<div class="edit-preferences__icon-wrapper">
						<span class="edit-preferences__icon-background">
							<strong>?</strong>
						</span>
					</div>
					<div class="edit-preferences__content-wrapper">
						<div class="row collapse text-left align-middle column">
							<h2 class="edit-preferences__content-wrapper--title">
								All Causes
							</h2>
							<router-link
								class="smallest"
								to="/get-started"
							>
								Choose causes you care about &#8594;
							</router-link>
						</div>
					</div>
				</div>
			</div>
			<div class="small-12 large-6 columns">
				<!-- Places Card -->
				<div class="edit-preferences__card" v-if="countries.length > 0">
					<div class="edit-preferences__icon-wrapper">
						<span class="edit-preferences__icon-background">
							<kv-icon
								class="edit-preferences__check-icon"
								name="checkmark"
							/>
						</span>
					</div>
					<div class="edit-preferences__content-wrapper">
						<div class="row collapse text-left align-middle">
							<div class="small-6 large-7 xlarge-6 columns">
								<h2 class="edit-preferences__content-wrapper--title">
									Your {{ countries.length }} places
								</h2>
								<router-link
									class="smallest"
									to="/get-started/places"
								>
									Change places &#8594;
								</router-link>
							</div>
							<div class="small-6 large-5 xlarge-6 columns">
								<ul class="edit-preferences__list">
									<li
										class="edit-preferences__list-item"
										v-for="(country, index) in countriesTrimmed"
										:key="index"
									>
										<kv-flag
											class="edit-preferences__flag"
											:country="country.isoCode"
											aspect-ratio="1x1"
											:inline-svg="true"
										/>
									</li>
									<li v-if="countries.length > 3" class="edit-preferences__list-item--counter">
										<strong>+{{ countries.length - 2 }}</strong>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="edit-preferences__card" v-if="countries.length === 0">
					<div class="edit-preferences__icon-wrapper">
						<span class="edit-preferences__icon-background">
							<strong>?</strong>
						</span>
					</div>
					<div class="edit-preferences__content-wrapper">
						<div class="row collapse text-left align-middle column">
							<h2 class="edit-preferences__content-wrapper--title">
								Everywhere
							</h2>
							<router-link
								class="smallest"
								to="/get-started"
							>
								Choose places you want to support &#8594;
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import KvCauseSelector from '@/components/Kv/KvCauseSelector';
import KvFlag from '@/components/Kv/KvFlag';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvCauseSelector,
		KvFlag,
		KvIcon,
	},
	props: {
		causes: {
			type: Array,
			default: () => [],
		},
		countries: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		causesTrimmed() {
			if (this.causes.length <= 3) {
				return this.causes;
			}
			return this.causes.slice(0, 2);
		},
		countriesTrimmed() {
			if (this.countries.length <= 3) {
				return this.countries;
			}
			return this.countries.slice(0, 2);
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

$box-shadow: 0 rem-calc(2) rem-calc(30) 0 rgba(0, 0, 0, 0.15);

.edit-preferences {
	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	&__sub-header {
		font-size: $medium-text-font-size;
	}

	&__card {
		border-radius: 1rem;
		background-color: $kiva-bg-darkgray;
		min-height: 11rem;
		display: flex;
		margin-top: 1rem;
		align-items: stretch;
	}

	&__icon-wrapper {
		background-color: $kiva-stroke-gray;
		border-radius: 1rem 0 0 1rem;
		width: rem-calc(46);
	}

	&__content-wrapper,
	&__icon-wrapper {
		display: flex;
		align-items: center;
		padding: 0.65rem;
	}

	&__content-wrapper {
		padding-left: 1.25rem;
		width: 100%;
		& > .row { width: 100%; }

		&--title {
			margin-bottom: 0;
			font-size: 2rem;
			font-weight: $global-weight-highlight;
		}
	}

	&__icon-background {
		display: flex;
		width: rem-calc(25);
		height: rem-calc(25);
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: $white;
		color: $kiva-stroke-gray;
	}

	&__check-icon {
		width: rem-calc(16);
		height: rem-calc(12);
		fill: $kiva-stroke-gray;
	}

	&__list {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 0;
		justify-content: center;
	}

	&__list-item,
	&__list-item--counter {
		width: rem-calc(69);
		height: rem-calc(69);
		display: flex;
		justify-content: center;
		margin: 0.25rem;
	}

	&__list-item {
		::v-deep .kv-cause-selector__circle {
			margin-bottom: 0;
		}
	}

	&__list-item--counter {
		background-color: $kiva-accent-blue;
		border-radius: 50%;
		padding: 5%;
		align-items: center;
		color: $white;
		font-size: 1.25rem;
	}

	&__flag {
		width: rem-calc(69);
		height: rem-calc(69);
		overflow: hidden;
		border-radius: 50%;
		box-shadow: $box-shadow;
		border: 0;
	}
}
</style>
