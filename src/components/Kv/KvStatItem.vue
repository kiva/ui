<template>
	<div class="tw-flex tw-gap-2 tw-items-center tw-self-stretch tw-my-auto">
		<div class="tw-flex tw-justify-center tw-items-start tw-self-stretch tw-my-auto tw-whitespace-nowrap tw-w-[83px]">
			<span v-if="prefix" class="tw-py-2 tw-text-sm tw-uppercase tw-font-[621] tw-w-[9px]">{{ prefix }}</span>
			<p class="tw-self-stretch tw-my-auto tw-text-7xl tw-font-medium tw-tracking-tighter tw-leading-none tw-text-center tw-max-md:tw-text-4xl">
				{{ value }}
			</p>
		</div>
		<p class="tw-self-stretch tw-my-auto tw-text-lg tw-leading-5 tw-font-[621] tw-w-[83px]">
			{{ label }}
		</p>
	</div>
</template>

<script>
export default {
	name: 'StatItem',
	props: {
		value: {
			type: Number,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		prefix: {
			type: String,
			default: '',
		},
	},
}
</script>
