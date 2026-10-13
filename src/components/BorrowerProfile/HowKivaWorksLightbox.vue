<template>
	<Teleport to="#teleports">
		<kv-lightbox
			:visible="visible"
			title="How it works"
			@lightbox-closed="$emit('lightbox-closed')"
		>
			<template #header>
				<p class="tw-text-base tw-text-primary">
					How it works
				</p>
			</template>
			<div class="tw-flex tw-flex-col tw-gap-3">
				<div class="tw-flex tw-flex-col tw-gap-1">
					<h2 class="tw-text-headline tw-text-primary">
						Helping one person after another
					</h2>
					<p class="tw-text-primary">
						Kiva connects financially underserved communities with impact-focused loans.
						As they repay, you can lend that money again.
					</p>
				</div>
				<!-- Mounted only while open so the animation starts from the beginning each time -->
				<revolving-fund-animation v-if="visible" class="tw-mx-auto" />
			</div>
		</kv-lightbox>
	</Teleport>
</template>

<script>
import { KvLightbox } from '@kiva/kv-components';
import RevolvingFundAnimation from '#src/components/BorrowerProfile/RevolvingFundAnimation';

export default {
	name: 'HowKivaWorksLightbox',
	components: {
		KvLightbox,
		RevolvingFundAnimation,
	},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['lightbox-closed'],
};
</script>
