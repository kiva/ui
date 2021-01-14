<template>
	<div class="faq">
		<h2 class="h3 strong">
			Level up your security with 2-step verfication
		</h2>
		<p>
			2-step verification protects your Kiva account by requiring an
			additional code when you log in on a device we don't recognize.
		</p>
		<h3 class="strong">
			FAQ
		</h3>
		<ul class="faq__list">
			<li>
				<kv-button
					class="text-link"
					@click.native.prevent="triggerWhatIsLightbox"
				>
					What is 2-step Verification?
				</kv-button>
			</li>
			<li>
				<kv-button
					class="text-link"
					@click.native.prevent="triggerHowItWorksLightbox"
				>
					How does it work?
				</kv-button>
			</li>
			<li>
				<kv-button
					class="text-link"
					@click.native.prevent="triggerHowItProtectsLightbox"
				>
					How does it protect you?
				</kv-button>
			</li>
		</ul>
		<kv-lightbox
			:visible="whatIsLbVisible"
			@lightbox-closed="lightboxClosed"
			title="What is 2-step verification?"
		>
			<p>
				2-step verification is the most secure way to access your Kiva account.
				By linking a second device to your account, you'll be required to enter
				a code in addition to your password when you login.
			</p>
		</kv-lightbox>
		<kv-lightbox
			:visible="howItWorksLbVisible"
			@lightbox-closed="lightboxClosed"
			title="How does it work?"
		>
			<p>
				Once you set up 2-step verification, you'll be asked to provide
				a code from your mobile device in addition to your password in
				order to log into your account. This code will be sent to you
				via text, voice call, or a mobile app.
			</p>
		</kv-lightbox>
		<kv-lightbox
			:visible="howItProtectsLbVisible"
			@lightbox-closed="lightboxClosed"
			title="How it protects you"
		>
			<p>
				2-step verification ensures that even if someone gains access to
				your password, they won't be able to login without access to your
				mobile device.
			</p>
		</kv-lightbox>
	</div>
</template>

<script>
import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvLightbox,
		KvButton,
	},
	data() {
		return {
			whatIsLbVisible: false,
			howItWorksLbVisible: false,
			howItProtectsLbVisible: false,
		};
	},
	methods: {
		triggerWhatIsLightbox() {
			this.whatIsLbVisible = !this.whatIsLbVisible;
		},
		triggerHowItWorksLightbox() {
			this.howItWorksLbVisible = !this.howItWorksLbVisible;
		},
		triggerHowItProtectsLightbox() {
			this.howItProtectsLbVisible = !this.howItProtectsLbVisible;
		},
		lightboxClosed() {
			this.whatIsLbVisible = false;
			this.howItWorksLBVisible = false;
			this.howItProtectsLBVisible = false;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.faq {
	background: $white;
	padding: 1.95rem; // same as KvSettingsCard

	&__list {
		list-style-type: none;
		margin: 0;
	}
}
</style>
