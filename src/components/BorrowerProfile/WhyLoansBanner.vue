<template>
	<!-- 5% of the action colour; the opacity scale has no 5% step, so the value is spelled out -->
	<section class="tw-bg-action/[0.05] tw-rounded tw-px-2 tw-pt-3 tw-pb-2 lg:tw-px-3 lg:tw-pb-1">
		<h2
			class="tw-text-label tw-text-primary tw-mb-2 lg:tw-hidden"
			data-testid="bp-why-loans-heading"
		>
			Why loans?
		</h2>
		<ul class="tw-flex tw-flex-col tw-gap-2 lg:tw-grid lg:tw-grid-cols-3 lg:tw-gap-5">
			<li
				v-for="point in points"
				:key="point.title"
				class="tw-flex tw-flex-col tw-gap-1"
				data-testid="bp-why-loans-point"
			>
				<component
					:is="point.icon"
					class="tw-w-2.5 tw-h-2.5 tw-text-action"
					aria-hidden="true"
				/>
				<div class="tw-flex tw-flex-col tw-gap-0.5">
					<h3 class="tw-text-label lg:tw-text-button-link tw-text-primary">
						{{ point.title }}
					</h3>
					<p class="tw-text-caption tw-text-primary">
						{{ point.copy }}
					</p>
				</div>
			</li>
		</ul>
		<div class="tw-flex tw-justify-center lg:tw-justify-end tw-pt-2 lg:tw-pt-1">
			<button
				type="button"
				class="tw-inline-flex tw-items-center tw-gap-0.5 tw-text-label tw-text-action hover:tw-underline"
				data-testid="bp-why-loans-how-it-works"
				v-kv-track-event="['borrower-profile', 'click', 'how-kiva-works']"
				@click="$emit('how-it-works')"
			>
				How it works
				<kv-material-icon class="tw-w-2 tw-h-2 tw-shrink-0" :icon="mdiInformationOutline" />
			</button>
		</div>
	</section>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';
import DignityIcon from '#src/assets/icons/inline/why-loans-dignity.svg';
import QualityOfLifeIcon from '#src/assets/icons/inline/why-loans-quality-of-life.svg';
import RelendIcon from '#src/assets/icons/inline/why-loans-relend.svg';

const FALLBACK_NAME = 'this borrower';

// "Why loans" banner for the borrower profile (new user version); the parent opens the explainer
export default {
	name: 'WhyLoansBanner',
	components: {
		KvMaterialIcon,
	},
	props: {
		loan: {
			type: Object,
			default: () => ({}),
		},
	},
	emits: ['how-it-works'],
	data() {
		return {
			mdiInformationOutline,
		};
	},
	computed: {
		// A fully anonymized loan has no displayable name; a pii-anonymized one keeps its placeholder name
		displayName() {
			if (this.loan?.anonymizationLevel === 'full') return FALLBACK_NAME;
			return this.loan?.name || FALLBACK_NAME;
		},
		points() {
			return [
				{
					icon: DignityIcon,
					title: 'Dignity through lending',
					copy: `A loan goes beyond one-time support, helping ${this.displayName} invest in their own plans `
						+ 'and shape their future.',
				},
				{
					icon: QualityOfLifeIcon,
					title: '90% improved their quality of life',
					copy: 'These loans prioritize social impact through fair, non-predatory lending that supports '
						+ 'long-term success.',
				},
				{
					icon: RelendIcon,
					title: 'Your loan can help again',
					copy: `96% of Kiva loans are repaid. As ${this.displayName} repays, you can relend your money `
						+ 'to support someone else.',
				},
			];
		},
	},
};
</script>
