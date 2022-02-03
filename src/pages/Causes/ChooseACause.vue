<template>
	<www-page
		main-class="kv-tailwind"
	>
		<section>
			<div :class="[
				'tw-mx-auto',
				'tw-px-3',
				'tw-max-w-md',
				'tw-mt-6',
				'tw-mb-14'
			]"
			>
				<h2 class="tw-mb-4">
					What do you want to support today?
				</h2>
				<a :href="button.target"
					v-for="(button, index) in buttons"
					:key="index"
					:class="[
						'tw-bg-secondary',
						'tw-rounded',
						'tw-py-2',
						'tw-mb-1.5',
						'tw-w-full',
						'tw-text-left',
						'tw-flex',
						'tw-items-center',
						'hover:tw-no-underline',
						'focus:tw-no-underline',
						'tw-inline-block']"
				>
					<img
						class="tw-h-4 tw-w-4 tw-mx-2"
						:src="causesIconImgRequire(button.icon)"
					>
					<div class="tw-flex-grow">
						<h3 class="tw-text-primary">{{ button.cause }}</h3>
						<span class="tw-text-tertiary">{{ button.tagline }}</span>
					</div>
					<kv-material-icon
						class="tw-w-5 tw-h-5 tw-align-middle tw-text-tertiary tw-mr-3"
						:icon="mdiChevronRight"
					/>
				</a>
			</div>
		</section>
	</www-page>
</template>

<script>

import WwwPage from '@/components/WwwFrame/WwwPage';
import { mdiChevronRight } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const causesIconImgRequire = require.context('@/assets/images/causes-icons/', true);

export default {
	components: {
		WwwPage,
		KvMaterialIcon,
	},
	data() {
		return {
			buttons: [
				{
					cause: 'Climate',
					tagline: 'Take action',
					target: '/lp/choose-a-cause-climate',
					icon: './windmill-icon.svg',
					analytics: ['causes', 'choose-a-cause_cta-button', 'climate']
				},
				{
					cause: 'Women',
					tagline: 'Break barriers',
					target: '/lp/choose-a-cause-women',
					icon: './jill-icon.svg',
					analytics: ['causes', 'choose-a-cause_cta-button', 'women']
				},
				{
					cause: 'Education',
					tagline: 'Fund a future ',
					target: '/lp/choose-a-cause-education',
					icon: './puzzle-icon.svg',
					analytics: ['causes', 'choose-a-cause_cta-button', 'education']
				}
			],
			mdiChevronRight,
			causesIconImgRequire,
		};
	},
};
</script>

<style lang="scss">
</style>
