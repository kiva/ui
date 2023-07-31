<template>
	<div class="tw-h-10 md:tw-h-6">
		<div
			class="tw-flex tw-items-center tw-transition-all tw-duration-1000"
			:class="{
				'tw-h-0' : !loaded, 'tw-h-full' : loaded,
				'tw-bg-action' : !secondStep, 'tw-bg-white tw-drop-shadow-lg' : secondStep
			}"
		>
			<div
				style="max-width: 1200px;"
				class="tw-mx-auto tw-text-center tw-transition-all tw-duration-1000 tw-px-2 md:tw-px-0"
				:class="{
					'tw-opacity-0' : !loaded, 'tw-opacity-full' : loaded,
					'tw-text-primary-inverse' : !secondStep, 'tw-text-primary' : secondStep
				}"
			>
				Introducing $5 loans! Diversify your impact, support multiple borrowers,
				and make a difference with
				<a
					class="tw-underline tw-transition-all tw-duration-1000 tw-cursor-pointer tw-whitespace-nowrap"
					:class="{
						'tw-text-primary-inverse hover:tw-text-primary-inverse' : !secondStep,
						'tw-text-primary hover:tw-text-primary' : secondStep
					}"
					@click="scrollToSection('#five-dollars-section')"
				>
					just $5 &gt;
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import smoothScrollMixin from '@/plugins/smooth-scroll-mixin';

export default {
	name: 'FiveDollarsBanner',
	mixins: [smoothScrollMixin],
	data() {
		return {
			loaded: false,
			secondStep: false
		};
	},
	methods: {
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = elementToScrollTo?.offsetTop ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		}
	},
	mounted() {
		setTimeout(() => {
			this.loaded = true;
		}, 200);

		setTimeout(() => {
			this.secondStep = true;
		}, 1800);
	},
};
</script>
