<template>
	<section>
		<h2>
			More about this loan
		</h2>
		<div
			class="tw-prose"
			v-if="partnerName && !loading"
		>
			<p>
				This loan is facilitated by our Field Partner, {{ partnerName }}.
				Field Partners are local organizations working in communities to vet
				borrowers, provide services, and administer loans on the ground.
			</p>

			<div v-html="moreInfoAboutLoan">
			</div>

			<div
				v-if="loanAlertText"
			>
				<h3>
					About {{ partnerName }}:
				</h3>
				<p
					key="storyDescription"
					v-html="this.loanAlertText"
				>
				</p>
			</div>
			<div
				v-if="dualStatementNote"
			>
				<h3>
					Important Note About This Loan
				</h3>
				<div v-html="dualStatementNote">
				</div>
			</div>
		</div>
		<div
			v-if="!partnerName && !loading"
		>
			<div class="tw-prose tw-mb-2">
				<h3>
					Business Description
				</h3>
				<div
					key="businessDescription"
					v-html="this.businessDescription"
				>
				</div>
			</div>

			<borrower-business-details
				class="tw-mb-2"
				:borrower-business-name="borrowerBusinessName"
				:sector="sector"
				:social-links="socialLinks"
				:years-in-business="yearsInBusiness"
			/>

			<div class="tw-prose">
				<h3>
					What is the purpose of this loan?
				</h3>
				<div
					key="purpose"
					v-html="this.purpose"
				>
				</div>
			</div>
		</div>

		<div
			v-if="loading"
		>
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 60 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
			<div v-for="i in 5" :key="`${i}pl1`">
				<kv-loading-placeholder class="tw-w-full tw-mb-1"
					:style="{width: 80 + (Math.random() * 15) + '%', height: '1rem'}"
				/>
			</div>
			<br>
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 60 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
			<div v-for="i in 5" :key="`${i}pl2`">
				<kv-loading-placeholder class="tw-w-full tw-mb-1"
					:style="{width: 80 + (Math.random() * 15) + '%', height: '1rem'}"
				/>
			</div>
			<br>
		</div>
	</section>
</template>

<script>
import gql from 'graphql-tag';
import { createIntersectionObserver } from '@/util/observerUtils';
import BorrowerBusinessDetails from '@/components/BorrowerProfile/BorrowerBusinessDetails';
// TODO: replace the loading placeholder with component from kv-components when available.
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerBusinessDetails,
		KvLoadingPlaceholder,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			businessName: '',
			businessDescription: '',
			dualStatementNote: '',
			loading: true,
			loanAlertText: '',
			moreInfoAboutLoan: '',
			name: '',
			partnerName: '',
			purpose: '',
			sector: '',
			socialLinks: {
				etsy: '',
				facebook: '',
				instagram: '',
				linkedin: '',
				twitter: '',
				website: '',
				yelp: '',
			},
			yearsInBusiness: '',
		};
	},
	computed: {
		borrowerBusinessName() {
			if (this.businessName) {
				return this.businessName;
			}
			return this.name;
		},
	},
	methods: {
		createObserver() {
			// Watch for this element being close to entering the viewport
			this.observer = createIntersectionObserver({
				targets: [this.$el],
				rootMargin: '500px',
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$el && entry.intersectionRatio > 0) {
							// This element is close to being in the viewport, so load the data.
							// Because of the apollo cache it's safe to call this repeatedly.
							this.loadData();
						}
					});
				}
			});
			if (!this.observer) {
				// Observer was not created, so call loadData right away as a fallback.
				this.loadData();
			}
		},
		destroyObserver() {
			if (this.observer) {
				this.observer.disconnect();
			}
		},
		loadData() {
			this.apollo.query({
				query: gql`query moreAboutLoan($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							name
							sector {
								id
								name
							}
							... on LoanDirect {
								businessName
								businessDescription
								purpose
								yearsInBusiness
								socialLinks {
									etsy
									facebook
									instagram
									linkedin
									twitter
									website
									yelp
								}
							}
							... on LoanPartner {
								dualStatementNote
								moreInfoAboutLoan
								partnerName
								partner {
									id
									loanAlertText
								}
							}
						}
					}
				}`,
				variables: {
					loanId: this.loanId
				},
			}).then(result => {
				const loan = result?.data?.lend?.loan;
				this.businessName = loan?.businessName ?? '';
				this.businessDescription = loan?.businessDescription ?? '';
				this.dualStatementNote = loan?.dualStatementNote ?? '';
				this.name = loan?.name ?? '';
				this.loanAlertText = loan?.partner?.loanAlertText ?? '';
				this.moreInfoAboutLoan = loan?.moreInfoAboutLoan ?? '';
				this.partnerName = loan?.partnerName ?? '';
				this.purpose = loan?.purpose ?? '';
				this.sector = loan?.sector?.name ?? '';
				this.socialLinks = loan?.socialLinks ?? {};
				this.yearsInBusiness = loan?.yearsInBusiness ?? '';

				this.loading = false;
			});
		},
	},
	mounted() {
		this.createObserver();
	},
	beforeDestroy() {
		this.destroyObserver();
	},
};

</script>
