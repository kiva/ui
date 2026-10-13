<template>
	<div ref="cycleOuterRef" class="cycle-outer">
		<div class="cycle-inner" :style="{ transform: `scale(${cycleScale})`, opacity: hasMeasured ? 1 : 0 }">
			<div style="position: relative; width: 533px; height: 420px;">
				<!-- ARROWS: 200×200 circle at left:157.06 top:89.78 -->
				<div style="position: absolute; left: 157.06px; top: 89.78px; width: 200px; height: 200px;">
					<div style="position: absolute; inset: -2.13%;">
						<svg
							fill="none"
							preserveAspectRatio="none"
							viewBox="0 0 208.51 208.509"
							style="display: block; width: 100%; height: 100%;"
						>
							<path
								:d="paths.arrowTopLeft"
								:fill="colors.ecoGreen"
								class="arrow-flash"
								style="animation-delay: 3.6s;"
							/>
							<path
								:d="paths.arrowTopRight"
								:fill="colors.ecoGreen"
								class="arrow-flash"
								style="animation-delay: 0s;"
							/>
							<path
								:d="paths.arrowBottomLeft"
								:fill="colors.ecoGreen"
								class="arrow-flash"
								style="animation-delay: 2.4s;"
							/>
							<path
								:d="paths.arrowBottomRight"
								:fill="colors.ecoGreen"
								class="arrow-flash"
								style="animation-delay: 1.2s;"
								@animationiteration="advanceBorrower"
							/>
						</svg>
					</div>
				</div>

				<!-- RIGHT: hand icon + "You relend it" -->
				<div
					style="position: absolute; left: 307px; top: 141.22px; width: 226px;
						display: flex; align-items: center;"
				>
					<div
						style="flex-shrink: 0; width: 97.882px; height: 97.882px;
							display: flex; align-items: center; justify-content: center;"
					>
						<svg
							fill="none"
							preserveAspectRatio="none"
							viewBox="0 0 61.3464 72.6471"
							style="width: 61.3464px; height: 72.6471px; display: block;"
						>
							<path :d="paths.handFill" fill="white" />
							<path :d="paths.handThumb" :fill="colors.primary" />
							<path
								:d="paths.handFinger1"
								:stroke="colors.primary"
								stroke-width="3.05882"
								stroke-linecap="square"
								stroke-miterlimit="10"
							/>
							<path
								:d="paths.handFinger2"
								:stroke="colors.primary"
								stroke-width="3.05882"
								stroke-linecap="square"
								stroke-miterlimit="10"
							/>
							<path :d="paths.handArrow" :fill="colors.primary" />
							<path :d="paths.handMoney" :fill="colors.ecoGreen" />
							<path :d="paths.handCircle" fill="white" />
							<path
								:d="paths.handDetail1"
								:stroke="colors.primary"
								stroke-width="3.05882"
								stroke-linecap="square"
								stroke-miterlimit="10"
							/>
							<path
								:d="paths.handDetail2"
								:stroke="colors.primary"
								stroke-width="3.05882"
								stroke-linecap="round"
								stroke-miterlimit="10"
							/>
							<path
								:d="paths.handDetail3"
								:stroke="colors.primary"
								stroke-width="3.05882"
								stroke-linecap="round"
								stroke-miterlimit="10"
							/>
						</svg>
					</div>
					<div class="cycle-step-pill" style="width: 107px; flex-shrink: 0;">
						<p class="cycle-step-text">
							You relend it
						</p>
					</div>
				</div>

				<!-- LEFT: "[Name] repays" + heart icon -->
				<div style="position: absolute; left: 0.06px; top: 140.78px; display: flex; align-items: center;">
					<div class="cycle-step-pill" style="width: 110px; flex-shrink: 0;">
						<p class="cycle-step-text">
							{{ currentBorrower.name }} repays
						</p>
					</div>
					<div style="flex-shrink: 0; width: 97.882px; height: 97.882px;">
						<svg
							fill="none"
							preserveAspectRatio="none"
							viewBox="0 0 97.8824 97.8824"
							style="display: block; width: 100%; height: 100%;"
						>
							<path :d="paths.heartOuter" fill="white" />
							<path :d="paths.heartFill" :fill="colors.ecoGreen" />
							<path
								:d="paths.heartStroke"
								:stroke="colors.heartStroke"
								stroke-width="3.65931"
								stroke-miterlimit="10"
							/>
							<path
								:d="paths.heartRay1"
								:stroke="colors.heartStroke"
								stroke-width="3.65931"
								stroke-miterlimit="10"
							/>
							<path
								:d="paths.heartRay2"
								:stroke="colors.heartStroke"
								stroke-width="3.65931"
								stroke-miterlimit="10"
							/>
							<path
								:d="paths.heartRay3"
								:stroke="colors.heartStroke"
								stroke-width="3.65931"
								stroke-miterlimit="10"
							/>
							<path
								:d="paths.heartRay4"
								:stroke="colors.heartStroke"
								stroke-width="3.65931"
								stroke-miterlimit="10"
							/>
							<path
								:d="paths.heartRay5"
								:stroke="colors.heartStroke"
								stroke-width="3.65931"
								stroke-miterlimit="10"
							/>
						</svg>
					</div>
				</div>

				<!-- TOP CENTER: "You receive the money" + deposit icon -->
				<div
					style="position: absolute; left: 168px; bottom: 256px; width: 180px;
						display: flex; flex-direction: column; align-items: center;"
				>
					<div class="cycle-step-pill" style="width: 100%;">
						<p class="cycle-step-text">
							You receive the money
						</p>
					</div>
					<div
						style="width: 97.882px; height: 97.882px; flex-shrink: 0;
							position: relative; overflow: hidden;"
					>
						<div style="position: absolute; inset: 12.5% 14.84% 11.72% 15.63%;">
							<svg
								fill="none"
								preserveAspectRatio="none"
								viewBox="0 0 68.0588 74.1765"
								style="display: block; width: 100%; height: 100%;"
							>
								<defs>
									<clipPath id="rfa-clip">
										<rect fill="white" height="74.1765" width="68.0588" />
									</clipPath>
								</defs>
								<g clip-path="url(#rfa-clip)">
									<path :d="paths.depositOuter" fill="white" />
									<path :d="paths.depositGreen" :fill="colors.ecoGreen" />
									<path
										:d="paths.depositScreen"
										:stroke="colors.depositStroke"
										stroke-width="3.05882"
										stroke-miterlimit="10"
									/>
									<path
										:d="paths.depositCircle"
										:stroke="colors.depositStroke"
										stroke-width="3.05882"
										stroke-miterlimit="10"
									/>
									<path
										:d="paths.depositShelf"
										fill="white"
										:stroke="colors.depositStroke"
										stroke-width="3.05882"
										stroke-linejoin="round"
									/>
									<path
										:d="paths.depositArrowL"
										fill="white"
										:stroke="colors.depositStroke"
										stroke-width="3.05882"
										stroke-linejoin="round"
									/>
									<path
										:d="paths.depositArrowR"
										fill="white"
										:stroke="colors.depositStroke"
										stroke-width="3.05882"
										stroke-linejoin="round"
									/>
								</g>
							</svg>
						</div>
					</div>
				</div>

				<!-- BOTTOM CENTER: borrower photo + "[Name] uses the money" -->
				<div
					:key="currentBorrowerIndex"
					class="borrower-fade-in"
					style="position: absolute; left: 157px; top: 227px; width: 200px;
						display: flex; flex-direction: column; align-items: center;"
				>
					<div
						style="width: 88px; height: 88px; border-radius: 50%;
							overflow: hidden; flex-shrink: 0;"
					>
						<img
							:src="currentBorrower.image"
							alt=""
							aria-hidden="true"
							style="width: 100%; height: 100%; object-fit: cover;"
						>
					</div>
					<div class="cycle-step-pill" style="width: 100%;">
						<p class="cycle-step-text">
							{{ currentBorrower.name }} uses the money to improve their life
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref, computed, onMounted, onBeforeUnmount,
} from 'vue';
import { colorEcoGreen4, colorEcoGreenDefault } from '@kiva/kv-tokens/js';
import fadiImg from '#src/assets/images/borrower-profile/how-kiva-works/cycle-fadi.png';
import carmenImg from '#src/assets/images/borrower-profile/how-kiva-works/cycle-carmen.png';
import estanisleoImg from '#src/assets/images/borrower-profile/how-kiva-works/cycle-estanisleo.png';
import graceImg from '#src/assets/images/borrower-profile/how-kiva-works/cycle-grace.png';

