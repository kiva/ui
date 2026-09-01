import { render } from '@testing-library/vue';
import GoalInReviewCollectiveImpact from '#src/components/MyKiva/GoalInReview/GoalInReviewCollectiveImpact';
import { globalOptions } from '../../../../specUtils';

describe('GoalInReviewCollectiveImpact', () => {
	it('renders the static community-impact stats', () => {
		const { getByText } = render(GoalInReviewCollectiveImpact, { global: globalOptions });

		getByText('Collective impact');
		getByText(/Goal Setters create something/);

		getByText('400K+');
		getByText('borrowers');
		getByText('62');
		getByText('countries');
		getByText('95%');
		getByText('women');

		getByText(/And you were part of it/);
	});
});
