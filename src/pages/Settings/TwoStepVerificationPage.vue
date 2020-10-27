<template>
	<www-page class="two-step-verification" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h1>
					2-step verification
				</h1>
			</div>
		</div>
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
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		WwwPage,
		KvSettingsCard,
		KvIcon,
	},
	metaInfo: {
		title: '2-step verification',
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.two-step-verification {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}
}

</style>
