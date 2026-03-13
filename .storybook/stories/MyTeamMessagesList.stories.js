import MyTeamMessagesList from '#src/components/LendingTeams/MyTeams/MyTeamMessagesList';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

const messagesQueryResult = {
	data: {
		my: {
			id: 1,
			teamMessages: {
				totalCount: 5,
				values: [
					{
						id: 1001,
						body: 'Great work everyone! We just hit our monthly lending goal. Keep it up! #1002',
						date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
						sender: {
							id: 42,
							name: 'Jane Doe',
							publicId: 'jane_doe',
							image: {
								id: 401,
								url: 'https://www-0.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg',
							},
						},
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
						id: 1002,
						body: 'Welcome to the team! Happy to lend together toward a better world.',
						date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
						sender: {
							id: 43,
							name: 'Roger Smith',
							publicId: 'roger_smith',
							image: {
								id: 402,
								url: 'https://www-0.development.kiva.org/img/s100/6b1a24092be3aaa22216874e644a4acf.jpg',
							},
						},
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
						id: 1003,
						body: 'Just funded a loan in Kenya — highly recommend checking out the agriculture category!',
						date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
						sender: {
							id: 44,
							name: 'Maria Lopez',
							publicId: 'maria_lopez',
							image: {
								id: 403,
								url: 'https://www-0.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
							},
						},
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
						id: 1004,
						body: 'Reminder: our team lending challenge ends this Friday. We\'re only $200 away from the goal!',
						date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
						sender: {
							id: 45,
							name: 'David Chen',
							publicId: 'david_chen',
							image: {
								id: 404,
								url: 'https://www-0.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg',
							},
						},
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
					{
						id: 1005,
						body: 'Has anyone tried lending in the clean energy sector? Would love to hear recommendations.',
						date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
						sender: {
							id: 46,
							name: 'Priya Patel',
							publicId: 'priya_patel',
							image: {
								id: 405,
								url: 'https://www-0.development.kiva.org/img/s100/6b1a24092be3aaa22216874e644a4acf.jpg',
							},
						},
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
				],
			},
		},
	},
};

const emptyQueryResult = {
	data: {
		my: {
			id: 1,
			teamMessages: {
				totalCount: 0,
				values: [],
			},
		},
	},
};

export default {
	title: 'LendingTeams/MyTeamMessagesList',
	component: MyTeamMessagesList,
};

const story = (args, queryResult, loading = false) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MyTeamMessagesList },
		mixins: [apolloStoryMixin({ queryResult, loading })],
		template: `
			<div style="max-width: 360px;">
				<my-team-messages-list />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({}, messagesQueryResult);

export const Empty = story({}, emptyQueryResult);

export const Loading = story({}, messagesQueryResult, true);
