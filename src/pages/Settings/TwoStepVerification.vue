<template>
	<www-page>
		<div class="page-wrap">
			<div class="row">
				<h2 class="column small-12 strong page-heading">
					2-step verification
				</h2>
				<div class="column small-12">
					<hr>
					<!-- Status section -->
					<section>
						<p class="medium-text heading">
							How would you like your verification code?
						</p>
						<p>You'll be asked for a verification code when accessing you Kiva account.</p>
					</section>

					<!-- 2-factor Methods section -->
					<section>
						<p class="medium-text heading">
							Authentication app
						</p>
					</section>

					<!-- Setup section -->
					<section>
						<p class="medium-text heading">
							Text message or phone call
						</p>
					</section>
				</div>
			</div>
		</div>
	</www-page>
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
		margin-bottom: 1.25rem;
	}

	hr {
		margin-top: rem-calc(12);
		margin-bottom: 2rem;
		border-color: #D8D8D8;
	}

	.heading {
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	section {
		margin-bottom: 2.25rem;
	}
}

</style>
