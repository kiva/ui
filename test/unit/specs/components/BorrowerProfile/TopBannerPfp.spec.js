/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import TopBannerPfp from '#src/components/BorrowerProfile/TopBannerPfp';
import { globalOptions } from '../../../specUtils';

function mountBanner(props = {}) {
	return mount(TopBannerPfp, {
		props: {
			borrowerName: 'Ken',
			lendersNeeded: 15,
			...props,
		},
		global: globalOptions,
	});
}

describe('TopBannerPfp', () => {
	it.each([
		['14 days'],
		['1 day'],
		['9 hours'],
	])('shows the same time left as the progress bar (%s)', timeLeft => {
		const wrapper = mountBanner({ timeLeft });

		expect(wrapper.find('[data-testid="bp-pfp-banner-copy"]').text())
			.toContain(`Ken has ${timeLeft} to earn the support of 15 lenders`);
	});

	it('falls back to generic copy when the time left is unknown', () => {
		const wrapper = mountBanner();

		expect(wrapper.find('[data-testid="bp-pfp-banner-copy"]').text())
			.toContain('Ken has limited time to earn the support of 15 lenders');
	});
});
