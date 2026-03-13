import TeamMessageCard from '#src/components/LendingTeams/MyTeams/TeamMessageCard';

export default {
	title: 'LendingTeams/TeamMessageCard',
	component: TeamMessageCard,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { TeamMessageCard },
		setup() { return args; },
		template: `
			<div style="max-width: 360px;">
				<team-message-card :message="message" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	message: {
		id: 1001,
		body: 'Great work everyone! We just hit our monthly lending goal. Keep it up! #1002',
		date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		sender: {
			id: 42,
			name: 'Jane Doe',
			publicId: 'jane_doe',
			imageUrl: 'https://www-0.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg',
		},
		team: {
			id: 101,
			name: 'Kiva Friends',
			teamPublicId: 'kiva-friends',
			imageUrl: 'https://www-0.development.kiva.org/img/s100/team_s135.png',
		},
	},
});

export const NoSenderImage = story({
	message: {
		id: 1002,
		body: 'Welcome to the team, everyone! Happy to lend together.',
		date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		sender: {
			id: 43,
			name: 'Anonymous Lender',
			publicId: 'anonymous_lender',
			imageUrl: '',
		},
		team: {
			id: 101,
			name: 'Kiva Friends',
			teamPublicId: 'kiva-friends',
			imageUrl: 'https://www-0.development.kiva.org/img/s100/team_s135.png',
		},
	},
});