// Lending cycle diagram ported from cms-page-server (components/partnerships/RevolvingFundAnimation.vue).
// It renders only the diagram; the surrounding copy belongs to the consumer, so the same component
// can serve any surface (and move to kv-components) without carrying page-specific text.
defineOptions({ name: 'RevolvingFundAnimation' });

const colors = {
	ecoGreen: colorEcoGreenDefault,
	primary: colorEcoGreen4,
	heartStroke: colorEcoGreen4,
	depositStroke: colorEcoGreen4,
};

/* eslint-disable max-len */
const paths = {
	arrowTopLeft: 'M33.5441 33.5441L36.5527 36.5527V36.5527L33.5441 33.5441ZM34.9338 9.95593C32.7128 9.18842 30.2902 10.3667 29.5227 12.5877C28.7552 14.8086 29.9334 17.2313 32.1544 17.9988L33.5441 13.9774L34.9338 9.95593ZM51.4122 20.1522L55.5832 20.9927L56.3181 17.3458L52.8019 16.1307L51.4122 20.1522ZM43.2462 39.1368C42.782 41.4404 44.273 43.6841 46.5766 44.1483C48.8801 44.6125 51.1238 43.1214 51.588 40.8179L47.4171 39.9774L43.2462 39.1368ZM4.25479 104.255H8.50958C8.50958 78.8615 18.597 54.5084 36.5527 36.5527L33.5441 33.5441L30.5355 30.5355C10.984 50.0871 2.38419e-06 76.6047 0 104.255H4.25479ZM33.5441 33.5441L36.5527 36.5527C40.6662 32.4392 45.1152 28.7389 49.8354 25.4782L47.4171 21.9774L44.9988 18.4767C39.8588 22.0274 35.0142 26.0568 30.5355 30.5355L33.5441 33.5441ZM33.5441 13.9774L32.1544 17.9988L50.0225 24.1736L51.4122 20.1522L52.8019 16.1307L34.9338 9.95593L33.5441 13.9774ZM51.4122 20.1522L47.2413 19.3116L43.2462 39.1368L47.4171 39.9774L51.588 40.8179L55.5832 20.9927L51.4122 20.1522Z',
	arrowTopRight: 'M174.965 33.5441L177.974 30.5355V30.5355L174.965 33.5441ZM200.787 38.6463C201.433 36.3869 200.124 34.0319 197.865 33.3864C195.605 32.7408 193.25 34.0491 192.605 36.3086L196.696 37.4774L200.787 38.6463ZM191.696 54.9774L191.065 59.1852L194.76 59.7395L195.787 56.1463L191.696 54.9774ZM172.327 47.7697C170.003 47.4212 167.837 49.0224 167.488 51.3463C167.14 53.6701 168.741 55.8366 171.065 56.1852L171.696 51.9774L172.327 47.7697ZM104.255 4.25479L104.255 8.50958C129.648 8.50958 154.001 18.597 171.957 36.5527L174.965 33.5441L177.974 30.5355C158.422 10.984 131.905 4.76837e-07 104.255 0L104.255 4.25479ZM174.965 33.5441L171.957 36.5527C177.317 41.9132 181.976 47.8437 185.875 54.2016L189.502 51.9774L193.129 49.7533C188.884 42.8299 183.811 36.3721 177.974 30.5355L174.965 33.5441ZM196.696 37.4774L192.605 36.3086L187.605 53.8086L191.696 54.9774L195.787 56.1463L200.787 38.6463L196.696 37.4774ZM191.696 54.9774L192.327 50.7697L172.327 47.7697L171.696 51.9774L171.065 56.1852L191.065 59.1852L191.696 54.9774Z',
	arrowBottomLeft: 'M33.5448 174.965L36.5534 171.957L33.5448 174.965ZM15.6967 150.702L16.6985 146.567L13.0667 145.687L11.7254 149.175L15.6967 150.702ZM5.19252 166.163C4.34908 168.356 5.44333 170.818 7.6366 171.661C9.82986 172.504 12.2916 171.41 13.135 169.217L9.16378 167.69L5.19252 166.163ZM34.3492 159.599C36.633 160.152 38.9329 158.749 39.4862 156.466C40.0395 154.182 38.6367 151.882 36.3529 151.329L35.351 155.464L34.3492 159.599ZM104.256 204.254V200C78.8624 200 54.5091 189.912 36.5534 171.957L33.5448 174.965L30.5362 177.974C50.0878 197.525 76.6055 208.509 104.256 208.509V204.254ZM33.5448 174.965L36.5534 171.957C29.6531 165.056 23.915 157.211 19.4647 148.726L15.6967 150.702L11.9286 152.678C16.7745 161.918 23.0229 170.46 30.5362 177.974L33.5448 174.965ZM9.16378 167.69L13.135 169.217L19.6679 152.229L15.6967 150.702L11.7254 149.175L5.19252 166.163L9.16378 167.69ZM15.6967 150.702L14.6948 154.837L34.3492 159.599L35.351 155.464L36.3529 151.329L16.6985 146.567L15.6967 150.702Z',
	arrowBottomRight: 'M174.965 174.965L177.974 177.974L174.965 174.965ZM162.485 204.805C164.704 205.577 167.13 204.405 167.902 202.186C168.675 199.967 167.502 197.541 165.283 196.768L163.884 200.787L162.485 204.805ZM146.696 194.802L142.531 193.933L141.768 197.591L145.297 198.82L146.696 194.802ZM154.991 175.873C155.471 173.573 153.995 171.319 151.695 170.839C149.394 170.359 147.141 171.835 146.661 174.135L150.826 175.004L154.991 175.873ZM204.255 104.255L200 104.255C200 116.828 197.523 129.279 192.712 140.895L196.643 142.523L200.574 144.151C205.813 131.503 208.51 117.946 208.51 104.255L204.255 104.255ZM196.643 142.523L192.712 140.895C187.9 152.511 180.848 163.066 171.957 171.957L174.965 174.965L177.974 177.974C187.655 168.293 195.334 156.8 200.574 144.151L196.643 142.523ZM163.884 200.787L165.283 196.768L148.095 190.784L146.696 194.802L145.297 198.82L162.485 204.805L163.884 200.787ZM146.696 194.802L150.861 195.671L154.991 175.873L150.826 175.004L146.661 174.135L142.531 193.933L146.696 194.802ZM174.965 174.965L171.957 171.957C164.599 179.315 156.101 185.414 146.805 190.025L148.696 193.837L150.587 197.649C160.709 192.627 169.962 185.986 177.974 177.974L174.965 174.965Z',
	handFill: 'M46.3278 16.2659C47.3266 16.8627 48.4552 17.1935 49.6163 17.1416L52.7231 16.9989C56.1868 16.7978 59.151 19.4442 59.3455 22.9078L60.5974 45.8819C60.792 48.7423 58.6904 51.2459 55.843 51.5443L49.1233 52.1929C48.4552 52.2578 47.9169 52.7702 47.8261 53.4383L46.0424 66.0928C46.0424 68.8624 43.7981 71.1131 41.0221 71.1131H16.3421C13.2158 71.1131 10.8548 68.2917 11.3996 65.2107L12.0418 61.1958C12.5218 58.1732 10.284 55.3971 7.22903 55.2285C4.64752 55.4036 2.40979 53.4577 2.2152 50.8827L0.885536 26.0212C0.736354 23.3229 2.77302 21.0009 5.46478 20.7998L6.74905 20.6765C7.62468 20.5922 8.2279 19.762 8.02683 18.8993L7.10579 15.3319C7.10579 15.3319 6.43771 13.1526 6.71662 10.6684C7.12525 7.01015 10.4202 4.37676 14.0914 4.67512C15.8686 4.81782 18.2815 4.73998 20.0847 3.65679C21.4273 2.8525 22.4781 2.20388 23.2694 1.71093C25.2931 0.439641 27.8032 0.0764146 30.0409 0.913133C33.3489 2.15199 35.0029 5.33023 35.0029 9.50084V10.2143C35.0029 11.9786 36.2871 13.4769 38.0319 13.7428C40.4967 14.119 43.9473 14.8584 46.3343 16.2789L46.3278 16.2659Z',
	handThumb: 'M16.9223 67.2248C19.0409 61.0291 19.394 56.7876 19.394 56.7876L41.2863 56.0806C41.2863 56.0806 42.3056 58.795 40.2403 67.1448L27.3487 67.2248H16.9223Z',
	handFinger1: 'M14.7769 24.3822L12.6583 15.3121C12.6583 15.3121 11.2459 11.3707 13.8642 10.1969C16.4825 9.02313 17.7883 13.6048 17.7883 13.6048L20.2867 20.4207L21.4792 24.3822',
	handFinger2: 'M29.5406 26.4163L29.1075 15.5122L28.9676 9.07651C28.9676 9.07651 29.2541 5.30177 26.5092 5.58188C23.7644 5.86198 23.8243 9.07651 23.8243 9.07651L23.0315 17.3262V24.0221',
	handArrow: 'M42.7053 47.8709L42.7387 46.4236L39.8472 46.357L39.8139 47.8042L42.7053 47.8709ZM38.5347 65.2707V66.7179H39.5674L39.9072 65.7442L38.5414 65.2707H38.5347ZM26.456 63.8235C25.6565 63.8235 25.0103 64.4704 25.0103 65.2707C25.0103 66.071 25.6565 66.7179 26.456 66.7179V63.8235ZM39.8139 47.8042C39.6873 53.3729 39.1277 59.1351 37.169 64.7972L39.9005 65.7442C41.9991 59.6753 42.5721 53.573 42.6987 47.8709L39.8072 47.8042H39.8139ZM38.5347 63.8235H26.456V66.7179H38.5347V63.8235Z',
	handMoney: 'M14.777 49.6051L55.0306 45.9904L54.3044 31.545L53.6914 22.7417H47.2623L5.59635 26.3564L7.36186 50.8989L14.777 49.6051Z',
	handCircle: 'M28.5479 42.7624C31.8631 42.7624 34.5506 39.5974 34.5506 35.6931C34.5506 31.7888 31.8631 28.6238 28.5479 28.6238C25.2327 28.6238 22.5452 31.7888 22.5452 35.6931C22.5452 39.5974 25.2327 42.7624 28.5479 42.7624Z',
	handDetail1: 'M20.9862 59.0418C20.9862 59.0418 21.7857 57.1745 18.8609 51.5924C15.9362 46.0103 14.717 40.9017 18.5944 40.1481C22.7184 39.3478 26.4426 38.4141 26.4426 38.4141C26.4426 38.4141 30.1668 36.6801 31.0996 38.5475C31.8457 40.0481 31.899 40.8084 29.907 42.1355C29.907 42.1355 27.6485 44.0029 24.1908 44.6698L25.923 47.5976',
	handDetail2: 'M29.8604 23.3153C29.8604 23.3153 29.5273 19.5473 33.2182 20.0274C36.5826 20.4676 35.2302 25.3961 35.2302 25.3961L34.1176 30.9982C34.1176 30.9982 33.5646 34.5929 30.6332 33.2524C29.2008 32.5921 29.1875 30.9115 29.5073 27.7903C29.6672 26.2631 29.8604 23.322 29.8604 23.322V23.3153Z',
	handDetail3: 'M36.6026 23.8287C36.6026 23.8287 36.7825 20.0539 40.3735 20.981C43.6513 21.8279 41.646 26.5497 41.646 26.5497L39.9471 31.1047C39.9471 31.1047 38.9144 34.5994 36.1896 32.9121C34.8571 32.0851 34.9037 31.2781 35.6499 28.217C36.0163 26.7164 36.6026 23.8354 36.6026 23.8354V23.8287Z',
	heartOuter: 'M75.037 54.4399C70.8889 62.6306 56.642 76.6229 50.5926 82.5952L48.9629 83.936C47.387 85.2325 45.0732 85.0639 43.7162 83.5399C38.3982 77.5676 28.8469 66.6346 22.0741 58.4621C14.0741 48.8089 16.7654 41.6421 19.4815 38.7169L13.337 32.6506C10.3728 29.7242 10.2183 24.8909 13.1156 21.8982C16.4952 18.4075 20.6268 14.6294 25.0468 12.5626C34.8057 7.99917 51.8616 3.8598 65.7876 11.4655C75.6582 16.8565 82.0755 22.6627 85.4155 26.976C87.3228 29.4391 86.4292 32.7035 84.0291 34.6895L75.037 42.1298C75.4074 43.1048 79.1852 46.2493 75.037 54.4399Z',
	heartFill: 'M42.799 44.8052C42.799 44.8052 50.7772 31.5468 60.9476 39.367C71.1179 47.1871 41.6396 74.273 41.6396 74.273C41.6396 74.273 15.3442 49.2317 24.5977 39.504C33.8511 29.7762 42.8095 44.8052 42.8095 44.8052H42.799Z',
	heartStroke: 'M50.5241 43.3297C50.5241 43.3297 56.2259 33.0961 66.3963 40.9162C76.5667 48.7363 47.0884 75.8222 47.0884 75.8222C47.0884 75.8222 20.7929 50.7809 30.0464 41.0532C39.2999 31.3255 48.2582 46.3545 48.2582 46.3545L50.5241 43.3297Z',
	heartRay1: 'M73.0569 33.5807L80.2025 26.435',
	heartRay2: 'M62.3597 26.2139L65.5109 16.6232',
	heartRay3: 'M24.5344 31.5994L17.3888 24.4537',
	heartRay4: 'M36.2857 24.2326L33.1345 14.6419',
	heartRay5: 'M49.3858 22.3776L49.6387 12.281',
	depositOuter: 'M10.3312 0H57.3377C63.2565 0 68.0512 4.79471 68.0512 10.7135V63.4553C68.0512 69.3741 63.2565 74.1688 57.3377 74.1688H10.3312C4.62647 74.1688 0 69.55 0 63.8377V10.3312C0 4.62647 4.62647 0 10.3312 0Z',
	depositGreen: 'M53.8812 34.4347L54.86 8.61824L49.0788 7.64706H7.54L7.05059 33.9453L53.8812 34.4347Z',
	depositScreen: 'M51.8929 13.7341H12.3882V38.2506H57.9494V15.5465L51.8929 13.7341Z',
	depositCircle: 'M31.5594 30.2976C32.4388 31.3224 33.9759 31.4371 35.3141 31.4371C36.0788 31.5072 37.8621 31.3407 38.8776 30.1141C39.5851 29.2596 40.1471 27.3306 40.1471 25.7629C40.1471 24.1953 39.9406 22.7194 39.0612 21.6947C38.1818 20.67 36.6447 20.0888 35.3065 20.0888C33.9682 20.0888 32.7906 20.1194 31.9188 21.1441C31.0471 22.1688 30.4659 24.1953 30.4659 25.7629C30.4659 27.3306 30.68 29.2729 31.5594 30.2976Z',
	depositShelf: 'M12.0518 56.1294V65.3288H56.6571V56.1294',
	depositArrowL: 'M34.5265 38.5947V55.2806L28.2253 48.9794',
	depositArrowR: 'M34.9471 38.5947V55.2806L41.2482 48.9794',
};
/* eslint-enable max-len */

