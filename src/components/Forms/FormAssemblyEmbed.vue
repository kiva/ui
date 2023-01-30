<template>
	<div class="tw-w-full">
		<div
			v-if="isLoading"
			class="tw-w-full tw-flex tw-content-center tw-justify-center"
			style="min-height: 200px;"
		>
			<kv-loading-spinner class="tw-self-center" />
		</div>
		<iframe
			v-show="!isLoading"
			class="tw-mx-auto tw-w-full"
			:src="iFrameSrc"
			:height="iFrameHeight"
			frameborder="0"
		></iframe>
	</div>
</template>

<script>
import {
	resizeHelper
} from '@/lib/formassembly/iframe-resize-helper';
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';

export default {
	name: 'FormAssemblyEmbed',
	components: {
		KvLoadingSpinner
	},
	props: {
		// The form assembly id for the form to embed
		formAssemblyId: {
			type: String,
			required: true,
		},
		// optional query params to append to the iframe src
		// Should include the leading '?'
		queryParams: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			isLoading: true,
			iFrameHeight: 500, // sensible default
		};
	},
	computed: {
		iFrameSrc() {
			if (this.formAssemblyId) {
				return `https://kiva.tfaforms.net/${this.formAssemblyId}${this.queryParams}`;
			}
			return '';
		}
	},
	async mounted() {
		if (!this.$isServer && typeof window !== 'undefined') {
			// resizes the iframe vertically based on the events fired from FA form
			resizeHelper();

			window.addEventListener('message', message => {
				// if we receive a message we can assume the form is loaded
				if (message.data) {
					this.isLoading = false;
				}
			});
		}
	},
};
</script>
