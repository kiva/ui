<template>
	<div class="basket-donation-item row">
		<span class="small-2">
			<span class="donation-icon">
				<kv-icon class="dedicate-heart" name="dedicate-heart" />
			</span>
		</span>
		<span class="small-10 medium-6">
			<div class="donation-info featured-text">
				Donation to Kiva
			</div>
			<div>
				<a
					class="small-text"
					@click.prevent="triggerDefaultLightbox">
					Help Kiva reach more borrowers around the world
				</a>
				<!-- This lightbox will be replaced with a Popper tip message. -->
				<kv-lightbox
					:visible="defaultLbVisible"
					@lightbox-closed="lightboxClosed">
					<h2 slot="title">How does Kiva use donations?</h2>
					<div>
						100% of every dollar you lend on Kiva goes directly to funding loans.
						We rely on small optional donations from you and others to keep Kiva running.
						Every $1 donated to Kiva makes $8 in loans possible around the world.
						Your donation will enable us to:
						<ul class="disc-list">
							<li>Send expert staff to over 60 countries to vet and monitor loans and partners.</li>
							<li>Build and maintain a website that facilitates over $1 million in loans each week.</li>
							<li>Provide comprehensive customer support to thousands of lenders worldwide.</li>
							<li>Train and support hundreds of volunteers -- 4 for every 1 staff member at Kiva.</li>
						</ul>
						If you live in the United States, your donation is tax-deductible.
						Thank you for considering a donation to Kiva.
					</div>
				</kv-lightbox>
			</div>
		</span>
		<span class="small-12 medium-4">
			<input type="input" name="donation" id="donation" :value="donation.price">
			<kv-button class="setting small-text">Update</kv-button>
		</span>
	</div>

</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		KvIcon,
		KvButton,
		KvLightbox
	},
	props: {
		donation: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			defaultLbVisible: false,
		};
	},
	methods: {
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.dedicate-heart {
	border: 1px solid $light-gray;
	height: rem-calc(85);
	width: rem-calc(85);
}

.disc-list {
    list-style-type: disc;
}

input {
	width: rem-calc(100);
	height: rem-calc(32);
    text-align: right;
    padding-right: rem-calc(5);
}

.basket-donation-item .setting {
	color: $kiva-accent-blue;
	border: 1px solid $kiva-accent-blue;
	box-shadow: 0 1px $kiva-accent-blue;
	padding: rem-calc(6) rem-calc(20);
	margin-bottom: rem-calc(5);
}

</style>
