<template>
	<section :aria-labelledby="title ? titleId : undefined">
		<KvCardFrame :allow-overflow="!flush">
			<div
				v-if="title"
				class="tw-flex tw-items-start md:tw-items-center tw-justify-between tw-gap-2
					tw-px-2.5 md:tw-px-3 tw-pb-2"
				:class="flush ? 'tw-pt-2' : 'tw-pt-2.5 md:tw-pt-3'"
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
						<KvLoadingText v-if="loading && $slots.subtitle" />
						<slot v-else name="subtitle">
							{{ subtitle }}
						</slot>
					</div>
				</div>
				<KvPill
					v-if="$slots.pill && !showError"
					variant="muted"
					size="small"
					class="tw-shrink-0"
					data-testid="impact-section-pill"
				>
					<span v-if="loading" class="tw-inline-block tw-w-8">
						<KvLoadingText />
					</span>
					<slot v-else name="pill"></slot>
				</KvPill>
			</div>
			<div :class="bodyClass">
				<slot v-if="loading" name="loading"></slot>
				<div
					v-else-if="showError"
					role="alert"
					class="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-py-3 tw-text-center"
				>
					<KvMaterialIcon :icon="mdiAlertCircleOutline" class="tw-w-3 tw-h-3 tw-text-caution" />
					<p class="tw-text-base tw-text-primary">
						We couldn't load this right now.
					</p>
					<p class="tw-text-caption tw-text-secondary">
						Your loans are safe. Refresh the page to try again.
					</p>
				</div>
				<slot v-else></slot>
			</div>
		</KvCardFrame>
	</section>
</template>

<script setup>
import { computed, useId } from 'vue';
import { mdiAlertCircleOutline } from '@mdi/js';
import {
	KvCardFrame, KvLoadingText, KvMaterialIcon, KvPill,
} from '@kiva/kv-components';

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
	/**
	 * Shows the loading slot as the body, and loading text for the pill and a slotted subtitle
	 */
	loading: {
		type: Boolean,
		default: false,
	},
	error: {
		type: Boolean,
		default: false,
	},
});

const titleId = `impact-section-title-${useId()}`;

const showError = computed(() => props.error && !props.loading);

const bodyClass = computed(() => {
	if (props.flush && !showError.value) return '';
	return ['tw-px-2.5 md:tw-px-3 tw-pb-2.5 md:tw-pb-3', { 'tw-pt-2.5 md:tw-pt-3': !props.title }];
});
</script>
