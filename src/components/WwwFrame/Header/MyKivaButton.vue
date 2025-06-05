<template>
	<router-link
		data-testid="header-portfolio"
		to="/portfolio"
		class="tw-inline-flex"
		v-kv-track-event="['TopNav','click-Portfolio']"
	>
		<span class="tw-sr-only">My Portfolio</span>
		<span
			class="tw-bg-secondary tw-rounded-sm tw-py-0.5 tw-px-1 tw-mr-1"
			:style="isUserDataLoading ? {content:'var(--ui-data-user-balance)'} : {}"
		>
			{{ $filters.numeral(balance, '$0') }}
		</span>
		<kv-material-icon
			:icon="mdiAccountCircle"
			class="tw-w-3 tw-h-3 md:tw-w-3.5 md:tw-h-3.5"
			:style="isUserDataLoading ? {
				display: 'var(--ui-data-user-avatar-default-display, inline-block)'
			} : {
				display: isDefaultProfilePic ? 'inline-block' : 'none'
			}"
		/>
		<img
			v-show="!isDefaultProfilePic"
			:src="profilePic"
			alt="My portfolio"
			class="data-hj-suppress
				tw-w-3 tw-h-3 md:tw-w-3.5 md:tw-h-3.5
				tw-rounded-full tw-overflow-hidden tw-object-fill"
			:style="isUserDataLoading ? {
				content:'var(--ui-data-user-avatar)',
				display: 'var(--ui-data-user-avatar-display, inline-block)',
			} : {
				display: isDefaultProfilePic ? 'none' : 'inline-block'
			}"
		>
	</router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { mdiAccountCircle } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';
import { isLegacyPlaceholderAvatar } from '#src/util/imageUtils';

const { profilePicId } = defineProps({
	isUserDataLoading: {
		type: Boolean,
		default: false
	},
	balance: {
		type: [String, Number],
		default: 0
	},
	profilePic: {
		type: String,
		default: ''
	},
	profilePicId: {
		type: [String, Number],
		default: ''
	},
});

const isDefaultProfilePic = computed(() => {
	return isLegacyPlaceholderAvatar(profilePicId);
});
</script>
