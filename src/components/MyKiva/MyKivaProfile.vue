<template>
	<div
		class="profile tw-flex tw-items-end tw-justify-end tw-gap-4"
	>
		<p
			class="tw-text-h3 tw-mr-auto md:tw-mr-0"
		>
			{{ lenderName }}
		</p>
		<a
			href="/settings/account-beta"
			v-kv-track-event="[
				'portfolio',
				'click',
				'Account profile pic'
			]"
		>
			<ActivityAvatar
				:class="{'tw-border-4 tw-border-white': !lenderImageUrl}"
				class="avatar !tw-h-10 !tw-w-10"
				:lender-image-url="lenderImageUrl"
				:lender-name="lenderName"
			/>
		</a>
	</div>
</template>

<script setup>
import ActivityAvatar from '#src/components/Iwd/ActivityAvatar';
import { computed, toRefs } from 'vue';

const props = defineProps({
	lender: {
		type: Object,
		default: () => ({}),
	},
	userInfo: {
		type: Object,
		default: () => ({}),
	},
});

const { lender, userInfo } = toRefs(props);

const lenderName = computed(() => {
	const firstName = userInfo?.value?.userAccount?.firstName ?? '';
	const lastName = userInfo?.value?.userAccount?.lastName ?? '';

	return `${firstName} ${lastName}`;
});

const lenderImageUrl = computed(() => {
	return lender?.value?.image?.url ?? '';
});
</script>

<style lang="postcss" scoped>

.profile {
	margin-top: -40px;

	@screen md {
		margin-top: -50px;
	}
	@apply tw-relative;
}

.avatar, .avatar :deep(div) {
	@screen md {
		width: 6.25rem !important;
		height: 6.25rem !important;
	}
	@apply tw-h-10 tw-w-10;
}

.avatar :deep(img) {
	@screen md {
		width: 6.25rem;
		height: 6.25rem;
	}
	@apply tw-h-10 tw-w-10 tw-border-4 tw-border-white tw-max-w-10 md:tw-max-w-full;
}

.avatar :deep(span) {
	@apply tw-text-h1 tw--mt-1 ;
}

</style>
