<template>
	<div>
		<slot></slot>
	</div>
</template>

<script>
import delayUntilVisibleMixin from '#src/plugins/delay-until-visible-mixin';

export default {
	name: 'AsyncMyKivaSection',
	mixins: [delayUntilVisibleMixin],
	emits: ['visible'],
	mounted() {
		this.delayUntilVisible(entry => this.$emit('visible', entry));
	},
};
</script>
