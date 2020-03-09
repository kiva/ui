import Error from '@/pages/Error';
import WwwPage from '@/components/WwwFrame/WwwPage';
import getDeepComponents from '@/util/getDeepComponents';

describe('getDeepComponents', () => {
	it('returns a list of all the components in the tree', () => {
		const result = getDeepComponents([Error]);
		expect(result).toEqual(expect.arrayContaining([Error, WwwPage]));
	});
});
