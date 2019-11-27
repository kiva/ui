/*
 * This file replaces the native Date object so that it will use the server time instead of the
 * local machine time. If you require the current time to be reasonably accurate (like when
 * validating authentication tokens or displaying the time remaining on a loan reservation) import
 * and call this function like so:
 *
 *   import syncDate from '@/util/syncDate';
 *   syncDate().then(() => {
 *     // time is synchronized
 *   });
 */

import { create } from 'timesync';

const time = create({
	server: '/timesync',
	delay: 250,
	interval: null, // disable automatic syncing
});

let syncPromise;
export default function sync() {
	// Return sync promise if one already exists to prevent multiple calls to time.sync()
	if (syncPromise) {
		return syncPromise;
	}
	syncPromise = new Promise(resolve => {
		// Start listening for sync events
		time.on('sync', status => {
			// status will be 'start' when syncing is started and 'end' when syncing has finished
			if (status === 'end') {
				syncPromise = null;
				resolve();
			}
		});
		// Start listening for error events
		time.on('error', err => {
			console.error(err);
			syncPromise = null;
			resolve();
		});
		// Start syncing
		time.sync();
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
