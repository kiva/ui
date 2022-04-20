<template>
	<www-page
		id="borrower-profile"
	>
		<article class="tw-relative tw-bg-secondary">
			<div class="tw-relative">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
					<hero-background />
				</div>
				<content-container class="md:tw-pt-6 lg:tw-pt-8">
					<summary-card data-testid="bp-summary" class="tw-relative lg:tw--mb-1.5 tw-z-1" />
				</content-container>
			</div>
			<div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8 tw-pointer-events-none">
				<sidebar-container class="lg:tw-sticky lg:tw-top-12 lg:tw-mt-10 lg:tw-pb-8">
					<lend-cta class="tw-pointer-events-auto" :loan-id="loanId" />
				</sidebar-container>
			</div>
			<content-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-8">
				<loan-story
					id="loanStory"
					data-testid="bp-loan-story"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
					:loan-id="loanId"
				/>
			</content-container>
			<div class="tw-bg-primary tw-mb-5 md:tw-mb-6 lg:tw-mb-8">
				<content-container>
					<why-special data-testid="bp-why-special" :loan-id="loanId" />
				</content-container>
			</div>
			<content-container>
				<more-about-loan data-testid="bp-more-about" class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8" :loan-id="loanId" />
				<borrower-country data-testid="bp-country" class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8" :loan-id="loanId" />
				<lenders-and-teams
					v-if="showLenders"
					data-testid="bp-lenders"
					key="lenders"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
					:loan-id="loanId"
					display-type="lenders"
					@hide-section="showLenders = false"
				/>
				<lenders-and-teams
					v-if="showTeams"
					data-testid="bp-teams"
					key="teams"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
					:loan-id="loanId"
					display-type="teams"
					@hide-section="showTeams = false"
				/>
			</content-container>
			<div class="tw-bg-primary">
				<content-container>
					<details-tabs id="loanDetails" :loan-id="loanId" name="bp-details" />
				</content-container>
			</div>
		</article>
		<!-- <aside>Similar loans</aside> -->
	</www-page>
</template>

<script>
import { getKivaImageUrl } from '@/util/imageUtils';
import { format, parseISO } from 'date-fns';
import gql from 'graphql-tag';

import WwwPage from '@/components/WwwFrame/WwwPage';
import ContentContainer from '@/components/BorrowerProfile/ContentContainer';
import SidebarContainer from '@/components/BorrowerProfile/SidebarContainer';
import HeroBackground from '@/components/BorrowerProfile/HeroBackground';
import SummaryCard from '@/components/BorrowerProfile/SummaryCard';
import LendCta from '@/components/BorrowerProfile/LendCta';
import LoanStory from '@/components/BorrowerProfile/LoanStory';
import DetailsTabs from '@/components/BorrowerProfile/DetailsTabs';
import BorrowerCountry from '@/components/BorrowerProfile/BorrowerCountry';
import LendersAndTeams from '@/components/BorrowerProfile/LendersAndTeams';
import MoreAboutLoan from '@/components/BorrowerProfile/MoreAboutLoan';
import WhySpecial from '@/components/BorrowerProfile/WhySpecial';

