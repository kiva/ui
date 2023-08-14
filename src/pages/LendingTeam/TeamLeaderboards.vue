<template>
	<div class="tw-bg-primary tw-mb-4 tw-rounded">
		<h3
			class="tw-text-h4 tw-bg-action tw-text-primary-inverse tw-w-full tw-pl-1 tw-rounded-sm"
		>
			<template v-if="!isNewMembers">
				Amount Funded:
			</template>
			<template v-else>
				Member Count:
			</template>
		</h3>
		<kv-tabs @tab-changed="handleTabChanged">
			<template #tabNav>
				<kv-tab
					for-panel="thisMonth"
					class="tw-text-small"
				>
					This Month
				</kv-tab>
				<kv-tab
					for-panel="lastMonth"
					class="tw-text-small"
				>
					Last Month
				</kv-tab>
				<kv-tab
					for-panel="allTime"
					class="tw-text-small"
				>
					All Time
				</kv-tab>
			</template>
			<template #tabPanels>
				<kv-tab-panel id="thisMonth">
					<p>Coming Soon...!</p>
				</kv-tab-panel>
				<kv-tab-panel id="lastMonth">
					<p>Coming Soon...!</p>
				</kv-tab-panel>
				<kv-tab-panel
					id="allTime"
					class="tw-border-primary"
				>
					<div
						v-for="team in teams.slice(0, 10)"
						:key="team.id"
						class="tw-text-small tw-rounded-sm tw-flex tw-flex-row tw-p-1"
					>
						<img
							v-if="team.image && team.image.url"
							class="tw-w-5 tw-h-5 tw-flex-none tw-mb-1"
							:src="team.image.url"
						>

						<img
							v-else class="tw-w-5 tw-h-5 tw-flex-none tw-mb-1"
							:src="teamNoImage"
						>

						<div
							class="tw-flex tw-flex-row tw-flex-wrap tw-pl-1 tw-flex-grow
							tw-overflow-hidden tw-whitespace-nowrap"
						>
							<div
								class="tw-flex tw-flex-nowrap tw-flex-none tw-w-full"
							>
								<div class="tw-flex-1 tw-overflow-hidden tw-text-ellipsis tw-text-base">
									<router-link
										:to="`/team/${team.teamPublicId}`"
									>
										<div
											class="tw-text-base tw-text-primary tw-overflow-hidden tw-text-ellipsis"
										>
											{{ team.name }}
										</div>
									</router-link>
								</div>
								<div class="tw-flex-none tw-ml-1">
									<template v-if="!isNewMembers">
										{{ numeral(team.lentAmount).format('$0,0a') }}
									</template>
									<template v-else>
										{{ numeral(team.lenderCount).format('0,0a') }}
									</template>
								</div>
							</div>
							<div
								class="tw-flex-none tw-w-full"
							>
								<template v-if="!isNewMembers">
									<kv-progress-bar
										aria-label="Total Amount the Team has lent"
										:min="0"
										max="75000000"
										:value="team.lentAmount"
									/>
								</template>
								<template v-else>
									<kv-progress-bar
										aria-label="Total Amount of Members the Team has"
										:min="0"
										max="200000"
										:value="team.lenderCount"
									/>
								</template>
							</div>
						</div>
					</div>
				</kv-tab-panel>
			</template>
		</kv-tabs>
	</div>
</template>

<script>
import KvProgressBar from '@/components/Kv/KvProgressBar';
import numeral from 'numeral';
import teamNoImage from '@/assets/images/team_s135.png';
import { fetchLeaderboard } from '../../util/teamsUtil';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabPanel from '~/@kiva/kv-components/vue/KvTabPanel';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';

export default {
	name: 'TeamLeaderboards',
	components: {
		KvProgressBar,
		KvTabs,
		KvTab,
		KvTabPanel,
	},
	inject: ['apollo'],
	data() {
		return {
			teams: ['10'],
			numeral,
			teamNoImage
		};
	},
	props: {
		boardType: {
			type: String,
			required: true,
		}
	},
	computed: {
		isNewMembers() {
			return this.boardType === 'memberCount';
		}
	},
	options: {
		limit: 10
	},
	methods: {
		handleTabChanged(index) {
			console.log(index);
		},
	},
	mounted() {
		fetchLeaderboard(this.apollo, this.boardType).then(teams => {
			this.teams = teams?.values ?? [];
		});
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-progress-bar {
	$background-color: transparent;
	$foreground-color: #19653E;

	display: block;
	width: 100%;
	background-color: $background-color;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	height: rem-calc(4);

	@include breakpoint(large) {
		height: rem-calc(9);
	}

	/* firefox */
	&::-moz-progress-bar {
		background: $foreground-color;
		background: var(--kv-progress-bar-foreground-color, $foreground-color);
	}

	/* webkit browsers */
	&::-webkit-progress-bar {
		background: $background-color;
		background: var(--kv-progress-bar-background-color, $background-color);
		box-shadow: 0;
	}

	&::-webkit-progress-value {
		background: $foreground-color;
		background: var(--kv-progress-bar-foreground-color, $foreground-color);
	}

	/* IE */
	&::-ms-fill {
		background: $foreground-color;
		background: var(--kv-progress-bar-foreground-color, $foreground-color);
		box-shadow: 0;
	}
}

</style>
