<template>
	<section>
		<slot></slot>
	</section>
</template>

<script>
import delayUntilVisibleMixin from '#src/plugins/delay-until-visible-mixin';

export default {
	name: 'AsyncLenderSection',
	mixins: [delayUntilVisibleMixin],
	emits: ['visible'],
	mounted() {
		this.delayUntilVisible(entry => this.$emit('visible', entry));
	},
};
</script>
