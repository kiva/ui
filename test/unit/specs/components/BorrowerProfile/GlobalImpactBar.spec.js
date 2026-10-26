/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import GlobalImpactBar from '#src/components/BorrowerProfile/GlobalImpactBar';
import { globalOptions } from '../../../specUtils';

function mountBar() {
	return mount(GlobalImpactBar, { global: globalOptions });
}

describe('GlobalImpactBar', () => {
	it('lists the four impact stats in order', () => {
		const stats = mountBar().findAll('[data-testid="bp-global-impact-stat"]');

		expect(stats.map(stat => stat.text().replace(/\s+/g, ' '))).toEqual([
			'20 years of experience',
			'$2.4 billion loans funded',
			'6 million people reached',
			'2.3 million lenders',
		]);
	});

	it('pairs every stat with a decorative icon', () => {
		const icons = mountBar().findAll('[data-testid="bp-global-impact-stat"] svg');

		expect(icons).toHaveLength(4);
		icons.forEach(icon => expect(icon.attributes('aria-hidden')).toBe('true'));
	});

	it('keeps the last stat on two lines below the desktop breakpoint', () => {
		const lastStat = mountBar().findAll('[data-testid="bp-global-impact-stat"] span').at(-1);

		expect(lastStat.text()).toBe('2.3 million\nlenders');
		expect(lastStat.classes()).toEqual(
			expect.arrayContaining(['tw-whitespace-pre-line', 'lg:tw-whitespace-normal']),
		);
	});
});
