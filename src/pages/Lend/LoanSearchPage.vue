<template>
	<www-page id="lend-filter-alpha">
		<article class="tw-bg-secondary tw-relative tw-pt-6">
			<div>
				<kv-page-container>
					<div class="tw-flex tw-items-start tw-pb-8">
						<div class="tw-flex-1">
							<h1 class="tw-mb-2">
								Make a loan, change a life
							</h1>
							<span class="better-future md:tw-w-2/3 tw-mb-3p tw-hidden md:tw-block">
								Each Kiva loan helps people build a better future for themselves and their families.
							</span>
						</div>
						<button class="tw-mb-2 tw-mt-3 tw-border-r tw-border-tertiary tw-px-1 md:tw-px-2">
							<kv-material-icon :icon="mdiEarth" class="tw-text-secondary tw-w-3 tw-h-3" />
							<p class="text-gray tw-hidden md:tw-block">
								Explore
							</p>
						</button>
						<button class="tw-mb-2  tw-mt-3 tw-px-1 md:tw-px-2">
							<kv-material-icon :icon="mdiFilter" class="tw-text-brand tw-w-3 tw-h-3" />
							<p class="text-gray tw-hidden md:tw-block">
								Filters
							</p>
						</button>
					</div>
					<loan-search-interface />
				</kv-page-container>
			</div>
		</article>
		<!-- <aside>Similar loans</aside> -->
	</www-page>
</template>

<script>

import WwwPage from '@/components/WwwFrame/WwwPage';
import LoanSearchInterface from '@/components/Lend/LoanSearch/LoanSearchInterface';
import { mdiEarth, mdiFilter } from '@mdi/js';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		WwwPage,
		KvPageContainer,
		KvMaterialIcon,
		LoanSearchInterface
	},
	data() {
		return {
			mdiEarth,
			mdiFilter
		};
	},
};
</script>

<style lang="scss" scoped>
	.better-future{
		font-size: 1.5rem;
		color: gray;
		font-weight: bolder;
		letter-spacing: -1px;
		line-height: 1.75rem;
	}
	.text-gray{
		color: gray;
	}
</style>
