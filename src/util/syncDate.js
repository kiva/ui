/*
 * This file replaces the native Date object so that it will use the server time instead of the
 * local machine time. If you require the current time to be reasonably accurate (like when
 * validating authentication tokens or displaying the time remaining on a loan reservation) import
 * and call this function like so:
 *
 *   import syncDate from '#src/util/syncDate';
 *   syncDate().then(() => {
 *     // time is synchronized
 *   });
 */

import store2 from 'store2';
import { create } from 'timesync';
import logFormatter from '#src/util/logFormatter';

// Grab Date.now before the Date prototype is replaced
const systemNow = Date.now;

// Create a timesync instance
const time = create({
	server: '/timesync',
	delay: 250,
	interval: null, // disable automatic syncing
	now: systemNow,
});

let syncPromise;
export default function sync() {
	// Return sync promise if one already exists to prevent multiple calls to time.sync()
	if (syncPromise) {
		return syncPromise;
	}

	// Skip syncing if it has been less than 10 minutes since the last sync
	const tenMinutes = 10 * 60 * 1000;
	const lastSyncTime = store2.get('timesync.lastSyncTime');
	if (lastSyncTime && systemNow() - lastSyncTime < tenMinutes) {
		// Just in case this is called after a page refresh, restore the saved offset from the last sync
		const lastOffset = store2.get('timesync.lastOffset');
		if (lastOffset && !time.offset) {
			time.offset = lastOffset;
		}
		// Return so that syncing process is not started
		return Promise.resolve();
	}

	syncPromise = new Promise(resolve => {
		// Start listening for sync events
		time.on('sync', status => {
			// status will be 'start' when syncing is started and 'end' when syncing has finished
			if (status === 'end') {
				// Save calculated offset into local storage
				store2.set('timesync.lastOffset', time.offset);
				time.off('sync'); // Removes this promise's sync event handler
				syncPromise = null;
				resolve();
			}
		});
		// Start listening for error events
		time.on('error', err => {
			logFormatter(err, 'error');
			time.off('error'); // Removes this promise's error event handler
			syncPromise = null;
			resolve();
		});
		// Start syncing
		time.sync();
		// Note time that this sync was run
		store2.set('timesync.lastSyncTime', systemNow());
	});
	return syncPromise;
}

// This function allows for creating a Date object with an arbitrary number of arguments, which
// allows the Date constructor to be overridden.
// Taken from https://stackoverflow.com/questions/13839318/javascript-override-date-prototype-constructor
/* eslint-disable new-parens, no-global-assign, prefer-spread, prefer-rest-params */
const { bind } = Function;
const unbind = bind.bind(bind);
function instantiate(constructor, args) {
	return new (unbind(constructor, null).apply(null, args));
}

Date = (function dateInjector(Date) {
	function KvDate() {
		// Get a Date object instantiated with the same arguments as this constructor
		const date = instantiate(Date, arguments);
		if (arguments.length === 0) {
			// No arguments means the current time is desired, therefore we need to correct the
			// contructed Date with the current synchronized time.
			date.setTime(Math.round(time.now()));
		}
		return date;
	}

	// Return the current synchronized time.
	KvDate.now = function now() {
		return Math.round(time.now());
	};

	// Pass through to Date.parse
	KvDate.parse = function parse() {
		return Date.parse.apply(this, arguments);
	};

	// Pass through to Date.UTC
	KvDate.UTC = function UTC() {
		return Date.UTC.apply(this, arguments);
	};

	// Inherit Date
	KvDate.prototype = Date.prototype;

	return KvDate;
}(Date));
