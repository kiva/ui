<template>
	<div class="tw-w-full">
		<div
			class="tw-relative tw-inline-flex tw-flex-1 tw-w-full"
		>
			<slot name="button"></slot>
			<img
				v-show="isCompleteLoanActive"
				class="tw-absolute tw--bottom-1 tw--left-1 tw-animate-pulse"
				:src="sparkleUrl"
			>
			<img
				v-show="isCompleteLoanActive"
				class="tw-absolute tw--top-2 tw-right-1.5 tw-animate-pulse tw-scale-50"
				style="animation-delay: 300ms;"
				:src="sparkleUrl"
			>
			<img
				v-show="isCompleteLoanActive"
				class="tw-absolute tw--top-1 tw--right-1 tw-animate-pulse"
				:src="sparkleUrl"
			>
			<img
				v-show="isCompleteLoanActive"
				class="tw-absolute tw-top-2 tw--right-1.5 tw-animate-pulse tw-scale-75"
				style="animation-delay: 800ms;"
				:src="sparkleUrl"
			>
		</div>
	</div>
</template>

<script>
import sparkleUrl from '#src/assets/images/sparkle.svg?url';

export default {
	name: 'CompleteLoanWrapper',
	props: {
		isCompleteLoanActive: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			sparkleUrl,
		};
	},
};
</script>
