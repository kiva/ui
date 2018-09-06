<template>
	<span>
		<kv-icon class="medium-chevron" name="medium-chevron"/>
	</span>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'foundation';
@include foundation-accordion;

.medium-chevron {
	height: rem-calc(18);
	width: rem-calc(40);
}

.accordion-title {
	line-height: rem-calc(36);
	border: none;
}

</style>
