<template>
	<div class="faq">
		<h2 class="faq__header">
			Frequently asked questions
		</h2>
		<!-- eslint-disable max-len -->
		<ul class="faq__list">
			<li>
				<h4>Why should I donate to Kiva?</h4>
				<p>Donations to Kiva's operating expenses are vital to the success and sustainability of Kiva. As an organization we’re committed to sending 100% of all loan contributions to borrowers. We don’t take a cut of money lent on our website, and don’t charge a fee for lending.</p>
			</li>
			<!-- <li>
				<h4>Why should I donate to Kiva?</h4>
				<p>Donations to Kiva's operating expenses are vital to the success and sustainability of Kiva. As an organization we’re committed to sending 100% of all loan contributions to borrowers. We don’t take a cut of money lent on our website, and don’t charge a fee for lending.</p>
			</li> -->
		</ul>
		<!-- eslint-enable max-len -->
	</div>
</template>

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
</style>
