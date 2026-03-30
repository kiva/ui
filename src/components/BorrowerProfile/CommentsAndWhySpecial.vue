<template>
	<article>
		<div v-if="loading" class="tw-w-full tw-my-5 md:tw-my-6 lg:tw-my-8 tw-py-2 md:tw-py-3 lg:tw-py-5">
			<kv-loading-placeholder class="tw-w-full tw-mb-2 lg:tw-mb-3" :style="{height: '1.6rem'}" />
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 60 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
		</div>

		<h2 class="tw-sr-only">
			Loan Comments
		</h2>
		<div
			v-if="!loading" class="tw-py-2 md:tw-py-3 lg:tw-py-5"
			:key="`comments-${loanId}`"
		>
			<kv-carousel :multiple-slides-visible="false" :embla-options="{ loop: false, draggable: false }">
				<template v-for="(comment, index) in enhancedComments" #[`slide${index}`] :key="index">
					<div>
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
							style="box-shadow: 0 4px 12px rgb(0 0 0 / 8%); width: 15rem;"
						>
							<h4 class="tw-text-base tw-text-upper tw-text-secondary tw-mb-1">
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
						<div>
							<h2>
								<em class="tw-break-words">"{{ shortComment(comment.body) }}"</em>
							</h2>
						</div>
						<div
							class="tw-flex"
							:class="isTruncatedComment(comment.body) ? 'tw-justify-between' : 'tw-justify-end'"
						>
							<!-- read more -->
							<p class="tw-mt-1" v-if="isTruncatedComment(comment.body)">
								<button
									class="tw-text-link"
									@click="showFullComment(comment.body)"
									v-kv-track-event="['borrower-profile', 'click', 'comment-read-more']"
								>
									Read More
								</button>
							</p>
							<div class="tw-self-end tw-flex tw-align-center tw-mt-1.5">
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
										tw-text-headline
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
										<img :src="kivaKUrl">
									</div>
								</div>
								<!-- name and team info -->
								<div class="tw-m-auto">
									<h3>
										{{ comment.authorName }}
									</h3>
									<h4
										class="tw-text-base tw-text-upper"
										v-if="comment.lenderTeam && comment.lenderTeamPublicId"
									>
										<router-link
											:to="`/team/${comment.lenderTeamPublicId}`"
											class="tw-text-primary"
											v-kv-track-event="[
												'borrower-profile',
												'click',
												'comment-team-name',
												comment.lenderTeamPublicId
											]"
										>
											{{ comment.lenderTeam }}
										</router-link>
									</h4>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-if="!loading" #why-special>
					<why-special
						data-testid="bp-why-special"
						:loan-id="loanId"
					/>
				</template>
			</kv-carousel>
		</div>
		<comment-report-lightbox
			:visible="isReportLightboxVisible"
			:loan-id="loanId"
			:comment-id="selectedCommentId"
			@close="isReportLightboxVisible = false"
			@reported="onCommentReported"
		/>
		<kv-lightbox
			:visible="isCommentLightboxVisible"
			title=""
			@lightbox-closed="isCommentLightboxVisible = false"
		>
			<h2>
				<em class="tw-break-words">"{{ selectedCommentBody }}"</em>
			</h2>
		</kv-lightbox>
	</article>
</template>

<script>
import _throttle from 'lodash/throttle';
import { mdiDotsHorizontalCircle } from '@mdi/js';
import { gql } from 'graphql-tag';

import WhySpecial from '#src/components/BorrowerProfile/WhySpecial';
import CommentReportLightbox from '#src/components/BorrowerProfile/CommentReportLightbox';
import clickOutside from '#src/plugins/click-outside';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import {
	isLegacyPlaceholderAvatar, KvCarousel, KvMaterialIcon, KvLoadingPlaceholder, KvLightbox
} from '@kiva/kv-components';
import kivaKUrl from '#src/assets/images/kiva_k.svg?url';

export default {
	name: 'CommentsAndWhySpecial',
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerImage,
		CommentReportLightbox,
		KvCarousel,
		KvLightbox,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		WhySpecial,
	},
	mixins: [clickOutside],
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
	data() {
		return {
			kivaKUrl,
			mdiDotsHorizontalCircle,
			loading: true,
			comments: [],
			commentMenuShown: false,
			isReportLightboxVisible: false,
			isCommentLightboxVisible: false,
			selectedCommentId: null,
			selectedCommentBody: '',
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
					isAnonymous: comment.authorName === 'Anonymous' || comment.authorName === null,
					lenderNameFirstLetter: comment.authorName?.substring(0, 1).toUpperCase(),
					lenderTeam: teamNameForThisComment,
					lenderTeamPublicId: teamInfo?.teamPublicId ?? null,
					hash: imageFileName?.split('.')[0]
				};
			});
		},
	},
	apollo: {
		lazy: true,
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
									teams(limit: 100) { #arbitrary limit for lenders that have a lot of teams
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
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			this.comments = data?.lend?.loan?.comments?.values ?? [];
			this.loading = false;
		},
		fetchPolicy: 'network-only',
	},
	mounted() {
		window.addEventListener('resize', this.throttledResize);
		this.determineIfMobile();
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		openCommentMenu() {
			this.commentMenuShown = true;
		},
		hideCommentsMenu() {
			this.commentMenuShown = false;
		},
		openReportModal(commentId) {
			this.selectedCommentId = commentId;
			this.isReportLightboxVisible = true;
		},
		onCommentReported() {
			this.isReportLightboxVisible = false;
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
		isTruncatedComment(commentBody) {
			const commentLength = commentBody?.length ?? 0;
			return commentLength > 255;
		},
		shortComment(commentBody) {
			if (this.isTruncatedComment(commentBody)) {
				return `${commentBody?.substring(0, 255)}... `;
			}
			return commentBody;
		},
		showFullComment(commentBody) {
			this.isCommentLightboxVisible = true;
			this.selectedCommentBody = commentBody;
		},
	}
};
</script>
