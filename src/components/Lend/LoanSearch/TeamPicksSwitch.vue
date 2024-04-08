<template>
	<div class="tw-bg-white tw-rounded tw-p-3 lg:tw-shadow-lg">
		<div class="tw-flex tw-flex-col">
			<kv-switch
				v-model="showTeamPicks"
			>
				<div class="tw-flex tw-items-center tw-gap-0.5">
					<img :src="HandOrangeIcon" class="tw-w-4">
					<span>Team Picks</span>
				</div>
			</kv-switch>
			<p class="tw-text-small">
				Loans handpicked for your team, by your team.
			</p>
		</div>
		<hr class="tw-border-tertiary tw-mt-3 lg:tw-hidden">
	</div>
</template>

<script>
import HandOrangeIcon from '@/assets/images/hand_orange.svg';
import KvSwitch from '~/@kiva/kv-components/vue/KvSwitch';

export default {
	name: 'TeamPicksSwitch',
	components: {
		KvSwitch
	},
	props: {
		showPicks: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			HandOrangeIcon
		};
	},
	computed: {
		showTeamPicks: {
			get() {
				return this.showPicks;
			},
			set(value) {
				this.$emit('handle-team-picks', value);
			}
		}
	}
};
</script>
