<template>
	<div class="tw-flex tw-items-center tw-mb-1.5">
		<div class="tw-flex tw-shrink-0 tw-items-end" data-testid="participation-lenders">
			<kv-user-avatar
				:key="lender.id"
				v-for="(lender, i) in participationLendersDisplayed"
				:lender-name="lender.name"
				:lender-image-url="lender.image.url"
				:is-small="true"
				:class="{ 'tw--ml-1': i > 0 }"
				:style="{ 'z-index': participationLendersDisplayed.length - i }"
			/>
		</div>
		<p class="tw-px-1 tw-text-base">
			Powered by {{ participantsText }}
		</p>
	</div>
</template>

<script>
import { isLegacyPlaceholderAvatar } from '@/util/imageUtils';
import KvUserAvatar from '~/@kiva/kv-components/vue/KvUserAvatar';

export default {
	name: 'PoweredByLenders',
	components: {
		KvUserAvatar
	},
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
