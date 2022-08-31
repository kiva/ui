<template>
	<div
		class="
			tw-bg-brand-100
			tw-rounded-sm
			tw-py-0.5
			tw-px-1
			tw-font-medium
			tw-inline-flex
			tw-items-center
			tw-shrink-0
		"
	>
		<slot name="icon"></slot>
		<slot name="text"></slot>
	</div>
</template>
<script>

export default {
	name: 'KvPill',
};
</script>
