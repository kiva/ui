import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvIcon from '@/components/Kv/KvIcon';
import { text } from '@storybook/addon-knobs';

export default {
	title: 'Kv/KvSettingsCard',
	component: KvSettingsCard,
};

export const Default = () => ({
	components: {
		KvSettingsCard,
		KvIcon
	},
	props: {
		title: {
			type: String,
			default: `${text('Title', 'Settings Card Title')}`
		},
		content: {
			type: String,
			default: `${text('Content', 'This is the content of the settings card. Insert anything here. The card can accommodate very tall or short content. The card should be used on a page that does not have a white background.')}`
		},
	},
	template: `
		<div :style="styling">
			<kv-settings-card class="column large-8" :title="title">
				<template v-slot:icon>
					<kv-icon
						class="icon"
						title="Monthly Good"
						name="subscriptions-monthly-good"
					/>
				</template>
				<template v-slot:content>
					<p>{{content}}</p>
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

