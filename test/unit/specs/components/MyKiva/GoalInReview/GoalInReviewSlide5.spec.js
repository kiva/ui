import { render } from '@testing-library/vue';
import GoalInReviewSlide5 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide5';
import { globalOptions } from '../../../../specUtils';

describe('GoalInReviewSlide5', () => {
	it('renders the static community-impact stats', () => {
		const { getByText } = render(GoalInReviewSlide5, { global: globalOptions });

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
