<template>
	<div class="row">
		<div class="column small-12 large-8">
			<kv-settings-card title="2-Step verification">
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
					<p>Status:</p>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
				</template>
			</kv-settings-card>
		</div>
	</div>
</template>

<script>
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvSettingsCard,
		KvIcon,
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
