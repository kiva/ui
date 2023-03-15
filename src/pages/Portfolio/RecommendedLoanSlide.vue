<template>
	<div
		class="
			loan-slide
			tw-flex tw-flex-col tw-items-center
			tw-h-full tw-p-2 md:tw-p-0
			tw-rounded tw-bg-brand-100
		"
	>
		<!-- photo (link) -->
		<div
			class="
				borrower-photo
				tw-mx-auto tw-mb-1 tw-max-w-full tw-overflow-hidden
				tw-rounded-full tw-bg-secondary
			"
		>
			<kv-loading-placeholder v-if="loading" style="height: 0; padding-bottom: 100%;" />
			<router-link
				v-else
				:to="`/lend/${loanId}`"
				v-kv-track-event="['portfolio', 'click', 'recommended-loans', 'loan-image', loanId]"
			>
				<picture v-if="imageUrl">
					<source
						:media="`(min-width: ${breakpoints.md}px)`"
						width="140"
						height="140"
						:srcset="`${imageUrlAt(280)} 2x, ${imageUrlAt(140)} 1x`"
					>
					<img
						:srcset="`${imageUrlAt(180)} 2x`"
						:src="imageUrlAt(90)"
						:alt="imageAlt"
						width="90"
						height="90"
					>
				</picture>
			</router-link>
		</div>
		<!-- name (link) -->
		<kv-loading-placeholder v-if="loading" class="name-placeholder" />
		<h3 v-else class="tw-max-w-full tw-truncate">
			<router-link
				:to="`/lend/${loanId}`"
				v-kv-track-event="['portfolio', 'click', 'recommended-loans', borrowerNameForUrl, loanId]"
			>
				{{ borrowerName }}
			</router-link>
		</h3>
		<!-- loan use -->
		<kv-loading-placeholder v-if="loading" class="use-placeholder" style="width: 90%;" />
		<kv-loading-placeholder v-if="loading" class="use-placeholder" style="width: 75%;" />
		<kv-loading-placeholder v-if="loading" class="use-placeholder tw-hidden md:tw-block" style="width: 80%;" />
		<p
			v-else
			class="
				tw-grow tw-mb-1 md:tw-px-2
				tw-line-clamp-2 md:tw-line-clamp-3
				tw-text-center tw-text-secondary tw-text-small
			"
		>
			{{ loanUse }}
		</p>
		<!-- lend button (link) -->
		<!-- <kv-loading-placeholder v-if="loading" class="button-placeholder" /> -->
		<kv-button
			class="tw-w-full"
			:class="{ 'button-placeholder': loading }"
			:to="`/lend/${loanId}`"
			:state="loading ? 'disabled' : ''"
			v-kv-track-event="['portfolio', 'click', 'recommended-loans', 'lend', loanId]"
		>
			Lend
		</kv-button>
	</div>
</template>

<script>
import { gql } from '@apollo/client';
import { paramCase } from 'change-case';
import delayUntilVisibleMixin from '@/plugins/delay-until-visible-mixin';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import kvTokensPrimitives from '~/@kiva/kv-tokens/primitives.json';

const { breakpoints } = kvTokensPrimitives;
const defaultImageSize = 's100';

export default {
	name: 'RecommendedLoanSlide',
	inject: ['apollo'],
	mixins: [delayUntilVisibleMixin],
	components: {
		KvButton,
		KvLoadingPlaceholder,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			loading: true,
			imageUrl: '',
			borrowerName: '',
			loanUse: '',
			breakpoints,
		};
	},
	computed: {
		imageAlt() {
			return `Photo of ${this.borrowerName}`;
		},
		borrowerNameForUrl() {
			return paramCase(this.borrowerName);
		},
	},
	methods: {
		imageUrlAt(size = 100) {
			return this.imageUrl.replace(defaultImageSize, `s${size}`);
		},
		fetchBasicInfo() {
			if (this.loading) {
				this.apollo.query({
					query: gql`query recentLoanItemBasic($loanId: Int!, $size: String!) {
						lend {
							loan(id: $loanId) {
								id
								image {
									id
									url(customSize: $size)
								}
								name
								fullLoanUse @client
								# for fullLoanUse
								anonymizationLevel
								borrowerCount
								loanAmount
								status
								use
							}
						}
					}`,
					variables: {
						loanId: this.loanId,
						size: defaultImageSize,
					},
				}).then(({ data }) => {
					this.loading = false;
					this.imageUrl = data?.lend?.loan?.image?.url ?? '';
					this.borrowerName = data?.lend?.loan?.name ?? '';
					this.loanUse = data?.lend?.loan?.fullLoanUse ?? '';
				});
			}
		},
	},
	watch: {
		// When loan id changes, update watch query variables
		loanId: {
			handler(loanId) {
				this.$nextTick(() => {
					if (loanId > 0 && !this.delayUntilVisibleObserver) {
						this.delayUntilVisible(() => {
							this.fetchBasicInfo();
						});
					}
				});
			},
			immediate: true,
		},
	},
};
</script>

<style lang="postcss" scoped>
.loan-slide {
	width: 218px;
}

.borrower-photo {
	width: 90px;
}

.name-placeholder {
	width: 65%;
	height: 22px;
	margin: 3px 0 5px;
}

.use-placeholder {
	height: 14px;
	margin-bottom: 5px;
}

.button-placeholder {
	margin-top: 4px;
}

@screen md {
	.loan-slide {
		width: 210px;
	}

	.borrower-photo {
		width: 140px;
	}

	.name-placeholder {
		margin-bottom: 6px;
	}

	.button-placeholder {
		margin-top: 6px;
	}
}

@screen lg {
	.name-placeholder {
		height: 24px;
	}

	.use-placeholder {
		height: 16px;
	}

	.button-placeholder {
		margin-top: 5px;
	}
}
</style>
