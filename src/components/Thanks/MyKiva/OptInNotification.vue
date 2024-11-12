<template>
	<div
		class="tw-flex tw-mx-auto tw-items-center tw-justify-start tw-gap-0.5 md:tw-gap-2
			tw-bg-white tw-rounded tw-px-3 tw-py-1.5 container"
		:style="{maxWidth: '620px'}"
	>
		<div
			v-if="receiveNews"
			class="avatars-container tw-flex tw-items-center"
		>
			<KvUserAvatar
				v-for="loan, index in loansToDisplay"
				:key="loan.id"
				:lender-name="loan?.name"
				:lender-image-url="loan?.image?.url"
				class="avatar tw-rounded-full tw-shadow tw-border-white tw-border-2 tw-w-auto"
				:class="{'smaller-borrower-avatar' : loansToDisplay.length > 2 && index !== 1 }"
				:style="{
					zIndex: index === 1 ? 2 : 1,
					marginRight: loansToDisplay.length > 2 && index === 0 ? '-30px' : '0',
					marginLeft: loansToDisplay.length > 1 && index === loansToDisplay.length - 1 ? '-30px' : '0',
				}"
			/>
		</div>
		<span class="tw-font-medium">
			{{ notificationMsg }}
		</span>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import KvUserAvatar from '@kiva/kv-components/vue/KvUserAvatar';

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

.container {
	@media screen and (width <= 422px ) {
		display: block;
		margin: 0 auto;
		text-align: center;
		width: 100%;
	}
}

.container > .avatars-container {
	@media screen and (width <= 422px ) {
		justify-content: center;
	}
}

.smaller-borrower-avatar :deep(img) {
	height: 36px;
	width: 36px;
}

</style>
