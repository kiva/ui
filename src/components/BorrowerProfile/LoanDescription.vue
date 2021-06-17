<template>
	<section>
		<div>
			<h2
				class="tw-text-h2"
				v-if="previousLoanDetails"
			>
				Update on {{ borrowerOrGroupName }}
			</h2>
			<h2
				class="tw-text-h2"
				v-if="!previousLoanDetails && isAnonymizationLevelFull"
			>
				Story
			</h2>
			<h2
				class="tw-text-h2"
				v-if="!previousLoanDetails && !isAnonymizationLevelFull"
			>
				{{ borrowerOrGroupName }}'s story
			</h2>
		</div>
		<div>
			<section v-if="storyDescription">
				<p
					v-for="(paragraph, index) in storyDescriptionParagraphs"
					:key="index"
					class="tw-text-base"
				>
					{{ paragraph }}
				</p>
			</section>

			<section v-if="borrowersList">
				<p class="tw-text-base">
					{{ borrowersList }} <span v-if="showNotPicturedMessage">*not pictured</span>
				</p>
			</section>

			<section>
				<h2 class="tw-text-h2">Previous loan details</h2>
				<p class="tw-text-base">{{ previousLoanDescription }}</p>

				<a
					v-if="showPreviousLoanLink"
					href="{{ previousLoanUrl }}"
				>
					More from {{ borrowerOrGroupName }}'s previous loan »
				</a>
				<br>
				<a
					v-if="showPreviousLoanLink"
					href="#"
				>
					Learn more about successive and concurrent loans
				</a>
				<section>
					<p
						v-for="(paragraph, index) in allPreviousLoanDescriptionsParagraphs"
						:key="index"
						class="tw-text-base"
					>
						{{ paragraph }}
					</p>
				</section>
				<p v-if="showAllPreviousLoanDetails">
					Show all previous loans
				</p>
			</section>

			<section v-if="showPreviousLoanDetails">
				<p
					class="tw-text-base"
					v-if="previousLoanTitlePayingback"
				>
					Show currently repaying previous loan details
				</p>
				<p
					class="tw-text-base"
					v-if="previousLoanTitleRepaid"
				>
					Show repaid previous loan details
				</p>
				<p
					class="tw-text-base"
					v-if="previousLoanTitle"
				>
					Show previous loan details
				</p>
			</section>

			<section v-if="storyTranslation">
				<img v-if="reviewerImageLink" src="{{ reviewerImageLink }}" alt="Translator profile picture"/>
				<p class="tw-text-base">
					Translated from {{ language }}<span v-if="reviewerName"> by {{ reviewerLink }} {{ reviewerName }}</span>.
					<a>
						View original language description.
					</a>
				</p>
				<div>
					<p
						v-for="(paragraph, index) in storyDescriptionParagraphs"
						:key="index"
						class="tw-text-base"
					>
						{{ paragraph }}
					</p>
				</div>
			</section>
		</div>
	</section>
</template>

<script>
export default {
		props: {
			previousLoanDetails: {
				type: Boolean,
				default: false,
			},
			borrowerOrGroupName: {
				type: String,
				default: '',
			},
			isAnonymizationLevelFull: {
				type: Boolean,
				default: false,
			},
			storyDescription: {
				type: String,
				default: '',
			},
			borrowersList: {
				type: String,
				default: '',
			},
			showNotPicturedMessage: {
				type: Boolean,
				default: false,
			},
			previousLoanDescription: {
				type: String,
				default: '',
			},
			showPreviousLoanLink: {
				type: Boolean,
				default: false,
			},
			previousLoanUrl: {
				type: String,
				default: '',
			},
			allPreviousLoanDescriptions: {
				type: String,
				default: '',
			},
			showAllPreviousLoanDetails: {
				type: Boolean,
				default: false,
			},
			showPreviousLoanDetails: {
				type: Boolean,
				default: false,
			},
			previousLoanTitlePayingback: {
				type: Boolean,
				default: false,
			},
			previousLoanTitleRepaid: {
				type: Boolean,
				default: false,
			},
			previousLoanTitle: {
				type: Boolean,
				default: false,
			},
			storyTranslation: {
				type: Boolean,
				default: false,
			},
			reviewerImageLink: {
				type: String,
				default: '',
			},
			language: {
				type: String,
				default: '',
			},
			reviewerName: {
				type: String,
				default: '',
			},
			reviewerLink: {
				type: String,
				default: '',
			},
		},
		computed: {
			storyDescriptionParagraphs() {
				return this.toParagraphs(this.storyDescription);
			},
			allPreviousLoanDescriptionsParagraphs() {
				return this.toParagraphs(this.allPreviousLoanDescriptions);
			},
		},
		methods: {
			toParagraphs(text) {
				return String(text).split(/(\r\n\r\n|\n\n|\n \n|<br>)/);
			}
		}
	};

</script>
