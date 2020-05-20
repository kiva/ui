<template>
	<div class="faq">
		<h2 class="faq__header">
			Frequently asked questions
		</h2>
		<!-- eslint-disable max-len -->
		<ul class="faq__list">
			<li>
				<h4>Are my contributions loans or donations?</h4>
				<p>All contributions to the Global COVID-19 response fund are loans.</p>
			</li>
			<li>
				<h4>Can I just contribute to the response fund once, rather than monthly?</h4>
				<p>
					Yes. If you choose “One-time support”
					<button class="show-form-btn" @click="showLightbox">
						using this form
					</button>
					, the selected amount will only be deposited once.
				</p>
			</li>
			<li>
				<h4>If I already have a balance with Kiva, will those funds be used toward this fund?</h4>
				<p>Yes, signing up for the Global COVID-19 Response fund will deploy available credit as well as future repayments toward COVID-19 loans.</p>
			</li>
			<li>
				<h4>Will I know who my funds are helping?</h4>
				<p>Yes. We’ll send you an update email every time your funds have been used to support someone.</p>
			</li>
			<li>
				<h4>Can I request to forgive my loan or request that the borrower not have to repay?</h4>
				<p>While offers to forgive loans are very generous, Kiva's lending process is designed to accommodate loans and not donations. This means that all funding requests posted to Kiva are considered loans, and there unfortunately isn't a way to request that a borrower not repay your portion of the loan they received.</p>
			</li>
			<li>
				<h4>Can I cancel my monthly contribution?</h4>
				<p>You can cancel your monthly contribution at any time.</p>
			</li>
			<li>
				<h4>What happens after my loan has been repaid?</h4>
				<p>For monthly depositors, as borrowers repay their loans, your money will automatically be relent to other small businesses or entrepreneurs, multiplying your impact. For single depositors, you may withdraw or manually re-lend your money upon repayment.</p>
			</li>
			<li>
				<h4>Can I withdraw or re-lend my funds?</h4>
				<p>You may withdraw or re-lend funds for COVID-19 relief after your funds have been used toward a loan and returned to you as repayments.</p>
			</li>
			<li>
				<h4>What will happen to allocated COVID-19 response funds once borrowers no longer need resources to address the impact of the pandemic?</h4>
				<p>If there are no longer COVID-19 specific needs to address, we’ll get in touch with you to ask you to change your settings.</p>
			</li>
			<li>
				<h4>Interested in a partnership with Kiva?</h4>
				<p>If you're an organization that wants to partner with us on these efforts, please reach out to us at partnerships@kiva.org.</p>
			</li>
		</ul>
		<!-- eslint-enable max-len -->

		<kv-lightbox
			:visible="isLightboxVisible"
			@lightbox-closed="hideLightbox"
		>
			<covid-landing-form
				id="faq"
				:one-time-only="true"
				button-text="One-time contribution"
				class="lightbox-form"
			/>
		</kv-lightbox>
	</div>
</template>

<script>
import CovidLandingForm from './CovidLandingForm';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		CovidLandingForm,
		KvLightbox
	},
	data() {
		return {
			isLightboxVisible: false,
		};
	},
	methods: {
		showLightbox() {
			this.isLightboxVisible = true;
			this.$kvTrackEvent(
				'Monthly Good',
				'click-FAQ-onetime-lightbox-open',
				'using this form'
			);
		},
		hideLightbox() {
			this.isLightboxVisible = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.faq {
	&__header {
		@include featured-text();

		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	&__list {
		list-style: none;
		margin-left: 0;
		margin-bottom: 0;
		padding: 0;

		li:last-of-type p {
			margin-bottom: 0;
		}
	}
}

.show-form-btn {
	color: $anchor-color;
	text-decoration: $anchor-text-decoration;

	&:hover {
		color: $anchor-color-hover;
		text-decoration: $anchor-text-decoration-hover;
	}
}

.lightbox-form {
	max-width: 25rem;
}
</style>
