<template>
	<small>{{ stateData.index }}</small>
</template>

<script>
export default {
	name: 'AlgoliaState',
	props: {
		stateData: {
			type: Object,
			default: () => {}
		}
	},
	watch: {
		stateData: {
			handler(stateData) {
				this.$nextTick(() => {
					console.log(stateData);
				});
			}
		}
	}
};
</script>
