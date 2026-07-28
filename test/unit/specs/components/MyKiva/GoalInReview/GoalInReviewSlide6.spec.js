import { render } from '@testing-library/vue';
import GoalInReviewSlide6 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide6';
import { globalOptions } from '../../../../specUtils';

describe('GoalInReviewSlide6', () => {
	it('renders the personal note with the signature', () => {
		const { getByText } = render(GoalInReviewSlide6, {
			global: globalOptions,
			props: { year: 2026 },
		});

		getByText('A personal note');
		getByText(/You did it! Thank you for turning this goal into reality/);
		getByText('Vishal G');
		getByText('CEO, Kiva');
	});

	it('shows the goal year in the byline pill', () => {
		const { getByText } = render(GoalInReviewSlide6, {
			global: globalOptions,
			props: { year: 2026 },
		});

		getByText(/Kiva.*2026/);
	});
});
