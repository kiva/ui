<template>
	<KvLoadingPlaceholder
		v-if="isLoading"
		class="tw-w-4 tw-h-4 !tw-rounded-full"
	/>
	<div
		v-else
		class="tw-w-4 tw-h-4"
	>
		<div class="tw-w-4 tw-h-4" v-if="!isDefaultProfilePic(imageFilename) && !isAnonymousUser && imageFilename">
			<img
				:src="lenderImageUrl"
				alt="Image of lender"
				class="tw-rounded-full tw-inline-block tw-w-4 tw-h-4 data-hj-suppress"
			>
		</div>
		<div
			v-else-if="!isAnonymousUser && isDefaultProfilePic(imageFilename) || !imageFilename"
			class="tw-rounded-full tw-inline-flex tw-align-center tw-justify-center tw-w-4 tw-h-4"
			:class="randomizedUserAvatarClass"
		>
			<!-- First Letter of lender name -->
			<span class="tw-self-center">
				{{ lenderNameFirstLetter }}
			</span>
		</div>
		<div
			v-else
			class="tw-rounded-full tw-bg-brand tw-inline-flex tw-items-center tw-justify-center tw-w-4 tw-h-4"
		>
			<!-- Kiva K logo -->
			<component :is="KivaIcon" alt="Kiva Icon" />
		</div>
	</div>
</template>

<script>
import { isLegacyPlaceholderAvatar } from '#src/util/imageUtils';
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import { defineAsyncComponent, shallowRef } from 'vue';

const KivaIcon = shallowRef(defineAsyncComponent(() => import('#src/assets/images/helpmechoose/kiva_mark.svg')));

export default {
	name: 'ActivityAvatar',
	components: {
		KvLoadingPlaceholder,
	},
	props: {
		lenderImageUrl: {
			type: String,
			default: null
		},
		lenderName: {
			type: String,
			required: true
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			KivaIcon,
		};
	},
	computed: {
		imageFilename() {
			return this.lenderImageUrl?.split('/').pop() ?? '';
		},
		isAnonymousUser() {
			return this.lenderName === 'Anonymous';
		},
		randomizedUserAvatarClass() {
			const userCardStyleOptions = [
				{ color: 'tw-text-action', bg: 'tw-bg-brand-100' },
				{ color: 'tw-text-black', bg: 'tw-bg-brand-100' },
				{ color: 'tw-text-white', bg: 'tw-bg-action' },
				{ color: 'tw-text-brand-100', bg: 'tw-bg-action' },
				{ color: 'tw-text-primary-inverse', bg: 'tw-bg-action' },
				{ color: 'tw-text-white', bg: 'tw-bg-black' },
				{ color: 'tw-text-action', bg: 'tw-bg-black' },
			];
			const randomStyle = userCardStyleOptions[Math.floor(Math.random() * userCardStyleOptions.length)];
			return `${randomStyle.color} ${randomStyle.bg}`;
		},
		lenderNameFirstLetter() {
			return this.lenderName?.charAt(0).toUpperCase() ?? '';
		}
	},
	methods: {
		isDefaultProfilePic(filename) {
			return isLegacyPlaceholderAvatar(filename);
		},
	}
};
</script>
