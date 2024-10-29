import { ref } from 'vue';
import Alea from '#src/util/experiment/Alea';
import useIsMobile from '#src/composables/useIsMobile';
import LineLarge from '#src/assets/images/my-kiva/journey-line-large.svg';
import LineMedium from '#src/assets/images/my-kiva/journey-line-medium.svg';
import LineSmall from '#src/assets/images/my-kiva/journey-line-small.svg';

export const MOBILE_BREAKPOINT = 440;
export const STATE_JOURNEY = 'JOURNEY';
export const STATE_EARNED = 'EARNED';
export const STATE_IN_PROGRESS = 'IN_PROGRESS';
export const BADGE_COMPLETED = 'COMPLETED';
export const BADGE_IN_PROGRESS = 'IN_PROGRESS';
export const BADGE_LOCKED = 'LOCKED';
export const BADGE_STATUS = [BADGE_COMPLETED, BADGE_IN_PROGRESS, BADGE_LOCKED];
export const BADGE_SHAPE_ARCH = 'SHAPE_ARCH';
export const BADGE_SHAPE_CIRCLE = 'SHAPE_CIRCLE';
export const BADGE_SHAPE_OBLONG = 'SHAPE_OBLONG';
export const BADGE_SHAPE_OVAL = 'SHAPE_OVAL';
export const BADGE_SHAPE_RECTANGLE = 'SHAPE_RECTANGLE';
export const BADGE_SHAPE = [
	BADGE_SHAPE_ARCH,
	BADGE_SHAPE_CIRCLE,
	BADGE_SHAPE_OBLONG,
	BADGE_SHAPE_OVAL,
	BADGE_SHAPE_RECTANGLE,
];
export const ID_WOMENS_EQUALITY = 'womens-equality';
export const ID_US_ECONOMIC_EQUALITY = 'us-economic-equality';
export const ID_CLIMATE_ACTION = 'climate-action';
export const ID_REFUGEE_EQUALITY = 'refugee-equality';
export const ID_BASIC_NEEDS = 'basic-needs';
export const US_ECONOMIC_EQUALITY_FILTER = 'country=PR,US';
export const CLIMATE_ACTION_FILTER = 'tag=9';
export const REFUGEE_EQUALITY_FILTER = 'attribute=28';
export const WOMENS_EQUALITY_FILTER = 'gender=female';
export const BASIC_NEEDS_FILTER = 'sector=6,10';

/**
 * General utilities for the MyKiva badge modal
 *
 * @param currentBadge The badge data from the achievement service
 * @returns Utilities for the MyKiva badge modal
 */
