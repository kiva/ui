<template>
	<kv-settings-card>
		<template v-slot:content>
			<div class="strong">
				Level up your security with 2-step verfication
			</div>
			<p>
				2-step verification protects your Kiva account by requiring an
				additional code when you log in on a device we don't recognize.
			</p>
			<div class="strong">
				FAQ
			</div>
			<div><a>What is 2-step Verification?</a></div>
			<div><a>How does it work?</a></div>
			<div><a>How it protects you</a></div>
		</template>
	</kv-settings-card>
</template>

<script>
import KvSettingsCard from '@/components/Kv/KvSettingsCard';

export default {
	components: {
		KvSettingsCard,
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
