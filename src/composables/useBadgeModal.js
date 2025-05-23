import { ref } from 'vue';
import Alea from '#src/util/experiment/Alea';
import {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_EQUITY,
} from './useBadgeData';

export const MOBILE_BREAKPOINT = 440;
export const STATE_JOURNEY = 'JOURNEY';
export const STATE_EARNED = 'EARNED';
export const BADGE_COMPLETED = 'COMPLETED';
export const BADGE_IN_PROGRESS = 'IN_PROGRESS';
export const BADGE_LOCKED = 'LOCKED';
export const BADGE_STATUS = [BADGE_COMPLETED, BADGE_IN_PROGRESS, BADGE_LOCKED];
export const BADGE_SHAPE_ARCH = 'SHAPE_ARCH';
export const BADGE_SHAPE_CIRCLE = 'SHAPE_CIRCLE';
export const BADGE_SHAPE_OBLONG = 'SHAPE_OBLONG';
export const BADGE_SHAPE_OVAL = 'SHAPE_OVAL';
export const BADGE_SHAPE_RECTANGLE = 'SHAPE_RECTANGLE';
export const BADGE_SHAPE_EQUITY = 'SHAPE_EQUITY';
export const BADGE_SHAPE = [
	BADGE_SHAPE_ARCH,
	BADGE_SHAPE_CIRCLE,
	BADGE_SHAPE_OBLONG,
	BADGE_SHAPE_OVAL,
	BADGE_SHAPE_RECTANGLE,
	BADGE_SHAPE_EQUITY,
];

/**
 * Gets the shape of the badge
 *
 * @param badgeId The ID of the badge
 * @returns The shape of the badge
 */
export const getBadgeShape = badgeId => {
	switch (badgeId) {
		case ID_WOMENS_EQUALITY:
			return BADGE_SHAPE_OBLONG;
		case ID_US_ECONOMIC_EQUALITY:
			return BADGE_SHAPE_RECTANGLE;
		case ID_CLIMATE_ACTION:
			return BADGE_SHAPE_ARCH;
		case ID_REFUGEE_EQUALITY:
			return BADGE_SHAPE_OVAL;
		case ID_EQUITY:
			return BADGE_SHAPE_EQUITY;
		case ID_BASIC_NEEDS:
		default:
			return BADGE_SHAPE_CIRCLE;
	}
};

/**
 * General utilities for the MyKiva badge modal
 *
 * @param currentBadge The badge data from the achievement service
 * @returns Utilities for the MyKiva badge modal
 */
export default function useBadgeModal(currentBadge) {
	const badge = ref(currentBadge);

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

	return {
		getTierPositions,
	};
}
