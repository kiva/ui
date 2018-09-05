<template>
	<div>
		<hr>
		<div class="row">
			<span class="small-3 medium-1">
				<kv-accordion
					class="accordion-arrow"
					@click.prevent="accordionToggle"/>
			</span>
			<span class="featured-text small-9 medium-8">Have a Kiva Card?</span>
		</div>
		<hr>
	</div>
</template>

<script>
import KvAccordion from '@/components/Kv/KvAccordion';

export default {
	components: {
		KvAccordion,
	},
	data() {
		return {
			usingTouch: false,
		};
	},
	methods: {
		accordionToggle() {
			console.log('accordion toggled');
			const arrow = document.getElementByClassName('.accordion-arrow');
			arrow.setAttribute('style', 'transform: rotate(180deg)');
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
