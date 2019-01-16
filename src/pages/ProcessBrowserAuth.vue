<template>
	<div></div>
</template>

<script>
export default {
	inject: ['kvAuth0'],
	mounted() {
		this.kvAuth0.popupCallback();
	},
};
</script>
