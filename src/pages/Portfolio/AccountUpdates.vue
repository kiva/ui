<template>
	<async-portfolio-section v-show="totalCount > 0 || loading" @visible="fetchAsyncData">
		<h2 class="tw-mb-4">
			Updates from borrowers
		</h2>
		<ul>
			<li
				v-for="(update, index) in updates"
				:key="`${update.id}-${index}`"
				class="md:tw-flex tw-items-start tw-mt-4"
			>
				<!-- update image -->
				<kv-loading-placeholder v-if="loading" class="tw-mr-3 tw-mb-2" style="width: 100px; height: 100px;" />
				<img
					v-if="!loading"
					class="tw-shrink-0 tw-rounded tw-mr-3 tw-mb-2"
					:srcset="`${update.imageRetinaUrl} 2x`"
					:src="update.imageUrl"
					width="100"
					height="100"
					style="width: 100px; height: 100px;"
				>
				<div class="tw-grow tw-min-w-0">
					<!-- update title -->
					<kv-loading-placeholder
						v-if="loading"
						class="tw-mt-0.5"
						style="width: 6rem; height: 1.5rem; margin-bottom: 18px;"
					/>
					<h3 v-if="!loading" class="tw-mb-1">
						<router-link
							:to="update.url"
							v-kv-track-event="['portfolio', 'click', 'borrower-update-subject', update.id]"
						>
							{{ update.subject }}
						</router-link>
					</h3>
					<!-- update body -->
					<kv-loading-placeholder v-if="loading" class="tw-mb-1 lg:tw-hidden" style="height: 1rem;" />
					<kv-loading-placeholder v-if="loading" class="tw-mb-1 md:tw-hidden" style="height: 1rem;" />
					<kv-loading-placeholder v-if="loading" class="tw-mb-1" style="height: 1rem;" />
					<kv-loading-placeholder v-if="loading" class="tw-mb-1" style="height: 1rem;" />
					<kv-loading-placeholder
						v-if="loading"
						class="tw-mb-1 md:tw-mb-3"
						style="height: 1rem; width: 70%;"
					/>
					<p v-if="!loading" class="tw-break-words tw-mb-1 md:tw-mb-2">
						{{ update.body }}<span v-if="update.truncated">...</span>
						<router-link
							v-if="update.truncated"
							:to="update.url"
							v-kv-track-event="['portfolio', 'click', 'borrower-update-read-more', update.id]"
						>
							Read more
						</router-link>
					</p>
					<!-- author name -->
					<kv-loading-placeholder v-if="loading" style="height: 1rem; width: 10rem;" />
					<p v-if="!loading" class="tw-text-small tw-text-secondary">
						Posted by {{ update.authorName }} • {{ update.date }}
					</p>
				</div>
			</li>
		</ul>
		<!-- all updates link -->
		<p v-if="totalCount > 3 || loading" class="tw-text-center tw-mt-4">
			<router-link
				to="/blog/myloans"
				class="tw-inline-block tw-p-1"
				v-kv-track-event="['portfolio', 'click', 'borrower-updates-view-all-updates']"
			>
				View all updates
			</router-link>
		</p>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'AccountUpdates',
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvLoadingPlaceholder,
	},
	data() {
		return {
			loading: true,
			totalCount: 0,
			// start with blank updates for loading placeholders
			updates: [{ id: 0 }, { id: 1 }, { id: 2 }],
		};
	},
	methods: {
		transformUpdate(update = {}) {
			let imageUrl = '';
			let imageRetinaUrl = '';
			if (update.image) {
				imageUrl = update.image.default ?? '';
				imageRetinaUrl = update.image.retina ?? '';
			} else if (update.type === 'loan') {
				imageUrl = update.loan?.image?.default ?? '';
				imageRetinaUrl = update.loan?.image?.retina ?? '';
			} else {
				imageUrl = update.loan?.partner?.image?.default ?? '';
				imageRetinaUrl = update.loan?.partner?.image?.retina ?? '';
			}

			const subject = DOMPurify.sanitize(update.subjectTranslated || update.subject || '', { ALLOWED_TAGS: [] });
			const body = DOMPurify.sanitize(update.bodyTranslated || update.body || '', { ALLOWED_TAGS: [] });

			return {
				id: update.id,
				url: `/blog/loan/${update.id}`,
				authorName: update.authorName,
				date: format(new Date(update.date), 'P'),
				imageUrl,
				imageRetinaUrl,
				subject,
				body: body.slice(0, 200),
				truncated: body.length > 200,
			};
		},
		fetchAsyncData() {
			if (this.loading) {
				this.apollo.query({
					query: gql`query kivaCreditStats {
						my {
							id
							updates(limit:3) {
								totalCount
								values {
									id
									authorName
									subject
									subjectTranslated
									body
									bodyTranslated
									date
									type
									image {
										id
										...imageUrls
									}
									loan {
										id
										image {
											id
											...imageUrls
										}
										... on LoanPartner {
											partner {
												id
												image {
													id
													...imageUrls
												}
											}
										}
									}
								}
							}
						}
					}
					fragment imageUrls on Image {
						id
						default: url(customSize:"s100")
						retina: url(customSize:"s200")
					}`
				}).then(({ data }) => {
					this.loading = false;
					this.totalCount = data?.my?.updates?.totalCount ?? 0;
					this.updates = (data?.my?.updates?.values ?? []).map(this.transformUpdate);
				});
			}
		},
	},
};
</script>
