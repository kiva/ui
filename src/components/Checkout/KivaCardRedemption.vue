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
				class="accordion-info row">
				<a class="small-12 medium-9">
					<input placeholder="ABCD-1234-EFGH-5678">
					<button class="button secondary">Apply</button>
					<a>Need help?</a>
				</a>
				<div class="small-12 medium-3">
					<span class="">Kiva Card value:</span>
					<span class="kiva-card-amount"> $0.00</span>
					<span class="remove-wrapper"
						@click="updateLoanAmount('remove')">
						<kv-icon class="remove-x" name="small-x" />
					</span>
				</div>
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
		}
	}
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "global/transitions";

.kiva-card-entry-wrapper {
	@include breakpoint(medium) {
		margin: $list-side-margin;
	}
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

.remove-x {
	fill: $subtle-gray;
	display: inline-block;
	width: 1.1rem;
	height: rem-calc(50);

	@include breakpoint(medium) {
		height: rem-calc(36);
	}
}

</style>
