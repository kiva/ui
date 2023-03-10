<template>
	<section class="tw-mb-0.5 md:tw-mb-3 tw-px-2.5 tw-py-3 tw-bg-primary md:tw-rounded md:tw-p-5">
		<slot></slot>
	</section>
</template>

<script>
import delayUntilVisibleMixin from '@/plugins/delay-until-visible-mixin';

export default {
	name: 'AsyncPortfolioSection',
	mixins: [delayUntilVisibleMixin],
	mounted() {
		this.delayUntilVisible(entry => this.$emit('visible', entry));
	},
};
</script>