const borrowers = [
	{ name: 'Fadi', image: fadiImg },
	{ name: 'Carmen', image: carmenImg },
	{ name: 'Estanisleo', image: estanisleoImg },
	{ name: 'Grace', image: graceImg },
];

const currentBorrowerIndex = ref(0);
const currentBorrower = computed(() => borrowers[currentBorrowerIndex.value]);

// Driven by the arrow animation's iteration event, so when reduced motion disables the
// animation the first borrower simply stays put.
const advanceBorrower = () => {
	currentBorrowerIndex.value = (currentBorrowerIndex.value + 1) % borrowers.length;
};

const cycleOuterRef = ref(null);
const cycleScale = ref(1);
// The stage is a fixed 533px-wide coordinate space scaled down to fit. Before it has been measured
// that scale is a guess, so it is not painted at all -- SSR would otherwise send scale(1) and the
// browser would paint a clipped stage until hydration. The height needs no measurement: aspect-ratio
// on .cycle-outer reproduces it exactly at every width.
const hasMeasured = ref(false);
let resizeObserver = null;

onMounted(() => {
	// No observer means no measurement will ever arrive, so reveal at scale(1). Leaving hasMeasured
	// false here would hide the animation permanently.
	if (!cycleOuterRef.value || typeof ResizeObserver === 'undefined') {
		hasMeasured.value = true;
		return;
	}
	resizeObserver = new ResizeObserver(([entry]) => {
		const w = entry.contentRect.width;
		cycleScale.value = Math.min(1, w / 533);
		hasMeasured.value = true;
	});
	resizeObserver.observe(cycleOuterRef.value);
});

