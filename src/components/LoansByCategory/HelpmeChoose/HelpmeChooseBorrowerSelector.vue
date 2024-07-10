<template>
	<div
		class="tw-rounded lg:tw-flex tw-border tw-gap-1 tw-items-center tw-p-1.5 lg:tw-p-1
				tw-text-center lg:tw-text-left tw-cursor-pointer"
		:class="[
			{ 'tw-bg-primary-inverse lg:tw-bg-white tw-border-white' : activeLoan },
			{ 'tw-border-secondary' : !activeLoan },
		]"
		:style="{ boxShadow }"
		@click="updateSelectedLoan"
	>
		<img :src="imageUrl" class="tw-hidden lg:tw-block tw-rounded tw-h-8 tw-w-8 tw-object-cover">
		<div>
			<h6 class="tw-hidden lg:tw-block tw-text-black tw-text-small tw-mb-1">
				{{ name }}
			</h6>
			<span
				class="tw-text-black lg:tw-text-white tw-text-base lg:tw-text-small
					tw-rounded tw-p-1.5 lg:tw-p-1 lg:tw-py-0.5 lg:tw-bg-black tw-font-medium
					tw-text-center lg:tw-text-left"
				:class="{ 'tw-text-white': activeLoan }"
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
		selected: {
			type: Number,
			default: 0
		},
		index: {
			type: Number,
			default: 0
		}
	},
	methods: {
		updateSelectedLoan() {
			this.$emit('select', this.index);
		}
	},
	computed: {
		activeLoan() {
			return this.selected === this.index;
		},
		boxShadow() {
			if (this.activeLoan) return '0px 4px 15px rgba(0, 0, 0, 0.05);';
			return 'none';
		}
	},
};
</script>