const loanUseFilter = require('../../plugins/loan-use-filter');

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerCountry,
		ContentContainer,
		DetailsTabs,
		HeroBackground,
		LendCta,
		LendersAndTeams,
		LoanStory,
		MoreAboutLoan,
		SidebarContainer,
		SummaryCard,
		WhySpecial,
		WwwPage,
	},
	metaInfo() {
		const canonicalUrl = `https://${this.$appConfig.host}${this.$route.path}`.replace('-beta', '');
		return {
			title: this.pageTitle,
			link: [
				{
					vmid: 'canonical',
					rel: 'canonical',
					href: canonicalUrl
				}
			],
			meta: [
				{ property: 'og:title', vmid: 'og:title', content: `Lend as little as $25 to ${this.name}` },
				{ property: 'og:type', vmid: 'og:type', content: 'kivadotorg:loan' },
				{
					property: 'og:image',
					vmid: 'og:image',
					content: this.imageShareUrl
				},
			].concat(this.$appConfig.enableFB ? [
				{
					vmid: 'facebook_label',
					name: 'facebook_label',
					content: this.pageLabel
				},
			] : []).concat([
				// Twitter Tags
				{ name: 'twitter:title', vmid: 'twitter:title', content: `Lend as little as $25 to ${this.name}` },
				{
					name: 'twitter:image',
					vmid: 'twitter:image',
					content: this.imageShareUrl
				},
				{
					name: 'twitter:label1',
					vmid: 'twitter:label1',
					content: 'Supporters'
				},
				{
					name: 'twitter:data1',
					vmid: 'twitter:data1',
					content: this.numLenders
				},
				{
					name: 'twitter:label2',
					vmid: 'twitter:label2',
					content: 'End Date'
				},
				{
					name: 'twitter:data2',
					vmid: 'twitter:data2',
					content: this.endDate
				},
				{ property: 'og:description', vmid: 'og:description', content: this.descriptionMetaContent },
				{
					name: 'twitter:description',
					vmid: 'twitter:description',
					content: this.descriptionMetaContent
				},
			])
		};
	},
	data() {
		return {
			loanId: Number(this.$route.params.id || 0),
			showLenders: true,
			showTeams: true,

			// meta fields
			endDate: '',
			numLenders: 0,
			name: '',
			hash: '',
			borrowerCount: 0,
			anonymizationLevel: 'none',
			loanAmount: '0',
			status: '',
			use: '',
			description: '',
		};
	},
	apollo: {
		query: gql`
			query borrowerProfileMeta($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						borrowerCount
						name
						... on LoanDirect {
							businessName
						}
						geocode {
							country {
								name
							}
						}
						image {
							id
							hash
						}
						plannedExpirationDate
						lenders {
							totalCount
						}
						anonymizationLevel
						loanAmount
						status
						use
						description
					}
				}
			}
		`,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				loanId: Number(route?.params?.id ?? 0),
			};
		},
		variables() {
			return {
				loanId: Number(this.$route?.params?.id ?? 0),
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan;
			this.businessName = loan?.businessName ?? '';
			this.name = loan?.name ?? '';
			this.countryName = loan?.geocode?.country?.name ?? '';
			this.hash = loan?.image?.hash ?? '';
			this.numLenders = loan?.lenders?.totalCount ?? 0;
			this.endDate = format(parseISO(loan.plannedExpirationDate), 'M/d') ?? '';
			this.borrowerCount = loan?.borrowerCount ?? 0;
			this.anonymizationLevel = loan?.anonymizationLevel ?? 'none';
			this.loanAmount = loan?.loanAmount ?? '0';
			this.status = loan?.status ?? '';
			this.use = loan?.use ?? '';
			this.description = loan?.description ?? '';
		},
	},
	mounted() {
		// EXP-GROW-655-Aug2021
		// This is cookie is set during the redirect and signifies the exp is active when landing on this page
		const expCookieSignifier = this.cookieStore.get('kvlendborrowerbeta');
		if (expCookieSignifier === 'b') {
			this.$kvTrackEvent('Borrower Profile', 'EXP-GROW-655-Aug2021', expCookieSignifier);
		}
	},
	computed: {
		imageShareUrl() {
			if (!this.hash) return '';
			return getKivaImageUrl({
				height: 630,
				width: 1200,
				base: this.$appConfig.photoPath,
				hash: this.hash,
			});
		},
		pageLabel() {
			return `Kiva - ${this.pageTitle}`;
		},
		pageTitle() {
			// eslint-disable-next-line prefer-destructuring
			let name = this.name;
			if (this.businessName) {
				name = `${name}, ${this.businessName}`;
			}
			return `${name} - ${this.countryName}`;
		},
		descriptionMetaContent() {
			if (this.anonymizationLevel !== 'full') {
				// eslint-disable-next-line max-len
				const loanUse = loanUseFilter(this.use, this.name, this.status, this.loanAmount, this.borrowerCount,
					this.loanUseMaxLength);
				return `${loanUse}\n\n${this.description.substring(0, 120)}...`;
			}
			return 'For the borrower\'s privacy, this loan has been made anonymous.';
		}
	},
};
</script>
