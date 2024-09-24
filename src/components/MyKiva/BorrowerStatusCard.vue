<template>
	<div class="card-container">
		<div class="tw-bg-white tw-absolute tw-top-1 tw-left-1 tw-rounded tw-px-1 tw-py-0.5 tw-font-medium">
			🎉 {{ loanStatus }}
		</div>
		<div class="tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
			<HeroBackground style="height: 96px;" class="!tw-block tw-rounded-t" />
			<div class="tw-flex tw-justify-center tw-gap-1.5 tw-flex-col md:tw-flex-row tw-px-1.5 md:tw-px-2.5">
				<div class="tw-flex-1">
					<div
						class="tw-w-10 tw-h-10 tw-mx-auto md:tw-mx-0 tw-border-white tw-border-4
              tw-rounded-full tw-shadow"
						style="margin-top: -2.5rem;"
					>
						<BorrowerImage
							class="tw-w-full tw-rounded-full tw-bg-brand"
							:alt="borrowerName"
							:aspect-ratio="1"
							:default-image="{ width: 80, faceZoom: 50 }"
							:hash="hash"
							:images="[
								{ width: 80, faceZoom: 50, viewSize: 1024 },
								{ width: 72, faceZoom: 50, viewSize: 734 },
								{ width: 64, faceZoom: 50 },
							]"
						/>
					</div>
					<h3 class="tw-text-center md:tw-text-left tw-mb-1">
						{{ title }}
					</h3>
					<p class="tw-text-center md:tw-text-left">
						{{ description }}
						<a
							class="tw-w-full md:tw-w-auto tw-text-action"
							:href="`/lend/${loan.id}`"
							variant="primary"
							v-kv-track-event="['portfolio', 'click', 'view-details', borrowerName, loan.id]"
						>
							View details
						</a>
					</p>
				</div>
				<div class="tw-flex-1">
					<button
						class="tw-flex tw-items-center tw-justify-center tw-py-2 tw-w-full
              md:tw-pointer-events-none"
						@click="toggleWhatIsNext"
					>
						<p class="tw-text-action tw-font-medium md:tw-text-black">
							What's next
						</p>
						<KvMaterialIcon
							class="tw-w-3 tw-h-3 tw-text-action md:tw-hidden"
							@click="open = !open"
							:icon="open ? mdiChevronUp : mdiChevronDown"
						/>
					</button>
					<kv-expandable easing="ease-in-out">
						<div v-show="open">
							<LoanNextSteps
								class="tw-mb-5"
								:weeks-to-repay="weeksToRepay"
								:current-step="currentStep"
								:repayments-started="!isFundraising"
								no-animation
							/>
						</div>
					</kv-expandable>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import HeroBackground from '#src/components/BorrowerProfile/HeroBackground';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import {
	mdiChevronDown,
	mdiChevronUp
} from '@mdi/js';
import KvExpandable from '#src/components/Kv/KvExpandable';
import LoanNextSteps from '#src/components/Thanks/LoanNextSteps';
import { addMonths, differenceInWeeks } from 'date-fns';
import { isLoanFundraising } from '#src/util/loanUtils';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'BorrowerStatusCard',
	props: {
		loan: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			isMobile: false,
			open: false,
			mdiChevronDown,
			mdiChevronUp,
		};
	},
	components: {
		BorrowerImage,
		HeroBackground,
		LoanNextSteps,
		KvMaterialIcon,
		KvExpandable,
	},
	computed: {
		title() {
			return `${this.borrowerName} in ${this.borrowerCountry}`;
		},
		borrowerCountry() {
			return this.loan?.geocode?.country?.name ?? '';
		},
		borrowerName() {
			return this.loan?.name ?? '';
		},
		hash() {
			return this.loan.image?.hash ?? '';
		},
		pronoun() {
			if (this.loan?.gender === 'male') return 'his';
			if (this.loan?.gender === 'female') return 'her';
			return 'their';
		},
		loanUse() {
			return this.loan.use ?? '';
		},
		loanFunFact() {
			// TODO: Replace this logic once MP-820 is complete
			const region = this.loan?.geocode?.country?.region ?? '';
			if (region === 'North America') {
				switch (this.borrowerCountry) {
					case 'United States':
						// eslint-disable-next-line max-len
						return '3 in 5 U.S. business owners felt less stressed about finances after support from Kiva.**';
					case 'Puerto Rico':
						// eslint-disable-next-line max-len
						return 'Small businesses are a crucial part of Puerto Rico\'s economy, employing around 44% of Puerto Rico\'s workforce.';
					case 'Dominican Republic':
						// eslint-disable-next-line max-len
						return 'Poverty in the Dominican Republic has decreased significantly, from 40% of the population in 2003 to 20% in 2019.';
					case 'Haiti':
						// eslint-disable-next-line max-len
						return 'North America is highly vulnerable to climate disasters like hurricanes, rising sea levels, and extreme weather, but it is increasingly focused on renewable energy and sustainability.';
					case 'Mexico':
						// eslint-disable-next-line max-len
						return 'In Mexico, financial access is improving, with over half of adults able to access a bank account. ';
					default:
						// eslint-disable-next-line max-len
						return 'North America is highly vulnerable to climate disasters like hurricanes, rising sea levels, and extreme weather, but it is increasingly focused on renewable energy and sustainability. ';
				}
			}
			switch (region) {
				case 'Central America':
					// eslint-disable-next-line max-len
					return 'In Central America, 95% of people surveyed said their quality of life improved as a result of their loan.**';
				case 'South America':
					// eslint-disable-next-line max-len
					return 'People living in poverty in South America has decreased from ~30% in 2002 to less than 20% by 2020.';
				case 'Africa':
					// eslint-disable-next-line max-len
					return 'In Africa, 92% of people surveyed said their confidence in their own abilities improved as a result of their loan.**';
				case 'Middle East':
					// eslint-disable-next-line max-len
					return 'The number of people with bank accounts is on the rise in the Middle East, a vital step in driving economic opportunity.';
				case 'Eastern Europe':
					// eslint-disable-next-line max-len
					return 'Eastern European countries have made progress in reducing poverty levels over the past decade through social protection programs.';
				case 'Asia':
					// eslint-disable-next-line max-len
					return 'In Asia, 86% of people surveyed were better able to manage their finances as a result of their loan.**';
				default:
					// eslint-disable-next-line max-len
					return 'In areas of Oceania like Fiji, the gender gap is improving—with more women able to access financial services.';
			}
		},
		loanStatus() {
			if (this.isFundraising) {
				return 'Fundraising';
			}
			return 'Repaying';
		},
		description() {
			return `${this.borrowerName}
        ${this.isFundraising ? 'will use' : 'used'}
        ${this.pronoun} loan ${this.loanUse} ${this.loanFunFact}`;
		},
		currentStep() {
			if (this.isFundraising) {
				return 1;
			}
			return 4;
		},
		weeksToRepay() {
			const date = this.loan?.terms?.expectedPayments?.[0]?.dueToKivaDate ?? null;
			const today = new Date();
			if (date) {
				// Get the number of weeks between the first repayment date (in the future) and now
				return `${differenceInWeeks(Date.parse(date), today)} weeks`;
			}

			// Calculating a possible range of weeks between the planned expiration date and a month after
			const expDate = Date.parse(this.loan?.plannedExpirationDate);
			const minDate = differenceInWeeks(addMonths(today, 1), today);
			const maxDate = differenceInWeeks(addMonths(expDate, 1), today);

			if (minDate === maxDate) {
				return `${minDate} weeks`;
			}

			return `${minDate} - ${maxDate} weeks`;
		},
		isFundraising() {
			return isLoanFundraising(this.loan);
		}
	},
	mounted() {
		this.isMobile = document.documentElement.clientWidth < 735;
		if (!this.isMobile) {
			this.open = true;
		}
	},
	methods: {
		toggleWhatIsNext() {
			if (!this.open) {
				this.$kvTrackEvent('portfolio', 'click', 'what-is-next', this.borrowerName, this.loan.id);
			}
			this.open = !this.open;
		}
	}
};
</script>

<style lang="postcss" scoped>

.card-container {
  @apply tw-flex tw-flex-col tw-justify-center tw-items-center tw-rounded tw-bg-white tw-relative;

  @screen md {
    width: 468px;
  }

  @screen lg {
    width: 520px;
  }
}

.avatar {
  margin-top: -4rem;
}

</style>
