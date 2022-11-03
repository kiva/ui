<template>
	<div
		v-if="loading"
		:aria-label="LOADING_LABEL"
		class="tw-absolute tw-w-full tw-h-full tw-bg-opacity-[65%] tw-z-2 tw-top-0 tw-left-0"
		:class="[`tw-bg-${bgColor}`, {'tw-rounded': rounded }]"
	>
		<div class="tw-absolute tw-top-5 tw-left-1/2 tw--translate-x-1/2">
			<kv-loading-spinner :size="size" />
		</div>
	</div>
</template>

<script>
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';

export const LOADING_LABEL = 'Section modal loader';

export default {
	name: 'KvSectionModalLoader',
	components: {
		KvLoadingSpinner,
	},
	props: {
		loading: {
			type: Boolean,
			default: false
		},
		bgColor: {
			type: String,
			default: 'white'
		},
		rounded: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'medium',
			validator: value => ['small', 'medium', 'large'].includes(value)
		},
	},
	data() {
		return {
			LOADING_LABEL,
		};
	},
};
</script>
