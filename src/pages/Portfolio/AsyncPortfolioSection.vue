<template>
	<section
		class="md:tw-mb-3 tw-px-2.5 tw-bg-primary md:tw-rounded md:tw-p-5"
		:class="{
			'tw-py-8 tw-mb-0.5': variantDefault,
			'tw-py-3': variantMinimal,
		}"
	>
		<slot></slot>
	</section>
</template>

<script>
import delayUntilVisibleMixin from '@/plugins/delay-until-visible-mixin';

export default {
	name: 'AsyncPortfolioSection',
	mixins: [delayUntilVisibleMixin],
	props: {
		variant: {
			validator(value) {
				return ['default', 'minimal'].includes(value);
			},
			default: 'default'
		},
	},
	computed: {
		variantDefault() {
			return this.variant === 'default';
		},
		variantMinimal() {
			return this.variant === 'minimal';
		},
	},
	mounted() {
		this.delayUntilVisible(entry => this.$emit('visible', entry));
	},
};
</script>
