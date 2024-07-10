/* eslint-disable no-plusplus, no-param-reassign, no-return-assign, no-bitwise, prefer-rest-params, func-names */

/**
 * The hash function used for Alea pseudo random number generator
 *
 * Johannes Baagøe <baagoe@baagoe.com>, 2010
 * Licensed under the MIT license
 *
 * {@link https://github.com/nquinlan/better-random-numbers-for-javascript-mirror}
 *
 * @returns The hash of the provided data
 */
export function Mash() {
	let n = 0xefc8249d;

	const mash = function (data) {
		data = data.toString();
		for (let i = 0; i < data.length; i++) {
			n += data.charCodeAt(i);
			let h = 0.02519603282416938 * n;
			n = h >>> 0;
			h -= n;
			h *= n;
			n = h >>> 0;
			h -= n;
			n += h * 0x100000000; // 2^32
		}
		return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
	};

	mash.version = 'Mash 0.9';

	return mash;
}

/**
 * Pseudo random number generator that returns a repeatable set of random numbers when supplied matching seeds
 *
 * Johannes Baagøe <baagoe@baagoe.com>, 2010
 * Licensed under the MIT license
 *
 * {@link https://github.com/nquinlan/better-random-numbers-for-javascript-mirror}
 *
 * @returns The seeded generator function
 */
export default function Alea() {
	return (function (args) {
		let s0 = 0;
		let s1 = 0;
		let s2 = 0;
		let c = 1;

		if (args.length === 0) {
			args = [+new Date()];
		}

		let mash = Mash();
		s0 = mash(' ');
		s1 = mash(' ');
		s2 = mash(' ');

		for (let i = 0; i < args.length; i++) {
			s0 -= mash(args[i]);
			if (s0 < 0) {
				s0 += 1;
			}
			s1 -= mash(args[i]);
			if (s1 < 0) {
				s1 += 1;
			}
			s2 -= mash(args[i]);
			if (s2 < 0) {
				s2 += 1;
			}
		}

		mash = null;

		const random = function () {
			const t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
			s0 = s1;
			s1 = s2;
			return s2 = t - (c = t | 0);
		};

		random.version = 'Alea 0.9';

		random.args = args;

		return random;
	}(Array.prototype.slice.call(arguments)));
}
