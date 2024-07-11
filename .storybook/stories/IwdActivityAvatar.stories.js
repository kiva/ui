import ActivityAvatar from '@/components/Iwd/ActivityAvatar';

export default {
	title: 'IWD/ActivityAvatar',
	component: ActivityAvatar,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ActivityAvatar },
		template: `
			<div>
				<activity-avatar
					:lender-image-url="lenderImageUrl"
					:lender-name="lenderName"
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	lenderImageUrl: 'https://www.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg',
	lenderName: 'Roger',
});

export const NoImage = story({
	lenderImageUrl: '',
	lenderName: 'Roger',
});

export const Anonymous = story({
	lenderImageUrl: 'https://www.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg',
	lenderName: 'Anonymous',
});

export const DefaultProfile = story({
	lenderImageUrl: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
	lenderName: 'Default Profile',
});
