<template>
	<section>
		<slot></slot>
	</section>
</template>

<script>
import delayUntilVisibleMixin from '@/plugins/delay-until-visible-mixin';

export default {
	name: 'AsyncLenderSection',
	mixins: [delayUntilVisibleMixin],
	mounted() {
		this.delayUntilVisible(entry => this.$emit('visible', entry));
	},
};
</script>
