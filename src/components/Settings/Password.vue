<template>
	<kv-settings-card title="Password">
		<template v-slot:icon>
			<!-- TODO: THIS ICON IS A PLACEHOLDER
					Get correct icon assest from design, or remove this KvIcon -->
			<kv-icon
				class="icon"
				title="Auto-lending On"
				name="auto-icon-on"
			/>
		</template>
		<template v-slot:content>
			<p>Clicking this button will send you a verification...</p>
		</template>
	</kv-settings-card>
</template>

<script>
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvSettingsCard,
		KvIcon,
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
