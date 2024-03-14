<template>
	<div class="tw-flex tw-flex-col lg:tw-flex-row tw-w-full tw-gap-1 lg:tw-gap-5 tw-mb-4 lg:tw-mb-6">
		<div class="lg:tw-basis-3/5 tw-flex tw-flex-col tw-gap-y-2">
			<div class="tw-flex tw-items-center tw-gap-2">
				<img
					v-if="teamImageUrl"
					class="tw-w-4 tw-h-4 lg:tw-w-8 lg:tw-h-8 tw-flex-none tw-rounded-sm"
					:src="teamImageUrl"
				>
				<div>
					<h4
						v-if="teamName"
						class="tw-text-h4"
					>
						{{ teamName }} CHALLENGE:
					</h4>
					<h2
						v-if="challengeName"
						class="tw-text-h2"
					>
						{{ challengeName }}
					</h2>
				</div>
			</div>
			<p
				v-if="challengeDescription"
				class="tw-italic"
			>
				{{ challengeDescription }}
			</p>
			<div class="tw-flex tw-items-center tw-gap-1">
				<kv-user-avatar
					class="user-avatar"
					v-if="authorImageUrl"
					:lender-name="authorName"
					:lender-image-url="authorImageUrl"
					:is-small="true"
				/>
				<p
					v-if="authorName"
					class="tw-text-h4"
				>
					{{ authorName }}, TEAM CAPTAIN
				</p>
			</div>
		</div>
		<div>
			<!-- Progress bar -->
			<!-- Activity Feed -->
		</div>
	</div>
</template>

<script>
import KvUserAvatar from '~/@kiva/kv-components/vue/KvUserAvatar';

export default {
	name: 'ChallengeHeader',
	components: {
		KvUserAvatar,
	},
	props: {
		challengeData: {
			type: Object,
			default: () => ({}),
		},
		teamData: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		teamName() {
			return this.teamData?.name ?? '';
		},
		teamImageUrl() {
			return this.teamData?.image?.url ?? '';
		},
		challengeName() {
			return this.challengeData?.name ?? '';
		},
		challengeDescription() {
			return this.challengeData?.description ?? '';
		},
		authorName() {
			return this.challengeData?.descriptionAuthor?.name ?? '';
		},
		authorImageUrl() {
			return this.challengeData?.descriptionAuthor?.image?.url ?? '';
		},
	},
};
</script>

<style scoped lang="postcss">
.user-avatar {
	@apply tw-w-4;
}

.user-avatar >>> img {
	@apply tw-w-4 tw-h-4;
}
</style>
