<template>
	<async-portfolio-section data-testid="education-module">
		<kv-grid class="tw-grid-cols-12 tw-items-center">
			<div
				class="tw-col-span-12 lg:tw-col-span-5 xl:tw-col-span-6 md:tw-items-start
					tw-flex tw-flex-col tw-items-center"
			>
				<div class="tw-mr-0 md:tw-mr-2 tw-bg-primary tw-h-12 tw-p-1 tw-rounded tw-w-12">
					<img class="tw-w-10 tw-h-10" alt="Leaf heart" :src="leafHeartUrl">
				</div>
				<h2 class="tw-mb-0.5 md:tw-text-left tw-text-center">
					Donations power progress
				</h2>
				<p class="tw-text-subhead md:tw-text-left tw-text-center">
					<!-- eslint-disable-next-line max-len -->
					Every dollar donated to Kiva helps bring us one step closer to financial access for all. See what we’ve achieved with your support.
				</p>
			</div>
			<div class="tw-col-span-12 lg:tw-col-span-7 xl:tw-col-span-6">
				<education-post :post="post" />
			</div>
		</kv-grid>
	</async-portfolio-section>
</template>

<script>
import { KvGrid } from '@kiva/kv-components';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import EducationPost from './EducationPost';
import leafHeartUrl from '#src/assets/images/leaf_heart.svg?url';

export default {
	name: 'EducationModule',
	props: {
		post: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			leafHeartUrl,
		};
	},
	components: {
		AsyncPortfolioSection,
		EducationPost,
		KvGrid,
	},
};
</script>
