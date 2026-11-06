<template>
	<form class="tw-flex tw-flex-col tw-gap-2" data-testid="invite-composer-email" @submit.prevent="send">
		<h3 class="tw-text-h4">
			Email friends
		</h3>
		<div>
			<label for="invite-composer-emails" class="tw-sr-only">Email addresses</label>
			<textarea
				id="invite-composer-emails"
				v-model="emails"
				:class="fieldClass"
				rows="3"
				aria-describedby="invite-composer-emails-hint"
				:disabled="fieldsDisabled"
				data-testid="invite-composer-emails"
				@change="trackChange('recipients')"
			></textarea>
			<p id="invite-composer-emails-hint" class="tw-text-small tw-text-secondary">
				Separate email addresses with commas.
			</p>
		</div>
		<div>
			<label for="invite-composer-from" class="tw-block tw-mb-0.5">From</label>
			<KvTextInput
				id="invite-composer-from"
				class="tw-w-full"
				:model-value="senderName"
				disabled
				data-testid="invite-composer-from"
			/>
		</div>
		<div>
			<label for="invite-composer-subject" class="tw-block tw-mb-0.5">Subject</label>
			<KvTextInput
				id="invite-composer-subject"
				class="tw-w-full"
				v-model="subject"
				:disabled="fieldsDisabled"
				data-testid="invite-composer-subject"
				@change="trackChange('subject')"
			/>
		</div>
		<div>
			<label for="invite-composer-message" class="tw-block tw-mb-0.5">Message</label>
			<textarea
				id="invite-composer-message"
				v-model="message"
				:class="fieldClass"
				rows="6"
				:disabled="fieldsDisabled"
				data-testid="invite-composer-message"
				@change="trackChange('message')"
			></textarea>
		</div>
		<div>
			<KvButton
				type="submit"
				:state="buttonState"
				data-testid="invite-composer-send"
			>
				Send invitations
			</KvButton>
			<!-- Spaced only once it has lines, so the empty region adds no space below the button -->
			<InviteResultLines
				ref="result"
				:class="{ 'tw-mt-2': result?.lines?.length }"
				:lines="result?.lines"
				:success="result?.success"
				tabindex="-1"
				data-testid="invite-composer-result"
			/>
		</div>
	</form>
</template>

<script>
import { KvButton, KvTextInput } from '@kiva/kv-components';
import InviteResultLines from '#src/components/Portfolio/Invites/InviteResultLines';
import logFormatter from '#src/util/logFormatter';
import focusIfDropped from '#src/util/invites/focusIfDropped';
import { INVITE_ERROR_MESSAGE, INVITE_RECIPIENT_STATUS } from '#src/util/invites/invitesConstants';
import sendInvitesMutation from '#src/graphql/mutation/invites/sendInvites.graphql';

const DEFAULT_MESSAGE = 'With Kiva, you can make a difference by lending just $25 to people around the globe. '
	+ 'I\'m already lending on Kiva and thought you\'d like to join me!';

export default {
	name: 'InviteComposer',
	components: {
		InviteResultLines,
		KvButton,
		KvTextInput,
	},
	inject: ['apollo'],
	props: {
		/** The viewer's first name, which signs the invite when they are public */
		firstName: {
			type: String,
			default: '',
		},
		/** Whether the viewer has a public profile */
		isPublic: {
			type: Boolean,
			default: false,
		},
		/** Whether the composer can be used yet: its defaults depend on the viewer */
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['sent'],
	data() {
		return {
			emails: '',
			subject: '',
			message: '',
			sending: false,
			// { success, lines } from the last send
			result: null,
			fieldClass: 'tw-w-full tw-px-2 tw-py-1 tw-border tw-border-tertiary tw-rounded-xs tw-bg-primary '
				+ 'tw-text-base tw-ring-inset focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-action '
				+ 'focus:tw-border-transparent disabled:tw-opacity-low',
		};
	},
	computed: {
		// Invites name the viewer only when their profile is public
		signature() {
			return this.isPublic && this.firstName ? this.firstName : '';
		},
		senderName() {
			return this.signature || 'Anonymous';
		},
		defaultSubject() {
			return this.signature
				? `${this.signature} invites you to make a difference on Kiva!`
				: 'You\'re invited to make a difference on Kiva!';
		},
		defaultMessage() {
			return this.signature ? `${DEFAULT_MESSAGE}\n\n- ${this.signature}` : DEFAULT_MESSAGE;
		},
		fieldsDisabled() {
			return this.disabled || this.sending;
		},
		buttonState() {
			if (this.sending) {
				return 'loading';
			}
			return this.disabled ? 'disabled' : '';
		},
	},
	watch: {
		// The defaults arrive with the viewer, before the composer is enabled
		defaultSubject: {
			handler(value) {
				this.subject = value;
			},
			immediate: true,
		},
		defaultMessage: {
			handler(value) {
				this.message = value;
			},
			immediate: true,
		},
	},
	methods: {
		// A change fires when the viewer leaves a field they edited, not on each keystroke or when the form resets
		trackChange(field) {
			this.$kvTrackEvent('portfolio', 'change', `Invites email ${field}`);
		},
		async send() {
			if (this.fieldsDisabled) {
				return;
			}
			this.$kvTrackEvent('portfolio', 'click', 'Invites send email');
			this.sending = true;
			this.result = null;
			try {
				const { data, errors } = await this.apollo.mutate({
					mutation: sendInvitesMutation,
					variables: { emails: this.emails, subject: this.subject, message: this.message },
				});
				const result = data?.my?.sendInvites;
				if (errors?.length || !result) {
					throw new Error(JSON.stringify(errors ?? 'missing result'));
				}
				this.result = { success: result.success, lines: result.lines };
				if (result.success) {
					this.emails = '';
					this.subject = this.defaultSubject;
					this.message = this.defaultMessage;
				}
				if (result.results.some(({ status }) => status === INVITE_RECIPIENT_STATUS.SENT)) {
					this.$emit('sent');
				}
			} catch (error) {
				this.result = { success: false, lines: [INVITE_ERROR_MESSAGE] };
				logFormatter(`Error sending invites: ${error}`, 'error');
			} finally {
				this.sending = false;
				this.restoreFocus();
			}
		},
		// The send button is disabled while sending, which drops focus to the page. Focus moves to the result, so
		// keyboard users continue from it.
		async restoreFocus() {
			await this.$nextTick();
			focusIfDropped(this.$refs.result?.$el);
		},
	},
};
</script>
