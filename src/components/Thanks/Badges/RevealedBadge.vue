<template>
	<div
		class="tw-relative tw-z-2 tw-pt-4 tw-pb-5 tw-bg-stone-1 tw-text-center"
	>
		<h1
			class="tw-mb-1 tw-relative tw-z-2 tw-text-black"
		>
			Congrats!
		</h1>
		<p
			class="tw-text-subhead tw-px-3 md:tw-px-8 tw-relative tw-z-2 tw-text-black"
		>
			You earned your first badge
		</p>
		<div class="tw-relative tw-mt-3">
			<div class="badge-container tw-flex-col">
				<div class="tw-relative tw-z-1">
					<div
						class="tw-absolute tw-h-full tw-z-docked tw-left-1/2 -tw-translate-x-1/2"
					>
						<animated-stars :style="{ minWidth: '14rem'}" class="tw-h-full" />
					</div>

					<img
						:src="imageRequire('equity-badge.svg')"
						class="badge tw-z-2"
						alt="Gift icon"
					>
				</div>
			</div>
		</div>
		<div
			class="tw-relative tw-z-2 tw-px-3"
		>
			<p class="tw-pb-4">
				<!-- eslint-disable-next-line max-len -->
				You made a difference! Thanks to your contribution we are one step closer to a more financially inclusive world.
			</p>
			<kv-button
				class="tw-w-full tw-mb-2"
				@click="$emit('show-discover-badges')"
				v-kv-track-event="[
					'thanks',
					'click',
					'discover-more-badges',
				]"
			>
				Discover more badges
			</kv-button>
			<div>
				<kv-button
					v-if="!isGuest"
					class="tw-w-full no-border"
					to="/portfolio"
					variant="secondary"
					v-kv-track-event="[
						'thanks',
						'click',
						'go-to-my-kiva',
						'Button seen after badge reveal'
					]"
				>
					Go to my kiva
				</kv-button>
				<div
					v-else
					class="option-box"
					:class="{'open' : openCreateAccount}"
					@click="() => openCreateAccount = !openCreateAccount"
					v-kv-track-event="[
						'thanks',
						'click',
						'open-account-creation-drawer',
					]"
				>
					<p class="tw-font-medium">
						Create your account
					</p>
					<kv-material-icon
						:icon="mdiChevronDown"
						class="expandable-button"
						:class="{'tw-rotate-180' : openCreateAccount}"
					/>
				</div>
				<kv-expandable
					v-show="openCreateAccount"
					easing="ease-in-out"
				>
					<div class="tw-py-2">
						<h2>Before you go!</h2>
						<!-- eslint-disable-next-line max-len -->
						<p>Finish setting up your account to track and relend your money as you are paid back.</p>
						<guest-account-creation
							class="tw-pt-3 account-creation"
							event-category="thanks"
							event-label="open-account-creation-drawer"
						/>
					</div>
				</kv-expandable>
			</div>
		</div>
	</div>
</template>

<script>
import KvExpandable from '#src/components/Kv/KvExpandable';
import AnimatedStars from '#src/components/Thanks/AnimatedStars';
import { mdiChevronDown } from '@mdi/js';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import KvButton from '@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import { metaGlobReader } from '#src/util/importHelpers';

const imageGlob = import.meta.glob('/src/assets/images/thanks-page/*.*', { eager: true, query: '?url' });
const imageRequire = metaGlobReader(imageGlob, '/src/assets/images/thanks-page/');

export default {
	name: 'RevealedBadge',
	components: {
		KvButton,
		KvMaterialIcon,
		KvExpandable,
		AnimatedStars,
		GuestAccountCreation,
	},
	props: {
		isGuest: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			imageRequire,
			mdiChevronDown,
			openCreateAccount: false,
		};
	}
};
</script>

<style lang="postcss" scoped>

.expandable-button {
	@apply tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500;
}

.badge {
	width: 180px;
	height: 185px;
}

.badge-container {
	width: 228px;
	height: 233px;
	@apply tw-flex tw-items-center tw-justify-center tw-mx-auto tw-rounded-lg;
}

.no-border :deep(span) {
	@apply tw-bg-transparent tw-border-0;
}

.account-creation :deep(input) {
	@apply tw-bg-stone-1;
}

.option-box {
	transition: border 0.2s ease, border-radius 0.5s ease;
	@apply tw-w-full tw-border tw-rounded tw-flex tw-justify-between tw-cursor-pointer tw-py-2 tw-px-3;
}

</style>
