<template>
	<div class="email-preview-section-wrapper row" id="email-preview">
		<div class="small-12 large-6 columns tw-relative">
			<kv-responsive-image
				class="tw-mx-auto lg:tw-absolute lg:tw-bottom-0 lg:tw-left-1/2 lg:tw--translate-x-1/2"
				style="max-width: 21.88rem;"
				:images="images"
				alt="A Monthly Good email in your inbox"
			/>
		</div>
		<div class="small-12 large-6 columns">
			<div class="tw-py-4 md:tw-py-6 lg:tw-py-8">
				<h2 class="tw-text-h1 tw-mb-4">
					Monthly Good, delivered to your inbox
				</h2>
				<p>
					<!-- eslint-disable-next-line max-len -->
					Once a month, we'll send you a dose of inspiration with an update on who your funds supported and how you’re making a difference.
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import KvResponsiveImage from '#src/components/Kv/KvResponsiveImage';
import { metaGlobReader } from '#src/util/importHelpers';

const emailPreviewImageGlob = import.meta.glob('/src/assets/images/mg-email-preview/*.*', { eager: true });
const emailPreviewimageRequire = metaGlobReader(emailPreviewImageGlob, '/src/assets/images/mg-email-preview/');

export default {
	name: 'EmailPreview',
	components: {
		KvResponsiveImage,
	},
	data() {
		return {
			images: [
				['small', emailPreviewimageRequire('email-preview-mobile-std.jpg')],
				['small retina', emailPreviewimageRequire('email-preview-mobile-retina.jpg')],
				['xga', emailPreviewimageRequire('email-preview-desktop-std.jpg')],
				['xga retina', emailPreviewimageRequire('email-preview-desktop-retina.jpg')],
			]
		};
	},

};
</script>
