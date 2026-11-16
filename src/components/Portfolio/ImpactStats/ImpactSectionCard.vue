<template>
	<section :aria-labelledby="title ? titleId : undefined">
		<KvCardFrame :allow-overflow="!flush">
			<div
				v-if="title"
				class="tw-flex tw-items-start tw-justify-between tw-gap-2
					tw-px-2.5 md:tw-px-3 tw-pt-2.5 md:tw-pt-3 tw-pb-2"
			>
				<div class="tw-flex tw-flex-col tw-gap-0.5 tw-min-w-0">
					<h3 :id="titleId" class="tw-text-h4 tw-text-primary">
						{{ title }}
					</h3>
					<div
						v-if="subtitle || $slots.subtitle"
						class="tw-text-caption tw-text-secondary"
						data-testid="impact-section-subtitle"
					>
						<slot name="subtitle">
							{{ subtitle }}
						</slot>
					</div>
				</div>
				<KvPill
					v-if="$slots.pill"
					variant="muted"
					size="small"
					class="tw-shrink-0"
					data-testid="impact-section-pill"
				>
					<slot name="pill"></slot>
				</KvPill>
			</div>
			<div :class="bodyClass">
				<slot></slot>
			</div>
		</KvCardFrame>
	</section>
</template>

<script setup>
import { computed, useId } from 'vue';
import { KvCardFrame, KvPill } from '@kiva/kv-components';

defineOptions({ name: 'ImpactSectionCard' });

const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	subtitle: {
		type: String,
		default: '',
	},
	/**
	 * Drops the body padding and clips the body to the card's rounded corners
	 */
	flush: {
		type: Boolean,
		default: false,
	},
});

const titleId = `impact-section-title-${useId()}`;

const bodyClass = computed(() => {
	if (props.flush) return '';
	return ['tw-px-2.5 md:tw-px-3 tw-pb-2.5 md:tw-pb-3', { 'tw-pt-2.5 md:tw-pt-3': !props.title }];
});
</script>
