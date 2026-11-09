<template>
	<div role="status">
		<!-- Always rendered, so screen readers announce each result as it replaces the last -->
		<div
			v-if="lines.length"
			class="tw-rounded tw-p-2"
			:class="success ? 'tw-bg-secondary' : 'tw-bg-caution-highlight'"
		>
			<p v-for="(line, i) in lines" :key="i" class="tw-break-words">
				{{ line }}
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'InviteResultLines',
	props: {
		/** The server's message, a line each. Shown as text: it can contain what the viewer entered. */
		lines: {
			type: Array,
			default: () => [],
		},
		/** Whether the request succeeded, which sets the box's color */
		success: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
