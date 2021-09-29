<template>
	<section
		class="monthly-good-info section show-for-small-only"
	>
		<div class="row align-center">
			<div class="small-10 large-12 columns">
				<h1 class="monthly-good-info__header" v-html="infoHeadline">
				</h1>
			</div>
		</div>
		<div class="row align-center">
			<div
				class="small-10 large-6 columns monthly-good-info__block"
			>
				<kv-icon
					class="monthly-good-info__icon-choose"
					name="choose"
				/>
				<div class="monthly-good-info__body" v-html="infoLeft">
				</div>
			</div>
			<div
				class="small-10 large-6 columns monthly-good-info__block"
			>
				<kv-icon
					class="monthly-good-info__icon-report"
					name="report"
				/>
				<div class="monthly-good-info__body" v-html="infoRight">
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvIcon,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		infoContentGroup() {
			return this.content ?? null;
		},
		infoHeadline() {
			const content = this.infoContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'mg-homepage-info-text-header';
			});
			const text = content?.richText;
			// contentful wraps all richText fields with a <p> tag,
			// which makes them difficult to style as headers,
			// this removes that wrapping tag
			const options = {
				renderNode: {
					paragraph: (node, next) => `${next(node.content)}`
				}
			};
			return documentToHtmlString(text, options).replace(/\n/g, '<br />');
		},
		infoLeft() {
			const content = this.infoContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'mg-homepage-info-text-left';
			});
			const text = content?.richText;
			return documentToHtmlString(text).replace(/\n/g, '<br />');
		},
		infoRight() {
			const content = this.infoContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'mg-homepage-info-text-right';
			});
			const text = content?.richText;
			return documentToHtmlString(text).replace(/\n/g, '<br />');
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

// utils
.section {
	position: relative;
	padding: 2rem 0;

	@include breakpoint(large) {
		padding: 2rem 0;
	}
}

.monthly-good-info {
	&__header {
		font-size: rem-calc(48);
		line-height: rem-calc(54);
		font-weight: 500;

		@include breakpoint(xlarge) {
			@include huge-headline();
		}

		// This text field from contentful can include an em tag or an i tag
		::v-deep em,
		::v-deep i {
			font-style: normal;
			color: $kiva-green;
		}
	}

	&__block {
		display: flex;
		margin-top: 1.75rem;
	}

	&__icon-report,
	&__icon-choose {
		margin-top: 0.65rem;
		flex-shrink: 0;
	}

	&__icon-choose {
		height: rem-calc(56);
		width: rem-calc(56);
	}

	&__icon-report {
		height: rem-calc(56);
		width: rem-calc(56);
	}

	&__body {
		::v-deep p {
			@include medium-text();

			@include breakpoint(xlarge) {
				@include featured-text();

				line-height: rem-calc(36);
			}
		}

		padding: 0 0.75rem 1rem 1.5rem;
		flex-grow: 1;
	}
}
</style>
