<template>
	<kv-button class="placeholder" />
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.placeholder {
	padding: rem-calc(13) 0;
	visibility: hidden;

}
</style>
