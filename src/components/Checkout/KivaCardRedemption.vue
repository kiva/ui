<template>
	<div
		class="kiva-card-entry-wrapper columns">
		<div class="kiva-card-toggle-wrapper">
			<span>
				<a @click="toggleAccordion">
					<kv-icon
						:class="{ flipped: open }"
						class="toggle-arrow"
						name="medium-chevron" />
				</a>
			</span>
			<span
				class="featured-text accordion-title"
				@click="toggleAccordion">Have a Kiva Card?</span>
		</div>
		<kv-expandable easing="ease-in-out">
			<div
				v-show="open"
				class="accordion-info">
				<a class="small-9 medium-11" href="/basket?kexpn=checkout_beta.minimal_checkout&kexpv=a">
					<div v-kv-track-event="['checkout', 'kiva card', 'Exit To Legacy']">
						Click here to enter a Kiva Card
					</div>
				</a>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvExpandable from '@/components/Kv/KvExpandable';

export default {
	components: {
		KvIcon,
		KvExpandable
	},
	data() {
		return {
			open: false
		};
	},
	methods: {
		toggleAccordion() {
			this.open = !this.open;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'global/transitions';

.kiva-card-entry-wrapper {
	margin: $list-side-margin;
}

.kiva-card-toggle-wrapper {
	display: flex;
	align-items: center;
}

.toggle-arrow {
	transition: transform 300ms ease;
	display: block;
	height: rem-calc(40);
	width: rem-calc(40);
	margin-right: rem-calc(22);
}

.accordion-title {
	padding-left: rem-calc(12);

	&:hover {
		cursor: pointer;
	}
}

.accordion-info {
	margin-left: 4.625rem;
}

.flipped {
	transform: rotate(180deg);
}
</style>
