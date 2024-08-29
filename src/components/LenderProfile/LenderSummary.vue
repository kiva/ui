<template>
	<div>
		<h1 class="data-hj-suppress">
			Kiva Lender {{ lenderName }}
		</h1>
		<div class="tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-gap-y-2 md:tw-gap-x-8 tw-pt-2">
			<div class="tw-w-full md:tw-basis-1/4 tw-pt-1.5">
				<kv-material-icon
					v-if="!lenderImageUrl"
					:icon="mdiAccountCircle"
					class="!tw-block tw-mx-auto tw-w-14 tw-h-14"
				/>
				<img
					v-else
					:src="lenderImageUrl"
					class="tw-mx-auto tw-w-2/3 md:tw-w-full"
				>
			</div>
			<div class="tw-w-full">
				<dl class="tw-divide-y tw-divide-gray-100">
					<div
						v-for="(value, key, index) in lenderSummary"
						:key="index"
						class="tw-py-1.5 tw-flex tw-gap-x-2"
					>
						<dt class="tw-font-medium tw-capitalize tw-basis-1/3 md:tw-basis-1/4">
							{{ key }}:
						</dt>
						<dd class="tw-basis-2/3 lg:tw-basis-3/4 data-hj-suppress">
							<template v-if="key=='checkout'">
								<a
									:href="value"
									target="_blank"
								>
									{{ value }}
								</a>
							</template>
							<template v-else>
								{{ value }}
							</template>
						</dd>
					</div>
				</dl>

				<div class="tw-mt-2.5 tw-flex tw-flex-col lg:tw-flex-row tw-gap-2">
					<kv-button
						class="tw-w-full lg:tw-w-auto"
						variant="secondary"
						@click="() => showMessageLightbox()"
					>
						Send message
					</kv-button>
					<kv-button
						class="tw-w-full lg:tw-w-auto"
						variant="secondary"
						:href="`/gifts/kiva-cards?handle=${publicId}#/lender`"
					>
						Send a Kiva Card
					</kv-button>
				</div>
			</div>
		</div>
		<kv-lightbox
			:visible="lightboxVisible"
			@lightbox-closed="lightboxClosed"
			:title="lightboxTitle"
		>
			<!-- eslint-disable max-len vue/singleline-html-element-content-newline -->
			<template v-if="!isLoggedIn">
				<p>
					You must be signed in and have made loans on Kiva first to send a Lender Message. This helps us reduce the amount of SPAM and unwanted messages in the system.
				</p>
			</template>

			<template v-else-if="isLoggedIn && loansNumber == 0">
				<p>In order to send a message, you will need to make a loan using your own funds first. This helps us prevent spam and unwanted messages.</p>
				<p class="tw-mt-2">
					Please
					<router-link to="/lend">
						make a loan first
					</router-link>
					(note that loans made with bonus credit are not eligible) and then try your message again!
				</p>
			</template>

			<template v-else>
				<div>
					<p
						v-if="errorMessage"
						class="tw-text-danger tw-text-small tw-mb-1.5"
					>
						{{ errorMessage }}
					</p>
					<div class="tw-relative">
						<textarea
							class="
								tw-w-full tw-border tw-border-tertiary tw-rounded-sm tw-px-2 tw-py-1 tw-min-h-16 tw-mb-1.5
								tw-ring-inset tw-appearance-none tw-resize-none
								focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-action focus:tw-border-transparent
							"
							v-model="lenderMessage"
						>
					</textarea>
						<kv-material-icon
							class="tw-w-2.5 tw-h-2.5 tw-absolute tw-bottom-3 tw-right-1"
							:icon="mdiPencilOutline"
						/>
					</div>
					<div class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-2">
						<kv-button
							class="tw-w-full lg:tw-w-auto"
							variant="secondary"
							:state="sendButtonState"
							@click="sendMessage"
						>
							Send message
						</kv-button>
						<kv-button
							class="tw-w-full lg:tw-w-auto"
							variant="secondary"
							@click="closeLightbox"
						>
							Close
						</kv-button>
					</div>
				</div>
				<p class="tw-mt-4">
					Lender messages shouldn't be used for self-promotion, advertising or solicitation. More information can be found in
					<router-link to="/kiva-community-guidelines">Kiva's community guidelines</router-link>.
				</p>
			</template>
			<!-- eslint-enable max-len -->
		</kv-lightbox>
	</div>
