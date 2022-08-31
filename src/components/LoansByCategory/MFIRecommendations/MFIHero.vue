<template>
	<div class="tw-w-full">
		<div class="tw-flex tw-items-center tw-gap-1 tw-px-2 lg:tw-px-0">
			<!-- eslint-disable max-len -->
			<img class="tw-w-4 lg:tw-w-6" src="@/assets/images/mfi_recommendations/earth.svg" alt="mfi_recommendations">
			<h3 class="tw-text-h3 tw-text-primary tw-whitespace-nowrap">
				Field Partner Spotlight
			</h3>
			<hr class="tw-border-tertiary tw-w-full tw-ml-2 tw-hidden lg:tw-block">
		</div>
		<div class="tw-mt-2 lg:tw-mt-4 tw-px-2">
			<h2 class="tw-text-h2 tw-text-primary">
				Fundación Pro Mujer
			</h2>
			<h6 class="tw-text-subhead tw-text-primary">
				15 years with Kiva, 52,908 borrowers supported
			</h6>
		</div>
		<div class="tw-flex tw-flex-col lg:tw-flex-row tw-my-3">
			<div class="md:tw-w-2/3 md:tw-px-2 tw-relative">
				<!-- eslint-disable max-len -->
				<img class="md:tw-rounded tw-w-full" src="@/assets/images/mfi_recommendations/fundacionpromujer.jpg" alt="fundacionpromujer">
				<span
					class="tw-absolute tw-bottom-1 tw-left-3 tw-rounded tw-bg-tertiary
						tw-px-2 tw-py-1 tw-flex tw-items-center tw-text-h4"
				>
					<kv-material-icon
						class="tw-h-2.5 tw-w-2.5 tw-mr-0.5"
						:icon="mdiMapMarker"
					/>
					BOLIVIA
				</span>
			</div>
			<div class="lg:tw-w-1/3 lg:tw-pl-2 tw-pt-2 lg:tw-pt-0">
				<p class="tw-px-3 lg:tw-px-0">
					Fundación Pro Mujer provides so much more than loans to their borrowers.
					<a target="_blank" href="https://www.kiva.org/about/where-kiva-works/partners/59">Learn More</a>
				</p>

				<ul class="tw-mt-2 tw-px-2">
					<li class="tw-flex tw-items-center tw-gap-1">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" src="@/assets/images/mfi_recommendations/heart.svg" alt="Anti-poverty focus">
						<h4 class="tw-uppercase tw-text-h4">
							Anti-poverty focus
						</h4>
					</li>
					<li class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" src="@/assets/images/mfi_recommendations/support.svg" alt="Entrepreneurial support">
						<h4 class="tw-uppercase tw-text-h4">
							Entrepreneurial support
						</h4>
					</li>
					<li class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" src="@/assets/images/mfi_recommendations/empowerment.svg" alt="Family & Community Empowerment">
						<h4 class="tw-uppercase tw-text-h4">
							Family & Community Empowerment
						</h4>
					</li>
					<li class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" src="@/assets/images/mfi_recommendations/savings.svg" alt="Facilitation of savings">
						<h4 class="tw-uppercase tw-text-h4">
							Facilitation of savings
						</h4>
					</li>
					<li class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" src="@/assets/images/mfi_recommendations/client_voice.svg" alt="Client voice">
						<h4 class="tw-uppercase tw-text-h4">
							Client voice
						</h4>
					</li>
				</ul>
			</div>
		</div>
		<div>
			<p class="tw-text-primary tw-text-subhead tw-py-0 lg:tw-py-6 tw-mb-4 tw-px-2 lg:tw-px-0 tw-indent-4">
				Fundación Pro Mujer offers Bolivia’s most in-need women the holistic services
				they need to build livelihoods for themselves and futures for their families.
				They help borrowers with business training and personal development services and
				are one of the few parterns to offer low-cost, high-quality healthcare.
			</p>
		</div>
	</div>
</template>

<script>
import { mdiMapMarker } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'MFIHero',
	data() {
		return {
			mdiMapMarker
		};
	},
	components: {
		KvMaterialIcon
	}
};
</script>
