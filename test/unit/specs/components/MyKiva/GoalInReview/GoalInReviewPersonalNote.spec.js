import { render } from '@testing-library/vue';
import GoalInReviewPersonalNote from '#src/components/MyKiva/GoalInReview/GoalInReviewPersonalNote';
import { globalOptions } from '../../../../specUtils';

describe('GoalInReviewPersonalNote', () => {
	it('renders the personal note with the signature', () => {
		const { getByText } = render(GoalInReviewPersonalNote, {
			global: globalOptions,
			props: { year: 2026 },
		});

		getByText('A personal note');
		getByText(/You did it! Thank you for turning this goal into reality/);
		getByText('Vishal G');
		getByText('CEO, Kiva');
	});

	it('shows the goal year in the byline pill', () => {
		const { getByText } = render(GoalInReviewPersonalNote, {
			global: globalOptions,
			props: { year: 2026 },
		});

		getByText(/Kiva.*2026/);
	});
});
