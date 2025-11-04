<template>
	<kv-toast
		ref="toastRef"
		class="tw-fixed tw-top-9 md:tw-top-11 tw-left-0 tw-right-0 tw-z-banner toast-container
				tw-rounded-t-none md:tw-rounded-t"
		@close="closeCallback"
	>
		<template #toastContent>
			<div class=" tw-w-full">
				<div class="tw-w-full tw-flex tw-gap-1 tw-items-center tw-justify-between">
					<kv-user-avatar
						:lender-name="shareLenderName"
						:lender-image-url="shareLenderImage"
						is-small
						class="tw-w-3 tw-h-3 md:tw-w-4 md:tw-h-4 tw-flex tw-items-center"
					/>
					<p class="tw-text-lg data-hj-suppress">
						{{ headerCallout }} <a
							:href="teamLink"
							v-kv-track-event="[
								'borrower-profile',
								'click',
								'invite-link',
								teamName
							]"
						>{{ teamName }}</a> hit their goal
					</p>
				</div>
			</div>
		</template>
	</kv-toast>
</template>

<script>
import { mdiArrowTopRight, mdiClose } from '@mdi/js';
import { KvUserAvatar, KvToast } from '@kiva/kv-components';

export default {
	name: 'ChallengeTeamInvite',
	components: {
		KvUserAvatar,
		KvToast,
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
	},
	methods: {
		closeCallback() {
			this.$kvTrackEvent('borrower-profile', 'click', 'close-invite-link');
		},
	},
	mounted() {
		this.$refs.toastRef.show('', '', true);
	}
};

</script>

<style scoped lang="postcss">
.info {
	@apply tw-bg-white tw-flex tw-items-center tw-justify-center tw-gap-2 tw-shadow-lg tw-py-1
		md:tw-rounded-xl tw-rounded-b tw-px-2.5 md:tw-px-4;
}

.container {
	@apply md:tw-pt-3 tw-px-0 md:tw-px-4 lg:tw-px-8;
}

.toast-container :deep(.tw-bg-secondary) {
	background-color: white !important;
}

.toast-container :deep(div[data-test=tip-message]) {
	@apply tw-mx-0;
}

.toast-container :deep(div.tw-shadow) > :first-child {
	@apply tw-hidden;
}

</style>
