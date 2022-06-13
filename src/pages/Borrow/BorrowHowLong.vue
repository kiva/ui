<template>
	<div class="tw-text-center">
		<intro-graphic
			class="tw-w-full tw-mx-auto tw-mb-4"
			style="max-width: 31rem;"
		/>
		<p class="tw-text-h4 tw-mb-1">
			Step 1: Pre-check
		</p>
		<h1 class="tw-mb-4">
			How long and how much?
		</h1>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 md:tw-col-span-10 lg:tw-col-span-8 md:tw-col-start-2 lg:tw-col-start-3">
				<p class="tw-mb-4">
					We're often asked, "How much can I borrow and how long will it take to fund?"
					It’s different for everyone, as loans can range from $1,000 - $15,000. We’ve seen
					that borrowers who take action and reach out to their community receive
					their loan as quickly as one week. The average time to complete the process is a few weeks.
				</p>
				<p class="tw-mb-4">
					Start by deciding exactly how much you’ll need to borrow. With the right
					preparation, you can get funded very quickly on our platform.
				</p>
				<p class="tw-mb-4">
					Need help getting started?
					<a href="https://www.kivaushub.org/borrower">Check out this useful guide</a>.
				</p>
				<kv-button :href="`/my/borrower/application?refid=${trusteeId}`">
					I understand, let’s create an account
				</kv-button>
			</div>
		</kv-grid>
	</div>
</template>

<script>
import IntroGraphic from '@/assets/inline-svgs/borrow/howlong.svg';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'BorrowHowLong',
	components: {
		IntroGraphic,
		KvButton,
		KvGrid,
	},
	metaInfo() {
		return {
			title: 'How Long | Borrow Pre-application',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Determine how much need to borrow and how long your loan will take to fund'
					+ ' - at Kiva, with the right preparation, your loan can get funded very quickly!'
				}
			]
		};
	},
	computed: {
		trusteeId() {
			return this.$route.query.refid || '';
		}
	},
};
</script>
