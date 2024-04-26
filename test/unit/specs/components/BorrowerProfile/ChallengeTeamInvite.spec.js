import { render } from '@testing-library/vue';
import ChallengeTeamInvite from '@/components/BorrowerProfile/ChallengeTeamInvite';
import KvUserAvatar from '~/@kiva/kv-components/vue/KvUserAvatar';

const shareLender = { id: 1, name: 'Lender' };
const teamName = 'Team Test';
const mocks = {
	$route: {
		query: {
			team: teamName
		}
	}
};
const show = jest.fn();

describe('ChallengeCallout', () => {
	it('should display team name', () => {
		const { getByText } = render(ChallengeTeamInvite, {
			props: { shareLender, teamName },
			mocks,
			stubs: {
				KvToast: {
					template: `
						<div ref="toastRef">
							<span>${teamName}</span>
						</div>
					`,
					methods: {
						close: () => ({}),
						show,
					},
				},
			},
		});

		getByText(teamName);
	});

	it('should display lender image', () => {
		const { getByAltText } = render(ChallengeTeamInvite, {
			props: {
				shareLender: {
					...shareLender,
					image: {
						url: 'test.jpg',
					},
				},
				teamName
			},
			mocks,
			stubs: {
				KvToast: {
					template: `
						<div ref="toastRef">
							<kv-user-avatar lender-name="name" lender-image-url="url.jpg" />
						</div>
					`,
					components: {
						KvUserAvatar
					},
					methods: {
						close: () => ({}),
						show,
					},
				},
			},
		});

		getByAltText('Image of lender');
		expect(show).toHaveBeenCalled();
	});
});
