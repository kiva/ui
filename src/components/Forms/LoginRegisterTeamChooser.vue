<template>
	<div>
		<div class="input-set">
			<label for="auto_join_default_team">
				Request to join team.
				<a id="team-info" @click.prevent="triggerTeamLightbox">
					What is this?
				</a>
				<select
					name="auto_join_default_team"
					id="auto_join_default_team"
					v-model="selectedTeamId"
					class="medium-text-font-size"
					@change="onChange"
				>
					<option value="auto_join">{{ teamName }}</option>
					<option value="">Not now</option>
				</select>
			</label>
		</div>

		<kv-lightbox
			:visible="teamLbVisible"
			@lightbox-closed="teamLightboxClosed">
			<h2 slot="title">Join the team!</h2>
			<p>
				<!-- eslint-disable-next-line max-len -->
				By joining the {{ teamName }} team you can see your impact, interact with colleagues, and get more out of Kiva.
			</p>
			<div class="join-team-button-container">
				<kv-button class="smaller secondary" @click.native.prevent="setJoinTeamButton(false)">
					No Thanks
				</kv-button>
				<kv-button class="smaller" @click.native.prevent="setJoinTeamButton(true)">
					Join Team
				</kv-button>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import TeamInfoFromId from '@/graphql/query/teamInfoFromId.graphql';
import _get from 'lodash/get';

export default {
	components: {
		KvButton,
		KvLightbox,
		TeamInfoFromId,
	},
	inject: ['apollo'],
	props: {
		teamId: {
			type: Number,
			required: true,
		},
	},
	apollo: {
		query: TeamInfoFromId,
		prefetch: true,
		variables() {
			return {
				id: this.teamId,
			};
		},
		result({ data }) {
			this.teamName = _get(data, 'community.team.name');
		},
	},
	data() {
		return {
			teamName: '',
			teamLbVisible: false,
			selectedTeamId: 'auto_join',
		};
	},
	methods: {
		triggerTeamLightbox() {
			this.teamLbVisible = !this.teamLbVisible;
		},

		teamLightboxClosed() {
			this.teamLbVisible = false;
		},
		setJoinTeamButton(joinTeam) {
			if (joinTeam) {
				this.selectedTeamId = 'auto_join';
				this.$kvTrackEvent('nudgeIfNotJoinTeamLightbox', 'Yes');
			} else {
				this.selectedTeamId = '';
				this.$kvTrackEvent('nudgeIfNotJoinTeamLightbox', 'No');
			}
			this.teamLbVisible = false;
		},
		onChange(event) {
			if (event.target.value === '') {
				this.teamLbVisible = true;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.input-set {
	label {
		font-weight: normal;
		font-size: 1rem;
		color: $charcoal;
	}

	input {
		color: $charcoal;
	}
}

#team-info {
	font-weight: 300;
}

.join-team-button-container {
	margin: 0 auto;
	max-width: 22rem;
	display: flex;
	justify-content: space-between;
	flex-direction: column;

	@include breakpoint(medium) {
		flex-direction: row;
	}
}
</style>
