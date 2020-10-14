<template>
	<div>
		<www-page>
			<div class="page-wrap">
				<div class="row">
					<h2 class="column small-12 strong page-heading">
						Security and login
					</h2>
					<div class="column small-12  medium-7">
						<!-- Password section -->
						<hr class="zero-top-margin">
						<section>
							<p class="medium-text heading">
								Password
							</p>
						</section>
						<hr>

						<!-- MFA section -->

						<!-- TODO: Add feature flag once it exists.
						This MFA settings area need to be hidden/shown based
						on the MFA feature flag that is captured in GROW-276 -->

						<section>
							<p class="medium-text heading">
								2-step verification
							</p>
						</section>
						<hr>
					</div>

					<!-- FAQ section -->
					<div class="column small-12 medium-5 faq-section">
						<section>
							<p class="medium-text heading">
								FAQ
							</p>
						</section>
					</div>
				</div>
			</div>
		</www-page>
	</div>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-wrap {
	margin: 2rem 0;

	.page-heading {
		margin-bottom: rem-calc(20);
	}

	hr {
		background-color: $kiva-bg-darkgray;
	}

	.zero-top-margin {
		margin-top: 0;
	}

	.heading {
		font-weight: 700;
	}

	.faq-section {
		border: 1px solid $kiva-bg-darkgray;
		border-radius: rem-calc(8);
		padding: rem-calc(20);
	}
}

</style>
