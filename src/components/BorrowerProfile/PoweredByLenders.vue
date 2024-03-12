<template>
	<div class="tw-flex tw-items-center tw-mb-1.5">
		<div class="tw-flex tw-shrink-0">
			<img
				v-for="(lender, i) in participationLendersDisplayed"
				:key="lender.id"
				:src="lender.image.url"
				alt="Lender photo"
				class="
					data-hj-suppress
					tw-inline-block
					tw-w-4
					tw-h-4
					tw-rounded-full
					tw-overflow-hidden
					tw-border
					tw-border-white
					tw-object-fill
					tw-relative
				"
				:class="{ 'tw--ml-2': i > 0, 'tw-border-gray-200': lender.isLegacyPlaceholder }"
				:style="{ 'z-index': participationLendersDisplayed.length - i }"
			>
		</div>
		<p class="tw-px-1 tw-text-base">
			Powered by {{ participantsText }}
		</p>
	</div>
</template>

<script>
import { isLegacyPlaceholderAvatar } from '@/util/imageUtils';

export default {
	name: 'PoweredByLenders',
	props: {
		participants: {
			type: Object,
			required: true,
			default: () => ({})
		}
	},
	computed: {
		participantsNumber() {
			return this.participants?.values?.length ?? 0;
		},
		participantsText() {
			return this.participantsNumber === 1
				? `${this.participantsNumber} lender`
				: `${this.participantsNumber} lenders`;
		},
		participationLendersDisplayed() {
			return (this.participants?.values ?? []).map(p => ({
				...p.lender,
				isLegacyPlaceholder: isLegacyPlaceholderAvatar(p.lender.image?.url.split('/').pop()),
			})).filter(l => l.image).slice(0, 5);
		}
	},
};
</script>
