<template>
	<section>
		<div
			v-for="(teamData, index) in allowedTeams" :key="teamData.team.teamPublicId"
			class="
                md:tw-mb-3 tw-px-2 tw-pb-4 md:tw-px-0 md:tw-pb-0
                tw-bg-desert-rose-3 md:tw-bg-transparent tw-drop-shadow-lg
			"
			:class="{ 'tw-pt-2' : index < 1 }"
		>
			<div class="tw-rounded">
				<div class="tw-rounded-t tw-bg-cover tw-bg-center tw-bg-no-repeat tw-bg-white team-challenge">
					<!-- eslint-disable-next-line max-len -->
					<div class="tw-pt-3 tw-px-2 tw-pb-1 md:tw-bg-white tw-rounded-tl tw-rounded-br tw-grow-0 team-challenge-headline">
						<span
							class="tw-bg-desert-rose-3 tw-w-auto tw-rounded tw-text-white tw-italic tw-text-small"
							style="padding: 4px 6px; font-weight: 700;"
						>
							New! Community Challenge
						</span>
						<h2 class="tw-text-h2 tw-mt-1">
							The {{ teamData.team.name }} Community Challenge has started!
						</h2>
					</div>
				</div>
				<div class="tw-bg-white tw-rounded-b tw-p-2 tw-flex tw-flex-col lg:tw-flex-row md:tw-gap-x-8">
					<p
						class="tw-text-base tw-mb-3"
						style="font-weight: 600;"
					>
						Join hundreds of {{ teamData.team.name }} members participating!
					</p>
					<div class="tw-w-full tw-min-w-1/2 lg:tw-w-auto">
						<!-- eslint-disable-next-line max-len -->
						<button @click="goToChallenge(teamData.team)" class="tw-bg-marigold tw-rounded tw-flex tw-w-full tw-justify-center tw-items-center tw-px-2 tw-py-1.5 tw-font-medium tw-gap-x-0.5 tw-whitespace-nowrap">
							Give your team a hand
							<kv-material-icon
								class="tw-w-2.5 tw-h-2.5"
								:icon="mdiArrowRight"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mdiArrowRight } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'TeamChallenge',
	components: {
		KvMaterialIcon,
	},
	props: {
		allowedTeams: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			mdiArrowRight,
		};
	},
	methods: {
		goToChallenge(team) {
			this.$kvTrackEvent('portfolio', 'click', 'Join challenge', `${team.name}`);
			window.location.href = `/team/${team.teamPublicId}/messages`;
		}
	},
};
</script>

<style scoped lang="postcss">
	.team-challenge {
		background-image: url('~@/assets/images/backgrounds/team_challenge_bg.svg');
		background-position-y: 0;
		min-height: 50vh;
	}

	@screen md {
		.team-challenge {
			min-height: 350px;
		}

		.team-challenge-headline {
			max-width: 300px;
		}
	}

	@screen lg {
		.team-challenge {
			background-position-y: -24px;
			min-height: 420px;
		}

		.team-challenge-headline {
			max-width: 350px;
		}
	}
</style>
