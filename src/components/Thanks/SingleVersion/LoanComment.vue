<template>
	<div
		v-if="showComment"
		class="tw-rounded md:tw-rounded-xl tw-mx-auto tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4 tw-w-full
            print:tw-hidden"
	>
		<KvUserAvatar
			:lender-name="loanName"
			:lender-image-url="loanImageUrl"
			class="tw-mx-auto tw-w-6 tw-h-6"
		/>
		<h2	class="tw-mt-1 tw-mb-3 tw-text-center" style="line-height: 1.25;">
			Tell others why you love this loan to <span class="data-hj-suppress">{{ loanName }}</span>
		</h2>
		<div class="tw-relative">
			<textarea
				class="tw-w-full tw-border tw-border-secondary tw-rounded tw-h-7 tw-p-2"
				style="height: 10rem;"
				v-model="userComment"
				:placeholder="placeholderComment"
			>
			</textarea>
			<KvMaterialIcon
				class="tw-w-2.5 tw-h-2.5 tw-absolute tw-bottom-2 tw-right-2"
				:icon="mdiPencilOutline"
			/>
		</div>
		<small
			class="tw-text-left tw-block"
		>Please follow our
			<button
				class="tw-text-action hover:tw-text-action-highlight"
				v-kv-track-event="['post-checkout', 'show', 'comments-ask', 'guidelines']"
				@click="showLightbox = true"
			>
				community guidelines
			</button>
		</small>
		<KvButton
			class="tw-mt-2 tw-w-full"
			variant="primary"
			:state="buttonState"
			aria-label="Comment"
			@click="submitComment"
			v-kv-track-event="['post-checkout', 'submit', 'comments-ask', 'comment']"
		>
			Leave Comment
		</KvButton>

		<p class="tw-text-base tw-mt-2 tw-text-center">
			Your comments can really help <span class="data-hj-suppress">{{ loanName }}</span> fully fund their loan.
		</p>

		<KvLightbox
			:visible="showLightbox"
			title="Kiva Community Guidelines"
			@lightbox-closed="showLightbox = false"
		>
			<!-- eslint-disable max-len -->
			<div class="tw-prose">
				<p>
					Kiva is about connecting people to alleviate poverty. Please show respect for each other and our borrowers. Your comments are often passed to borrowers to give them a confidence boost.
				</p>
				<h3>Do</h3>
				<ul class="tw-mt-0">
					<li>Share why you supported a particular borrower, or lending partner.</li>
					<li>
						Tell the borrower the reasons they should believe in themselves.
					</li><li>
						Chime in on a comment another lender has written.
					</li>
				</ul>
				<h3>Don't</h3>
				<ul class="tw-mt-0">
					<li>Don't write comments about Kiva itself. Don't write comments about issues relating to historical repayments from the lending partner. Keep it on topic.</li>
					<li>
						Don't attack, harass or threaten anyone.
					</li><li>
						Don't spam our lenders.
					</li>
				</ul>
				<p>
					Your rights and responsibilities as part of the Kiva community are laid out in the <router-link
						to="/legal/terms"
						target="_blank"
					>
						Terms of Use
					</router-link> and the following guidelines, which apply to lending teams, comments, conversation tab posts, private messages, profiles and any other content posted on Kiva or Kiva's social media properties.
				</p>
				<p>
					The Kiva team reserves the right to remove posts and messages at our sole discretion. Frequent guideline violations may also lead to the loss of posting privileges. If you have any questions, concerns or grievances related to these guidelines, please write to our team at <a href="mailto:contactus@kiva.org">contactus@kiva.org</a>.
				</p>
				<!-- eslint-enable max-len -->
			</div>
		</KvLightbox>
	</div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { mdiPencilOutline } from '@mdi/js';
import logFormatter from '#src/util/logFormatter';
import {
	KvUserAvatar, KvMaterialIcon, KvLightbox, KvButton
} from '@kiva/kv-components';
import loanAddComment from '#src/graphql/mutation/loanAddComment.graphql';
import useTipMessage from '#src/composables/useTipMessage';
import { GUEST_COMMENT_COMMENT, GUEST_COMMENT_LOANID } from '#src/plugins/guest-comment-mixin';

const emit = defineEmits(['guest-continue']);

const apollo = inject('apollo');
const cookieStore = inject('cookieStore');

const { $showTipMsg } = useTipMessage(apollo);

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	loan: {
		type: Object,
		default: () => ({}),
	},
});

const showLightbox = ref(false);
const userComment = ref('');
const loading = ref(false);
const showComment = ref(true);

const loanId = computed(() => props.loan?.id ?? 0);

const loanName = computed(() => props.loan?.name ?? '');

const loanImageUrl = computed(() => props.loan?.image?.url ?? '');

const placeholderComment = computed(() => `Tell others why this loan to ${loanName.value} is great!`);

const buttonState = computed(() => {
	if (loading.value) return 'loading';
	if (!userComment.value) return 'disabled';
	return '';
});

/**
 * We don't currently allow guests to add comments due to requiring the user to have a team attribution for the loan.
 * This guest functionality was verified to be working and keeping in case we want to allow it in the future.
 */
const submitCommentAsGuest = () => {
	// Save comment to cookie
	cookieStore.set(GUEST_COMMENT_COMMENT, userComment.value, { path: '/' });
	cookieStore.set(GUEST_COMMENT_LOANID, loanId.value, { path: '/' });

	// Show create account form
	emit('guest-continue');
};

const submitCommentAsUser = () => {
	loading.value = true;
	apollo.mutate({
		mutation: loanAddComment,
		variables: {
			id: loanId.value,
			body: userComment.value
		}
	}).then(({ data }) => {
		// Comment was added successfully
		if (data.loan.addComment) {
			$showTipMsg(`Thank you for helping ${loanName.value}!`);
			showComment.value = false;
		} else {
			throw new Error('Comment not added');
		}
	}).catch(e => {
		logFormatter(e, 'error');
		$showTipMsg('There was a problem commenting on this loan', 'error');
	}).finally(() => {
		loading.value = false;
	});
};

const submitComment = () => {
	if (props.isGuest) {
		submitCommentAsGuest();
	} else {
		submitCommentAsUser();
	}
};
</script>
