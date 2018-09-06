<template>
	<div>
		<hr>
		<ul class="row accordion" data-accordion>
			<li class="accordion-item" data-accordion-item>
				<span class="small-3 medium-1">
					<kv-accordion
						class="accordion-arrow" />
				</span>
				<a class="featured-text small-9 medium-8 accordion-title">Have a Kiva Card?</a>
				<div class="accordion-content" data-tab-content>Check this shit out.</div>
			</li>
		</ul>
		<hr>
	</div>
</template>

<script>
import KvAccordion from '@/components/Kv/KvAccordion';
import { Accordion } from 'foundation-sites';


export default {
	components: {
		KvAccordion,
		Accordion
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
		initAccordion() {
			const $accordion = new Accordion('.accordion');
			console.log($accordion);
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
