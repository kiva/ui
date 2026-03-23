import TeamCard from '#src/components/LendingTeams/MyTeams/TeamCard';

export default {
	title: 'LendingTeams/TeamCard',
	component: TeamCard,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { TeamCard },
		setup() { return args; },
		template: `
			<div style="max-width: 360px;">
				<team-card :team="team" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	team: {
		id: 101,
		name: 'Kiva Friends',
		teamPublicId: 'kiva-friends',
		imageUrl: 'https://www-0.development.kiva.org/img/s100/team_s135.png',
	},
});

export const NoImage = story({
	team: {
		id: 102,
		name: 'Tech for Good',
		teamPublicId: 'tech-for-good',
		imageUrl: '',
	},
});
