<template>
	<div
		class="tw-rounded md:tw-rounded-lg tw-mx-auto tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-2 tw-w-full
            print:tw-shadow-transparent"
	>
		<div
			v-if="loansToDisplay.length && isOptedIn"
			class="tw-flex tw-items-center tw-justify-center"
		>
			<KvUserAvatar
				v-for="loan, index in loansToDisplay"
				:key="loan.id"
				:lender-name="loan?.name"
				:lender-image-url="loan?.image?.url"
				class="tw-rounded-full tw-shadow tw-border-white tw-border-2 tw-w-auto"
				:class="{ 'smaller-borrower-avatar': loansToDisplay.length > 2 && index !== 1 }"
				:style="{
					zIndex: index === 1 ? 2 : 1,
					marginRight: loansToDisplay.length > 2 && index === 0 ? '-22px' : '0',
					marginLeft: loansToDisplay.length > 1&& index === loansToDisplay.length - 1
						? '-22px' : '0',
				}"
			/>
		</div>
		<h2
			class="tw-text-center tw-text-primary"
		>
			<span
				v-if="isOptedIn"
			>
				Thank you! <br>
			</span>
			You’re making progress on your impact journey!
		</h2>

		<JourneyImg
			class="tw-mx-auto tw-mt-2"
		/>

		<KvButton
			class="tw-mt-2 tw-w-full"
			variant="primary"
			v-kv-track-event="[
				'post-checkout',
				'click',
				'continue-to-my-kiva',
				isGuest ? 'guest' : 'signed-in',
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
		<div class="tw-my-2">
			<div
				class="tw-flex tw-items-center tw-justify-between tw-text-action print:!tw-hidden tw-cursor-pointer"
				:class="{ 'open' : openImpactJourneys }"
				@click="handleClickImpactJourneys"
			>
				<p class="tw-green-3 tw-text-base">
					What are impact journeys?
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
				<p
					v-show="openImpactJourneys"
					class="tw-pt-2 tw-text-primary"
				>
					Impact journeys are your personal guide to making a difference.
					<br><br>
					Get inspired, track your progress, celebrate impact milestones,
					and easily see the real change you can make!
				</p>
			</KvExpandable>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { mdiArrowRight, mdiChevronDown } from '@mdi/js';
import { KvUserAvatar, KvButton, KvMaterialIcon } from '@kiva/kv-components';
import KvExpandable from '#src/components/Kv/KvExpandable';
import JourneyImg from '#src/assets/images/thanks-page/journey.svg';

const router = useRouter();

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

const loansToDisplay = computed(() => props.loans.slice(0, 3));

const handleClickImpactJourneys = () => {
	openImpactJourneys.value = !openImpactJourneys.value;
};

const handleClickContinue = () => {
	if (props.isGuest) {
		emit('continue-as-guest');
		return;
	}
	router.push('/portfolio');
};
</script>

<style lang="postcss" scoped>
.smaller-borrower-avatar :deep(img) {
	height: 36px;
	width: 36px;
}
</style>
