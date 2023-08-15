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
						v-for="team in teams.slice(0, numberOfShownTeams)"
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
										min="0"
										max="75000000"
										:value="`${team.lentAmount}`"
									/>
								</template>
								<template v-else>
									<kv-progress-bar
										aria-label="Total Amount of Members the Team has"
										min="0"
										max="100000"
										:value="`${team.lenderCount}`"
									/>
								</template>
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
import { fetchLeaderboard } from '../../util/teamsUtil';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabPanel from '~/@kiva/kv-components/vue/KvTabPanel';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

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
			teams: [],
			numeral,
			teamNoImage,
			isMobile: false,
			expandTeams: false
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
		},
		numberOfShownTeams() {
			if (this.isMobile && !this.expandTeams) {
				return 4;
			} return 10;
		}
	},
	methods: {
		handleTabChanged(index) {
			console.log(index);
		},
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
	},
	mounted() {
		this.determineIfMobile();
		fetchLeaderboard(this.apollo, this.boardType).then(teams => {
			this.teams = teams?.values ?? [];
		});
	}
};
</script>
