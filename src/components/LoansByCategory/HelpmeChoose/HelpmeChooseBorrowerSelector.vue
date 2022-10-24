<template>
	<div
		class="tw-rounded lg:tw-flex tw-border tw-border-secondary tw-gap-1 tw-items-center tw-p-1.5 lg:tw-p-1 tw-w-auto
				tw-justify-center lg:tw-justify-left"
		:class="{ 'tw-bg-primary-inverse lg:tw-bg-white lg:tw-shadow-lg tw-border-none': selectedLoan }"
	>
		<img :src="imageUrl" class="tw-hidden lg:tw-block tw-rounded tw-h-8 tw-w-8 tw-object-cover">
		<div>
			<h6 class="tw-hidden lg:tw-block tw-text-black tw-text-small tw-mb-1">
				{{ name }}
			</h6>
			<span
				class="tw-text-black lg:tw-text-white tw-text-base lg:tw-text-small
					tw-rounded tw-p-1.5 lg:tw-p-1 tw-w-full lg:tw-bg-black tw-font-medium"
				:class="{ 'tw-text-white': selectedLoan }"
			>
				{{ tag }}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'HelpmeChooseBorrowerSelector',
	props: {
		imageUrl: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		tag: {
			type: String,
			default: ''
		},
		selectedLoan: {
			type: Boolean,
			default: false
		}
	},
};
</script>
