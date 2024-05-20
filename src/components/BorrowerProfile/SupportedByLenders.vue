<template>
	<div
		class="tw-flex tw-items-center"
		:class="{'tw-mb-1.5': !minimal}"
	>
		<div class="tw-flex tw-shrink-0 tw-items-end" data-testid="participation-lenders">
			<kv-user-avatar
				:key="lender.id"
				v-for="(lender, i) in participationLendersDisplayed"
				:lender-name="lender.name"
				:lender-image-url="lender.image.url"
				is-small
				:class="{ 'tw--ml-1': i > 0, 'challenge-avatar': isChallenge }"
				:style="{ 'z-index': participationLendersDisplayed.length - i }"
			/>
		</div>
		<p v-if="!minimal" class="tw-px-1 tw-text-base">
			{{ supportText }}
		</p>
	</div>
</template>

<script>
import { isLegacyPlaceholderAvatar } from '#src/util/imageUtils';
import KvUserAvatar from '@kiva/kv-components/vue/KvUserAvatar';

export default {
	name: 'SupportedByLenders',
	components: {
		KvUserAvatar
	},
	props: {
		participants: {
			type: Object,
			required: true,
			default: () => ({})
		},
		isChallenge: {
			type: Boolean,
			default: false
		},
		minimal: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		participantsNumber() {
			return this.isChallenge
				? this.participants?.totalCount ?? 0
				: this.participants?.values?.length ?? 0;
		},
		participantsText() {
			// eslint-disable-next-line no-nested-ternary
			return this.isChallenge
				? this.participantsNumber === 1
					? `${this.participantsNumber} member`
					: `${this.participantsNumber} members`
				: this.participantsNumber === 1
					? `${this.participantsNumber} person`
					: `${this.participantsNumber} people`;
		},
		supportText() {
			return this.isChallenge
				? `${this.participantsText} participating`
				: `Supported by ${this.participantsText}`;
		},
		participationLendersDisplayed() {
			return (this.participants?.values ?? []).map(p => {
				const lender = p?.lender ?? p;
				return ({
					...lender,
					isLegacyPlaceholder: isLegacyPlaceholderAvatar(p.image?.url.split('/').pop()),
				});
			}).filter(l => l.image).slice(0, 5);
		}
	},
};
</script>

<style scoped lang="postcss">
.challenge-avatar {
	@apply tw-w-4;
}

.challenge-avatar :deep(div,)
.challenge-avatar :deep(img) {
	@apply tw-w-4 tw-h-4;
}
</style>
