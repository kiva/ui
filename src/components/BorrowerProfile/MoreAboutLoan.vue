<template>
	<section>
		<div class="tw-prose tw-break-words">
			<h2 data-testid="bp-more-about-header">
				More about this loan
			</h2>
			<div v-if="partnerName && !loading">
				<p v-if="!partnerNameNA" data-testid="bp-more_about-facilitated">
					This loan is facilitated by our Field Partner, {{ partnerName }}.
					Field Partners are local organizations working in communities to vet
					borrowers, provide services, and administer loans on the ground.
				</p>

				<template v-if="readMore || userContextExpVariant !== 'a'">
					<div v-html="moreInfoAboutLoan" data-testid="bp-more-about-info">
					</div>
					<div v-if="loanAlertText" data-testid="bp-more-about-alert-text">
						<h3>
							About {{ partnerName }}:
						</h3>
						<p
							key="storyDescription"
							v-html="this.loanAlertText"
						>
						</p>
					</div>
					<div v-if="dualStatementNote" data-testid="bp-more-about-dual-statement">
						<h3>
							Important Note About This Loan
						</h3>
						<div v-html="dualStatementNote">
						</div>
					</div>
				</template>
				<template v-else>
					<kv-text-link @click="readMore = true">
						Read more
					</kv-text-link>
				</template>
			</div>
		</div>
		<div v-if="!partnerName && !loading">
			<div class="tw-prose tw-mb-2">
				<h3>
					Business description
				</h3>
				<div
					data-testid="bp-more-about-direct-description"
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
				:loan-id="loanId"
			/>

			<div class="tw-prose" data-testid="bp-direct-loan-purpose">
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
				<kv-loading-placeholder
					class="tw-w-full tw-mb-1"
					:style="{width: 80 + (Math.random() * 15) + '%', height: '1rem'}"
				/>
			</div>
			<br>
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 60 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
			<div v-for="i in 5" :key="`${i}pl2`">
				<kv-loading-placeholder
					class="tw-w-full tw-mb-1"
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
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

export default {
	name: 'MoreAboutLoan',
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerBusinessDetails,
		KvLoadingPlaceholder,
		KvTextLink
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		userContextExpVariant: {
			type: String,
			default: 'c'
		}
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
			readMore: false
		};
	},
	computed: {
		borrowerBusinessName() {
			if (this.businessName) {
				return this.businessName;
			}
			return this.name;
		},
		partnerNameNA() {
			return this.partnerName.indexOf('N/A') > -1
				|| this.partnerName.indexOf('N/a') > -1
				|| this.partnerName.indexOf('n/a') > -1;
		}
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
