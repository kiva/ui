<template>
	<section class="tw-bg-primary-inverse tw-text-primary-inverse tw-py-3 lg:tw-py-2">
		<kv-page-container>
			<ul
				class="tw-grid tw-grid-cols-2 tw-gap-x-5 tw-gap-y-3
					lg:tw-flex lg:tw-flex-wrap lg:tw-justify-center lg:tw-gap-x-8 lg:tw-gap-y-2"
			>
				<li
					v-for="stat in stats"
					:key="stat.text"
					class="tw-flex tw-flex-col tw-items-center tw-gap-0.5 tw-text-center lg:tw-flex-row"
					data-testid="bp-global-impact-stat"
				>
					<component :is="stat.icon" class="tw-w-2.5 tw-h-2.5 tw-shrink-0" aria-hidden="true" />
					<span class="tw-text-button-link tw-whitespace-pre-line lg:tw-whitespace-normal">
						{{ stat.text }}
					</span>
				</li>
			</ul>
		</kv-page-container>
	</section>
</template>

<script>
import { KvPageContainer } from '@kiva/kv-components';
import ExperienceIcon from '#src/assets/icons/inline/global-impact-experience.svg';
import FundedIcon from '#src/assets/icons/inline/global-impact-funded.svg';
import ReachedIcon from '#src/assets/icons/inline/global-impact-reached.svg';
import LendersIcon from '#src/assets/icons/inline/global-impact-lenders.svg';

// Fixed figures: Product confirmed the bar shows static copy, not live stats
const STATS = [
	{ icon: ExperienceIcon, text: '20 years of experience' },
	{ icon: FundedIcon, text: '$2.4 billion loans funded' },
	{ icon: ReachedIcon, text: '6 million people reached' },
	// The line break keeps the last cell two lines tall below the desktop breakpoint, like the other three
	{ icon: LendersIcon, text: '2.3 million\nlenders' },
];

export default {
	name: 'GlobalImpactBar',
	components: {
		KvPageContainer,
	},
	setup() {
		return { stats: STATS };
	},
};
</script>
