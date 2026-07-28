import useLifecycleCapture from '#src/composables/useLifecycleCapture';
import { getLifecycleData } from '#src/util/lifecycleStage';

vi.mock('#src/util/lifecycleStage', () => ({
	getLifecycleData: vi.fn(),
}));

describe('useLifecycleCapture', () => {
	beforeEach(() => {
		getLifecycleData.mockReset();
	});

	it('stores the in-flight lifecycle request', () => {
		const apollo = {};
		const request = Promise.resolve({ stage: 'idle180', daysSinceLastLoan: 200 });
		getLifecycleData.mockReturnValue(request);
		const { lifecycleDataPromise, startLifecycleCapture } = useLifecycleCapture(apollo);

		startLifecycleCapture();

		expect(getLifecycleData).toHaveBeenCalledWith(apollo);
		expect(lifecycleDataPromise.value).toBe(request);
	});

	it('starts the lifecycle request only once', () => {
		getLifecycleData.mockReturnValue(Promise.resolve(null));
		const { startLifecycleCapture } = useLifecycleCapture({});

		startLifecycleCapture();
		startLifecycleCapture();

		expect(getLifecycleData).toHaveBeenCalledTimes(1);
	});
});
