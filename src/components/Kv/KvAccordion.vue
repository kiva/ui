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
	}
};
</script>

<style lang="scss">
@import 'settings';

.medium-chevron {
	height: rem-calc(18);
	width: rem-calc(40);
}

</style>