onBeforeUnmount(() => {
	resizeObserver?.disconnect();
});
</script>

<style lang="postcss" scoped>
.cycle-outer {
	@apply tw-w-full tw-relative tw-overflow-hidden;

	max-width: 533px;
	aspect-ratio: 533 / 420;
}

.cycle-inner {
	@apply tw-absolute tw-top-0 tw-left-0 tw-origin-top-left;

	width: 533px;
	height: 420px;
	transition: opacity 150ms ease-in-out;
}

@keyframes arrowFlash {
	0%, 20% {
		opacity: 1;
	}

	25%, 100% {
		opacity: 0.2;
	}
}

.arrow-flash {
	animation: arrowFlash 4.8s ease-in-out infinite;
}

@keyframes fadeInBorrower {
	0% {
		opacity: 0;
		transform: translateY(10px);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.borrower-fade-in {
	animation: fadeInBorrower 0.5s ease-in-out forwards;
}

/* Scoped styles outrank Tailwind's motion-reduce variant, so the media query lives here. */
@media (prefers-reduced-motion: reduce) {
	.arrow-flash,
	.borrower-fade-in {
		animation: none;
	}
}

.cycle-step-pill {
	@apply tw-bg-secondary tw-rounded tw-p-2 tw-flex-shrink-0;
}

.cycle-step-text {
	@apply tw-text-base tw-text-action tw-text-center tw-whitespace-normal;
	@apply tw-font-medium;

	line-height: 1.05;
	letter-spacing: -0.4588px;
}
</style>
