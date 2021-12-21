<template>
	<div class="row">
		<kv-settings-card class="column large-8" :title="causeName + ' Subscription'">
			<template #content>
				<div>
					<p>
						On the <kv-button class="text-link"
							@click.native.prevent="showEditLightbox = true;"
						>
							{{ dayOfMonth | numeral('Oo') }}
						</kv-button> of each month <kv-button class="text-link"
							@click.native.prevent="showEditLightbox = true;"
						>
							{{ amount | numeral('$0,0.00') }}
						</kv-button> will be
						transferred <kv-button class="text-link"
							@click.native.prevent="showEditLightbox = true;"
						>
							for {{ causeName | changeCase('noCase') }}.
						</kv-button>
					</p>
					<p>
						<kv-button class="text-link"
							@click.native.prevent="showCancelLightbox = true"
							v-kv-track-event="[
								'Causes',
								'click-cancel-cause-subscription',
								`Cancel ${causeName} Subscription`
							]"
						>
							Cancel Subscription
						</kv-button>
					</p>

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
									<kv-button
										data-test="causes-save-button"
										class="smaller button"
										v-if="!isSaving"
										@click.native="saveCausesSubscription"
										:disabled="!isChanged || !isFormValid"
									>
										Save Settings
									</kv-button>
									<kv-button data-test="causes-save-button" class="smaller button" v-else>
										Saving <kv-loading-spinner />
									</kv-button>
								</div>
							</transition>
						</div>
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
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import SubscriptionsCausesCancellationFlow from
	'@/components/Subscriptions/SubscriptionsCausesCancellationFlow';

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
	inject: ['apollo', 'cookieStore'],
	components: {
		CausesUpdateForm,
		KvButton,
		KvLightbox,
		KvLoadingSpinner,
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
	},
	methods: {
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
		margin: 1.5rem 0 0;

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
		margin-bottom: 2rem;
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
		stroke: $blue;
		width: rem-calc(13);
		height: rem-calc(9);

		&.back-arrow {
			transform: rotate(90deg);
		}
	}

	.button--link {
		color: $kiva-accent-blue;
		fill: $kiva-accent-blue;
		cursor: pointer;
		padding: 0.5rem;
	}

	.icon-pencil {
		height: 1rem;
		width: 1rem;
	}
}
</style>
