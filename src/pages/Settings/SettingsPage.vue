<template>
	<www-page
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>

		<kv-default-wrapper>
			<div class="row column">
				<h1 class="tw-mb-4">
					Settings
				</h1>

				<div class="settings tw-flex tw-flex-col tw-gap-4">
					<section data-testid="account-settings-section" class="section">
						<a
							class="section__link"
							href="/settings/account"
							data-testid="account-settings-lnk"
						>
							<h2 class="section__title">Account settings</h2>
							<ul class="section__list">
								<li>
									<h3>Personal info</h3>
									<p>
										Your private account info: email,
										<span v-if="!isMfaActive">password, </span>
										mailing address
									</p>
								</li>
								<li>
									<h3>Lender profile</h3>
									<p>What displays publicly on Kiva: name, location, occupation</p>
								</li>
							</ul>
						</a>
					</section>
					<section
						data-testid="security-settings-section"
						v-if="isMfaActive"
						class="section"
					>
						<router-link
							class="section__link"
							to="/settings/security"
							data-testid="security-settings-lnk"
						>
							<h2 class="section__title">
								Security settings
							</h2>
							<ul class="section__list">
								<li>
									<h3>Password</h3>
									<p>Change your password</p>
								</li>
								<li>
									<h3>2-step verification</h3>
									<p>Turn on or off 2-step verification</p>
								</li>
							</ul>
						</router-link>
					</section>
					<section data-testid="credit-settings-section" class="section">
						<a
							class="section__link"
							href="/settings/credit"
							data-testid="credit-settings-lnk"
						>
							<h2 class="section__title">Credit settings</h2>
							<ul class="section__list">
								<li>
									<h3>Repayment settings</h3>
									<p>Where you want your money to go when it's repaid</p>
								</li>
								<li>
									<h3>Inactivity settings</h3>
									<p>Where you want your money to go if your account becomes inactive</p>
								</li>
								<li
									v-if="!isSubscriber"
									class="section__subsection"
								>
									<h3>Auto lending settings</h3>
									<p>Turn auto lending on or off, and put your idle credit to good use</p>
								</li>
								<li class="section__subsection">
									<template v-if="isSubscriber">
										<h3>Monthly Good settings</h3>
										<p>Automatically support borrowers in need each month</p>
									</template>
									<template v-if="!isSubscriber">
										<h3>Auto deposit</h3>
										<p>Increase your impact - make regular deposits or
											donations into your Kiva account</p>
									</template>
								</li>
							</ul>
						</a>
					</section>
					<section data-testid="payment-settings-section" class="section">
						<a
							class="section__link"
							href="/settings/payments"
							data-testid="payment-settings-lnk"
						>
							<h2 class="section__title">Payment settings</h2>
							<ul class="section__list">
								<li>
									<h3>Payment methods</h3>
									<p>Update your payment method details</p>
								</li>
							</ul>
						</a>
					</section>
					<section data-testid="email-settings-section" class="section">
						<a
							class="section__link"
							href="/settings/email"
							data-testid="email-settings-lnk"
						>
							<h2 class="section__title">Email preferences</h2>
							<ul class="section__list">
								<li>
									<h3>Account and loan updates</h3>
									<p>Receive borrower updates and repayment notifications</p>
								</li>
								<li>
									<h3>News from Kiva</h3>
									<p>Hear about what’s new at Kiva and how you can get more involved</p>
								</li>
								<li>
									<h3>Lender and team messages</h3>
									<p>Get notifications from other lenders and teams you belong to</p>
								</li>
							</ul>
						</a>
					</section>
					<section data-testid="trustee-settings-section" class="section">
						<a
							class="section__link"
							href="/trustees/apply"
							data-testid="trustee-settings-lnk"
						>
							<h2 class="section__title">Trustee settings</h2>
						</a>
					</section>
					<section data-testid="data-settings-section" class="section">
						<a
							class="section__link"
							href="/settings/data"
							data-testid="data-settings-lnk"
						>
							<h2 class="section__title">Data settings</h2>
							<ul class="section__list">
								<li>
									<h3>Cookie preferences</h3>
									<p>Change your Kiva cookie preferences</p>
								</li>
								<li>
									<h3>Advertising data sharing preferences</h3>
									<p>Change your Kiva data sharing preferences for advertising purposes</p>
								</li>
								<li>
									<h3>Account termination</h3>
									<p>Close your Kiva account</p>
								</li>
							</ul>
						</a>
					</section>
				</div>
			</div>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import { gql } from '@apollo/client';

import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';

const pageQuery = gql`query settingsQuery {
	my {
		id
		autoDeposit {
			id
			isSubscriber # signifies monthly good is active
		}
	}
	general {
		mfaEnabled: featureSetting(key: "mfa.enabled") {
			key
			value
			description
		}
	}
}`;

export default {
	name: 'SettingsPage',
	components: {
		KvDefaultWrapper,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	metaInfo: {
		title: 'Settings',
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			isMfaActive: false,
			isSubscriber: false,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
			this.isMfaActive = data?.general?.mfaEnabled?.value === 'true';
		},
	},
};
</script>

<style lang="postcss" scoped>
.section__link {
	@apply tw-bg-primary tw-p-4 tw-block;
}

.section__link:hover,
.section__link:focus {
	@apply tw-no-underline;
}

.section__link:hover .section__title,
.section__link:focus .section__title {
	@apply tw-underline;
}

.section__list {
	@apply tw-list-disc tw-pl-2 tw-mt-2 tw-flex tw-flex-col tw-gap-2 tw-text-primary;
}

.section__list h3 {
	@apply tw-my-1;
}
</style>
