import { render } from '@testing-library/vue';
import ChallengeTeamInvite from '#src/components/BorrowerProfile/ChallengeTeamInvite';
import { KvUserAvatar } from '@kiva/kv-components';
import { globalOptions } from '../../../specUtils';

const shareLender = { id: 1, name: 'Lender' };
const teamName = 'Team Test';
const mocks = {
	$route: {
		query: {
			team: teamName
		}
	}
};
const show = vi.fn();

describe('ChallengeCallout', () => {
	it('should display team name', () => {
		const { getByText } = render(ChallengeTeamInvite, {
			global: {
				...globalOptions,
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
			},
			props: { shareLender, teamName },
		});

		getByText(teamName);
	});

	it('should display lender image', () => {
		const { getByAltText } = render(ChallengeTeamInvite, {
			global: {
				...globalOptions,
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
			},
			props: {
				shareLender: {
					...shareLender,
					image: {
						url: 'test.jpg',
					},
				},
				teamName
			},
		});

		getByAltText('Image of lender');
		expect(show).toHaveBeenCalled();
	});
});
