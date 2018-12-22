<template>
	<section>
		<h1>Images</h1>

		<h2>Dynamic Loan Images</h2>
		<p>The primary image attached to a loan in our system is originally upload by a partner.
		Upon upload this image is processed via Cloudinary in order to crop the image, centering the subject
		in the frame.</p>

		<p>Each image will be cropped to a group of preset sizes that are controlled via our settings manager.
		For an image to take on the intended dimensions it must be declared in this setting.</p>

		<p><i>* Please verify and get approval for any potential changes to the Cloudinary settings as new Images
		could cause our usage of the service to exceed the rate limit.</i></p>

		<h3>Current Cloudinary Settings</h3>
		<code>["w_480,h_300","w_480,h_360","w_960,h_600","w_960,h_720","w_1200,h_630"]</code>
	</section>
</template>

<script>
// export default {
// 	data() {
// 		return {};
// 	}
// };
</script>

<style lang="scss" scoped>
// @import 'settings';
</style>
