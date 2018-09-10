<template>
	<div class="kiva-card-entry-wrapper columns">
		<div class="row">
			<span class="small-3 medium-1">
				<a @click="toggleAccordion">
					<kv-icon
						:class="{ flipped: isFlipped }"
						class="medium-chevron"
						name="medium-chevron" />
				</a>
			</span>
			<span class="small-9 medium-11 featured-text accordion-title">Have a Kiva Card?</span>
		</div>
		<div
			class="row"
			:class="{ hidden: isHidden }">
			<!-- This empty <span> is to keep the spacing correct with the basket items shown above on this page. -->
			<span class="small-3 medium-1"></span>
			<a class="small-9 medium-11" href="/basket">
				<div>Enter a Kiva card</div>
			</a>
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
			isHidden: true
		};
	},
	methods: {
		toggleAccordion() {
			this.isFlipped = !this.isFlipped;
			this.isHidden = !this.isHidden;
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

.hidden {
	visibility: hidden;
}
</style>
