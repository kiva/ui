<template>
	<div>
		<hr>
		<div class="row accordion">
			<div class="accordion-item">
				<a >
					<span class="small-3 medium-1">
						<kv-accordion />
					</span>
					<span class="featured-text small-9 medium-8 accordion-title">Have a Kiva Card?</span>
				</a>
				<div class="accordion-content">
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
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
