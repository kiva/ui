<template>
	<div
		class="
			tw-rounded
			tw-py-0.5
			tw-px-1
			tw-font-medium
			tw-text-h4
			tw-inline-flex
			tw-items-center
			tw-shrink-0
			tw-uppercase
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
