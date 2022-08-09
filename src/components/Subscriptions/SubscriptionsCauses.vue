<template>
	<div class="row">
		<kv-settings-card class="column large-8" :title="causeName + ' Subscription'">
			<template #content>
				<div>
					<p class="tw-mb-2">
						On the <button
							class="tw-text-link tw-font-medium"
							@click="showEditLightbox = true;"
						>
							{{ dayOfMonth | numeral('Oo') }}
						</button> of each month <button
							class="tw-text-link tw-font-medium"
							@click="showEditLightbox = true;"
						>
							{{ amount | numeral('$0,0.00') }}
						</button> will be
						transferred <button
							class="tw-text-link tw-font-medium"
							@click="showEditLightbox = true;"
						>
							for {{ causeName | changeCase('noCase') }}.
						</button>
					</p>

					<button
						class="tw-text-link tw-font-medium"
						@click="showCancelLightbox = true"
						v-kv-track-event="[
							'Causes',
							'click-cancel-cause-subscription',
							`Cancel ${causeName} Subscription`
						]"
					>
						Cancel Subscription
					</button>

					<!-- Edit Causes Lightbox -->
					<kv-lightbox
						class="causes-update-lightbox"
						:visible="showEditLightbox"
						:title="settingsOpen ? 'Change your subscription' : 'Update payment method'"
						@lightbox-closed="closeLightbox"
					>
						<div class="causes-update-lightbox__content">
							<transition :name="slideTransition" mode="out-in">
								<!-- Deposit Settings -->
								<div
									v-if="settingsOpen"
									class="row column" key="depositSettings"
								>
									<causes-update-form
										:day-of-month="dayOfMonth"
										:category-id="categoryId"
										:amount="amount"
										:disabled="isSaving"
										@form-update="formUpdated"
										class="causes-update-lightbox__form"
									/>
									<div class="causes-update-lightbox__payment-method">
										<div class="row">
											<div class="column tw-text-right">
												<button
													class="tw-text-link tw-font-medium tw-mt-2"
													@click="toggleSections"
												>
													Update Payment Method
													<kv-icon class="icon-pencil" name="pencil" title="Edit" />
												</button>
											</div>
										</div>
									</div>
								</div>
								<!-- Payment Methods -->
								<div
									v-if="!settingsOpen"
									class="row column" key="paymentSettings"
								>
									<button
										class="tw-text-link tw-font-medium"
										@click="toggleSections"
									>
										<kv-icon
											class="arrow back-arrow tw-stroke-current"
											name="small-chevron"
											:from-sprite="true"
										/>
										Back to deposit settings
									</button>

									<div class="causes-update-lightbox__dropin-payment-wrapper">
										<causes-drop-in-payment-wrapper
											action="Update"
											:amount="amount"
											:day-of-month="dayOfMonth"
											:subscription-id="subscriptionId"
											@complete-transaction="completeCausesUpdatePayment"
										/>
									</div>
								</div>
							</transition>
						</div>
						<template #controls>
							<kv-button
								data-test="causes-save-button"
								@click="saveCausesSubscription"
								:state="saveButtonState"
								v-if="settingsOpen"
							>
								Save Settings
							</kv-button>
						</template>
					</kv-lightbox>
				</div>

				<!-- Cause Cancellation Flow -->
				<subscriptions-causes-cancellation-flow
					:show-cancel-lightbox="showCancelLightbox"
					:subscription-id="subscriptionId"
					@confirm-cancel="$emit('cancel-subscription', subscriptionId); showCancelLightbox = false;"
					@abort-cancel="showCancelLightbox = false"
				/>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
/**  TODO - Future enhancement to this component would be
* to possibly handle the case of multiple enabled subscriptions */
import gql from 'graphql-tag';
import updateSubscription from '@/graphql/mutation/updateSubscription.graphql';

import CausesUpdateForm from '@/components/Forms/CausesUpdateForm';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvIcon from '@/components/Kv/KvIcon';
import CausesDropInPaymentWrapper from '@/components/Causes/CausesDropInPaymentWrapper';

import SubscriptionsCausesCancellationFlow from
	'@/components/Subscriptions/SubscriptionsCausesCancellationFlow';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const pageQuery = gql`query causeSubscription {
	mySubscriptions(includeDisabled: false) {
		values {
			id
			enabled
			category {
				id
				subscriptionType
				name
			}
			amount
			schedule {
				dayOfMonth
			}
		}
	}
}`;

