<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Terms Of Service</h1>
				<p>Last updated: February 19, 2013</p>
				<h1 style="text-align:center">KIVA DEVELOPER TERMS OF SERVICE</h1>
				<p>
					By using the Kiva API provided by Kiva Microfunds (“Kiva”), you (the “Licensee”)
					agree to this Developer Terms of Service (“Agreement”). The following
					are incorporated by reference into this Agreement:
					(a) the Kiva Terms of Use (located at http://www.kiva.org/legal/terms) and
					(b) the Kiva Privacy Policy (located at http://www.kiva.org/legal/privacy).
					In the event of any irreconcilable conflict between this Agreement and
					any of the Kiva Terms of Use or Kiva Privacy Policy, the provisions of
					this Agreement shall govern. This Agreement may be modified by Kiva in
					its sole discretion from time to time and such modifications shall
					automatically become part of this Agreement and shall be effective
					once posted by Kiva on the Kiva Website (as indicated by the posted
					update date). Your License will be subject to any such modifications.
					You should review the Website and this Agreement from time to time for
					any modifications. If you do not agree with any such modifications,
					please immediately terminate your use of the Licensed API (as defined below),
					as outlined in Section 11 below.
				</p>
				<h2>1. Definitions</h2>
				<h2>2. Grant of License</h2>
				<h2>3. Proprietary Rights</h2>
				<h2>4. Other Restrictions</h2>
				<h2>5. Conditions to Non-Public Data; Write Ability</h2>
				<h2>6. Additional Licensee Obligations</h2>
				<h2>7. Disclaimers</h2>
				<h2>8. Support and Upgrades</h2>
				<h2>9. Limitation of Liability</h2>
				<h2>10. Indemnification</h2>
				<h2>11. Term and Termination</h2>
				<h2>12. Government Use</h2>
				<h2>13. Export Controls</h2>
				<p>
				</p>
				<h2>14. Governing Law; Resolution of Disputes; Arbitration and Waivers</h2>
				<p style="font-weight: bold">
					<!-- eslint-disable-next-line max-len -->
					This Agreement is governed by the laws of the State of California, USA, without regard to its choice of law or conflict of law provisions. If any dispute arises between Licensee and Kiva, including, without limitation, any dispute arising from or relating to the Kiva API, Licensed API and any Developed Application, Licensee agrees that all such disputes will be determined exclusively by final and binding arbitration, in accordance with the then existing commercial rules of the American Arbitration Association in San Francisco if the amount claimed is greater than $100 and otherwise over the telephone or in another city in which Kiva is located. The arbitration shall be heard and adjudicated by one arbitrator to be selected by Licensee and Kiva. Any award will be final, binding and conclusive upon the parties, subject only to judicial review provided by California statute, and a judgment rendered on the arbitration award can be entered in any court having jurisdiction thereof. Notwithstanding the foregoing, either Licensee or Kiva may seek any injunctive relief in a state or federal court in San Francisco, California, as may be necessary to preserve rights pending the completion of arbitration and Kiva may seek any injunctive relief in a state or federal court in San Francisco, California, or another court of competent jurisdiction, at any time against any violations of Sections 2 through 6.
				</p>
				<p style="font-weight: bold">
					<!-- eslint-disable-next-line max-len -->
					TO THE EXTENT PERMITTED BY APPLICABLE LAW, BY AGREEING TO SUBMIT ALL DISPUTES TO BINDING ARBITRATION, LICENSEE AND KIVA HEREBY WAIVE THEIR RIGHTS TO A JURY OR COURT TRIAL OF ANY CLAIM OR CAUSE OF ACTION ARISING OUT OF OR BASED UPON THIS AGREEMENT OR ANY CONTEMPLATED USE HEREIN, INCLUDING CONTRACT, TORT, BREACH OF DUTY AND ALL OTHER CLAIMS, EXCEPT AS SPECIFICALLY PROVIDED ABOVE.
				</p>
				<h2>15. Miscellaneous</h2>
				<p>
					<!-- eslint-disable-next-line max-len -->
					This Agreement constitutes the complete and entire agreement between Licensee and Kiva pertaining to the subject matter hereof, and supersedes any and all prior or contemporaneous written or oral agreements or understandings with respect to such subject matter. This Agreement may be amended or modified only by a writing executed by Kiva. If for any reason a court of competent jurisdiction finds any provision of this Agreement invalid or unenforceable for any reason, that provision of the Agreement will be reformed to the extent necessary to make it enforceable or will be enforced to the maximum extent permissible, and the other provisions of this Agreement will remain in full force and effect. The failure of Kiva to act with respect to a breach of this Agreement by Licensee or others does not constitute a waiver and shall not limit Kiva’s rights with respect to such breach or any subsequent breaches. Any waiver of any provision of this Agreement by Kiva will be effective only if in writing and signed by Kiva. This Agreement is personal to Licensee and may not be assigned or transferred for any reason whatsoever (including without limitation, by operation of law, merger, reorganization, or as a result of an acquisition or change of control involving Licensee) without Kiva’s prior written consent and any action or conduct in violation of the foregoing shall be null and void and without effect. Kiva expressly reserves the right to assign this Agreement and to delegate any of its obligations hereunder.
				</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import DeveloperSecondaryMenu from '@/components/WwwFrame/Menus/DeveloperSecondaryMenu';

export default {
	components: {
		WwwPage,
		DeveloperSecondaryMenu,
	},
	metaInfo: {
		title: 'Terms Of Service'
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
