<template>
	<span>
		<kv-icon
			class="medium-chevron"
			name="medium-chevron"
			@click.prevent.stop="flipShit()"/>
	</span>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	methods: {
		flipShit() {
			const arrow = document.getElementByClassName('.medium-chevron');
			arrow.setAttribute('style', 'transform: rotate(180deg)');
			console.log('shit has been flipped');
		}
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

</style>
