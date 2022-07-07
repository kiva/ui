<template>
	<kv-lightbox
		:visible="iFrameVisible"
		:prevent-close="true"
		id="faFormLightbox"
	>
		<div class="content" ref="formContainerRef">
			<iframe
				id="faForm"
				:src="iFrameSrc"
				:height="iFrameHeight"
				:width="iFrameWidth"
				frameborder="0"
			></iframe>

			<div class="tw-text-center">
				<kv-button
					class="text-link"
					@click.native="optOut"
				>
					No thanks, I'll opt out
				</kv-button>
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import gql from 'graphql-tag';
import logFormatter from '@/util/logFormatter';
import parseSPCookie from '@/util/parseSPCookie';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	name: 'CampaignVerificationForm',
	inject: ['apollo', 'cookieStore'],
	metaInfo: {
		// script: [
		// 	{ src: '//kiva.tfaforms.net/js/iframe_resize_helper.js', async: true }
		// ],
	},
	components: {
		KvLightbox,
		KvButton,
	},
	props: {
		formId: {
			type: String,
			default: null
		},
		maId: {
			type: String,
			default: ''
		},
		pfId: {
			type: String,
			default: ''
		},
		userId: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			iFrameSrc: null,
			iFrameVisible: false,
			iFrameWidth: 500,
			iFrameHeight: 500,
			spId: '',
			spUserId: '',
		};
	},
	mounted() {
		// make sure we have a form id to fetch
		if (this.formId) {
			// check the db to see if this user has already submitted to this form id
			this.checkFormSubmissionComplete();
		}
	},
	methods: {
		checkFormSubmissionComplete() {
			this.apollo.query({
				query: gql`query employeeVerificationFormQuery($formId: String!) {
					getForm(formId: $formId) {
						formId
						submittedTime
						userId
					}
				}`,
				variables: {
					formId: this.formId
				},
			}).then(({ data, errors }) => {
				if (errors && errors.length) {
					errors.forEach(error => {
						logFormatter(error, 'error');
					});
					return false;
				}
				// Check for record of form submission
				const formSubmittedTime = data?.getForm?.submittedTime ?? null;
				if (formSubmittedTime) {
					// close form and emit completion event if done
					this.iFrameVisible = false;
					this.$kvTrackEvent(
						'ManagedLendingCampaign',
						'modal-campaign-verification-closed',
						'Form Submission Exists in FormAssembly Service'
					);
					this.$emit('verification-complete');
				} else {
					// reinitialize the form
					this.initVerificationForm();
				}
			});
		},
		initVerificationForm() {
			this.getSnowplowSession().then(() => {
				this.setFrameSrc();
				this.setIFrameDimensions();
				if (this.formId) {
					this.iFrameVisible = true;
					this.$kvTrackEvent(
						'ManagedLendingCampaign',
						'modal-campaign-verification-shown'
					);
				}
				window.addEventListener('message', message => {
					this.handleIFrameMessage(message);
				});
			});
		},
		setFrameSrc() {
			if (!this.$isServer && window && window.location && this.formId) {
				// eslint-disable-next-line max-len
				this.iFrameSrc = `https://kiva.tfaforms.net/${this.formId}?tfa_1=${this.userId}&tfa_2=${this.maId}&tfa_3=${this.pfId}&tfa_4=${this.spId}&tfa_5=${this.spUserId}`;
			}
		},
		setIFrameDimensions() {
			const maxFormWidth = 500;
			this.iFrameWidth = this.$el.clientWidth < maxFormWidth ? this.$el.clientWidth - 90 : maxFormWidth;
			this.iFrameHeight = 500;
		},
		handleIFrameMessage(message) {
			const messageDataType = message?.data?.type;
			// Events emitted via 'postMessage'
			// 'fa_form_submitted' form submitted (may or may not be valid)
			// 'fa_form_closed' form completed and transitioned to thanks view
			if (messageDataType && messageDataType === 'fa_form_closed') {
				// compare the time closed with time submitted
				this.$nextTick(() => {
					// handle closing lightbox
					window.setTimeout(
						() => {
							this.iFrameVisible = false;
							this.$kvTrackEvent(
								'ManagedLendingCampaign',
								'modal-campaign-verification-closed',
								'Form Complete Signal from iframe'
							);
							this.$emit('verification-complete');
						},
						1000
					);
				});
			}
		},
		async getSnowplowSession() {
			// get tracking data from snowplow cookie
			const { snowplowUserId, snowplowSessionId } = parseSPCookie(this.cookieStore);
			this.spId = snowplowSessionId;
			this.spUserId = snowplowUserId;
		},
		optOut() {
			// hide verification form
			this.iFrameVisible = false;
			// track opt-out
			this.$kvTrackEvent(
				'ManagedLendingCampaign',
				'click-campaign-verification-optout',
				'No thanks, I\'ll opt out'
			);
			// initialize opt-out lightbox
			this.$emit('campaign-verification-opt-out');
		}
	}
};
</script>
<style lang="scss" scoped>
@import 'settings';

</style>
