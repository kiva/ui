<template>
	<transition name="kvfade">
		<div class="tw-bg-secondary" v-if="showComments">
			<kv-page-container>
				<kv-grid class="tw-grid-cols-12">
					<!-- comment form -->
					<div
						class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-pt-2 tw-mb-4"
						v-if="!showAccountCreation"
					>
						<h1	class="tw-mt-1 tw-mb-3 tw-text-left">
							Tell others why you love this loan to {{ loanName }}
						</h1>
						<p class="tw-m-0 tw-text-subhead">
							Your comments can really help {{ loanName }} fully fund their loan.
						</p>

						<div class="tw-mt-3 tw-text-center">
							<div class="tw-relative">
								<textarea
									class="tw-w-full tw-border tw-border-secondary tw-rounded tw-h-7 tw-p-2"
									style="height: 10rem;"
									v-model="userComment"
									:placeholder="placeholderComment"
								>
									</textarea>
								<kv-material-icon
									class="tw-w-2.5 tw-h-2.5 tw-absolute tw-bottom-2 tw-right-2"
									:icon="mdiPencilOutline"
								/>
							</div>
							<small
								class="tw-text-left tw-block"
							>Please follow our <button
								class="tw-text-action hover:tw-text-action-highlight"
								v-kv-track-event="['post-checkout', 'show', 'comments-ask', 'guidelines']"
								@click="showLightbox = true"
							>community guidelines</button></small>
							<kv-button
								class="tw-mt-3"
								variant="primary"
								:state="buttonState"
								aria-label="Comment"
								@click="submitComment"
								v-kv-track-event="['post-checkout', 'submit', 'comments-ask', 'comment']"
							>
								Comment
							</kv-button>
						</div>
						<button
							class="tw-block tw-mx-auto tw-text-action
							tw-underline hover:tw-text-action-highlight tw-mt-2"
							@click="showComments = false"
							v-kv-track-event="['post-checkout', 'dismiss', 'comments-ask']"
						>
							No thanks, maybe later
						</button>
						<kv-lightbox
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
						</kv-lightbox>
					</div>
					<!-- guest account creation -->
					<div
						class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-pt-2 tw-mb-4"
						v-if="showAccountCreation"
					>
						<h1	class="tw-mt-1 tw-mb-3 tw-text-left">
							Create your account
						</h1>
						<p class="tw-m-0 tw-text-subhead">
							<!-- eslint-disable-next-line max-len -->
							Only registered users can leave comments. Finish your account creation to leave your comment on this loan.
						</p>

						<div class="tw-mt-3 tw-max-w-sm tw-mx-auto">
							<guest-account-creation
								:guest-username="guestUsername"
							/>
						</div>
					</div>
				</kv-grid>
			</kv-page-container>
		</div>
	</transition>
</template>

<script>
import logFormatter from '#src/util/logFormatter';
import { mdiPencilOutline } from '@mdi/js';
import loanAddComment from '#src/graphql/mutation/loanAddComment.graphql';
import { GUEST_COMMENT_COMMENT, GUEST_COMMENT_LOANID } from '#src/plugins/guest-comment-mixin';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import {
	KvMaterialIcon, KvButton, KvLightbox, KvGrid, KvPageContainer
} from '@kiva/kv-components';

export default {
	name: 'CommentAsk',
	inject: ['apollo', 'cookieStore'],
	components: {
		GuestAccountCreation,
		KvMaterialIcon,
		KvButton,
		KvLightbox,
		KvGrid,
		KvPageContainer
	},
	props: {
		loanName: {
			type: String,
			default: ''
		},
		loanId: {
			type: Number,
			default: null
		},
		isGuest: {
			type: Boolean,
			default: false
		},
		guestUsername: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			mdiPencilOutline,
			showComments: true,
			loading: false,
			showLightbox: false,
			userComment: '',
			showAccountCreation: false,
		};
	},
	computed: {
		placeholderComment() {
			return `Tell others why this loan to ${this.loanName} is great!`;
		},
		buttonState() {
			if (this.loading) return 'loading';
			if (!this.userComment) return 'disabled';
			return '';
		},
	},
	methods: {
		submitComment() {
			if (!this.isGuest) {
				this.submitCommentAsUser();
			} else {
				this.submitCommentAsGuest();
			}
		},
		submitCommentAsGuest() {
			// save comment to cookie
			this.cookieStore.set(GUEST_COMMENT_COMMENT, this.userComment, { path: '/' });
			this.cookieStore.set(GUEST_COMMENT_LOANID, this.loanId, { path: '/' });

			// show create account form
			this.showAccountCreation = true;
		},
		submitCommentAsUser() {
			this.loading = true;
			this.apollo.mutate({
				mutation: loanAddComment,
				variables: {
					id: this.loanId,
					body: this.userComment
				}
			}).then(({ data }) => {
				// comment was added successfully
				if (data.loan.addComment) {
					this.$showTipMsg(`Thank you for helping ${this.loanName}!`);
					this.showComments = false;
				} else {
					throw new Error('Comment not added');
				}
			}).catch(e => {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem commenting on this loan', 'error');
			}).finally(() => {
				this.loading = false;
			});
		},
	},
};
</script>
