<template>
	<div class="edit-preferences">
		<h2 class="tw-mb-2">
			Looking for different loans?
		</h2>
		<p class="tw-text-subhead tw-mb-4">
			Change your preferences and find more borrowers to support.
		</p>
		<p class="edit-preferences__outro tw-text-subhead">
			Want to dive even deeper? There are {{ $filters.numeral(totalCount, 0,0) }} borrowers on Kiva,
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
import { KvFlag } from '@kiva/kv-components';
import KvCauseSelector from '#src/components/Kv/KvCauseSelector';
import KvIcon from '#src/components/Kv/KvIcon';

export default {
	name: 'EditPreferences',
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
@use '#src/assets/scss/settings' as *;

$box-shadow: 0 rem-calc(2) rem-calc(30) 0 rgb(0 0 0 / 15%);

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
		:deep(.kv-cause-selector__circle) {
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
