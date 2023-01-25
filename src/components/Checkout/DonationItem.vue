<template>
	<!-- DO NOT REMOVE basket-donation-item class -->
	<div class="basket-donation-item">
		<template
			v-if="donateItemExperimentVersion === 'a' ||
				(donateItemExperimentVersion === 'e' && !hasLoans)"
		>
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-pb-5">
				<!-- donation image -->
				<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
					<img
						class="donation-img tw-w-12 lg:tw-w-13 tw-h-12 lg:tw-h-13 tw-rounded"
						:src="imageRequire(`./peace-sign-holding-money.svg`)"
						alt="donation line item image"
						data-testid="basket-donation-image"
					>
				</div>

				<!-- donation text -->
				<div class="tw-flex-auto">
					<div class="tw-mb-0.5">
						<div class="tw-w-full tw-flex">
							<h2
								class="tw-flex-1 md:tw-flex-grow tw-text-h3"
								data-testid="basket-donation-title"
							>
								{{ donationTitle }}
							</h2>
							<button
								class="donation-amount md:tw-hidden tw-flex-none tw-align-middle"
								data-testid="basket-donation-edit-button-mobile-pencil"
								v-kv-track-event="['basket', 'Edit Donation']"
								@click="enterEditDonation"
								title="Edit Donation"
							>
								<kv-material-icon
									role="img"
									aria-label="Edit Donation"
									title="Edit Donation"
									class="edit-donation tw-text-action
									tw-w-3.5
									tw-h-3.5
									tw-py-0.5
									md:tw-hidden"
									name="pencil"
									:icon="mdiPencil"
								/>
							</button>
						</div>

						<div
							v-show="!editDonation"
							class="md:tw-hidden"
						>
							<button
								class="donation-amount"
								data-testid="basket-donation-edit-button-mobile-amount"
								v-kv-track-event="['basket', 'Edit Donation']"
								@click="enterEditDonation"
								title="Edit Donation"
							>
								{{ formattedAmount }}
								<kv-material-icon
									role="img"
									aria-label="Edit Donation"
									title="Edit Donation"
									class="edit-donation tw-text-action
									tw-w-3.5
									tw-h-3.5
									tw-py-0.5
									tw-hidden md:tw-inline-block
									"
									name="pencil"
									:icon="mdiPencil"
								/>
							</button>
						</div>

						<div>
							<div
								class="donation-tagline tw-text-small tw-text-secondary tw-my-1"
								data-testid="basket-donation-tagline"
								v-html="donationTagLine"
							>
							</div>
							<button
								class="tw-text-small tw-text-link"
								data-testid="basket-donation-info-lightbox"
								@click="triggerDefaultLightbox"
								v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']"
							>
								{{ donationDetailsLink }}
							</button>
						</div>
					</div>
				</div>

				<!-- donation total -->
				<div
					class="
				tw-flex-none
				tw-w-full
				md:tw-w-auto
				md:tw-ml-3
				lg:tw-ml-4.5
				tw-mt-1.5
				md:tw-mt-0"
				>
					<div
						v-show="!editDonation"
						class="tw-hidden md:tw-block tw-text-right"
					>
						<button
							class="donation-amount"
							data-testid="basket-donation-edit-button-combined"
							v-kv-track-event="['basket', 'Edit Donation']"
							@click="enterEditDonation"
							title="Edit Donation"
						>
							{{ formattedAmount }}
							<kv-material-icon
								role="img"
								aria-label="Edit Donation"
								title="Edit Donation"
								class="edit-donation tw-text-action
								tw-w-3.5
								tw-h-3.5
								tw-py-0.5
								tw-align-bottom
								"
								name="pencil"
								:icon="mdiPencil"
							/>
						</button>
					</div>
					<div v-show="editDonation" class="small-12 columns donation-amount-input-wrapper">
						<kv-text-input
							class="donation-amount-input"
							data-testid="basket-donation-edit-input"
							name="donation"
							id="donation"
							v-model="amount"
							@blur="validateInput"
							@keyup.enter.prevent="updateDonation()"
						/>
						<kv-button
							variant="secondary"
							class="update-donation-inline-button"
							data-testid="basket-donation-edit-submit"
							@click="updateDonation()"
						>
							Update
						</kv-button>
						<button
							class="show-for-medium remove-wrapper"
							@click="updateLoanAmount('remove')"
							data-testid="basket-donation-remove"
						>
							<kv-material-icon
								class="remove-x tw-text-tertiary"
								name="small-x"
								:from-sprite="true"
								title="Remove donation"
							/>
						</button>
					</div>
					<donate-repayments
						v-if="hasLoans"
						@updating-totals="$emit('updating-totals', $event)"
						@refreshtotals="$emit('refreshtotals')"
					/>
				</div>
			</div>
		</template>
		<template v-if="donateItemExperimentVersion === 'b'">
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-pb-5">
				<!-- donation image -->
				<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
					<img
						class="donation-img tw-w-12 lg:tw-w-13 tw-h-12 lg:tw-h-13 tw-rounded"
						:src="imageRequire(`./peace-sign-holding-money.svg`)"
						alt="donation line item image"
						data-testid="basket-donation-image"
					>
				</div>

				<!-- donation text -->
				<div class="tw-flex-auto">
					<div class="tw-mb-0.5">
						<div class="tw-w-full tw-flex">
							<h2
								class="tw-flex-1 md:tw-flex-grow tw-text-h3"
								data-testid="basket-donation-title"
							>
								{{ basketDonateModulesExpDonationHeader }}
							</h2>
							<button
								class="donation-amount md:tw-hidden tw-flex-none tw-align-middle"
								data-testid="basket-donation-edit-button-mobile-pencil"
								v-kv-track-event="['basket', 'Edit Donation']"
								@click="enterEditDonation"
								title="Edit Donation"
							>
								<kv-material-icon
									role="img"
									aria-label="Edit Donation"
									title="Edit Donation"
									class="edit-donation tw-text-action
								tw-w-3.5
								tw-h-3.5
								tw-py-0.5
								md:tw-hidden"
									name="pencil"
									:icon="mdiPencil"
								/>
							</button>
						</div>

						<div
							v-show="!editDonation"
							class="md:tw-hidden"
						>
							<button
								class="donation-amount"
								data-testid="basket-donation-edit-button-mobile-amount"
								v-kv-track-event="['basket', 'Edit Donation']"
								@click="enterEditDonation"
								title="Edit Donation"
							>
								{{ formattedAmount }}
								<kv-material-icon
									role="img"
									aria-label="Edit Donation"
									title="Edit Donation"
									class="edit-donation tw-text-action
								tw-w-3.5
								tw-h-3.5
								tw-py-0.5
								tw-hidden md:tw-inline-block
								"
									name="pencil"
									:icon="mdiPencil"
								/>
							</button>
						</div>

						<div>
							<div
								class="donation-tagline tw-text-small tw-text-secondary tw-my-1 tw-max-w-2xl"
								data-testid="basket-donation-tagline"
							>
								<p
									class="tw-text-small tw-text-secondary"
									v-html="basketDonateModulesExpDonationTagline"
								>
								</p>
							</div>
							<button
								class="tw-text-small tw-text-link"
								data-testid="basket-donation-info-lightbox"
								@click="triggerDefaultLightbox"
								v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']"
							>
								{{ donationDetailsLink }}
							</button>
						</div>
					</div>
				</div>

				<!-- donation total -->
				<div
					class="
				tw-flex-none
				tw-w-full
				md:tw-w-auto
				md:tw-ml-3
				lg:tw-ml-4.5
				tw-mt-1.5
				md:tw-mt-0"
				>
					<div
						v-show="!editDonation"
						class="tw-hidden md:tw-block tw-text-right"
					>
						<button
							class="donation-amount"
							data-testid="basket-donation-edit-button-combined"
							v-kv-track-event="['basket', 'Edit Donation']"
							@click="enterEditDonation"
							title="Edit Donation"
						>
							{{ formattedAmount }}
							<kv-material-icon
								role="img"
								aria-label="Edit Donation"
								title="Edit Donation"
								class="edit-donation tw-text-action
								tw-w-3.5
								tw-h-3.5
								tw-py-0.5
								tw-align-bottom
								"
								name="pencil"
								:icon="mdiPencil"
							/>
						</button>
					</div>
					<div v-show="editDonation" class="small-12 columns donation-amount-input-wrapper">
						<kv-text-input
							class="donation-amount-input"
							data-testid="basket-donation-edit-input"
							name="donation"
							id="donation"
							v-model="amount"
							@blur="validateInput"
							@keyup.enter.prevent="updateDonation()"
						/>
						<kv-button
							variant="secondary"
							class="update-donation-inline-button"
							data-testid="basket-donation-edit-submit"
							@click="updateDonation()"
						>
							Update
						</kv-button>
						<button
							class="show-for-medium remove-wrapper"
							@click="updateLoanAmount('remove')"
							data-testid="basket-donation-remove"
						>
							<kv-material-icon
								class="remove-x tw-text-tertiary"
								name="small-x"
								:from-sprite="true"
								title="Remove donation"
							/>
						</button>
					</div>
					<donate-repayments
						v-if="hasLoans"
						@updating-totals="$emit('updating-totals', $event)"
						@refreshtotals="$emit('refreshtotals')"
					/>
				</div>
			</div>
		</template>
		<template v-if="donateItemExperimentVersion === 'c'">
			<div class="tw-flex tw-items-center">
				<span class="tw-text-secondary tw-text-small tw-pr-1">Donate to Kiva</span>
				<hr class="tw-flex-grow">
			</div>
			<h3>{{ basketDonateModulesExpDonationHeader }}</h3>
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-pb-5 tw-mt-2">
				<!-- donation image -->
				<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
					<img
						class="donation-img tw-w-12 lg:tw-w-13 tw-h-12 lg:tw-h-13 tw-rounded"
						src="@/assets/images/team_donate.png"
						alt="donation line item image"
						data-testid="basket-donation-image"
					>
				</div>

				<!-- donation text -->
				<div class="tw-flex-auto">
					<div class="tw-mb-0.5">
						<div
							v-show="!editDonation"
							class="md:tw-hidden tw-mb-1"
						>
							<button
								class="donation-amount"
								data-testid="basket-donation-edit-button-mobile-amount"
								v-kv-track-event="['basket', 'Edit Donation']"
								@click="enterEditDonation"
								title="Edit Donation"
							>
								{{ formattedAmount }}
								<kv-material-icon
									role="img"
									aria-label="Edit Donation"
									title="Edit Donation"
									class="edit-donation
										tw-inline-flex
										tw-w-3.5
										tw-h-3.5
										tw-py-0.5
										tw-align-bottom
										tw-text-action
									"
									name="pencil"
									:icon="mdiPencil"
								/>
							</button>
						</div>

						<div>
							<div
								class="donation-tagline tw-text-small tw-text-secondary tw-mb-1 tw-max-w-2xl"
								data-testid="basket-donation-tagline"
							>
								<p
									class="tw-text-small tw-text-secondary"
									v-html="basketDonateModulesExpDonationTagline"
								>
								</p>
							</div>
							<button
								class="tw-text-small tw-text-link"
								data-testid="basket-donation-info-lightbox"
								@click="triggerDefaultLightbox"
								v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']"
							>
								{{ donationDetailsLink }}
							</button>
						</div>
					</div>
				</div>

				<!-- donation total -->
				<div
					class="
				tw-flex-none
				tw-w-full
				md:tw-w-auto
				md:tw-ml-3
				lg:tw-ml-4.5
				tw-mt-1.5
				md:tw-mt-0"
				>
					<div
						v-show="!editDonation"
						class="tw-hidden md:tw-block tw-text-right"
					>
						<button
							class="donation-amount"
							data-testid="basket-donation-edit-button-combined"
							v-kv-track-event="['basket', 'Edit Donation']"
							@click="enterEditDonation"
							title="Edit Donation"
						>
							{{ formattedAmount }}
							<kv-material-icon
								role="img"
								aria-label="Edit Donation"
								title="Edit Donation"
								class="edit-donation tw-text-action
								tw-w-3.5
								tw-h-3.5
								tw-py-0.5
								tw-align-bottom
								"
								name="pencil"
								:icon="mdiPencil"
							/>
						</button>
					</div>
					<div v-show="editDonation" class="small-12 columns donation-amount-input-wrapper">
						<kv-text-input
							class="donation-amount-input"
							data-testid="basket-donation-edit-input"
							name="donation"
							id="donation"
							v-model="amount"
							@blur="validateInput"
							@keyup.enter.prevent="updateDonation()"
						/>
						<kv-button
							variant="secondary"
							class="update-donation-inline-button"
							data-testid="basket-donation-edit-submit"
							@click="updateDonation()"
						>
							Update
						</kv-button>
						<button
							class="show-for-medium remove-wrapper"
							@click="updateLoanAmount('remove')"
							data-testid="basket-donation-remove"
						>
							<kv-material-icon
								class="remove-x tw-text-tertiary"
								name="small-x"
								:from-sprite="true"
								title="Remove donation"
							/>
						</button>
					</div>
					<donate-repayments
						v-if="hasLoans"
						@updating-totals="$emit('updating-totals', $event)"
						@refreshtotals="$emit('refreshtotals')"
					/>
				</div>
			</div>
		</template>
		<template v-if="donateItemExperimentVersion === 'd'">
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-pb-5">
				<!-- donation image -->
				<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
					<img
						class="donation-img tw-w-12 lg:tw-w-13 tw-h-12 lg:tw-h-13 tw-rounded"
						:src="imageRequire(`./peace-sign-holding-money.svg`)"
						alt="donation line item image"
						data-testid="basket-donation-image"
					>
				</div>

				<!-- donation text -->
				<div class="tw-flex-auto">
					<div class="tw-mb-0.5">
						<div class="tw-w-full tw-flex">
							<h2
								class="tw-flex-1 md:tw-flex-grow tw-text-h3"
								data-testid="basket-donation-title"
							>
								{{ basketDonateModulesExpDonationHeader }}
							</h2>
							<button
								class="donation-amount md:tw-hidden tw-flex-none tw-align-middle"
								data-testid="basket-donation-edit-button-mobile-pencil"
								v-kv-track-event="['basket', 'Edit Donation']"
								@click="enterEditDonation"
								title="Edit Donation"
							>
								<kv-material-icon
									role="img"
									aria-label="Edit Donation"
									title="Edit Donation"
									class="edit-donation tw-text-action
									tw-w-3.5
									tw-h-3.5
									tw-py-0.5
									md:tw-hidden"
									name="pencil"
									:icon="mdiPencil"
								/>
							</button>
						</div>

						<div
							v-show="!editDonation"
							class="md:tw-hidden"
						>
							<button
								class="donation-amount"
								data-testid="basket-donation-edit-button-mobile-amount"
								v-kv-track-event="['basket', 'Edit Donation']"
								@click="enterEditDonation"
								title="Edit Donation"
							>
								{{ formattedAmount }}
								<kv-material-icon
									role="img"
									aria-label="Edit Donation"
									title="Edit Donation"
									class="edit-donation tw-text-action
									tw-w-3.5
									tw-h-3.5
									tw-py-0.5
									tw-hidden md:tw-inline-block
									"
									name="pencil"
									:icon="mdiPencil"
								/>
							</button>
						</div>

						<div>
							<div
								class="donation-tagline tw-text-small tw-text-secondary tw-my-1 tw-max-w-2xl"
								data-testid="basket-donation-tagline"
							>
								<p
									class="tw-text-small tw-text-secondary"
									v-html="basketDonateModulesExpDonationTagline"
								>
								</p>
							</div>
							<button
								class="tw-text-small tw-text-link"
								data-testid="basket-donation-info-lightbox"
								@click="triggerDefaultLightbox"
								v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']"
							>
								{{ donationDetailsLink }}
							</button>
						</div>
					</div>
				</div>

				<!-- donation total -->
				<div
					class="
				tw-flex-none
				tw-w-full
				md:tw-w-auto
				md:tw-ml-3
				lg:tw-ml-4.5
				tw-mt-1.5
				md:tw-mt-0"
				>
					<div
						v-show="!editDonation"
						class="tw-hidden md:tw-block tw-text-right"
					>
						<button
							class="donation-amount"
							data-testid="basket-donation-edit-button-combined"
							v-kv-track-event="['basket', 'Edit Donation']"
							@click="enterEditDonation"
							title="Edit Donation"
						>
							{{ formattedAmount }}
							<kv-material-icon
								role="img"
								aria-label="Edit Donation"
								title="Edit Donation"
								class="edit-donation tw-text-action
								tw-w-3.5
								tw-h-3.5
								tw-py-0.5
								tw-align-bottom
								"
								name="pencil"
								:icon="mdiPencil"
							/>
						</button>
					</div>
					<div v-show="editDonation" class="small-12 columns donation-amount-input-wrapper">
						<kv-text-input
							class="donation-amount-input"
							data-testid="basket-donation-edit-input"
							name="donation"
							id="donation"
							v-model="amount"
							@blur="validateInput"
							@keyup.enter.prevent="updateDonation()"
						/>
						<kv-button
							variant="secondary"
							class="update-donation-inline-button"
							data-testid="basket-donation-edit-submit"
							@click="updateDonation()"
						>
							Update
						</kv-button>
						<button
							class="show-for-medium remove-wrapper"
							@click="updateLoanAmount('remove')"
							data-testid="basket-donation-remove"
						>
							<kv-material-icon
								class="remove-x tw-text-tertiary"
								name="small-x"
								:from-sprite="true"
								title="Remove donation"
							/>
						</button>
					</div>
					<donate-repayments
						v-if="hasLoans"
						@updating-totals="$emit('updating-totals', $event)"
						@refreshtotals="$emit('refreshtotals')"
					/>
				</div>
			</div>
		</template>
		<template v-if="donateItemExperimentVersion === 'e' && orderTotalVariant && hasLoans">
			<div class="tw-flex tw-flex-col tw-w-full tw-pb-2">
				<div class="tw-flex tw-flex-row tw-w-full">
					<!-- donation text -->
					<div class="tw-w-auto tw-text-left md:tw-text-right tw-flex-1">
						<h2
							class="tw-text-h3"
							data-testid="basket-donation-title"
						>
							Donate to Kiva:
						</h2>
					</div>

					<!-- donation total -->
					<div
						v-show="!editDonation"
						class="tw-block tw-text-right"
					>
						<button
							class="donation-amount tw-text-h3 tw-flex"
							data-testid="basket-donation-edit-button-combined"
							v-kv-track-event="['basket', 'Edit Donation']"
							@click="enterEditDonation"
							title="Edit Donation"
						>
							<div class="tw-text-right tw-inline-block tw-pl-2">
								{{ formattedAmount }}
							</div>
							<kv-material-icon
								role="img"
								aria-label="Edit Donation"
								title="Edit Donation"
								class="edit-donation
											tw-text-action
											tw-w-2.5
											tw-ml-2
											tw-h-3.5
											tw-py-0.5
											tw-align-bottom
									"
								name="pencil"
								:icon="mdiPencil"
							/>
						</button>
					</div>
					<div v-show="editDonation" class="donation-amount-input-wrapper">
						<kv-text-input
							class="donation-amount-input"
							data-testid="basket-donation-edit-input"
							name="donation"
							id="donation"
							v-model="amount"
							@blur="validateInput"
							@keyup.enter.prevent="updateDonation()"
						/>
						<kv-button
							variant="secondary"
							class="update-donation-inline-button"
							data-testid="basket-donation-edit-submit"
							@click="updateDonation()"
						>
							Update
						</kv-button>
						<button
							class="show-for-medium remove-wrapper"
							@click="updateLoanAmount('remove')"
							data-testid="basket-donation-remove"
						>
							<kv-material-icon
								class="remove-x tw-text-tertiary"
								name="small-x"
								:from-sprite="true"
								title="Remove donation"
							/>
						</button>
					</div>
				</div>

				<donate-repayments
					v-if="hasLoans"
					@updating-totals="$emit('updating-totals', $event)"
					@refreshtotals="$emit('refreshtotals')"
				/>
			</div>
		</template>
		<!-- Donation nudge lightbox -->
		<donation-nudge-lightbox
			ref="nudgeLightbox"
			:loan-count="loanCount"
			:loan-reservation-total="loanReservationTotal"
			:nudge-lightbox-visible="nudgeLightboxVisible"
			:close-nudge-lightbox="closeNudgeLightbox"
			:update-donation-to="updateDonationTo"
			:has-custom-donation="hasCustomDonation"
			:description="donationNudgeDescription()"
			:percentage-rows="donationNudgePercentageRows"
			:current-donation-amount="amount"
		/>

		<!-- How kiva use's donations lightbox -->
		<kv-lightbox
			:visible="defaultLbVisible"
			@lightbox-closed="lightboxClosed"
			title="How does Kiva use donations?"
			data-testid="basket-donation-how-kiva-uses-lightbox"
		>
			<div class="tw-prose">
				<p>
					100% of money lent on Kiva goes to funding loans,
					so we rely on donations to continue this important work.
					Each dollar helps us invest in systemic change and spread financial inclusion around the world.
				</p>
				<p>
					We’re investing in lasting solutions for a more inclusive world through your donations.
					Projects like...
				</p>
				<ul>
					<li>
						Kiva Capital, scaling our model for institutional investors.
					</li>
					<li>
						Kiva Labs, supporting small and growing social enterprises around the world.
					</li>
				</ul>
				<p>
					Your donations also help over 100 Kiva employees and more than 400 volunteers
					make your loans happen!
				</p>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import numeral from 'numeral';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { mdiPencil } from '@mdi/js';
