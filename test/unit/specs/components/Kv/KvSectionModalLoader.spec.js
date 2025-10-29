import { render } from '@testing-library/vue';
import KvSectionModalLoader, { LOADING_LABEL } from '../../../../../src/components/Kv/KvSectionModalLoader';

describe('KvSectionModalLoader', () => {
	it('should hide loader by default', () => {
		const { queryByLabelText } = render(KvSectionModalLoader);
		expect(queryByLabelText(LOADING_LABEL)).toBe(null);
	});

	it('should show loader', () => {
		const { getByLabelText } = render(KvSectionModalLoader, { props: { loading: true } });
		getByLabelText(LOADING_LABEL);
	});
});
