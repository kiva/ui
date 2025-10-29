import oneTrustGlobalEvent from '../../../../src/head/oneTrustEvent';

describe('oneTrustGlobalEvent', () => {
	let dispatchEventSpy;
	let mockDocument;

	beforeEach(() => {
		// Mock document.cookie
		mockDocument = {
			cookie: '',
		};
		global.document = mockDocument;

		// Mock window.dispatchEvent
		dispatchEventSpy = vi.fn();
		global.window = { dispatchEvent: dispatchEventSpy };

		// Mock CustomEvent
		global.CustomEvent = vi.fn((type, options) => ({ type, ...options }));
	});

	afterEach(() => {
		delete global.document;
		delete global.window;
		delete global.CustomEvent;
	});

	it('should dispatch oneTrustAccepted event when C0002 is accepted', () => {
		global.document.cookie = 'OptanonConsent=groups=C0001:1,C0002:1';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
		expect(global.CustomEvent).toHaveBeenCalledWith('oneTrustAccepted', {
			detail: { groups: 'C0001:1,C0002:1' },
		});
	});

	it('should dispatch oneTrustAccepted event when C0003 is accepted', () => {
		global.document.cookie = 'OptanonConsent=groups=C0001:1,C0003:1';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
		expect(global.CustomEvent).toHaveBeenCalledWith('oneTrustAccepted', {
			detail: { groups: 'C0001:1,C0003:1' },
		});
	});

	it('should dispatch oneTrustAccepted event when C0004 is accepted', () => {
		global.document.cookie = 'OptanonConsent=groups=C0001:1,C0004:1';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
		expect(global.CustomEvent).toHaveBeenCalledWith('oneTrustAccepted', {
			detail: { groups: 'C0001:1,C0004:1' },
		});
	});

	it('should dispatch event when multiple optional groups are accepted', () => {
		global.document.cookie = 'OptanonConsent=groups=C0001:1,C0002:1,C0003:1,C0004:1';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
		expect(global.CustomEvent).toHaveBeenCalledWith('oneTrustAccepted', {
			detail: { groups: 'C0001:1,C0002:1,C0003:1,C0004:1' },
		});
	});

	it('should not dispatch event when only C0001 (essential) is accepted', () => {
		global.document.cookie = 'OptanonConsent=groups=C0001:1';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).not.toHaveBeenCalled();
	});

	it('should not dispatch event when optional groups are declined', () => {
		global.document.cookie = 'OptanonConsent=groups=C0001:1,C0002:0,C0003:0,C0004:0';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).not.toHaveBeenCalled();
	});

	it('should not dispatch event when OptanonConsent cookie does not exist', () => {
		global.document.cookie = '';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).not.toHaveBeenCalled();
	});

	it('should not dispatch event when groups parameter is missing from cookie', () => {
		global.document.cookie = 'OptanonConsent=someOtherParam=value';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).not.toHaveBeenCalled();
	});

	it('should handle cookie with other parameters before OptanonConsent', () => {
		global.document.cookie = 'otherCookie=value; OptanonConsent=groups=C0001:1,C0003:1';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
	});

	it('should handle cookie with other parameters after groups', () => {
		global.document.cookie = 'OptanonConsent=groups=C0001:1,C0002:1&hosts=someValue';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
	});

	it('should not dispatch event when groups string is empty', () => {
		global.document.cookie = 'OptanonConsent=groups=';

		oneTrustGlobalEvent();

		expect(dispatchEventSpy).not.toHaveBeenCalled();
	});
});
