<!--  eslint-disable max-len -->
<template>
	<WwwPage main-class="tw-bg-secondary tw-pb-3">
		<template #secondary>
			<TheMyKivaSecondaryMenu />
		</template>
		<KvPageContainer>
			<KvGrid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
				<ThePortfolioTertiaryMenu class="tw-col-span-3 tw-hidden md:tw-block tw-pt-2" />
				<div class="tw-col-span-12 md:tw-col-span-9 tw-pt-1.5 md:tw-pt-3">
					<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3">
						<p class="tw-text-gray-500 tw-font-medium">
							Donor name:
						</p>
						<h2 class="tw-mb-2 tw-break-words">
							<KvLoadingPlaceholder
								v-if="loading"
								class="md:!tw-mt-1 !tw-w-1/4"
								style="height: 32px; margin-top: 2px;"
							/>
							<div v-else class="tw--mt-1">
								{{ donationInfo?.fullDonorName }}
								<a
									class="tw-text-small tw-no-underline"
									href="/settings/account-beta"
									v-kv-track-event="[
										'portfolio',
										'click',
										'Account settings'
									]"
								>edit</a>
							</div>
						</h2>
						<p>Kiva is a 501(c)(3) charitable organization. No goods or services were provided to you by Kiva in exchange for your donations. Donations may be claimed for a deduction from your U.S. taxes. Please consult with your tax counsel regarding the deductibility rules that apply to your specific tax situation.</p>
						<a
							class="tw-no-underline tw-mt-2 tw-cursor-pointer tw-flex tw-gap-0.5"
							@click="showInfoModal = true"
							v-kv-track-event="[
								'portfolio',
								'click',
								'Show how Kiva uses donations'
							]"
						>
							<KvMaterialIcon :icon="mdiHelpCircle" class="tw-align-middle tw-w-2.5" />
							<span>How Kiva uses donations</span>
						</a>
					</div>
					<div
						class="
							tw-pt-2.5
							tw-rounded-none
							md:tw-rounded
							tw-py-3
							tw-px-2
							md:tw-px-3
							md:tw-mt-3
							tw-bg-primary
						"
					>
						<KvGrid class="tw-grid-cols-12">
							<div class="tw-col-span-12 md:tw-col-span-8">
								<KvGrid class="tw-grid-cols-12">
									<div class="tw-col-span-6">
										<h4>{{ donationInfo?.currentYear }} Donations</h4>
										<KvLoadingPlaceholder
											v-if="loading"
											class="md:!tw-mt-2 !tw-w-1/2"
											style="height: 32px; margin-top: 10px;"
										/>
										<h2 v-else class="tw-text-eco-green tw-break-words">
											{{ numeral(donationInfo?.currentYearDonations ?? 0).format('$0,0.00') }}
										</h2>
									</div>
									<div class="tw-col-span-6">
										<h4>{{ donationInfo?.latestTaxYear }} Donations</h4>
										<KvLoadingPlaceholder
											v-if="loading"
											class="md:!tw-mt-2 !tw-w-1/2"
											style="height: 32px; margin-top: 10px;"
										/>
										<h2 v-else class="tw-text-eco-green tw-break-words">
											{{ numeral(donationInfo?.latestTaxYearDonations ?? 0).format('$0,0.00') }}
										</h2>
									</div>
								</KvGrid>
							</div>
							<div class="tw-col-span-12 md:tw-col-span-4 tw-flex tw-items-center">
								<KvButton
									to="/donate/supportus"
									class="tw-w-full"
									v-kv-track-event="[
										'portfolio',
										'click',
										'Make a donation'
									]"
								>
									Make a donation
								</KvButton>
							</div>
						</KvGrid>
					</div>
					<div
						v-if="loading || hasDonations"
						class="tw-rounded-none md:tw-rounded tw-py-3 tw-px-2 md:tw-px-3 md:tw-mt-3 md:tw-bg-primary"
					>
						<KvLoadingPlaceholder
							v-if="loading"
							style="height: 50px;"
						/>
						<template v-else>
							<table class="tw-w-full tw-text-left tw-table-fixed">
								<thead>
									<tr class="tw-bg-gray-200">
										<th class="tw-p-1 tw-w-1/3">
											Donation to Kiva
										</th>
										<th class="tw-p-1 tw-w-1/3">
											Date
										</th>
										<th class="tw-p-1 tw-w-1/3">
											Kiva ID
										</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(entry, i) in donationEntries"
										:key="i"
										class="tw-bg-primary"
										:class="{ '!tw-bg-gray-50': i % 2 === 1 }"
									>
										<td class="tw-p-1 tw-break-words">
											{{ numeral(entry.price).format('$0,0.00') }}
										</td>
										<td class="tw-p-1 tw-break-words">
											{{ getFormattedDate(entry.completedTime) }}
										</td>
										<td class="tw-p-1 tw-break-words">
											{{ entry.id }}
										</td>
									</tr>
								</tbody>
							</table>
							<div class="tw-text-center tw-pt-1 tw-text-small">
								Showing 1 to {{ displayedDonationCount }} of {{ donationsTotalCount }} entries
								<br>
								<a
									v-if="displayedDonationCount < donationsTotalCount && !loadingMore"
									class="tw-no-underline tw-cursor-pointer tw-block tw-h-2.5"
									@click="loadMoreDonations"
									v-kv-track-event="[
										'portfolio',
										'click',
										'Load more donations'
									]"
								>
									Load more
								</a>
								<KvLoadingSpinner v-else-if="loadingMore" class="!tw-w-2.5 !tw-h-2.5 tw-m-auto" />
							</div>
						</template>
					</div>
					<div
						class="tw-rounded-none md:tw-rounded tw-py-3 tw-px-2 md:tw-px-3 md:tw-mt-3"
						:class="{
							'tw-bg-primary': loading || hasDonations,
							'tw-bg-secondary md:tw-bg-primary': !loading && !hasDonations
						}"
					>
						<KvLoadingPlaceholder
							v-if="loading"
							style="height: 50px;"
						/>
						<template v-else>
							<KvGrid class="tw-grid-cols-12 tw-text-center md:tw-text-left">
								<div class="tw-col-span-12 md:tw-col-span-6">
									<h3 class="tw-mb-1">
										Kiva's EIN/Tax ID number
									</h3>
									<div>
										71-0992446
										<p class="tw-font-medium tw-mt-2">
											Kiva Microfunds
											<br>182 Howard Street, Suite 414
											<br>San Francisco, CA 94105
											<br>USA
										</p>
									</div>
								</div>
								<div v-if="hasDonations" class="tw-col-span-12 md:tw-col-span-6">
									<h3 class="tw-mb-1">
										Print tax receipts
									</h3>
									<div
										v-if="hasDafDonations"
										class="tw-text-left tw-pt-1 tw-text-small"
									>
										Note: DAF totals and line items will not be included in the printed version.
									</div>
									<div class="tw-flex tw-flex-col">
										<div
											v-for="donationYear in donationInfo.annualDonations"
											:key="donationYear.year"
										>
											<a
												:href="`/portfolio/donations/print?year=${donationYear.year}`"
												class="tw-no-underline"
												target="_blank"
												v-kv-track-event="[
													'portfolio',
													'click',
													'Get tax receipt for year',
												]"
											>{{ `${donationYear.year} Tax receipt (${numeral(donationYear.total).format('$0,0.00')})` }}</a>
										</div>
										<div class="tw-mt-2">
											<a
												href="/portfolio/donations/export"
												class="tw-no-underline"
												target="_blank"
												v-kv-track-event="[
													'portfolio',
													'click',
													'Export all donations',
												]"
											>Export all donations</a>
										</div>
									</div>
								</div>
							</KvGrid>
						</template>
					</div>
				</div>
			</KvGrid>
		</KvPageContainer>
		<KvLightbox :visible="showInfoModal" title="How does Kiva use donations?" @lightbox-closed="closeInfoModal">
			<p>
				Kiva's staff and volunteers work hard to ensure every dollar donated to Kiva is used efficiently. Donations support a variety of programs, which include but are not limited to: --Performing due diligence and monitoring for Lending Partners around the world. --Building and maintaining the complex technical infrastructure that facilitates an average of $2.5 million in weekly loans. --Training and supporting over 450 volunteers annually who translate and edit every loan posted on the Kiva website.  --Answering thousands of support emails and phone calls per month. If you live in the United States, your donation is eligible for a tax deduction. To learn more about how Kiva puts donations to use, check out our most recent annual report:
				<a
					class="tw-no-underline"
					href="https://www.kiva.org/about/finances#annualreport"
					target="_blank"
					v-kv-track-event="[
						'portfolio',
						'click',
						'Finances annual report'
					]"
				>
					https://www.kiva.org/about/finances#annualreport
				</a>
			</p>
			<p class="tw-mt-2">
				You can see a detailed breakdown explaining how your donations are used and why it's important to donate to Kiva in this blog post:
				<a
					class="tw-no-underline"
					href="https://www.kiva.org/blog/why-donate-to-kiva"
					target="_blank"
					v-kv-track-event="[
						'portfolio',
						'click',
						'Why donate to Kiva'
					]"
				>
					https://www.kiva.org/blog/why-donate-to-kiva
				</a>
			</p>
		</KvLightbox>
	</WwwPage>
