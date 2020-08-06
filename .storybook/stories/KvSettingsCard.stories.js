import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvIcon from '@/components/Kv/KvIcon';


export default {
	title: 'Kv/KvSettingsCard',
	component: KvSettingsCard,
};

export const Default = () => ({
	components: {
		KvSettingsCard,
		KvIcon
	},
	template: `
		<div :style="styling">
			<kv-settings-card class="column large-8" title="Monthly Good">
				<template v-slot:icon>
					<kv-icon
						class="icon"
						title="Monthly Good"
						name="subscriptions-monthly-good"
					/>
				</template>
				<template v-slot:content>
					<p>This is the content of the settings card. Insert anything here. The card should be used on a page that does not have a white background.</p>
				</template>
			</kv-settings-card>
		</div>
	`,
	computed: {
		styling: function() {
			return {
				backgroundColor: '#fafafa',
				padding: '2rem'
			}
		}
	}
});