export default function useBadgeModal(currentBadge) {
	const badge = ref(currentBadge);
	const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

	/**
	 * Gets the positioning of the badge tiers in the journey (3 possible positions)
	 *
	 * @returns The positions of the badge tiers
	 */
	const getTierPositions = () => {
		const MIN_POSITION = 0;
		const MAX_POSITION = 2;
		const positions = [];
		let previousPosition;

		(badge.value.achievementData.tiers ?? []).forEach((_tier, index) => {
			const randomNumber = Alea(`${badge.value.id}-${index}`)();
			let randomPosition = Math.floor(randomNumber * (MAX_POSITION - MIN_POSITION + 1)) + MIN_POSITION;

			// Ensure subsequent positions are different
			if (randomPosition === previousPosition) {
				randomPosition += 1;
				if (randomPosition > MAX_POSITION) randomPosition = MIN_POSITION;
			}

			positions.push(randomPosition);
			previousPosition = randomPosition;
		});

		return positions;
	};

	/**
	 * Gets the appropriate line component for the badge tier in the journey based on positioning
	 *
	 * @param previousPosition The position of the previous badge tier
	 * @param currentPosition The position of the current badge tier
	 * @returns The line component for the current badge tier
	 */
	const getLineComponent = (previousPosition, currentPosition) => {
		const difference = currentPosition - previousPosition;
		let component = LineSmall;
		if (isMobile.value) {
			if (Math.abs(difference) === 2) {
				component = LineLarge;
			} else if (Math.abs(difference) === 1) {
				if (currentPosition === 1) {
					component = LineMedium;
				} else {
					component = LineSmall;
				}
			}
		}
		return component;
	};

	/**
	 * Gets the CSS styles for the line component based on the position in the journey
	 *
	 * @param previousPosition The position of the previous badge tier
	 * @param currentPosition The position of the current badge tier
	 * @returns The CSS styles for the current badge tier line component
	 */
	const getLineStyle = (previousPosition, currentPosition) => {
		const difference = currentPosition - previousPosition;
		let width = '134px';
		let top;
		let left;
		let transform;
		const isMiddle = currentPosition === 1;
		if (difference === -2) {
			if (isMobile.value) width = '215px';
			top = isMobile.value ? '-121%' : '56%';
			left = isMobile.value ? '12%' : '-106%';
			transform = isMobile.value ? 'rotate(-72deg)' : 'rotate(-82deg)';
		} else if (difference === -1) {
			if (isMobile.value) {
				width = isMiddle ? '146px' : '124px';
			}
			const mobileTop = isMiddle ? '-162px' : '-108%';
			const mobileLeft = isMiddle ? undefined : '11%';
			top = isMobile.value ? mobileTop : '42%';
			left = isMobile.value ? mobileLeft : '-116%';
			transform = isMobile.value ? 'scaleX(-1)' : 'rotate(-82deg)';
		} else if (difference === 1) {
			if (isMobile.value) {
				width = isMiddle ? '154px' : '124px';
			}
			const mobileTop = isMiddle ? '-166px' : '-111%';
			top = isMobile.value ? mobileTop : '-15%';
			left = isMobile.value ? '-8%' : '-114%';
			transform = isMobile.value ? 'rotate(-2deg)' : 'rotate(180deg)';
		} else if (difference === 2) {
			if (isMobile.value) {
				width = '215px';
				transform = 'scaleX(-1) rotate(-69deg)';
			}
			top = isMobile.value ? '-120%' : '-95%';
			left = isMobile.value ? '-94px' : '-56%';
		}
		return {
			width,
			...(top && { top }),
			...(left && { left }),
			...(transform && { transform }),
		};
	};

	/**
	 * Gets the shape of the badge
	 *
	 * @returns The shape of the badge
	 */
	const getBadgeShape = () => {
		switch (badge.value.id) {
			case ID_WOMENS_EQUALITY:
				return BADGE_SHAPE_OBLONG;
			case ID_US_ECONOMIC_EQUALITY:
				return BADGE_SHAPE_RECTANGLE;
			case ID_CLIMATE_ACTION:
				return BADGE_SHAPE_ARCH;
			case ID_REFUGEE_EQUALITY:
				return BADGE_SHAPE_OVAL;
			case ID_BASIC_NEEDS:
			default:
				return BADGE_SHAPE_CIRCLE;
		}
	};

	/**
	 * Gets the URL params of the badge to be used in lend/filter
	 *
	 * @returns The URL params
	 */
	const getPrefilteredUrl = () => {
		switch (badge.value.id) {
			case ID_WOMENS_EQUALITY:
				return WOMENS_EQUALITY_FILTER;
			case ID_US_ECONOMIC_EQUALITY:
				return US_ECONOMIC_EQUALITY_FILTER;
			case ID_CLIMATE_ACTION:
				return CLIMATE_ACTION_FILTER;
			case ID_REFUGEE_EQUALITY:
				return REFUGEE_EQUALITY_FILTER;
			case ID_BASIC_NEEDS:
			default:
				return BASIC_NEEDS_FILTER;
		}
	};

	/**
	 * Gets the styles needed for positioning the small circle on the badge journey for progress
	 *
	 * @returns The styles for the small circle
	 */
	const getNumberCircleStyles = () => {
		switch (badge.value.id) {
			case ID_WOMENS_EQUALITY:
				return { right: '20px', bottom: '6px' };
			case ID_REFUGEE_EQUALITY:
				return { right: '10px', bottom: '18px' };
			case ID_BASIC_NEEDS:
				return { right: '10px', bottom: '10px' };
			case ID_US_ECONOMIC_EQUALITY:
			case ID_CLIMATE_ACTION:
			default:
				return { right: '-2px', bottom: '-2px' };
		}
	};

	return {
		getTierPositions,
		getLineComponent,
		getLineStyle,
		getBadgeShape,
		getPrefilteredUrl,
		getNumberCircleStyles,
	};
}
