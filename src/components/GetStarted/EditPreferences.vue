<template>
	<div class="edit-preferences">
		<h2 class="tw-mb-2">
			Looking for different loans?
		</h2>
		<p class="tw-text-subhead tw-mb-4">
			Change your preferences and find more borrowers to support.
		</p>
		<div class="row">
			<div class="small-12 large-6 columns">
				<!-- Causes Card -->
				<div class="edit-preferences__card tw-bg-secondary" v-if="causes.length > 0">
					<div class="edit-preferences__icon-wrapper tw-bg-tertiary">
						<span class="edit-preferences__icon-background">
							<kv-icon
								class="edit-preferences__check-icon"
								name="checkmark"
							/>
						</span>
					</div>
					<div class="edit-preferences__content-wrapper">
						<div class="row collapse tw-text-left align-middle">
							<div class="small-6 large-7 xlarge-6 columns">
								<h2>
									Your {{ causes.length }} causes
								</h2>
								<router-link
									class="smallest"
									to="/get-started"
									v-kv-track-event="['Lending', 'click-results-change-causes', 'Change causes']"
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
				<div class="edit-preferences__card tw-bg-secondary" v-if="causes.length === 0">
					<div class="edit-preferences__icon-wrapper tw-bg-tertiary">
						<span class="edit-preferences__icon-background">
							<strong>?</strong>
						</span>
					</div>
					<div class="edit-preferences__content-wrapper">
						<div class="row collapse tw-text-left align-middle column">
							<h2>All Causes</h2>
							<router-link
								class="smallest"
								to="/get-started"
								v-kv-track-event="['Lending', 'click-results-choose-causes', 'choose causes']"
							>
								Choose causes you care about &#8594;
							</router-link>
						</div>
					</div>
				</div>
			</div>
			<div class="small-12 large-6 columns">
				<!-- Places Card -->
				<div class="edit-preferences__card tw-bg-secondary" v-if="countries.length > 0">
					<div class="edit-preferences__icon-wrapper tw-bg-tertiary">
						<span class="edit-preferences__icon-background">
							<kv-icon
								class="edit-preferences__check-icon"
								name="checkmark"
							/>
						</span>
					</div>
					<div class="edit-preferences__content-wrapper">
						<div class="row collapse tw-text-left align-middle">
							<div class="small-6 large-7 xlarge-6 columns">
								<h2>Your {{ countries.length }} places</h2>
								<router-link
									class="smallest"
									to="/get-started/places"
									v-kv-track-event="['Lending', 'click-results-change-places', 'Change places']"
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
				<div class="edit-preferences__card tw-bg-secondary" v-if="countries.length === 0">
					<div class="edit-preferences__icon-wrapper tw-bg-tertiary">
						<span class="edit-preferences__icon-background">
							<strong>?</strong>
						</span>
					</div>
					<div class="edit-preferences__content-wrapper">
						<div class="row collapse tw-text-left align-middle column">
							<h2>Everywhere</h2>
							<router-link
								class="smallest"
								to="/get-started/places"
								v-kv-track-event="['Lending', 'click-results-choose-places', 'Choose places']"
							>
								Choose places you want to support &#8594;
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
		<p class="edit-preferences__outro tw-text-subhead">
			Want to dive even deeper? There are {{ totalCount | numeral(0,0) }} borrowers on Kiva,
			<router-link
				to="/lend/filter"
				v-kv-track-event="['Lending', 'click-dive-deeper', 'Start exploring today']"
			>
				start exploring today.
			</router-link>
		</p>
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
		totalCount: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			causeList: [
				{
					id: 5,
					name: 'women',
					checked: false,
				},
				{
					id: 6,
					name: 'shelter',
					checked: false,
				},
				{
					id: 4,
					name: 'education',
					checked: false,
				},
				{
					id: 102,
					name: 'technology',
					checked: false,
				},
				{
					id: 8,
					name: 'agriculture',
					checked: false,
				},
				{
					id: 96,
					name: 'COVID-19',
					checked: false,
				},
				{
					id: 25,
					name: 'health',
					checked: false,
				},
				{
					id: 32,
					name: 'refugees',
					checked: false,
				},
				{
					id: 29,
					name: 'arts',
					checked: false
				}
			]
		};
	},
	computed: {
		causesTrimmed() {
			const causeIds = this.causes.map(cause => cause.id);
			const filteredCauses = this.causeList.filter(cause => {
				return causeIds.includes(cause.id);
			});
			if (filteredCauses.length <= 3) {
				return filteredCauses;
			}
			return filteredCauses.slice(0, 2);
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
	&__card {
		border-radius: 1rem;
		min-height: 11rem;
		display: flex;
		margin-top: 1rem;
		align-items: stretch;
	}

	&__icon-wrapper {
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

	&__outro {
		max-width: 30rem;
		margin: 2rem auto 0;
	}
}
</style>
