// Grab the now() function from Date before it is overwritten by syncDate
const { now } = Date;

let currentDelay = 0;
let delaySetting = 10000;

const mocks = {
	// Mock timesync.on
	on: jest.fn((event, cb) => {
		// For 'sync' event, just call the callback with 'end' to indicate syncing has completed
		if (event === 'sync') {
			setTimeout(() => {
				cb('end');
			}, 10);
		}
	}),
	// Mock timesync.now() to return the current time shifted by a delay
	now: jest.fn(() => now() + currentDelay),
	// Mock timesync.sync() to 'sync' the current time
	sync: jest.fn(() => {
		currentDelay = delaySetting;
	}),
};

// Mock timesync.create
exports.create = jest.fn(() => mocks);

// Test-only exports to expose mocks and set the delay that time should be shifted by
exports.mocks = mocks;
exports.setDelay = delay => {
	delaySetting = delay;
};
exports.reset = () => {
	delaySetting = 0;
	currentDelay = 0;
};
