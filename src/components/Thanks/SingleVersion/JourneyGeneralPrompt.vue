<template>
	<div
		class="tw-rounded md:tw-rounded-lg tw-mx-auto tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4 tw-w-full
            print:!tw-hidden"
	>
		<BorrowerAvatarsContainer
			v-if="loansToDisplay.length && isOptedIn"
			:loans="loansToDisplay"
		/>
		<h2
			class="tw-text-center tw-text-primary"
			style="line-height: 1.25;"
		>
			<span
				v-if="isOptedIn"
			>
				Thank you! <br>
			</span>
			You’ve made progress toward your next achievement{{ isOptedIn ? '.' : '!' }}
		</h2>

		<JourneyImg
			class="tw-mx-auto tw-mt-2 md:tw-hidden tw-w-full"
		/>
		<JourneyDesktopImg
			class="tw-mx-auto tw-mt-2 tw-hidden md:tw-block tw-w-full"
		/>

		<KvButton
			class="tw-mt-2 tw-w-full"
			variant="primary"
			v-kv-track-event="[
				'post-checkout',
				'click',
				'continue-to-my-kiva',
				userType,
				'journeyGeneral'
			]"
			@click="handleClickContinue"
		>
			<span
				class="tw-flex tw-items-center tw-gap-0.5"
			>
				Continue
				<KvMaterialIcon
					:icon="mdiArrowRight"
				/>
			</span>
		</KvButton>
		<div class="tw-mt-2">
			<div
				class="tw-flex tw-items-center tw-justify-between tw-text-action print:!tw-hidden tw-cursor-pointer"
				:class="{ 'open' : openImpactJourneys }"
				@click="handleClickImpactJourneys"
			>
				<p class="tw-green-3 tw-text-base">
					What are achievements?
				</p>
				<KvMaterialIcon
					:icon="mdiChevronDown"
					class="tw-transition-transform tw-ease-in-out tw-duration-500"
					:class="{ 'tw-rotate-180' : openImpactJourneys }"
				/>
			</div>
			<KvExpandable
				easing="ease-in-out"
			>
				<div
					v-show="openImpactJourneys"
					class="tw-text-primary"
				>
					<p class="tw-pt-2">
						Achievements are your personal guide to making a difference.
						<br><br>
						Get inspired, track your progress, celebrate each level you reach,
						and easily see the real change you can make!
					</p>
				</div>
			</KvExpandable>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { mdiArrowRight, mdiChevronDown } from '@mdi/js';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import KvExpandable from '#src/components/Kv/KvExpandable';
import JourneyImg from '#src/assets/images/thanks-page/journey.svg';
import JourneyDesktopImg from '#src/assets/images/thanks-page/journey-desktop.svg';
import BorrowerAvatarsContainer from '#src/components/Thanks/BorrowerAvatarsContainer';
import useMyKivaHome from '#src/composables/useMyKivaHome';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const cookieStore = inject('cookieStore');

const router = useRouter();
const { portfolioPath } = useMyKivaHome(apollo, $kvTrackEvent, cookieStore);

const emit = defineEmits(['continue-as-guest']);

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	isOptedIn: {
		type: Boolean,
		default: false,
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
});

const openImpactJourneys = ref(false);

const userType = computed(() => (props.isGuest ? 'guest' : 'signed-in'));

const loansToDisplay = computed(() => props.loans.slice(0, 3));

const handleClickImpactJourneys = () => {
	openImpactJourneys.value = !openImpactJourneys.value;

	if (openImpactJourneys.value) {
		$kvTrackEvent(
			'post-checkout',
			'click',
			'show-whats-an-impact-journey',
			userType.value,
		);
	}
};

const handleClickContinue = () => {
	if (props.isGuest) {
		emit('continue-as-guest');
		return;
	}
	router.push(portfolioPath.value);
};
</script>

<style lang="postcss" scoped>
.smaller-borrower-avatar :deep(img) {
	height: 36px;
	width: 36px;
}
</style>
