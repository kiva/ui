<template>
	<article>
		<div v-if="loading" class="tw-w-full tw-my-5 md:tw-my-6 lg:tw-my-8">
			<kv-loading-placeholder class="tw-w-full tw-mb-2 lg:tw-mb-3" :style="{height: '1.6rem'}" />
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 60 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
		</div>

		<h2 class="tw-sr-only">
			Loan Comments
		</h2>
		<div v-if="!loading" class="tw-mt-2 md:tw-mt-3 lg:tw-mt-5 tw-mb-4 md:tw-mb-5 lg:tw-mb-7">
			<kv-carousel :multiple-slides-visible="false" :embla-options="{ loop: false, draggable: false }">
				<template v-for="(comment, index) in enhancedComments" #[`slide${index}`]>
					<div :key="index">
						<!-- comment menu -->
						<button
							v-if="isLoggedIn"
							@click.stop="openCommentMenu"
							class="tw-ml-auto tw-mr-0 tw-block"
							:style="{visibility: commentMenuShown ? 'hidden' : 'visible'}"
						>
							<kv-material-icon
								class="tw-w-3 tw-h-3 tw-text-secondary"
								:icon="mdiDotsHorizontalCircle"
							/>
						</button>
						<div
							v-if="commentMenuShown"
							v-click-outside="hideCommentsMenu"
							class="tw-bg-white tw-rounded tw-p-1.5 tw-absolute tw-right-1 tw-top-0"
							style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); width: 15rem;"
						>
							<h4 class="tw-text-h4 tw-text-secondary tw-mb-1">
								More options
							</h4>
							<ul>
								<li class="tw-text-base">
									<button @click="openReportModal(comment.id)">
										Report this comment
									</button>
								</li>
							</ul>
						</div>
						<!-- comment -->
						<h2>
							<em>"{{ comment.body }}"</em>
						</h2>
						<!-- author -->
						<div class="tw-float-right tw-flex tw-align-center tw-mt-1.5">
							<div
								class="tw-mr-1"
								:class="{'tw-w-4 tw-h-4': isMobile, 'tw-w-6 tw-h-6': !isMobile}"
							>
								<!-- image variations -->
								<!-- user is not anonymous and has an image -->
								<borrower-image
									v-if="!comment.isAnonymous && !isDefaultProfilePic(comment.hash)"
									class="tw-rounded-full tw-bg-black tw-w-full tw-h-full"
									:alt="comment.authorName"
									:default-image="{ width: isMobile ? 32 : 48 }"
									:hash="comment.hash"
								/>
								<!-- user is not anonymous and does not have an image -->
								<div
									v-else-if="!comment.isAnonymous && isDefaultProfilePic(comment.hash)"
									class="
										tw-rounded-full
										tw-text-h2
										tw-w-full tw-h-full
										tw-flex tw-align-center tw-justify-center"
									:class="randomizedUserClass()"
								>
									<!-- First Letter of lender name -->
									<span class="tw-self-center">
										{{ comment.lenderNameFirstLetter }}
									</span>
								</div>
								<!-- user is anonymous -->
								<div
									v-else
									class="
										tw-rounded-full
										tw-bg-brand
										tw-w-full tw-h-full
										tw-flex tw-align-center tw-justify-center"
								>
									<!-- Kiva K logo -->
									<img
										src="@/assets/images/kiva_k.svg"
									>
								</div>
							</div>

							<!-- name and team info -->
							<div>
								<h3>
									{{ comment.authorName }}
								</h3>
								<h4 v-if="comment.lenderTeam && comment.lenderTeamPublicId">
									<router-link
										:to="`/team/${comment.lenderTeamPublicId}`"
										class="tw-text-primary"
									>
										{{ comment.lenderTeam }}
									</router-link>
								</h4>
							</div>
						</div>
					</div>
				</template>
				<why-special data-testid="bp-why-special" :loan-id="loanId" />
			</kv-carousel>
		</div>
		<kv-lightbox
			:visible="isLightboxVisible"
			title="Report comment"
			@lightbox-closed="isLightboxVisible = false"
		>
			<template #header>
				<h2>
					Report Comment
				</h2>
				<h3 class="tw-mt-2">
					Why are you reporting this comment?
				</h3>
			</template>

			<fieldset class="tw-flex tw-flex-col tw-gap-2 tw-mt-1 tw-mb-2">
				<kv-radio
					value="I find it offensive"
					name="reportReason"
					v-model="selectedReason"
				>
					I find it offensive
				</kv-radio>
				<kv-radio
					value="It's spam or misleading"
					name="reportReason" v-model="selectedReason"
				>
					It's spam or misleading
				</kv-radio>
				<kv-radio
					value="It is harmful, violent, or could cause harm"
					name="reportReason" v-model="selectedReason"
				>
					It is harmful, violent, or could cause harm
				</kv-radio>
			</fieldset>

			<template #controls>
				<kv-button
					variant="secondary"
					@click="isLightboxVisible = false"
				>
					Cancel
				</kv-button>
				<kv-button
					variant="primary"
					:state="buttonState"
					@click="reportComment"
				>
					Submit report
				</kv-button>
			</template>
		</kv-lightbox>
	</article>
