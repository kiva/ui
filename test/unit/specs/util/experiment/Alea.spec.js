import Alea, { Mash } from '@/util/experiment/Alea';
import { runManyTimes, runManyTimesAndCompare } from '../../../helpers/runAndCompare';

describe('Alea.js', () => {
	describe('Mock', () => {
		it('should return same hash for same GUID', () => {
			runManyTimesAndCompare(() => Mash()('f0041eaa-0076-45c7-894a-0b0996e845fd'));
		});

		it('should return same hash for same string', () => {
			runManyTimesAndCompare(() => Mash()('asd'));
		});

		it('should return same hash for same decimal', () => {
			runManyTimesAndCompare(() => Mash()(0.3557529668373902));
		});

		it('should return same hash for same integer', () => {
			runManyTimesAndCompare(() => Mash()(1147483647));
		});
	});

	describe('Alea', () => {
		it('should return same random number for same single GUID argument', () => {
			runManyTimesAndCompare(() => Alea('f0041eaa-0076-45c7-894a-0b0996e845fd')());
		});

		it('should return same random number for same single string argument', () => {
			runManyTimesAndCompare(() => Alea('asd')());
		});

		it('should return same random number for same single decimal argument', () => {
			runManyTimesAndCompare(() => Alea(0.3557529668373902)());
		});

		it('should return same random number for same single integer argument', () => {
			runManyTimesAndCompare(() => Alea(1147483647)());
		});

		it('should return same random number for same single bit argument', () => {
			runManyTimesAndCompare(() => Alea(1)());
		});

		it('should return same random number for same two arguments', () => {
			runManyTimesAndCompare(() => Alea('f0041eaa-0076-45c7-894a-0b0996e845fd', 'asd')());
		});

		it('should return same random number for same three arguments', () => {
			runManyTimesAndCompare(() => Alea('f0041eaa-0076-45c7-894a-0b0996e845fd', 'asd', 0.3557529668373902)());
		});

		it('should return same random number for same four arguments', () => {
			runManyTimesAndCompare(() => Alea(
				'f0041eaa-0076-45c7-894a-0b0996e845fd',
				'asd',
				0.3557529668373902,
				1147483647
			)());
		});

		it('should return same random number for same five arguments', () => {
			runManyTimesAndCompare(() => Alea(
				'f0041eaa-0076-45c7-894a-0b0996e845fd',
				'asd',
				0.3557529668373902,
				1147483647,
				1
			)());
		});

		it('should return a different random number per run', () => {
			runManyTimes(() => {
				const prng = Alea(Math.random);
				const first = prng();
				const second = prng();
				const third = prng();
				expect(first).not.toBe(second);
				expect(first).not.toBe(third);
				expect(second).not.toBe(third);
			});
		});

		it('should return consistent random numbers across invocations', () => {
			runManyTimes(() => {
				const seed = Math.random();
				const prng1 = Alea(seed);
				const prng2 = Alea(seed);
				expect(prng1()).toBe(prng2());
				expect(prng1()).toBe(prng2());
				expect(prng1()).toBe(prng2());
			});
		});

		it('should have same value at different iterations from same seed', () => {
			runManyTimes(() => {
				const seed = Math.random();
				const prng1 = Alea(seed);
				const prng2 = Alea(seed);
				prng1();
				expect(prng1()).not.toBe(prng2());
				prng2();
				expect(prng1()).toBe(prng2());
			});
		});

		it('should have different value from different seeds', () => {
			runManyTimes(() => {
				const prng1 = Alea(0);
				const prng2 = Alea(1);
				expect(prng1()).not.toBe(prng2());
				expect(prng1()).not.toBe(prng2());
				expect(prng1()).not.toBe(prng2());
			});
		});

		it('should return known values', () => {
			runManyTimes(() => {
				const prng = Alea(12345);
				expect(prng()).toBe(0.27138191112317145);
				expect(prng()).toBe(0.19615925149992108);
				expect(prng()).toBe(0.6810678059700876);
			});
		});
	});
});