</template>

<script>
import { format, parseISO } from 'date-fns';
import { mdiAccountCircle, mdiPencilOutline } from '@mdi/js';
import logReadQueryError from '#src/util/logReadQueryError';
import userInfoQuery from '#src/graphql/query/userInfo.graphql';
import sendLenderMessageMutation from '#src/graphql/mutation/sendLenderMessage.graphql';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import KvButton from '@kiva/kv-components/vue/KvButton';
import KvLightbox from '@kiva/kv-components/vue/KvLightbox';

export default {
	name: 'LenderSummary',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvMaterialIcon,
		KvButton,
		KvLightbox,
	},
	props: {
		publicId: {
			type: String,
			required: true,
		},
		lenderInfo: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			mdiAccountCircle,
			mdiPencilOutline,
			isLoggedIn: false,
			loansNumber: 0,
			lightboxVisible: false,
			lenderMessage: '',
			sendingMessage: false,
			errorMessage: '',
		};
	},
	computed: {
		lenderName() {
			return this.lenderInfo?.name ?? '';
		},
		lenderImageUrl() {
			return this.lenderInfo?.image?.url ?? '';
		},
		memberSince() {
			return format(parseISO(this.lenderInfo?.memberSince ?? new Date()), 'MMM dd, yyyy');
		},
		lenderSummary() {
			const summaryData = {
				location: this.lenderInfo?.lenderPage?.whereabouts ?? '',
				occupation: this.lenderInfo?.lenderPage?.occupation ?? '',
				'I loan because': this.lenderInfo?.lenderPage?.loanBecause ?? '',
				'About me': this.lenderInfo?.lenderPage?.otherInfo ?? '',
				checkout: this.lenderInfo?.lenderPage?.url ?? '',
				'Member since': this.memberSince,
			};

			return Object.fromEntries(
				Object.entries(summaryData)
					// eslint-disable-next-line no-unused-vars
					.filter(([_, value]) => value)
			);
		},
		lightboxTitle() {
			return this.isLoggedIn
				? `Send a Lender Message to ${this.lenderName}`
				: 'Not Signed In';
		},
		sendButtonState() {
			if (this.lenderMessage.length < 2 || this.sendingMessage) {
				return 'disabled';
			}
			return '';
		},
	},
	methods: {
		showMessageLightbox() {
			this.lightboxVisible = true;
		},
		lightboxClosed() {
			this.lightboxVisible = false;
		},
		closeLightbox() {
			this.lenderMessage = '';
			this.lightboxClosed();
		},
		sendMessage() {
			this.sendingMessage = true;
			this.errorMessage = '';
			try {
				this.apollo.mutate({
					mutation: sendLenderMessageMutation,
					variables: {
						lenderPublicId: this.publicId,
						message: this.lenderMessage,
					},
				});
			} catch (e) {
				this.sendingMessage = false;
				this.errorMessage = e[0]?.message
					? e[0].message
					: 'There was a problem sending your message. Please try again later.';
			} finally {
				this.sendingMessage = false;
				this.closeLightbox();
				this.$showTipMsg('Your message has been sent!');
			}
		},
	},
	async mounted() {
		try {
			const { data } = await this.apollo.query({
				query: userInfoQuery,
			});

			this.isLoggedIn = !!data.my?.userAccount?.id ?? false;
			this.loansNumber = data.my?.userStats?.number_of_loans ?? 0;
		} catch (e) {
			logReadQueryError(e, 'LenderSummary userIdQuery');
		}
	}
};
</script>
