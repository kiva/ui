<template>
	<div class="tw-bg-primary tw-mb-4 tw-rounded tw-drop-shadow-lg tw-overflow-hidden">
		<h4
			class="tw-bg-action tw-text-primary-inverse tw-w-full tw-px-1 tw-py-1.5 tw-mb-1 tw-inline-block"
		>
			<template v-if="!isNewMembers">
				Amount Funded:
			</template>
			<template v-else>
				Member Count:
			</template>
		</h4>
		<kv-tabs class="tw-px-1" @tab-changed="handleTabChanged">
			<template #tabNav>
				<kv-tab
					for-panel="thisMonth"
					class="tw-text-h4"
					:class="{'tw-text-secondary' :selectedTabIndex !== 0}"
				>
					This Month
				</kv-tab>
				<kv-tab
					for-panel="lastMonth"
					class="tw-text-h4"
					:class="{'tw-text-secondary' :selectedTabIndex !== 1}"
				>
					Last Month
				</kv-tab>
				<kv-tab
					for-panel="allTime"
					class="tw-text-h4"
					:class="{'tw-text-secondary' :selectedTabIndex !== 2}"
				>
					All Time
				</kv-tab>
			</template>
			<template #tabPanels>
				<kv-tab-panel
					v-for="timeFrame in ['thisMonth', 'lastMonth', 'allTime']"
					:id="timeFrame"
					:key="timeFrame"
					class="tw-border-primary"
				>
					<div
						v-for="leaderboardTeam in teamsToShow(timeFrame)"
						:key="leaderboardTeam.team.id"
						class="tw-text-small tw-rounded-sm tw-flex tw-flex-row tw-p-1"
					>
						<img
							v-if="leaderboardTeam.team.image && leaderboardTeam.team.image.url"
							class="tw-w-5 tw-h-5 tw-flex-none tw-mb-1"
							:src="leaderboardTeam.team.image.url"
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
										:to="`/team/${leaderboardTeam.team.teamPublicId}`"
									>
										<div
											class="tw-text-base tw-text-primary tw-overflow-hidden tw-text-ellipsis"
										>
											{{ leaderboardTeam.team.name }}
										</div>
									</router-link>
								</div>
								<div class="tw-flex-none tw-ml-1">
									<template v-if="!isNewMembers">
										{{ numeral(leaderboardTeam.value).format('$0,0a') }}
									</template>
									<template v-else>
										{{ numeral(leaderboardTeam.value).format('0,0a') }}
									</template>
								</div>
							</div>
							<div
								class="tw-flex-none tw-w-full"
							>
								<kv-progress-bar
									:aria-label="progressLabel"
									:min="0"
									:max="maxValue(timeFrame)"
									:value="parseInt(leaderboardTeam.value)"
								/>
							</div>
						</div>
					</div>
					<button
						v-if="numberOfShownTeams == 4"
						@click="expandTeams = true"
						class="tw-text-link tw-m-auto tw-block tw-text-small"
					>
						Show more teams
					</button>
				</kv-tab-panel>
			</template>
		</kv-tabs>
	</div>
</template>

<script>
import numeral from 'numeral';
import teamNoImage from '@/assets/images/team_s135.png';
import _throttle from 'lodash/throttle';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabPanel from '~/@kiva/kv-components/vue/KvTabPanel';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	name: 'TeamLeaderboard',
	components: {
		KvProgressBar,
		KvTabs,
		KvTab,
		KvTabPanel,
	},
	data() {
		return {
			numeral,
			teamNoImage,
			isMobile: false,
			expandTeams: false,
			selectedTabIndex: 0
		};
	},
	props: {
		boardType: {
			type: String,
			validator: value => ['memberCount', 'overallLoanedAmount'].includes(value),
			required: true,
		},
		boardTeams: {
			type: Object,
			default: () => ({}),
			required: true,
		}
	},
	computed: {
		isNewMembers() {
			return this.boardType === 'memberCount';
		},
		numberOfShownTeams() {
			if (this.isMobile && !this.expandTeams) {
				return 4;
			} return 10;
		},
		progressLabel() {
			if (this.isNewMembers) {
				return 'Total Amount of Members the Team has';
			} return 'Total Amount the Team has lent';
		}
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
		teamsToShow(timeFrame) {
			const teams = this.boardTeams[timeFrame] ?? [];
			return teams.slice(0, this.numberOfShownTeams);
		},
		maxValue(timeFrame) {
			const teams = this.boardTeams[timeFrame] ?? [];
			const values = teams.map(team => parseInt(team.value, 10));
			return Math.max(...values);
		},
		handleTabChanged(index) {
			this.selectedTabIndex = index;
		},
	},
	mounted() {
		this.determineIfMobile();
		window.addEventListener('resize', _throttle(() => {
			this.determineIfMobile();
		}, 200));
	},
	beforeDestroy() {
		window.removeEventListener('resize', _throttle(() => {
			this.determineIfMobile();
		}, 200));
	},
};
</script>
