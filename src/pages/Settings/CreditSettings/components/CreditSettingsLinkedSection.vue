<template>
	<section class="tw-bg-primary tw-p-3 tw-mb-3">
		<h2 class="tw-text-h3 tw-mb-1">
			{{ title }}
		</h2>
		<p class="tw-mb-0">
			<router-link
				:to="to"
				class="tw-text-link tw-font-medium hover:tw-underline focus:tw-underline"
			>
				{{ description }}
			</router-link>
		</p>
	</section>
</template>

<script>
export default {
	name: 'CreditSettingsLinkedSection',
	props: {
		description: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		to: {
			type: [String, Object],
			required: true,
		},
	},
};
</script>
