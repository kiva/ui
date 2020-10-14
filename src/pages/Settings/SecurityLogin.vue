<template>
	<div>
		<www-page>
			<div class="page-wrap">
				<div class="row">
					<h2 class="column small-12 strong">
						Security and login
					</h2>
					<!-- Password section -->
					<section class="column small-12  medium-7">
						<hr>
						<p class="medium-text heading">
							Password
						</p>
					</section>
					<!-- MFA section -->
					<section class="column small-12  medium-7">
						<hr>
						<p class="medium-text heading">
							2-step verification
						</p>
						<hr>
					</section>
					<!-- FAQ section -->
					<section class="column small-12 medium-5">
						<p class="medium-text heading">
							FAQ
						</p>
					</section>
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

.heading {
	font-weight: 700;
}

</style>
