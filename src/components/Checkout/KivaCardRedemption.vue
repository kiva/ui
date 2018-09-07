<template>
	<div>
		<hr>
		<div class="row accordion" data-accordion>
			<div class="accordion-item" data-accordion-item>
				<span class="small-3 medium-1">
					<kv-accordion />
				</span>
				<span class="featured-text small-9 medium-8 accordion-title">Have a Kiva Card?</span>
				<div class="accordion-content" data-tab-content>
					<a href="/basket">Check this shit out.</a>
				</div>
			</div>
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
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
