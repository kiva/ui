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
			<span
				class="small-9 medium-11 featured-text accordion-title"
				@click="toggleAccordion">Have a Kiva Card?</span>
		</div>
		<div
			:class="{ hidden: isHidden }"
			class="row accordion-info">
			<!-- This empty <span> is to keep the spacing correct with the basket items shown above on this page. -->
			<span class="small-3 medium-1"></span>
			<a class="small-9 medium-11" href="/basket">
				<div>Click here to enter a Kiva Card</div>
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

.kiva-card-entry-wrapper {
	margin: $list-side-margin;
}

.kiva-card-entry-wrapper .row {
	padding-left: rem-calc(8);
}

.accordion-title:hover {
	cursor: pointer;
}

.medium-chevron {
	height: rem-calc(40);
	width: rem-calc(40);
}

.flipped {
	transform: rotate(180deg);
}

.hidden {
	visibility: hidden;
}
</style>
