<template>
	<div class="row">
		<div class="column small-12 large-8">
			<kv-settings-card title="How would you like your verification code?">
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
					<p>You'll be asked for a verification code when accessing you Kiva account.</p>

					<h3>
						Authentication app
					</h3>

					<h3>
						Text message or phone call
					</h3>
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
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
