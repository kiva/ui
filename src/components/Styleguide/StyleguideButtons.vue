<template>
	<section>
		<h2>Buttons</h2>

		<label class="elem-desc">Primary button</label>
		<kv-button>Primary</kv-button>

		<label class="elem-desc">Smaller button (.smaller)</label>
		<kv-button class="smaller">Smaller</kv-button>

		<label class="elem-desc">Smallest button (.smallest)</label>
		<kv-button class="smallest">Smallest</kv-button>

		<label class="elem-desc">Secondary button (.secondary)</label>
		<kv-button class="secondary">Secondary</kv-button>

		<label class="elem-desc">Setting button (.setting)</label>
		<kv-button class="setting">Setting</kv-button>
	</section>
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
@import 'foundation';
</style>
