import ActivityCard from '#src/components/Iwd/ActivityCard';

export default {
	title: 'IWD/ActivityCard',
	component: ActivityCard,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ActivityCard },
		template: `
			<div>
				<activity-card
					:activity="activity"
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	activity: {
		lender: {
			name: 'Roger',
			image: {
				url: 'https://www.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg',
			},
		},
		shareAmount: '25.00',
	}
});

