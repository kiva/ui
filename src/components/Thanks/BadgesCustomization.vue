<template>
	<div
		class="md:tw-my-6 md:tw-rounded tw-mx-auto tw-overflow-x-hidden tw-h-full tw-bg-stone-1"
		:style="{maxWidth: '620px', minHeight: '1012px'}"
		:class="{'container-shadow': !showNewBg}"
	>
		<div class="new-background tw-h-0 tw-w-0" :class="{ 'grow': newBgActive }"></div>
		<transition-group name="fade" tag="div">
			<FirstScreen
				key="first-screen"
				v-if="newScreenSteps === 0"
				:lender="lender"
				:loans="loans"
				:is-guest="isGuest"
				:selected-loan="selectedLoan"
				:receipt="receipt"
				@show-discover-badges="showDiscoverBadges"
				@show-new-bg="showNewBg"
			/>
			<RevealedBadge
				key="revealed-badge-screen"
				@show-discover-badges="showDiscoverBadges"
				v-if="newScreenSteps === 1"
				:is-guest="isGuest"
			/>
			<DiscoverSection
				v-if="newScreenSteps === 2"
				key="discover-screen"
				:selected-loan-region="selectedLoanRegion"
				:is-guest="isGuest"
				:badges="randomSortedBadges"
				@back="() => newScreenSteps -= 1"
				@select-badge="selectBadge"
			/>
			<DetailSection
				v-if="newScreenSteps === 3"
				key="detail-screen"
				:selected-badge="selectedBadge"
				:badges="randomSortedBadges"
				:is-guest="isGuest"
				@back="() => newScreenSteps -= 1"
			/>
		</transition-group>
	</div>
</template>

<script>
import confetti from 'canvas-confetti';
import DiscoverSection from '@/components/Thanks/Badges/DiscoverSection';
import DetailSection from '@/components/Thanks/Badges/DetailSection';
import FirstScreen from '@/components/Thanks/Badges/FirstScreen';
import RevealedBadge from '@/components/Thanks/Badges/RevealedBadge';

export default {
	name: 'BadgesCustomization',
	components: {
		FirstScreen,
		DiscoverSection,
		DetailSection,
		RevealedBadge,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		selectedLoan: {
			type: Object,
			default: () => ({})
		},
		isGuest: {
			type: Boolean,
			default: false
		},
		lender: {
			type: Object,
			default: () => ({})
		},
		loans: {
			type: Array,
			default: () => ([])
		},
		receipt: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			isBlurred: true,
			isMobileLayout: false,
			wiggle: false,
			badgeBlurRevealing: false,
			badgeBlurRevealCompleted: false,
			discoverBadges: false,
			newScreenSteps: 0,
			selectedBadge: '',
			defaultSortBadges: [
				{
					id: 2,
					name: 'Climate',
					img: 'climate'
				},
				{
					id: 3,
					name: 'Women',
					img: 'women'
				},
				{
					id: 4,
					name: 'U.S. Entrepreneurs',
					img: 'entrepreneurs'
				},
				{
					id: 5,
					name: 'Refugees',
					img: 'refugees'
				},
				{
					id: 6,
					name: 'Most Vulnerable',
					img: 'most-vulnerable'
				}
			],
			newBgActive: false,
		};
	},
	computed: {
		randomSortedBadges() {
			const badges = [...this.defaultSortBadges];
			return badges.sort(() => Math.random() - 0.5);
		},
		selectedLoanRegion() {
			return this.selectedLoan?.geocode?.country?.region ?? '';
		}
	},
	methods: {
		hash(loan) {
			return loan?.image?.hash ?? '';
		},
		showDiscoverBadges() {
			this.newScreenSteps = 2;
		},
		selectBadge(badgeName) {
			this.newScreenSteps += 1;
			this.selectedBadge = badgeName;
		},
		showNewBg() {
			this.newBgActive = true;
		},
	},
	created() {
		this.defaultSortBadges.unshift(
			{
				id: 1,
				name: this.selectedLoan?.geocode?.country?.region,
				img: 'region'
			}
		);
		this.$kvTrackEvent('thanks', 'view', 'equity badge', this.isGuest ? 'guest' : 'signed-in');
	},
	mounted() {
		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150,
			spread: 200,
			colors: ['#6AC395', '#223829', '#95D4B3'],
			disableForReducedMotion: true,
		});
	},
};
</script>

<style lang="postcss" scoped>

.expandable-button {
	@apply tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500;
}

.ghost-button >>> span {
	@apply tw-bg-transparent tw-border-black;
}

.no-border >>> span {
	@apply tw-bg-transparent tw-border-0;
}

.account-creation >>> input {
	@apply tw-bg-stone-1;
}

.secondary-container {
	@apply tw-bg-stone-1 tw-w-full tw-px-3 md:tw-px-8 tw-z-1 tw-pt-3;
}

.option-box {
	transition: border 0.2s ease, border-radius 0.5s ease;
	@apply tw-w-full tw-border tw-rounded tw-flex tw-justify-between tw-cursor-pointer tw-py-2 tw-px-3;
}

.social-share >>> .share__social.social {
	@apply tw-w-full;
}

.option-box.open {
	@apply tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-rounded-none;
}

.hide-for-print {
	@apply print:tw-hidden;
}

.badge-container {
	box-shadow: 0 4px 12px 0 #00000014;
	transition: filter 0.3s ease;
	width: 228px;
	height: 233px;
	background-color: #F3F1EF33;
	@apply tw-flex tw-items-center tw-justify-center tw-mx-auto tw-rounded-lg;
}

.badge {
	width: 180px;
	height: 185px;
	transition: filter 2s ease;
}

.blurred {
	filter: blur(8px);
}

.reveal-button {
	@apply tw-absolute tw-bottom-3;
}

.reveal-button >>> span {
	opacity: 90%;
	@apply tw-border-black;
}

@keyframes wiggle {
	0% {
		transform: rotate(0deg);
		filter: blur(8px);
	}

	25% {
		transform: rotate(-10deg);
	}

	50% {
		transform: rotate(10deg);
		filter: blur(2px);
	}

	75% {
		transform: rotate(-10deg);
	}

	100% {
		transform: rotate(0deg);
		filter: blur(8px);
	}
}

.wiggle {
	animation: wiggle 1s ease-in-out;
}

.new-background {
	transition: all 1s ease-in-out;
	@apply tw-bg-stone-1 tw-absolute tw-top-1/2 tw-left-1/2 tw-w-0 tw-h-0 tw-z-1;
}

.grow {
	@apply tw-w-full tw-h-full tw-top-0 tw-left-0 tw-transform-none;
}

.fade-enter-active {
	transition: opacity 1s;
}

.fade-enter {
	@apply tw-opacity-0;
}

.container-shadow {
	box-shadow: 0 5px 25px 0px #D1DCD6
}

.grow {
	@apply tw-w-full tw-h-full tw-top-0 tw-left-0 tw-transform-none;
}

</style>
