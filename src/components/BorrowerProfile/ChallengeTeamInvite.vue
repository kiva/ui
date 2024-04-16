<template>
	<kv-page-container class="container">
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 tw-w-full">
				<div class="info tw-w-full tw-flex tw-items-center tw-justify-between">
					<kv-user-avatar
						:lender-name="shareLenderName"
						:lender-image-url="shareLenderImage"
						is-small
						class="challenge-avatar md:tw-w-4 md:tw-h-4 tw-flex tw-items-center"
					/>
					<p class="tw-text-lg data-hj-suppress">
						{{ headerCallout }} <a :href="teamLink">{{ teamName }}</a> hit their goal
					</p>
					<button
						class="tw-flex"
						@click="$emit('close')"
					>
						<kv-material-icon
							class="tw-h-3 tw-w-3"
							:icon="mdiClose"
						/>
					</button>
				</div>
			</div>
		</kv-grid>
	</kv-page-container>
</template>

<script>
import { mdiArrowTopRight, mdiClose } from '@mdi/js';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUserAvatar from '~/@kiva/kv-components/vue/KvUserAvatar';

export default {
	name: 'ChallengeTeamInvite',
	components: {
		KvGrid,
		KvPageContainer,
		KvMaterialIcon,
		KvUserAvatar,
	},
	props: {
		shareLender: {
			type: Object,
			default: () => ({}),
		},
		teamName: {
			type: String,
			required: true,
		},
		teamId: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			mdiArrowTopRight,
			mdiClose,
		};
	},
	computed: {
		shareLenderName() {
			return this.shareLender?.name ?? '';
		},
		shareLenderImage() {
			return this.shareLender?.image?.url ?? '';
		},
		headerCallout() {
			return this.shareLenderName
				? `Support ${this.shareLenderName} and help `
				: 'Help ';
		},
		teamLink() {
			return `/lend/filter?team=${this.teamId ?? ''}`;
		},
	}
};

</script>

<style scoped lang="postcss">
.info {
	@apply tw-bg-white tw-flex tw-items-center tw-justify-center tw-gap-2 tw-shadow-lg tw-py-1
		md:tw-rounded-lg tw-rounded-b tw-px-2.5 md:tw-px-4;
}

.container {
	@apply md:tw-pt-3 tw-px-0 md:tw-px-4 lg:tw-px-8;
}

.challenge-avatar >>> img {
	@apply md:tw-w-4 md:tw-h-4;
}

</style>
