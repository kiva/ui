import KvSettingsCard from '#src/components/Kv/KvSettingsCard';

export default {
	title: 'Kv/KvSettingsCard',
	component: KvSettingsCard,
	parameters: {
		backgrounds: {
			default: 'kiva-bg-lightgray',
		},
	},
	args: {
		disabled: false,
		title: 'Settings Card Title',
		cardContent: 'This is the content of the settings card. Insert anything here. The card can accommodate very tall or short content. The card should be used on a page that does not have a white background.',
	}
};

export const Default = (args, { argTypes }) => ({
	components: {
		KvSettingsCard,
	},
	props: Object.keys(argTypes),
	template: `
		<kv-settings-card class="column large-8" :title="title" :disabled="disabled">
			<template #content>
				<p>{{cardContent}}</p>
			</template>
		</kv-settings-card>
	`,
});

