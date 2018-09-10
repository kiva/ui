<template>
	<div>
		<hr>
		<div class="row accordion">
			<div class="accordion-item">
				<a >
					<span class="small-3 medium-1">
						<a @click="toggleAccordion">
							<kv-icon
								:class="{ flipped: isFlipped }"
								class="medium-chevron"
								name="medium-chevron" />
						</a>
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
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
	data() {
		return {
			isFlipped: false
		};
	},
	methods: {
		toggleAccordion() {
			console.log('toggle accordion triggered');
			this.isFlipped = !this.isFlipped;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.medium-chevron {
	height: rem-calc(18);
	width: rem-calc(40);
}

.accordion-title {
	line-height: rem-calc(36);
	border: none;
}

.flipped {
	transform: rotate(180deg);
}
</style>
