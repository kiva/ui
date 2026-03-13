import MyTeamsList from '#src/components/LendingTeams/MyTeams/MyTeamsList';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

const teamsQueryResult = {
	data: {
		my: {
			id: 1,
			teams: {
				totalCount: 3,
				values: [
					{
						id: 201,
						team: {
							id: 101,
							name: 'Kiva Friends',
							teamPublicId: 'kiva-friends',
							image: {
								id: 301,
								url: 'https://www-0.development.kiva.org/img/s100/team_s135.png',
							},
						},
					},
					{
						id: 202,
						team: {
							id: 102,
							name: 'Tech for Good',
							teamPublicId: 'tech-for-good',
							image: {
								id: 302,
								url: 'https://www-0.development.kiva.org/img/s100/team_s135.png',
							},
						},
					},
					{
						id: 203,
						team: {
							id: 103,
							name: 'Green Lenders',
							teamPublicId: 'green-lenders',
							image: {
								id: 303,
								url: 'https://www-0.development.kiva.org/img/s100/team_s135.png',
							},
						},
					},
				],
			},
		},
	},
};

const emptyQueryResult = {
	data: {
		my: {
			id: 1,
			teams: {
				totalCount: 0,
				values: [],
			},
		},
	},
};

export default {
	title: 'LendingTeams/MyTeamsList',
	component: MyTeamsList,
};

const story = (args, queryResult, loading = false) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MyTeamsList },
		mixins: [apolloStoryMixin({ queryResult, loading })],
		template: `
			<div style="max-width: 360px;">
				<my-teams-list />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({}, teamsQueryResult);

export const Empty = story({}, emptyQueryResult);

export const Loading = story({}, teamsQueryResult, true);
