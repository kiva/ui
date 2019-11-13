/* eslint-disable no-bitwise */

import { isWithinRange } from 'date-fns';
import _get from 'lodash/get';

/**
 * Read a boolean setting from SettingsManager
 *
 * @param {object} data
 * @param {string|boolean} key
 * @returns {boolean|null}
 */
export function readBoolSetting(data, key) {
	let val = _get(data, key);
	if (val) val = val.toString();
	if (val === 'true') return true;
	if (val === 'false') return false;
	return null;
}

/**
 * Read a date setting from SettingsManager
 *
 * @param {object} data
 * @param {string} key
 * @returns {date|null}
 */
export function readDateSetting(data, key) {
	const val = _get(data, key);
	// extra string cleanup for firefox
	const cleanedDateVal = val ? val.replace(/[/"]/g, '') : null;
	return cleanedDateVal ? new Date(cleanedDateVal) : null;
}

/**
 * Read a json setting from SettingsManager
 *
 * TODO: figure out why these values are double-serialized
 *
 * @param {object} data
 * @param {string} key
 * @returns {object|null}
 */
export function readJSONSetting(data, key) {
	try {
		return JSON.parse(JSON.parse(_get(data, key)));
	} catch (e) {
		return null;
	}
}

/**
 * Determine if a feature or setting is enabled and currently active.
 *
 * @param {object} data
 * @param {string} enabledKey
 * @param {string} startTimeKey
 * @param {string} endTimeKey
 * @returns {boolean}
 */
export function settingEnabled(data, enabledKey, startTimeKey, endTimeKey) {
	const enabled = readBoolSetting(data, enabledKey);
	const startTime = readDateSetting(data, startTimeKey);
	const endTime = readDateSetting(data, endTimeKey);
	return enabled && isWithinRange(new Date(), startTime, endTime);
}

/**
 * Convert a string to a 32 bit integer
 * Inspiration: https://stackoverflow.com/a/8831937
 *
 * @param {string} source
 */

export function hashCode(source) {
	let hash = 0;
	// return 0 if empty or incorrect type
	if (typeof source === 'undefined' || typeof source !== 'string' || source === '') {
		return hash;
	}
	// shift the bits
	for (let i = 0; i < source.length; i++) { // eslint-disable-line
		// isolate character
		const character = source.charCodeAt(i);
		// original approach left shift
		hash = ((hash << 5) - hash) + character;
		// Convert to 32bit integer
		hash &= hash; // eslint-disable-line no-bitwise
	}
	return Math.abs(hash);
}
