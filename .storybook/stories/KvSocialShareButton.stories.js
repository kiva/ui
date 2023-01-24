import KvSocialShareButton from '@/components/Kv/KvSocialShareButton';

export default {
	title: 'Kv/KvSocialShareButton',
	component: KvSocialShareButton,
	args: {
		modalTitle: 'This is the share modal title',
		shareMessage: `Kiva is an easy way to make a real difference in someone's life.`,
		shareUrl: '/test',
		variant: 'caution',
		utmCampaign: 'social_share_campaign',
		utmContent: 'testuser123',
	},
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: ['primary', 'secondary', 'link', 'ghost', 'danger', 'caution'],
			}
		},
	}
};


export const Default= (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvSocialShareButton,
	},
	template: `
		<kv-social-share-button
			:modal-title="modalTitle"
			:share-message="shareMessage"
			:share-url="shareUrl"
			:variant="variant"
			:utm-campaign="utmCampaign"
			:utm-content="utmContent"
		>
			Share this thing
			<template #modal-content>
				Did you know that this fact is super fascinating? Share it with your friends!
			</template>
		</kv-social-share-button>
	`,
});
