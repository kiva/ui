import { render } from '@testing-library/vue';
import CommentsContainer from '@/components/Contentful/CommentsContainer';

const withContentProp = (dataObject = {}) => ({
	props: {
		content: {
			dataObject,
		},
	},
});

const renderContainer = (dataObject = {}) => {
	return render(CommentsContainer, withContentProp(dataObject));
};

describe('CommentsContainer', () => {
	it('should render without activity ID', async () => {
		const component = renderContainer();
		component.getByText('Activity ID missing');
	});

	it('should render with activity ID', async () => {
		const component = renderContainer({ activityId: 'asd' });
		component.getByText('Comment functionality coming soon!');
	});
});
