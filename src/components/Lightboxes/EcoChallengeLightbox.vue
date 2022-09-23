<template>
	<kv-lightbox
		:visible="visible"
		title="Added to basket!"
		@lightbox-closed="closeLightbox"
	>
		<div class="tw-flex tw-justify-between tw-items-center">
			<h2 class="tw-pb-3 tw-pr-5 tw-basis-9/12" v-if="missingMilestones.length === 0">
				Way to go! You’re all set to complete the Climate Challenge.
			</h2>
			<h2 class="tw-pb-3 tw-pr-5 tw-basis-9/12" v-else>
				Alright! Now you just need to make a {{ categoriesMissingString }} loan to complete the challenge.
			</h2>
			<div class="tw-pb-3 tw-flex tw-justify-between tw-pr-4 tw-basis-1/3">
				<div
					class="tw-flex tw-flex-col tw-items-center"
					v-for="(step, index) in milestoneSteps"
					:key="index"
				>
					<kv-material-icon
						class="tw-w-6 tw-h-6 tw-text-brand"
						:icon="mdiCheckCircle"
						v-if="!isStepMissing(step.name)"
					/>
					<kv-material-icon
						class="tw-w-6 tw-h-6 tw-text-secondary"
						:icon="mdiCheckboxBlankCircleOutline"
						v-else
					/>
					<span class="tw-text-small tw-font-medium">{{ step.title }}</span>
				</div>
			</div>
		</div>
		<div
			:class="[
				'tw-bg-brand-200',
				'tw-p-4 tw-rounded',
				'tw-flex'

			]"
			v-if="missingMilestones.length !== 0"
		>
			<div class="tw-flex tw-rounded tw-h-12 tw-w-12 tw-bg-primary tw-p-1 tw-mr-2">
				<icon-climate-challenge class="tw-h-full tw-w-full" />
			</div>
			<div
				:class="['tw-grow tw-items-center tw-justify-between',
					'tw-flex tw-flex-wrap md:tw-flex-nowrap']"
				v-for="(step, index) in firstMissingMilestoneStep"
				:key="index"
			>
				<div class="tw-mr-2">
					<h4
						class="tw-text-h4"
					>
						{{ missingMilestones.length === 1 ? 'Last' : 'Next' }} Step
					</h4>
					<h3>
						Find a loan for {{ step.name | changeCase('noCase') }}!
					</h3>
				</div>
				<kv-button class="tw-mt-2 tw-flex-none" :to="step.url" :key="index">
					{{ step.buttonText }}
				</kv-button>
			</div>
		</div>
		<template #controls>
			<kv-button to="/basket" v-if="missingMilestones.length === 0">
				Continue to Checkout
			</kv-button>
			<kv-text-link
				v-else
				:icon="mdiArrowRight"
				href="/basket"
			>
				Or continue to checkout
			</kv-text-link>
		</template>
	</kv-lightbox>
</template>

<script>
import IconClimateChallenge from '@/assets/icons/inline/eco-challenge/globe-leaf.svg';
import {
	mdiArrowRight,
	mdiCheckboxBlankCircleOutline,
	mdiCheckCircle
} from '@mdi/js';
import { joinArray } from '@/util/joinArray';
import { missingMilestones } from '@/util/ecoChallengeUtils';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'EcoChallengeLightbox',
	components: {
		IconClimateChallenge,
		KvButton,
		KvLightbox,
		KvMaterialIcon,
		KvTextLink,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		progresses: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			mdiArrowRight,
			mdiCheckboxBlankCircleOutline,
			mdiCheckCircle,
			milestoneSteps: [
				{
					name: 'sustainable-agriculture',
					title: 'Agriculture',
					url: '/lend-by-category/eco-friendly#carousel-sustainable-agriculture',
					buttonText: 'Find an agriculture loan',
				},
				{
					name: 'recycle-reuse',
					title: 'Recycle',
					url: '/lend-by-category/eco-friendly#carousel-recycle-and-re-use',
					buttonText: 'Find a recycling loan',
				},
				{
					name: 'solar',
					title: 'Solar',
					url: '/lend-by-category/eco-friendly#carousel-solar-energy',
					buttonText: 'Find a solar loan',
				}
			]
		};
	},
	computed: {
		missingMilestones() {
			return missingMilestones(this.progresses, 'climate-challenge');
		},
		categoriesMissingString() {
			const milestoneNames = this.missingMilestones.map(milestone => milestone.milestoneName);
			return joinArray(milestoneNames).replaceAll('-', ' ');
		},
		firstMissingMilestoneStep() {
			return this.milestoneSteps.filter(step => step.name === this.missingMilestones[0].milestoneName) ?? [];
		},
	},
	methods: {
		closeLightbox() {
			this.$emit('close-lightbox');
		},
		isStepMissing(stepName) {
			if (this.missingMilestones.find(missingStep => missingStep.milestoneName === stepName)) {
				return true;
			}
			return false;
		},
	},
};
</script>
