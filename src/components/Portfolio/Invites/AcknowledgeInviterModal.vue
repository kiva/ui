<template>
	<KvLightbox
		:visible="visible"
		title="Invited to Kiva by a friend?"
		@lightbox-closed="$emit('close')"
	>
		<form
			class="tw-flex tw-flex-col tw-gap-2 data-hj-suppress"
			data-testid="ack-inviter-form"
			@submit.prevent="submit"
		>
			<p>
				Say thanks and help them track their overall impact by giving them credit for introducing you to Kiva.
			</p>
			<div>
				<label for="ack-inviter-input" class="tw-block tw-mb-0.5">
					Enter your friend's email address or lender page URL (i.e http://kiva.org/lender/kivastaff)
				</label>
				<KvTextInput
					id="ack-inviter-input"
					v-model="inviter"
					class="tw-w-full"
					:disabled="submitting"
					data-testid="ack-inviter-input"
				/>
			</div>
			<div>
				<KvButton
					type="submit"
					:state="submitting ? 'loading' : ''"
					data-testid="ack-inviter-submit"
				>
					Submit
				</KvButton>
			</div>
			<InviteResultLines :lines="lines" data-testid="ack-inviter-result" />
		</form>
	</KvLightbox>
</template>

<script>
import { KvButton, KvLightbox, KvTextInput } from '@kiva/kv-components';
import InviteResultLines from '#src/components/Portfolio/Invites/InviteResultLines';
import logFormatter from '#src/util/logFormatter';
import focusIfDropped from '#src/util/invites/focusIfDropped';
import {
	INVITE_ACKNOWLEDGE_STATUS, INVITE_ERROR_MESSAGE, INVITE_ORIGIN_COOKIE,
} from '#src/util/invites/invitesConstants';
import acknowledgeInviterMutation from '#src/graphql/mutation/invites/acknowledgeInviter.graphql';

export default {
	name: 'AcknowledgeInviterModal',
	components: {
		InviteResultLines,
		KvButton,
		KvLightbox,
		KvTextInput,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},
	// acknowledged: ({ inviter, lines }) once the inviter is credited. not-found: no inviter could be credited, which
	// includes the viewer already having one.
	emits: ['close', 'acknowledged', 'not-found'],
	data() {
		return {
			inviter: '',
			submitting: false,
			// What went wrong with the last submit
			lines: [],
		};
	},
	watch: {
		// Each opening starts empty, with focus on the entry
		async visible(value) {
			if (value) {
				this.inviter = '';
				this.lines = [];
				await this.$nextTick();
				document.getElementById('ack-inviter-input')?.focus();
			}
		},
	},
	methods: {
		async submit() {
			if (this.submitting) {
				return;
			}
			this.$kvTrackEvent('portfolio', 'click', 'Invites acknowledge inviter');
			this.submitting = true;
			this.lines = [];
			try {
				const { data, errors } = await this.apollo.mutate({
					mutation: acknowledgeInviterMutation,
					variables: {
						inviter: this.inviter,
						// Where the viewer came from, when they followed an invite link
						inviteRef: this.cookieStore.get(INVITE_ORIGIN_COOKIE) || null,
					},
				});
				const result = data?.my?.acknowledgeInviter;
				if (errors?.length || !result) {
					throw new Error(JSON.stringify(errors ?? 'missing result'));
				}
				if (result.status === INVITE_ACKNOWLEDGE_STATUS.ACKNOWLEDGED) {
					this.$emit('acknowledged', { inviter: result.inviter, lines: result.lines });
					return;
				}
				this.lines = result.lines;
				if (result.status === INVITE_ACKNOWLEDGE_STATUS.NOT_FOUND) {
					this.$emit('not-found');
				}
			} catch (error) {
				this.lines = [INVITE_ERROR_MESSAGE];
				logFormatter(`Error acknowledging inviter: ${error}`, 'error');
			} finally {
				this.submitting = false;
			}
			this.restoreFocus();
		},
		// The form is disabled while submitting, which drops focus to the page. It goes back to the entry, so it can
		// be corrected.
		async restoreFocus() {
			await this.$nextTick();
			if (this.visible) {
				focusIfDropped(document.getElementById('ack-inviter-input'));
			}
		},
	},
};
</script>
