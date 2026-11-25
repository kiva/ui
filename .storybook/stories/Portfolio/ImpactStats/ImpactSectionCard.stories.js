import { KvLoadingPlaceholder, KvLoadingText } from '@kiva/kv-components';
import ImpactSectionCard from '#src/components/Portfolio/ImpactStats/ImpactSectionCard';

export default {
	title: 'Portfolio/ImpactStats/ImpactSectionCard',
};

const body = `<p class="tw-text-base">
	You've lent in 7 countries across 4 regions. Lending in more places spreads your impact further.
</p>`;
const pill = '<template #pill>7 of 32 countries</template>';
const loadingBody = '<template #loading><kv-loading-text :lines="3" /></template>';
const geographicReach = { title: 'Geographic Reach', subtitle: 'Countries where you have lent' };

const story = ({ props = {}, slots = '' } = {}) => {
	const template = () => ({
		components: { ImpactSectionCard, KvLoadingPlaceholder, KvLoadingText },
		setup: () => ({ props }),
		template: `<div style="max-width: 757px;">
			<impact-section-card v-bind="props">${slots}</impact-section-card>
		</div>`,
	});
	return template.bind({});
};

const desktop = { viewport: { defaultViewport: 'largeBreakpoint' } };

const ready = { props: geographicReach, slots: `${body}${pill}` };
const loading = { props: { ...geographicReach, loading: true }, slots: `${body}${pill}${loadingBody}` };
const loadingSlottedSubtitle = {
	props: { title: 'Your first loan on Kiva', loading: true },
	slots: `${body}${loadingBody}<template #subtitle>You lent to Rosa M on March 13, 2020</template>`,
};
const error = { props: { ...geographicReach, error: true }, slots: `${body}${pill}` };
const flush = {
	props: { ...geographicReach, flush: true },
	slots: `<kv-loading-placeholder style="height: 320px;" />${pill}`,
};
const untitled = { props: {}, slots: body };
const longTitle = {
	props: { title: 'By Lending Partner and other long section titles' },
	slots: `${body}<template #pill>7 partners</template>`,
};

export const Ready = story(ready);
Ready.parameters = desktop;

export const Loading = story(loading);
Loading.parameters = desktop;

export const LoadingSlottedSubtitle = story(loadingSlottedSubtitle);
LoadingSlottedSubtitle.parameters = desktop;

export const Error = story(error);
Error.parameters = desktop;

export const Flush = story(flush);
Flush.parameters = desktop;

export const Untitled = story(untitled);
Untitled.parameters = desktop;

export const LongTitle = story(longTitle);
LongTitle.parameters = desktop;
