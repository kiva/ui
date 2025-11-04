<template>
	<div
		class="tw-flex tw-mx-auto tw-items-center tw-justify-start tw-gap-1 md:tw-gap-2
			tw-bg-white tw-rounded tw-px-1.5 md:tw-px-3 tw-py-1.5 container"
		:style="{maxWidth: '620px'}"
	>
		<div
			v-if="receiveNews"
			class="avatars-container tw-flex tw-items-center tw-flex-2"
		>
			<KvUserAvatar
				v-for="loan, index in loansToDisplay"
				:key="loan.id"
				:lender-name="loan?.name"
				:lender-image-url="loan?.image?.url"
				class="tw-shadow tw-border-2 tw-border-white tw-box-content"
				:class="{
					'tw-w-4.5 tw-h-4.5 md:tw-w-6 md:tw-h-6': loansToDisplay.length <= 2 || index === 1,
					'tw-w-[30px] tw-h-[30px]' : loansToDisplay.length > 2 && index !== 1
				}"
				:style="{
					zIndex: index === 1 ? 2 : 1,
					marginRight: loansToDisplay.length > 2 && index === 0 ? '-18px' : '0',
					marginLeft: loansToDisplay.length > 1 && index === loansToDisplay.length - 1 ? '-18px' : '0',
				}"
			/>
		</div>
		<span class="!tw-font-medium message">
			{{ notificationMsg }}
		</span>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { KvUserAvatar } from '@kiva/kv-components';

const props = defineProps({
	receiveNews: {
		type: Boolean,
		default: false
	},
	loansToDisplay: {
		type: Array,
		default: () => ([]),
	},
	isMobile: {
		type: Boolean,
		default: false,
	}
});

const notificationMsg = computed(() => {
	if (props.receiveNews) {
		return 'Great, we’ll keep you updated.';
	}

	return 'We won’t send updates. You can change this setting at any time.';
});

</script>

<style lang="postcss" scoped>

.message {
	@media screen and (width <= 398px) {
		font-size: 0.8125rem !important;
		line-height: 1.5 !important;
	}
}

</style>