import logFormatter from '@/util/logFormatter';
import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experimentUtils';

import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import donationDataQuery from '@/graphql/query/checkout/donationData.graphql';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';

import DonationNudgeLightbox from '@/components/Checkout/DonationNudge/DonationNudgeLightbox';
import DonateRepayments from '@/components/Checkout/DonateRepaymentsToggle';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const imageRequire = require.context('@/assets/images/kiva-classic-illustrations/', true);

export default {
	name: 'DonationItem',
	components: {
		KvMaterialIcon,
		KvButton,
		KvLightbox,
		KvTextInput,
		DonateRepayments,
		DonationNudgeLightbox,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		donation: {
			type: Object,
			default: () => {}
		},
		loanCount: {
			type: Number,
			default: 0
		},
		loanReservationTotal: {
			type: Number,
			default: 0,
		},
		orderTotalVariant: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			defaultLbVisible: false,
			amount: numeral(this.donation.price).format('$0,0.00'),
			cachedAmount: numeral(this.donation.price).format('$0,0.00'),
			editDonation: false,
			nudgeLightboxVisible: false,
			hasCustomDonation: true,
			donationNudgeExperimentalDescription: false,
			loanHistoryCount: null,
			donationDetailsLink: 'How Kiva uses donations',
			dynamicDonationItem: '',
			mdiPencil,
			imageRequire,
			donateItemExperimentVersion: 'a'
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: donationDataQuery
			}).then(() => {
				return client.query({ query: experimentQuery, variables: { id: 'basket_donate_modules' } });
			}).catch(errorResponse => {
				logFormatter(errorResponse, 'error');
			});
		}
	},
	created() {
		const donateModuleExpData = getExperimentSettingCached(this.apollo, 'basket_donate_modules');
		if (donateModuleExpData?.enabled) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Basket',
				'basket_donate_modules',
				'EXP-ACK-440-Oct2022'
			);
			if (version) {
				this.donateItemExperimentVersion = version;
			}
		}

		this.setupContentfulContent();
	},
	watch: {
		// watching the computed serverAmount property allows us to get set updates based on nested data props
		serverAmount() {
			this.amount = numeral(this.donation.price).format('0,0.00');
		},
	},
	computed: {
		donationTitle() {
			return 'Donation to Kiva';
		},
		hasLoans() {
			return this.loanCount > 0;
		},
		serverAmount() {
			return numeral(this.donation.price).format('$0,0.00');
		},
		formattedAmount() {
			return numeral(this.amount).format('$0,0.00');
		},
		donationTagLine() {
			const loanCost = numeral(Math.floor(this.loanReservationTotal * 0.12)).format('$0,0');
			// if there is dynamic donation tagline from contentful, use that.
			if (this.dynamicDonationItem) {
				// process contentful content as rich text
				const contentfulHTML = documentToHtmlString(this.dynamicDonationItem);
				// replace magic variable ###loan_costs###
				return contentfulHTML.replace(/###loan_costs###/g, loanCost);
			}

			let coverOurCosts = `${this.loanCount > 1 ? 'These loans cost' : 'This loan costs'}`;
			coverOurCosts += ` Kiva more than ${loanCost} to facilitate. Will you help us cover our costs?`;
			return coverOurCosts;
		},
		donationNudgePercentageRows() {
			const basePercentageRows = [
				{
					percentage: 15,
					appeal: `Cover the cost to facilitate ${this.loanCount > 1 ? 'these loans' : 'this loan'}`,
					appealIsHorizontallyPadded: false,
				},
				{
					percentage: 20,
					appeal: 'Reach more people around the world!',
					appealIsHorizontallyPadded: false,
				},
			];
			const lowPercentage = [{
				percentage: 10,
				appeal: 'Cover some of Kiva\'s costs',
				appealIsHorizontallyPadded: true,
			}];
			return this.hasCustomDonation ? basePercentageRows : lowPercentage.concat(basePercentageRows);
		},
		basketDonateModulesExpDonationHeader() {
			if (!this.hasLoans) {
				return this.donationTitle;
			}

			switch (this.donateItemExperimentVersion) {
				// variant a is the control, and uses this.donationTitle
				case 'b':
				case 'c':
				default:
					return 'Help our team find more borrowers';
				case 'd':
					return 'Help cover the cost of your loan';
			}
		},
		basketDonateModulesExpDonationTagline() {
			if (!this.hasLoans) {
				// eslint-disable-next-line max-len
				return 'As an international nonprofit, we’re committed to transparency about how your funds are used. 100% of money lent on Kiva goes to supporting borrowers. Your donations help us cover the costs of distributing these loans and reach more borrowers across the globe.';
			}

			switch (this.donateItemExperimentVersion) {
				// variant a is the control, and uses this.donationTagLine
				case 'b':
				case 'c':
				default:
					// eslint-disable-next-line max-len
					return '<em>"Our team works one-on-one with partners so they can find and support borrowers with services like training and healthcare.	Your tips make our work possible."</em><br> &dash; Carolina, Borrower success team.';
				case 'd':
					// eslint-disable-next-line max-len
					return 'Loans aren\'t free for us to manage. Our expenses include borrower due diligence, partner training, site maintenance and more. We rely on our generous donors to break even.';
			}
		}
	},
	methods: {
		updateDonationTo(amount) {
			if (amount === undefined) {
				return;
			}
			this.amount = numeral(amount).format('0.00');
			this.updateDonation();
		},
		enterEditDonation() {
			if (this.hasLoans) {
				this.openNudgeLightbox();
			} else {
				this.editDonation = true;
			}
		},
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		setupContentfulContent() {
			const contentfulContentRaw = this.apollo.readQuery({
				query: donationDataQuery,
			});
			const pageEntry = contentfulContentRaw?.contentful?.entries?.items?.[0] ?? null;
			const pageData = pageEntry ? processPageContentFlat(pageEntry) : null;
			// eslint-disable-next-line max-len
			this.dynamicDonationItem = pageData?.page?.contentGroups?.checkoutDonationItem?.contents?.[0]?.richText ?? '';
		},
		updateDonation() {
			this.editDonation = false;
			this.$emit('updating-totals', true);
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: numeral(this.amount).format('0.00'),
					isTip: this.donation.isTip
				}
			}).then(data => {
				if (data.errors) {
					data.errors.forEach(({ message }) => {
						this.$showTipMsg(message, 'error');
					});
					this.amount = this.cachedAmount;
					this.$emit('updating-totals', false);
				} else {
					this.$emit('refreshtotals');
					this.$kvTrackEvent(
						'basket',
						'Update Donation',
						'Update Success',
						// pass donation amount as whole number
						numeral(this.amount).value() * 100,
						numeral(this.amount).value() * 100
					);
					this.amount = numeral(this.amount).format('$0,0.00');
					this.cachedAmount = numeral(this.amount).format('$0,0.00');
				}
			}).catch(error => {
				console.error(error);
				this.$emit('updating-totals', false);
			});
		},
		validateInput() {
			// get donation value from input, store it as donationValue
			const donationValue = document.getElementById('donation').value;

			// format the value taken from the donation input
			const verifiedInput = numeral(donationValue).format('$0,0.00');

			// inject the verfied input back into the donation input field
			// numeral takes care of non-numerical inputs, does it's best guess
			// formed value. If input can't be deciphered then $0.00 is returned
			document.getElementById('donation').value = verifiedInput;
		},
		closeNudgeLightbox() {
			this.nudgeLightboxVisible = false;
		},
		openNudgeLightbox() {
			this.$kvTrackEvent('basket', 'click-open nudge');
			this.nudgeLightboxVisible = true;
			this.$nextTick(() => {
				this.$refs.nudgeLightbox.expandNudgeLightbox();
			});
		},
		donationNudgeDescription() {
			/* eslint-disable max-len */
			return 'Reaching financially excluded people around the world requires things like performing due diligence in over 80 countries, training hundreds of volunteer translators, and maintaining the infrastructure to facilitate over $1B in loans.';
			/* eslint-enable max-len */
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.inline-donation-amount {
	width: rem-calc(132);

	@include breakpoint(medium) {
		width: rem-calc(90);
	}
}

.donation-amount-input-wrapper {
	padding-left: rem-calc(10);

	.update-donation-inline-button.secondary {
		@extend .inline-donation-amount;
	}

	@include breakpoint(medium) {
		float: right;
		white-space: nowrap;
	}
}

.donation-amount-input {
	@extend .inline-donation-amount;

	display: block;
	margin-bottom: rem-calc(15);
}

.show-for-medium {
	&.remove-wrapper {
		display: inline;
		padding-left: rem-calc(10);
		visibility: hidden;
	}

	.remove-x {
		display: inline-block;
		width: 1.1rem;
		height: rem-calc(36);
	}
}

</style>
