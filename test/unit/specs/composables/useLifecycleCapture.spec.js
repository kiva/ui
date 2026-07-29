import useLifecycleCapture from '#src/composables/useLifecycleCapture';
import { getLifecycleData } from '#src/util/lifecycleStage';

vi.mock('#src/util/lifecycleStage', () => ({
	getLifecycleData: vi.fn(),
}));

describe('useLifecycleCapture', () => {
	beforeEach(() => {
		getLifecycleData.mockClear();
		getLifecycleData.mockReturnValue(Promise.resolve({ stage: 'idle180', daysSinceLastLoan: 200 }));
	});

	// the resolved value is deliberately not stored: checkout can complete before the
	// request returns, and completion needs something to wait on
	it('stores the in-flight request rather than its resolved value', () => {
		const apollo = {};
		const { lifecycleDataPromise, startLifecycleCapture } = useLifecycleCapture(apollo);

		startLifecycleCapture();

		expect(getLifecycleData).toHaveBeenCalledWith(apollo);
		expect(lifecycleDataPromise.value).toBeInstanceOf(Promise);
	});

	// the checkout query re-runs on basket changes and after login
	it('starts the request only once', () => {
		const { startLifecycleCapture } = useLifecycleCapture({});

		startLifecycleCapture();
		startLifecycleCapture();
		startLifecycleCapture();

		expect(getLifecycleData).toHaveBeenCalledTimes(1);
	});
});
