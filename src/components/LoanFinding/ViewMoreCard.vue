<template>
	<div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full">
		<div class="tw-flex tw-flex-col tw-gap-y-2" style="max-width: 186px;">
			<img
				class="tw-w-4 tw-h-4 tw-mx-auto"
				alt="View More Glass"
				:src="viewMoreGlassUrl"
			>
			<p class="tw-text-subhead tw-text-center">
				View more loans that match your filters on our search page
			</p>
			<kv-button
				:to="viewMoreLink"
				v-kv-track-event="['event-tracking', 'click', 'qf-mobile-view-more']"
			>
				<span class="tw-flex tw-items-center">
					View more
					<kv-material-icon class="tw-ml-1" :icon="mdiArrowRight" />
				</span>
			</kv-button>
		</div>
	</div>
</template>

<script>
import { mdiArrowRight } from '@mdi/js';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import filterConfig from '#src/util/loanSearch/filterConfig';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import viewMoreGlassUrl from '#src/assets/images/view_more_glass.svg?url';

export default {
	name: 'ViewMoreCard',
	components: {
		KvButton,
		KvMaterialIcon,
	},
	props: {
		loanSearchState: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			mdiArrowRight,
			viewMoreGlassUrl,
		};
	},
	computed: {
		viewMoreLink() {
			const filterParams = {
				...filterConfig.keys.reduce((prev, key) => { // eslint-disable-next-line max-len
					return { ...prev, ...filterConfig.config[key].getQueryFromFilter(this.loanSearchState, FLSS_QUERY_TYPE) };
				}, {})
			};
			const queryString = new URLSearchParams(filterParams).toString();
			return `/lend/filter?${queryString}`;
		}
	}
};
</script>
