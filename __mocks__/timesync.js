// Grab the now() function from Date before it is overwritten by syncDate
const { now } = Date;

let delaySetting = 10000;

const mocks = {
	offset: 0,
	// Mock timesync.on
	on: vi.fn((event, cb) => {
		// For 'sync' event, just call the callback with 'end' to indicate syncing has completed
		if (event === 'sync') {
			setTimeout(() => {
				cb('end');
			}, 10);
		}
	}),
	// Mock timesync.off
	off: vi.fn(),
	// Mock timesync.now() to return the current time shifted by a delay
	now: vi.fn(() => now() + mocks.offset),
	// Mock timesync.sync() to 'sync' the current time
	sync: vi.fn(() => {
		mocks.offset = delaySetting;
	}),
};

// Mock timesync.create
exports.create = vi.fn(() => mocks);

// Test-only exports to expose mocks and set the delay that time should be shifted by
exports.mocks = mocks;
exports.realNow = now;
exports.setDelay = delay => {
	delaySetting = delay;
};
exports.reset = () => {
	delaySetting = 0;
	mocks.offset = 0;
};
