<template>
	<async-portfolio-section @visible="fetchAsyncData" data-testid="your-teams">
		<!-- title -->
		<kv-loading-placeholder v-if="loading" class="header-placeholder" />
		<h2 v-if="!loading" class="tw-mb-2">
			<template v-if="hasTeams">
				Your Teams
			</template>
			<template v-if="!hasTeams">
				Lending Teams
			</template>
		</h2>
		<!-- team list -->
		<ol v-if="hasTeams" class="tw-mb-2">
			<li v-for="team in loopTeams" :key="team.id" class="data-hj-suppress tw-flex tw-items-center tw-mb-1">
				<!-- team photo -->
				<kv-loading-placeholder v-if="loading" class="tw-mr-1.5" style="width: 2rem; height: 2rem;" />
				<img
					v-if="team.imageUrl && team.imageRetinaUrl"
					class="tw-w-4 tw-h-4 tw-mr-1.5"
					:srcset="`${team.imageRetinaUrl} 2x`"
					:src="team.imageUrl"
					:alt="team.imageAlt"
					width="32"
					height="32"
				>
				<div class="tw-flex tw-flex-col tw-min-w-0">
					<!-- team name (link) -->
					<kv-loading-placeholder
						v-if="loading"
						class="team-name-placeholder"
						:style="`width: ${team.width}rem;`"
					/>
					<router-link
						:to="`/team/${team.teamPublicId}`"
						class="tw-font-medium tw-truncate"
						v-kv-track-event="['portfolio', 'click', 'your-teams-team-name', team.teamPublicId, team.id]"
					>
						{{ team.name }}
					</router-link>
					<!-- total attributed to team -->
					<kv-loading-placeholder v-if="loading" class="lent-amount-placeholder" />
					<span class="tw-text-h4 tw-text-secondary">
						{{ team.amount }}
					</span>
				</div>
			</li>
		</ol>
		<!-- no-teams paragraph -->
		<p v-if="!loading && !hasTeams" class="tw-mb-2">
			Find like-minded lenders. Find a network of individuals that share your interests, school affiliation or
			location &amp; work together to achieve shared goals.
		</p>
		<!-- join team button -->
		<kv-loading-placeholder v-if="loading" class="button-placeholder" />
		<kv-button
			v-if="!loading"
			variant="secondary"
			to="/teams"
			v-kv-track-event="['portfolio', 'click', `your-teams-join-${hasTeams ? 'another' : 'a'}-team`]"
		>
			<template v-if="hasTeams">
				Join another team
			</template>
			<template v-if="!hasTeams">
				Join a team
			</template>
		</kv-button>
		<!-- all your teams link -->
		<p v-if="totalTeams > 5" class="tw-text-center tw-mt-4">
			<router-link
				to="/blog/myloans"
				class="tw-inline-block tw-p-1"
				v-kv-track-event="['portfolio', 'click', 'your-teams-view-all-your-teams']"
			>
				View all your teams
			</router-link>
		</p>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import getCacheKey from '@/util/getCacheKey';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'YourTeams',
	serverCacheKey: () => getCacheKey('YourTeams'),
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		KvButton,
		KvLoadingPlaceholder,
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			teams: [],
			totalTeams: 0,
			defaultImageUrl: `${this.$appConfig.photoPath}s32/726677.jpg`,
			defaultImageRetinaUrl: `${this.$appConfig.photoPath}s64/726677.jpg`,
		};
	},
	computed: {
		hasTeams() {
			return this.loading ? true : this.totalTeams > 0;
		},
		loopTeams() {
			return this.loading ? [{ id: 0, width: 10 }, { id: 1, width: 5 }] : this.teams;
		},
	},
	methods: {
		fetchAsyncData() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = this.apollo.query({
					query: gql`query myTopTeams {
						my {
							id
							teams(limit: 5) {
								totalCount
								values {
									id
									amountLent
									team {
										id
										name
										teamPublicId
										image {
											id
											regular: url(customSize: "s32")
											retina: url(customSize: "s64")
										}
									}
								}
							}
						}
					}`
				}).then(({ data }) => {
					this.loading = false;
					this.totalTeams = data?.my?.teams?.totalCount ?? 0;
					this.teams = (data?.my?.teams?.values ?? []).map(({ amountLent, team }) => ({
						id: team.id,
						name: team.name,
						teamPublicId: team.teamPublicId,
						imageUrl: team.image?.regular ?? this.defaultImageUrl,
						imageRetinaUrl: team.image?.retina ?? this.defaultImageRetinaUrl,
						imageAlt: `Avatar for lending team ${team.name}`,
						amount: numeral(amountLent).format('$0,0[.]00'),
					}));
				}).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.header-placeholder {
	width: 8rem;
	height: 1.5rem;
	margin: 3px 0 19px;
}

.team-name-placeholder {
	height: 1rem;
	margin: 0.25rem 0;
}

.lent-amount-placeholder {
	width: 3rem;
	height: 0.75rem;
	margin: 3px 0;
}

.button-placeholder {
	width: 11rem;
	height: 2.875rem;
	@apply tw-rounded;
}

@screen md {
	.header-placeholder {
		height: 1.75rem;
		margin: 3px 0 20px;
	}

	.lent-amount-placeholder {
		height: 0.875rem;
		margin: 3px 0 4px;
	}

	.button-placeholder {
		height: 3rem;
	}
}

@screen lg {
	.header-placeholder {
		height: 2rem;
		margin: 8px 0 28px;
	}
}
</style>
