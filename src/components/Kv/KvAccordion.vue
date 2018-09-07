<template>
	<span>
		<a @click="toggleAccordion"
			:class="{ flipped: isFlipped }">
			<kv-icon
				class="medium-chevron"
				name="medium-chevron" />
		</a>
	</span>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
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
