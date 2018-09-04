<template>
	<div>
		<hr>
		<div class="row">
			<span class="small-3 medium-1">
				<kv-accordion class="accordion-arrow"/>
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
		KvAccordion
	},
	props: {
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.accordion-arrow svg {
	color: black;
	stroke: blue;
	fill: green;
}

</style>
