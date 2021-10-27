<template>
	<div
		class="tw-bg-primary tw-p-4 tw-mb-4 tw-w-full"
		:class="{ 'tw-opacity-low tw-pointer-events-none': disabled }"
	>
		<h2 class="tw-mb-2">
			{{ title }}
		</h2>
		<!-- @slot Content of the settings card. Should not be empty. -->
		<slot name="content"></slot>
	</div>
</template>

<script>
/**
 * Settings card component. Can accomodate content of any height.
 * Should be used on a page that does not have a white background color.
 */
export default {
	props: {
		/**
		 * Title of the Settings Card.
		* */
		title: {
			type: String,
			default: ''
		},
		/**
		 * Disables the settings card.
		* */
		disabled: {
			type: Boolean,
			default: false
		},
	},
};
</script>