export default {
	name: 'SubscriptionsCauses',
	inject: ['apollo', 'cookieStore'],
	components: {
		CausesUpdateForm,
		CausesDropInPaymentWrapper,
		KvButton,
		KvIcon,
		KvLightbox,
		KvSettingsCard,
		SubscriptionsCausesCancellationFlow,
	},
	data() {
		return {
			causeName: '',
			categoryId: '',
			subscriptionId: '',
			dayOfMonth: new Date().getDate(),
			amount: 0,
			showEditLightbox: false,
			showCancelLightbox: false,
			settingsOpen: true, // if settingsOpen is false, payment update section is shown
			isSaving: false,
			isChanged: false,
			isFormValid: true,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			const activeCausesSubscription = data?.mySubscriptions?.values?.[0];
			this.causeName = activeCausesSubscription?.category?.name ?? '';
			this.subscriptionId = activeCausesSubscription?.id ?? '';
			this.dayOfMonth = activeCausesSubscription?.schedule?.dayOfMonth;
			this.amount = activeCausesSubscription?.amount;
			this.categoryId = activeCausesSubscription?.category?.id ?? '';
		},
	},
	computed: {
		slideTransition() {
			return this.settingsOpen ? 'kv-slide-right' : 'kv-slide-left';
		},
		saveButtonState() {
			if (!this.isChanged || !this.isFormValid) {
				return 'disabled';
			}
			if (this.isSaving) {
				return 'loading';
			}
			return '';
		}
	},
	methods: {
		toggleSections() {
			this.settingsOpen = !this.settingsOpen;
		},
		/** This method is triggered when the form is updated.
		* Sets the values in this component to the form values
		* @param {Object} form - Update form values
		* @param {number} form.amount - Causes amount.
		* @param {number} form.dayOfMonth - Cause day of month.
		* @param {string} form.categoryId - Cause category id.
		* @param {boolean} form.isChanged - is the form dirty.
		* @param {boolean} form.isFormValid - is the form valid.
		*/
		formUpdated({
			amount, dayOfMonth, categoryId, categoryName, isChanged, isFormValid
		}) {
			this.amount = amount;
			this.dayOfMonth = dayOfMonth > 28 ? 28 : dayOfMonth;
			this.categoryId = categoryId;
			this.isChanged = isChanged;
			this.isFormValid = isFormValid;
			this.causeName = categoryName;
		},
		saveCausesSubscription() {
			this.isSaving = true;
			const updateCauseSubscription = this.apollo.mutate({
				mutation: updateSubscription,
				variables: {
					subscriptionId: this.subscriptionId,
					categoryId: this.categoryId,
					dayOfMonth: this.dayOfMonth,
					amount: this.amount,
					donation: 0,
					noteSize: 5, // TODO make this some kind of global setting?
					lendingDelay: 0,
					period: 'MONTHLY'
				}
			});

			return updateCauseSubscription.then(response => {
				if (response.errors) {
					this.$showTipMsg('There was a problem saving your settings', 'error');
				} else {
					this.$showTipMsg('Settings saved!');
				}
			}).catch(e => {
				console.error(e);
				this.$showTipMsg('There was a problem saving your settings', 'error');
			}).finally(() => {
				this.isSaving = false;
				this.$emit('unsaved-changes', false);
				this.showEditLightbox = false;
			});
		},
		completeCausesUpdatePayment() {
			this.$kvTrackEvent('Causes', 'successful-update-causes-payment', 'update-causes-payment');
			this.showEditLightbox = false;
			// reset lightbox state
			this.settingsOpen = true;
			// refetch page query with updated information
			this.apollo.query({ query: pageQuery, fetchPolicy: 'network-only' });
			this.$showTipMsg('Payment method updated');
		},
		closeLightbox() {
			/** If form is changed, let parent component know so save button can be displayed
			 * This method will not be executed when lightbox closes after saving.
			*/
			if (this.isChanged) {
				this.$emit('unsaved-changes', true);
			}
			this.showEditLightbox = false;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.causes-update-lightbox {
	&__content {
		overflow: hidden;
		max-width: 100%;

		@include breakpoint('large') {
			width: rem-calc(530);
		}

		@include breakpoint('xxlarge') {
			width: rem-calc(620);
		}
	}

	&__form,
	&__payment-method {
		padding-left: 0.5rem;
	}

	&__payment-method {
		padding-right: 2rem;
	}

	&__dropin-payment-wrapper {
		margin: 1rem 0 0;
		padding-left: 0.5rem;
	}

	&__current-payment-method {
		margin: 1rem 0;
	}

	&__cc-icon {
		height: 1.5rem;
		margin-top: -0.33rem;
	}

	.arrow {
		width: rem-calc(13);
		height: rem-calc(9);

		&.back-arrow {
			transform: rotate(90deg);
		}
	}

	.icon-pencil {
		height: 1rem;
		width: 1rem;
	}
}
</style>