</template>

<script>
import numeral from 'numeral';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import {
	KvPageContainer,
	KvGrid,
	KvLightbox,
	KvMaterialIcon,
	KvButton,
	KvLoadingPlaceholder,
	KvLoadingSpinner,
} from '@kiva/kv-components';
import logFormatter from '#src/util/logFormatter';
import myDonationsQuery from '#src/graphql/query/portfolio/myDonations.graphql';
import { mdiHelpCircle } from '@mdi/js';

const LIMIT = 10;

export default {
	name: 'DonationsPage',
	inject: ['apollo'],
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		KvGrid,
		KvPageContainer,
		KvLightbox,
		KvMaterialIcon,
		KvButton,
		KvLoadingPlaceholder,
		KvLoadingSpinner,
	},
	data() {
		return {
			numeral,
			mdiHelpCircle,
			hasDafDonations: false,
			loading: true,
			loadingMore: false,
			donationInfo: undefined,
			donationsTotalCount: undefined,
			donationEntries: undefined,
			showInfoModal: false,
			offset: 0,
		};
	},
	computed: {
		displayedDonationCount() {
			return this.offset + LIMIT;
		},
		hasDonations() {
			return this.donationEntries?.length > 0;
		},
	},
	methods: {
		async fetchDonationsData(newOffset = 0) {
			try {
				const response = await this.apollo.query({
					query: myDonationsQuery,
					variables: {
						offset: newOffset,
						limit: LIMIT,
					},
				});
				this.donationInfo = response?.data?.my?.userAccount?.donationInfo;
				this.hasDafDonations = response?.data?.my?.userAccount?.donationInfo?.hasDafDonations;
				this.donationsTotalCount = response?.data?.my?.userAccount?.donationEntries?.total;
				this.donationEntries = [
					...(this.donationEntries ?? []),
					...(response?.data?.my?.userAccount?.donationEntries?.donations ?? [])
				];
				this.loading = false;
			} catch (error) {
				logFormatter(`Error fetching donations data: ${error}`, 'error');
			}
		},
		closeInfoModal() {
			// Lightbox triggers this event twice on close
			if (this.showInfoModal) {
				this.$kvTrackEvent(
					'portfolio',
					'click',
					'Close info modal',
				);
			}
			this.showInfoModal = false;
		},
		getFormattedDate(timestamp) {
			const date = new Date(timestamp * 1000);
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		},
		async loadMoreDonations() {
			// Cache offset value so UI doesn't update until the new data is loaded
			const newOffset = this.offset + LIMIT;
			this.loadingMore = true;
			await this.fetchDonationsData(newOffset);
			this.loadingMore = false;
			this.offset += LIMIT;
		},
	},
	mounted() {
		this.fetchDonationsData();
	},
};
</script>
