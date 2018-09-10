<template>
	<div class="kiva-card-entry-wrapper">
		<div class="row">
			<span class="small-3 medium-1">
				<a>
					<a @click="toggleAccordion">
						<kv-icon
							:class="{ flipped: isFlipped }"
							class="medium-chevron"
							name="medium-chevron" />
					</a>
				</a>
			</span>
			<span class="small-9 medium-8 featured-text accordion-title">Have a Kiva Card?</span>
			<span class="small-3 show-for-small-only"></span>
		</div>
		<div class="small-9 medium-3 featured-text">
			<div :class="{ shown: isShown }">
				<span class="small-3 medium-1"></span>
				<a
					class="row columns small-9 medium-8"
					href="/basket">
					<div>Check this shit out.</div>
				</a>
				<span class="small-3 show-for-small-only"></span>
			</div>
		</div>
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
			isFlipped: false,
			isShown: true
		};
	},
	methods: {
		toggleAccordion() {
			this.isFlipped = !this.isFlipped;
			this.isShown = !this.isShown;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.medium-chevron {
	height: rem-calc(40);
	width: rem-calc(40);
}

.kiva-card-entry-wrapper .accordion-title {
	line-height: rem-calc(36);
	border: none;
	color: $charcoal;

	:hover {
		text-decoration: none;
	}
}

.flipped {
	transform: rotate(180deg);
}

.shown {
	visibility: hidden;
}
</style>
