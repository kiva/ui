import NotifyMe from '@/components/Thanks/NotifyMe';

export default {
	title: 'Components/Notify Me',
	component: NotifyMe,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { NotifyMe },
		template: '<notify-me :goal="goal" email="test@test.com" :teamPublicId="teamPublicId" />',
	})
	template.args = args;
	return template;
};

const future = new Date();
future.setDate(future.getDate() + 2);

const goal = {
	endDate: future.toISOString(),
	targets: {
		totalCount: 2,
		values: [
			{ status: 'COMPLETE' },
			{ status: 'IN_PROGRESS' },
		]
	}
}

export const Default = story({ goal });

export const Team = story({ goal, teamPublicId: 'aplus' });
