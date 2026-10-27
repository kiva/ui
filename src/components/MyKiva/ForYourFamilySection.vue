<template>
	<section>
		<h2 class="tw-text-primary tw-mb-2 !tw-text-title">
			For your family
		</h2>
		<div
			class="tw-grid tw-grid-cols-1 tw-gap-2 lg:tw-gap-4"
			:class="hideBdayCard ? 'md:tw-grid-cols-2' : 'md:tw-grid-cols-3'"
		>
			<div
				v-for="card in cards"
				:key="card.key"
				class="tw-bg-white tw-rounded tw-shadow tw-p-2 tw-flex tw-flex-col tw-gap-2 tw-items-center"
			>
				<div class="tw-flex tw-flex-col tw-gap-1.5 tw-text-center tw-text-action-highlight">
					<h3 class="tw-text-title">
						{{ card.title }}
					</h3>
					<p v-if="card.body" class="tw-text-base">
						{{ card.body }}
					</p>
				</div>
				<div class="tw-grow tw-flex tw-items-center tw-justify-center tw-w-full">
					<img
						v-if="card.key === 'birthday'"
						:src="birthdayCandlesImg"
						alt="Lit birthday candles on a cake"
						class="tw-w-full tw-rounded-md tw-object-cover birthday-photo"
					>
					<div v-else-if="card.key === 'family'" class="illustration">
						<img :src="handsHeartSvg" alt="">
					</div>
					<div v-else class="illustration people">
						<img :src="personCatherineSvg" alt="" class="person catherine">
						<img :src="personAnaJuliaSvg" alt="" class="person ana-julia">
						<img :src="personAmanSvg" alt="" class="person aman">
					</div>
				</div>
				<KvButton
					:href="card.href"
					:variant="card.variant"
					class="tw-w-full"
					v-kv-track-event="['portfolio', 'click', card.trackingLabel]"
				>
					{{ card.ctaText }}
				</KvButton>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed } from 'vue';
import { KvButton } from '@kiva/kv-components';
import birthdayCandlesImg from '#src/assets/images/my-kiva/for-your-family/birthday-candles.jpg';
import handsHeartSvg from '#src/assets/images/my-kiva/for-your-family/hands-heart.svg?url';
import personCatherineSvg from '#src/assets/images/my-kiva/for-your-family/person-catherine.svg?url';
import personAnaJuliaSvg from '#src/assets/images/my-kiva/for-your-family/person-ana-julia.svg?url';
import personAmanSvg from '#src/assets/images/my-kiva/for-your-family/person-aman.svg?url';

defineOptions({ name: 'ForYourFamilySection' });

const props = defineProps({
	bdayCardName: {
		type: String,
		default: '',
	},
	bdayCardLinkOverride: {
		type: String,
		default: '',
	},
	lendLinkOverride: {
		type: String,
		default: '',
	},
	impactLinkOverride: {
		type: String,
		default: '',
	},
	hideBdayCard: {
		type: Boolean,
		default: false,
	},
});

const cards = computed(() => [
	!props.hideBdayCard && {
		key: 'birthday',
		title: props.bdayCardName ? `Happy birthday ${props.bdayCardName}!` : 'Happy birthday!',
		body: 'You have funds ready to lend.',
		ctaText: 'Get started',
		href: props.bdayCardLinkOverride || '/lend',
		variant: 'primary',
		trackingLabel: 'for-your-family-birthday',
	},
	{
		key: 'family',
		title: 'Involve the whole family.',
		body: 'Discuss how the borrower’s life differs from yours.',
		ctaText: 'Browse loans',
		href: props.lendLinkOverride || '/lend',
		variant: 'secondary',
		trackingLabel: 'for-your-family-browse-loans',
	},
	{
		key: 'impact',
		title: 'See who you helped anytime.',
		ctaText: 'View your impact',
		href: props.impactLinkOverride || '/portfolio',
		variant: 'secondary',
		trackingLabel: 'for-your-family-view-impact',
	},
].filter(Boolean));
</script>

<style lang="postcss" scoped>
.birthday-photo {
	max-width: 297px;
	aspect-ratio: 297 / 162;
	object-position: 50% 30%;
}

.illustration {
	@apply tw-relative tw-flex tw-items-center tw-justify-center tw-overflow-hidden;

	width: 128px;
	height: 128px;
}

.person {
	@apply tw-absolute tw-max-w-none;

	left: 50%;
	top: 50%;
}

.catherine {
	transform: translate(-50%, -50%) translate(-2.95px, -15.43px) rotate(2deg);
}

.ana-julia {
	transform: translate(-50%, -50%) translate(32.8px, 12.2px) rotate(4deg);
}

.aman {
	transform: translate(-50%, -50%) translate(-36.02px, 8.38px) rotate(-6.44deg);
}
</style>