</template>

<script>
import _throttle from 'lodash/throttle';
import { isLegacyPlaceholderAvatar } from '@/util/imageUtils';

import { mdiDotsHorizontalCircle } from '@mdi/js';
import { gql } from '@apollo/client';
import { createIntersectionObserver } from '@/util/observerUtils';
import logFormatter from '@/util/logFormatter';
import WhySpecial from '@/components/BorrowerProfile/WhySpecial';
import clickOutside from '@/plugins/click-outside';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvRadio from '~/@kiva/kv-components/vue/KvRadio';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'CommentsAndWhySpecial',
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerImage,
		KvButton,
		KvCarousel,
		KvLightbox,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvRadio,
		WhySpecial,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		isLoggedIn: {
			type: Boolean,
			default: false,
		},
	},
	mixins: [
		clickOutside,
	],
	data() {
		return {
			mdiDotsHorizontalCircle,
			loading: true,
			comments: [],
			commentMenuShown: false,
			isLightboxVisible: false,
			selectedReason: '',
			selectedCommentId: '',
			userCardStyleOptions: [
				{ color: 'tw-text-action', bg: 'tw-bg-brand-50' },
				{ color: 'tw-text-black', bg: 'tw-bg-brand-100' },
				{ color: 'tw-text-action', bg: 'tw-bg-secondary' },
				{ color: 'tw-text-white', bg: 'tw-bg-action' },
				{ color: 'tw-text-brand-50', bg: 'tw-bg-action' },
				{ color: 'tw-text-brand-50', bg: 'tw-bg-black' },
				{ color: 'tw-text-primary-inverse', bg: 'tw-bg-action' },
				{ color: 'tw-text-white', bg: 'tw-bg-black' },
			],
			isMobile: false,
		};
	},
	computed: {
		buttonState() {
			if (this.loading) return 'loading';
			if (!this.selectedReason) return 'disabled';
			return '';
		},
		enhancedComments() {
			// adds quasi computed properties to comments.
			// isAnonymous boolean, lender name first letter, and image hash from url
			return this.comments.map(comment => {
				const imageFileName = comment.authorImageUrl?.split('/').pop();
				const teamNameForThisComment = comment.authorLendingAction?.teams?.[0];
				const teamInfo = comment.authorLendingAction?.lender?.teams?.values.find(team => {
					return team.name === comment.authorLendingAction?.teams?.[0];
				});
				return {
					...comment,
					isAnonymous: comment.authorName === 'Anonymous',
					lenderNameFirstLetter: comment.authorName?.substring(0, 1).toUpperCase(),
					lenderTeam: teamNameForThisComment,
					lenderTeamPublicId: teamInfo?.teamPublicId ?? null,
					hash: imageFileName?.split('.')[0]
				};
			});
		},
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
				query: gql`query loanComments($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							comments {
								values {
									id
									authorName
									authorImageUrl
									authorLendingAction {
										teams
										lender {
											id
											teams {
												values {
													id
													name
													teamPublicId
												}
											}
										}
									}
									body
								}
							}
						}
					}
				}`,
				variables: {
					loanId: this.loanId
				},
			}).then(result => {
				this.comments = result?.data?.lend?.loan?.comments?.values ?? [];
				this.loading = false;
			});
		},
		openCommentMenu() {
			this.commentMenuShown = true;
		},
		hideCommentsMenu() {
			this.commentMenuShown = false;
		},
		openReportModal(commentId) {
			this.selectedCommentId = commentId;
			this.isLightboxVisible = true;
		},
		reportComment() {
			this.loading = true;
			this.apollo.mutate({
				mutation: gql`mutation flagLoanComment($id: Int!, $description: String, $commentId: Int!) {
					loan(id: $id) {
						flagComment(description: $description, commentId: $commentId)
					}
				}`,
				variables: {
					id: this.loanId,
					commentId: this.selectedCommentId,
					description: this.selectedReason
				}
			}).then(({ data, errors }) => {
				// comment was added successfully
				if (data.loan.flagComment) {
					this.$showTipMsg('Thank you for reporting this comment!');
				} else if (errors[0].message) {
					this.$showTipMsg(errors[0].message);
				} else {
					throw new Error('There was a problem reporting this comment');
				}
			}).catch(e => {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem reporting this comment', 'error');
			}).finally(() => {
				this.isLightboxVisible = false;
				this.loading = false;
			});
		},
		randomizedUserClass() {
			const randomStyle = this.userCardStyleOptions[Math.floor(Math.random() * this.userCardStyleOptions.length)];
			return `${randomStyle.color} ${randomStyle.bg}`;
		},
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
		isDefaultProfilePic(commentHash) {
			return isLegacyPlaceholderAvatar(commentHash);
		},
		throttledResize() {
			return _throttle(this.determineIfMobile, 200);
		},
	},
	mounted() {
		this.createObserver();
		window.addEventListener('resize', this.throttledResize);
		this.determineIfMobile();
	},
	beforeDestroy() {
		this.destroyObserver();
		window.removeEventListener('resize', this.throttledResize);
	},
};
</script>
