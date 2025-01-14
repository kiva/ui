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
				:is-opted-in="isOptedIn"
				:badges-achieved="badgesAchieved"
				@show-discover-badges="showDiscoverBadges"
				@show-new-bg="showNewBg"
			/>
			<RevealedBadge
				key="revealed-badge-screen"
				@show-discover-badges="showDiscoverBadges"
				v-else-if="newScreenSteps === 1"
				:is-guest="isGuest"
			/>
			<DiscoverSection
				v-else-if="newScreenSteps === 2"
				key="discover-screen"
				:selected-loan-region="selectedLoanRegion"
				:is-guest="isGuest"
				:badges="randomSortedBadges"
				@back="() => newScreenSteps -= 1"
				@select-badge="selectBadge"
			/>
			<DetailSection
				v-else-if="newScreenSteps === 3"
				key="detail-screen"
				:selected-badge-idx="selectedBadgeIdx"
				:badges="randomSortedBadges"
				:is-guest="isGuest"
				@back="() => newScreenSteps -= 1"
			/>
		</transition-group>
	</div>
</template>

<script>
import confetti from 'canvas-confetti';
import DiscoverSection from '#src/components/Thanks/Badges/DiscoverSection';
import DetailSection from '#src/components/Thanks/Badges/DetailSection';
import FirstScreen from '#src/components/Thanks/Badges/FirstScreen';
import RevealedBadge from '#src/components/Thanks/Badges/RevealedBadge';

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
		isOptedIn: {
			type: Boolean,
			default: false,
		},
		badgesAchieved: {
			type: Array,
			default: () => ([]),
		},
	},
	data() {
		return {
			newScreenSteps: 0,
			selectedBadgeId: 0,
			defaultSortBadges: [
				{
					id: 2,
					name: 'Climate',
					img: 'climate',
					description: 'Climate change is impacting unbanked and underserved populations the most.',
					goals: [
						'Complete 2 eco-friendly loans.',
						'Learn one cool thing about climate action'
					],
					category: {
						tags: ['#Eco-friendly', '#Sustainable Ag'],
					},
					count: 0,
					tracking: 'Climate',
				},
				{
					id: 3,
					name: 'Women',
					img: 'women',
					// eslint-disable-next-line max-len
					description: 'Over 50% of unbanked people worldwide are women, lacking access to financial services.',
					goals: [
						'Complete 2 loans for women',
						'Learn one cool thing about women',
					],
					category: {
						gender: 'female',
					},
					count: 0,
					tracking: 'Women',
				},
				{
					id: 4,
					name: 'U.S. Entrepreneurs',
					img: 'entrepreneurs',
					description: '1 in 10 U.S. adults are unbanked & roughly 1 in 4 are underbanked.',
					goals: [
						'Complete 2 loans for U.S. Entrepreneurs',
						'Learn one cool thing about U.S. Entrepreneurs',
					],
					category: {
						countryIsoCode: ['US', 'GU', 'VI', 'PR'],
						distributionModel: 'direct'
					},
					count: 0,
					tracking: 'U.S. Entrepreneurs',
				},
				{
					id: 5,
					name: 'Refugees',
					img: 'refugees',
					// eslint-disable-next-line max-len
					description: 'When people are forced to flee their homes and livelihoods, they also leave behind their financial security.',
					goals: [
						'Complete 2 loans for refugees',
						'Learn one cool thing about refugees',
					],
					category: {
						themes: ['Refugees/Displaced'],
					},
					count: 0,
					tracking: 'Refugees',
				},
				{
					id: 6,
					name: 'Most Vulnerable',
					img: 'most-vulnerable',
					// eslint-disable-next-line max-len
					description: 'Help families and communities access the medicine, surgeries and healthcare services they need.',
					goals: [
						'Complete 2 loans to help the most vulnerable',
						'Learn one cool thing about the most vulnerable populations on Kiva',
					],
					category: {
						themes: ['Vulnerable Groups'],
						distributionModel: 'fieldPartner'
					},
					count: 0,
					tracking: 'Most Vulnerable',
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
		},
		borrowerName() {
			return this.selectedLoan?.name ?? '';
		},
		loanCountry() {
			return this.selectedLoan?.geocode?.country?.name ?? '';
		},
		loanRegion() {
			return this.selectedLoan?.geocode?.country?.region ?? '';
		},
		loanCountryIsoCode() {
			return this.selectedLoan?.geocode?.country?.isoCode ?? '';
		},
	},
	methods: {
		hash(loan) {
			return loan?.image?.hash ?? '';
		},
		showDiscoverBadges() {
			this.newScreenSteps = 2;
		},
		selectBadge(badgeIdx) {
			this.newScreenSteps += 1;
			this.selectedBadgeIdx = badgeIdx;
		},
		showNewBg() {
			this.newBgActive = true;
		},
		countLoansInCategories() {
			this.defaultSortBadges.forEach((badge, idx) => {
				this.loans.forEach(loan => {
					let matches = true;

					if (badge.category.themes) {
						const themes = loan?.themes ?? [];
						matches = matches && badge.category.themes.some(theme => themes.includes(theme));
					}

					if (badge.category.tags) {
						const tags = loan?.tags ?? [];
						matches = matches && badge.category.tags.some(tag => tags.includes(tag));
					}

					if (badge.category.gender) {
						matches = matches && loan?.gender === badge.category.gender;
					}

					if (badge.category.countryIsoCode) {
						matches = matches && badge.category.countryIsoCode.includes(loan?.geocode?.country?.isoCode);
					}

					if (badge.category.distributionModel) {
						matches = matches && loan?.distributionModel === badge.category.distributionModel;
					}

					if (matches) {
						this.defaultSortBadges[idx].count += 1;
					}
				});
			});
		}
	},
	created() {
		if (this.loanCountryIsoCode) {
			this.defaultSortBadges.unshift(
				{
					id: 1,
					name: this.loanRegion,
					img: 'region',
					goals: [
						`Complete 2 loans from ${this.loanCountry}`,
						`Learn 1 cool thing about ${this.loanRegion}`,
					],
					// eslint-disable-next-line max-len
					description: `Like ${this.borrowerName}, people in ${this.loanRegion} continue to be financially excluded.`,
					category: {
						countryIsoCode: [this.loanCountryIsoCode],
					},
					count: 0,
					tracking: `Region-${this.loanRegion}`,
				}
			);
		}
		this.countLoansInCategories();
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
	box-shadow: 0 5px 25px 0 #D1DCD6;
}

</style>
